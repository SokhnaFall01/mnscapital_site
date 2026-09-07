/* =========================================================================
   MNS CAPITAL — Éditeur d'administration
   Éditeur piloté par un schéma : construit les formulaires à partir de
   la description des champs et réécrit le contenu dans l'objet DATA.
   ========================================================================= */
(function () {
  "use strict";

  /* --- Chargement du contenu actuel --- */
  var DATA = JSON.parse(document.getElementById("content-data").textContent);

  /* --- Schéma : groupes (onglets) et champs modifiables --- */
  // Types de champ : "text", "textarea", "image",
  //   "liststr" (liste de textes), "listobj" (liste de blocs à sous-champs)
  var SCHEMA = [
    {
      key: "general", label: "Général", icon: "⚙️",
      title: "Paramètres généraux",
      desc: "Nom, logo et pied de page présents sur toutes les pages.",
      base: ["site"],
      fields: [
        { path: "brandName", label: "Nom de la structure", type: "text" },
        { path: "brandTagline", label: "Sous-titre (sous le nom)", type: "text" },
        { path: "logo", label: "Logo", type: "image" },
        { path: "footerAbout", label: "Description (pied de page)", type: "textarea" },
        { path: "footerMotto", label: "Signature (pied de page)", type: "text" },
        { path: "footerPlace", label: "Localisation (pied de page)", type: "text" }
      ]
    },
    {
      key: "apropos", label: "À propos", icon: "🏛️",
      title: "Page À propos",
      desc: "Présentation, positionnement, mission, vision, approche, CEO et promesse.",
      base: ["apropos"],
      fields: [
        { path: "heroImage", label: "Image du bandeau", type: "image" },
        { path: "heroAccroche", label: "Accroche (grand titre du bandeau)", type: "text" },
        { path: "presentation", label: "Présentation", type: "textarea" },
        { path: "positionnement", label: "Positionnement", type: "textarea" },
        { path: "mission", label: "Mission", type: "textarea" },
        { path: "vision", label: "Vision", type: "textarea" },
        { path: "approche", label: "Approche", type: "textarea" },
        { path: "ceoRole", label: "CEO — intitulé", type: "text" },
        { path: "ceoName", label: "CEO — nom (à compléter)", type: "text" },
        { path: "ceoPhoto", label: "CEO — photo (optionnel)", type: "image" },
        { path: "ceoText", label: "CEO — texte de présentation", type: "textarea" },
        { path: "signature", label: "Signature institutionnelle (à compléter)", type: "textarea" },
        { path: "promesse", label: "Notre promesse", type: "textarea" }
      ]
    },
    {
      key: "partners", label: "Partenaires", icon: "🤝",
      title: "Section Partenaires",
      desc: "Titre et logos des partenaires (affichés sur la page À propos).",
      base: ["partners"],
      fields: [
        { path: "title", label: "Titre de la section", type: "text" },
        { path: "lead", label: "Texte d'introduction (optionnel)", type: "textarea" },
        { path: "items", label: "Logos des partenaires", type: "listobj",
          item: [
            { path: "name", label: "Nom du partenaire", type: "text" },
            { path: "logo", label: "Logo", type: "image" },
            { path: "url", label: "Lien vers le site (optionnel)", type: "text" }
          ] }
      ]
    },
    {
      key: "services", label: "Nos services", icon: "🧩",
      title: "Page Nos services",
      desc: "Introduction, les services et leurs prestations, mode d'intervention.",
      base: ["services"],
      fields: [
        { path: "intro", label: "Texte d'introduction", type: "textarea" },
        { path: "items", label: "Services", type: "listobj",
          item: [
            { path: "title", label: "Titre du service", type: "text" },
            { path: "presentation", label: "Présentation courte", type: "textarea" },
            { path: "prestations", label: "Prestations", type: "liststr" }
          ] },
        { path: "modeTitle", label: "Mode d'intervention — titre", type: "text" },
        { path: "steps", label: "Étapes d'intervention", type: "listobj",
          item: [
            { path: "title", label: "Titre de l'étape", type: "text" },
            { path: "text", label: "Description", type: "textarea" }
          ] }
      ]
    },
    {
      key: "pourquoi", label: "Pourquoi nous ?", icon: "⭐",
      title: "Page Pourquoi nous ?",
      desc: "Introduction, atouts et formulation synthétique.",
      base: ["pourquoi"],
      fields: [
        { path: "intro", label: "Texte d'introduction", type: "textarea" },
        { path: "atouts", label: "Atouts", type: "listobj",
          item: [
            { path: "title", label: "Titre de l'atout", type: "text" },
            { path: "text", label: "Description", type: "textarea" }
          ] },
        { path: "synthese", label: "Formulation synthétique", type: "textarea" }
      ]
    },
    {
      key: "contact", label: "Contact", icon: "✉️",
      title: "Page Contact",
      desc: "Introduction, coordonnées, options du formulaire et message de confirmation.",
      base: ["contact"],
      fields: [
        { path: "intro", label: "Texte d'introduction", type: "textarea" },
        { path: "location", label: "Ville & pays", type: "text" },
        { path: "email", label: "Adresse e-mail", type: "text" },
        { path: "phone", label: "Téléphone", type: "text" },
        { path: "availability", label: "Disponibilité / horaires", type: "text" },
        { path: "ctaLabel", label: "Libellé du bouton", type: "text" },
        { path: "confirmation", label: "Message de confirmation", type: "textarea" },
        { path: "secteurs", label: "Secteurs d'activités (liste du formulaire)", type: "liststr" },
        { path: "motifs", label: "Motifs de contact (liste du formulaire)", type: "liststr" }
      ]
    }
  ];

  /* --- Accès à un conteneur via son chemin de base --- */
  function containerOf(base) {
    var obj = DATA;
    base.forEach(function (k) { obj = obj[k]; });
    return obj;
  }

  var el = function (tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; };

  /* --- Construction d'un champ simple (texte / zone de texte) --- */
  function buildScalar(container, field) {
    var wrap = el("div", "field");
    var lab = el("label"); lab.textContent = field.label; wrap.appendChild(lab);
    var input = field.type === "textarea" ? el("textarea") : el("input");
    if (field.type !== "textarea") input.type = "text";
    input.value = container[field.path] != null ? container[field.path] : "";
    input.addEventListener("input", function () { container[field.path] = input.value; });
    wrap.appendChild(input);
    return wrap;
  }

  /* --- Champ image (aperçu + téléversement) --- */
  function buildImage(container, field) {
    var wrap = el("div", "field");
    var lab = el("label"); lab.textContent = field.label; wrap.appendChild(lab);
    var row = el("div", "img-field");
    var img = el("img", "img-field__preview");
    img.src = "/" + (container[field.path] || "");
    img.alt = field.label;
    var ctrl = el("div", "img-field__ctrl");
    var btn = el("label", "img-field__btn");
    btn.innerHTML = "⬆ Changer l'image";
    var file = el("input"); file.type = "file"; file.accept = "image/*";
    var pathTxt = el("div", "path"); pathTxt.textContent = container[field.path] || "";
    file.addEventListener("change", function () {
      if (!file.files || !file.files[0]) return;
      var fd = new FormData(); fd.append("image", file.files[0]);
      btn.innerHTML = "⏳ Envoi…";
      fetch("/admin/upload", { method: "POST", body: fd })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res.ok) {
            container[field.path] = res.path;
            img.src = "/" + res.path + "?t=" + Date.now();
            pathTxt.textContent = res.path;
          } else { alert("Échec du téléversement : " + res.error); }
          btn.innerHTML = "⬆ Changer l'image";
        })
        .catch(function () { alert("Erreur réseau lors du téléversement."); btn.innerHTML = "⬆ Changer l'image"; });
    });
    btn.appendChild(file);
    ctrl.appendChild(btn); ctrl.appendChild(pathTxt);
    row.appendChild(img); row.appendChild(ctrl);
    wrap.appendChild(row);
    return wrap;
  }

  /* --- Liste de textes (ajout / suppression) --- */
  function buildListStr(container, field) {
    var wrap = el("div", "field");
    var lab = el("label"); lab.textContent = field.label; wrap.appendChild(lab);
    var block = el("div", "list-block");
    var arr = container[field.path] = container[field.path] || [];

    function rowFor(i) {
      var row = el("div", "subrow");
      var input = el("input"); input.type = "text"; input.value = arr[i];
      input.addEventListener("input", function () { arr[i] = input.value; });
      var rm = el("button", "btn-remove"); rm.type = "button"; rm.textContent = "✕";
      rm.addEventListener("click", function () { arr.splice(i, 1); render(); });
      row.appendChild(input); row.appendChild(rm);
      return row;
    }
    function render() {
      block.innerHTML = "";
      arr.forEach(function (_, i) { block.appendChild(rowFor(i)); });
      var add = el("button", "btn-add"); add.type = "button"; add.textContent = "+ Ajouter";
      add.addEventListener("click", function () { arr.push(""); render(); });
      block.appendChild(add);
    }
    render();
    wrap.appendChild(block);
    return wrap;
  }

  /* --- Liste d'objets (blocs répétables) --- */
  function buildListObj(container, field) {
    var wrap = el("div", "field");
    var lab = el("label"); lab.textContent = field.label; wrap.appendChild(lab);
    var block = el("div", "list-block");
    var arr = container[field.path] = container[field.path] || [];

    function emptyItem() {
      var o = {};
      field.item.forEach(function (f) { o[f.path] = f.type === "liststr" ? [] : ""; });
      return o;
    }
    function render() {
      block.innerHTML = "";
      arr.forEach(function (obj, i) {
        var item = el("div", "list-item");
        var head = el("div", "list-item__head");
        var t = el("span", "list-item__title"); t.textContent = field.label + " · " + (i + 1);
        var rm = el("button", "btn-remove"); rm.type = "button"; rm.textContent = "✕ Supprimer";
        rm.addEventListener("click", function () { arr.splice(i, 1); render(); });
        head.appendChild(t); head.appendChild(rm);
        item.appendChild(head);

        field.item.forEach(function (f) {
          if (f.type === "liststr") {
            item.appendChild(buildListStr(obj, f));
          } else if (f.type === "image") {
            item.appendChild(buildImage(obj, f));
          } else {
            var sub = el("div", "sub");
            var sl = el("label"); sl.textContent = f.label; sub.appendChild(sl);
            var input = f.type === "textarea" ? el("textarea") : el("input");
            if (f.type !== "textarea") input.type = "text";
            input.value = obj[f.path] != null ? obj[f.path] : "";
            input.addEventListener("input", function () { obj[f.path] = input.value; });
            sub.appendChild(input);
            item.appendChild(sub);
          }
        });
        block.appendChild(item);
      });
      var add = el("button", "btn-add"); add.type = "button"; add.textContent = "+ Ajouter un élément";
      add.addEventListener("click", function () { arr.push(emptyItem()); render(); });
      block.appendChild(add);
    }
    render();
    wrap.appendChild(block);
    return wrap;
  }

  /* --- Construction d'un groupe (onglet) --- */
  function buildGroup(group) {
    var sec = el("div", "admin-group");
    sec.dataset.group = group.key;
    var head = el("div", "admin-group__head");
    var h = el("h2"); h.textContent = group.title;
    var p = el("p"); p.textContent = group.desc;
    head.appendChild(h); head.appendChild(p); sec.appendChild(head);

    var container = group.base.length ? containerOf(group.base) : DATA;
    group.fields.forEach(function (field) {
      var node;
      if (field.type === "image") node = buildImage(container, field);
      else if (field.type === "liststr") node = buildListStr(container, field);
      else if (field.type === "listobj") node = buildListObj(container, field);
      else node = buildScalar(container, field);
      sec.appendChild(node);
    });
    return sec;
  }

  /* --- Montage de l'interface --- */
  var nav = document.getElementById("adminNav");
  var editor = document.getElementById("adminEditor");

  SCHEMA.forEach(function (group, idx) {
    var b = el("button");
    b.innerHTML = '<span class="admin-nav__dot"></span> ' + group.icon + " " + group.label;
    b.dataset.group = group.key;
    if (idx === 0) b.classList.add("active");
    b.addEventListener("click", function () { activate(group.key); });
    nav.appendChild(b);

    var sec = buildGroup(group);
    if (idx === 0) sec.classList.add("active");
    editor.appendChild(sec);
  });

  function activate(key) {
    nav.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.group === key);
    });
    editor.querySelectorAll(".admin-group").forEach(function (s) {
      s.classList.toggle("active", s.dataset.group === key);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* --- Enregistrement --- */
  var toast = document.getElementById("saveToast");
  function showToast(msg, isError) {
    toast.textContent = msg;
    toast.classList.toggle("error", !!isError);
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 3200);
  }

  document.getElementById("saveBtn").addEventListener("click", function () {
    var btn = this;
    btn.disabled = true;
    var original = btn.textContent;
    btn.textContent = "Enregistrement…";
    fetch("/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: DATA })
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.ok) showToast("✓ Modifications enregistrées et publiées en ligne.");
        else showToast("Échec : " + (res.error || "inconnu"), true);
      })
      .catch(function () { showToast("Erreur réseau lors de l'enregistrement.", true); })
      .finally(function () { btn.disabled = false; btn.textContent = original; });
  });
})();
