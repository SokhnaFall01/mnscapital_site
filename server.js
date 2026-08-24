/* =========================================================================
   MNS CAPITAL — Serveur Express
   - Sert les pages publiques (rendues à partir de content.json)
   - Espace administrateur /admin protégé par mot de passe
   ========================================================================= */
"use strict";

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

// Derrière un reverse proxy (Traefik, Nginx…) : faire confiance aux en-têtes
// X-Forwarded-* pour connaître le protocole et l'IP réels du visiteur.
app.set("trust proxy", 1);

/* --- Configuration (à personnaliser via variables d'environnement) --- */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mnscapital2026";
const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

const CONTENT_FILE = path.join(__dirname, "content.json");
const IMG_DIR = path.join(__dirname, "public", "assets", "img");

/* --- Utilitaires de contenu --- */
function readContent() {
  return JSON.parse(fs.readFileSync(CONTENT_FILE, "utf-8"));
}
function writeContent(data) {
  // Sauvegarde de sécurité avant écriture
  try {
    fs.copyFileSync(CONTENT_FILE, CONTENT_FILE + ".bak");
  } catch (e) {
    /* première écriture : pas de sauvegarde existante */
  }
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/* --- Vues (EJS) & fichiers statiques --- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.json({ limit: "2mb" }));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 8 },
  })
);

/* --- Téléversement d'images (multer) --- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMG_DIR),
  filename: (req, file, cb) => {
    const safe = file.originalname
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const stamp = Date.now();
    const ext = path.extname(safe) || ".jpg";
    const base = path.basename(safe, ext) || "image";
    cb(null, `${base}-${stamp}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|gif|svg\+xml)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Format d'image non pris en charge."));
  },
});

/* --- Garde d'authentification --- */
function requireAuth(req, res, next) {
  if (req.session && req.session.authed) return next();
  return res.redirect("/admin/login");
}

/* =====================================================================
   PAGES PUBLIQUES
   ===================================================================== */
function render(res, view) {
  const content = readContent();
  res.render(view, { c: content, page: view });
}

app.get("/", (req, res) => render(res, "home"));
app.get("/services", (req, res) => render(res, "services"));
app.get("/expertise", (req, res) => render(res, "expertise"));
app.get("/actualites", (req, res) => render(res, "actualites"));
app.get("/carrieres", (req, res) => render(res, "carrieres"));
app.get("/contact", (req, res) => render(res, "contact"));

/* Réception du formulaire de contact (démo : journalise et confirme) */
app.post("/contact", (req, res) => {
  console.log("[contact]", {
    at: new Date().toISOString(),
    ...req.body,
  });
  const content = readContent();
  res.render("contact", { c: content, page: "contact", sent: true });
});

/* =====================================================================
   ADMINISTRATION
   ===================================================================== */
app.get("/admin/login", (req, res) => {
  if (req.session && req.session.authed) return res.redirect("/admin");
  res.render("admin/login", { error: null });
});

app.post("/admin/login", (req, res) => {
  const given = String(req.body.password || "");
  const expected = String(ADMIN_PASSWORD);
  const ok =
    given.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (ok) {
    req.session.authed = true;
    return res.redirect("/admin");
  }
  res.status(401).render("admin/login", {
    error: "Mot de passe incorrect. Veuillez réessayer.",
  });
});

app.post("/admin/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
});

app.get("/admin", requireAuth, (req, res) => {
  res.render("admin/dashboard", {
    c: readContent(),
    saved: req.query.saved === "1",
    error: null,
  });
});

/* Enregistrement du contenu (JSON complet envoyé par le tableau de bord) */
app.post("/admin/save", requireAuth, (req, res) => {
  try {
    const incoming =
      typeof req.body.content === "string"
        ? JSON.parse(req.body.content)
        : req.body.content;
    if (!incoming || typeof incoming !== "object") {
      throw new Error("Contenu invalide.");
    }
    writeContent(incoming);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

/* Téléversement d'une image → renvoie le chemin relatif à enregistrer */
app.post("/admin/upload", requireAuth, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) return res.status(400).json({ ok: false, error: err.message });
    if (!req.file) return res.status(400).json({ ok: false, error: "Aucun fichier reçu." });
    res.json({ ok: true, path: "assets/img/" + req.file.filename });
  });
});

/* =====================================================================
   DÉMARRAGE
   ===================================================================== */
app.listen(PORT, () => {
  console.log(`MNS CAPITAL — serveur démarré sur http://localhost:${PORT}`);
  console.log(`Espace admin : http://localhost:${PORT}/admin`);
});
