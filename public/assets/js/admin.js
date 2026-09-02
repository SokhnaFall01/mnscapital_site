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
      desc: "Nom, logo, devise et pied de page présents sur toutes les pages.",
      base: ["site"],
      fields: [
        { path: "brandName", label: "Nom du cabinet", type: "text" },
        { path: "brandTagline", label: "Sous-titre (sous le nom)", type: "text" },
        { path: "logo", label: "Logo", type: "image" },
        { path: "motto", label: "Devise (mots-clés)", type: "liststr" },
        { path: "footerAbout", label: "Description (pied de page)", type: "textarea" },
        { path: "footerMotto", label: "Devise du pied de page", type: "text" },
        { path: "footerPlace", label: "Localisation (pied de page)", type: "text" }
      ]
    },
    {
      key: "home", label: "Accueil", icon: "🏠",
      title: "Page d'accueil (Le Cabinet)",
      desc: "Bandeau principal, histoire, vision, mission, engagements, valeurs et promesse.",
      base: ["home"],
      fields: [
        { path: "heroKicker", label: "Sur-titre du bandeau", type: "text" },
        { path: "heroTitle", label: "Titre principal", type: "textarea" },
        { path: "heroLede", label: "Texte d'introduction", type: "textarea" },
        { path: "heroImage", label: "Image du bandeau", type: "image" },
        { path: "histoireKicker", label: "Sur-titre « Histoire »", type: "text" },
        { path: "histoireTitle", label: "Titre « Histoire »", type: "text" },
        { path: "histoirePara1", label: "Histoire — paragraphe 1", type: "textarea" },
        { path: "histoirePara2", label: "Histoire — paragraphe 2", type: "textarea" },
        { path: "histoireImage", label: "Image « Histoire »", type: "image" },
        { path: "histoireBadgeStrong", label: "Badge — titre", type: "text" },
        { path: "histoireBadgeText", label: "Badge — texte", type: "text" },
        { path: "visionTitle", label: "Vision — titre", type: "text" },
        { path: "visionText", label: "Vision — texte", type: "textarea" },
        { path: "missionTitle", label: "Mission — titre", type: "text" },
        { path: "missionText", label: "Mission — texte", type: "textarea" },
        { path: "engagementsTitle", label: "Engagements — titre", type: "text" },
        { path: "engagements", label: "Liste des engagements", type: "liststr" },
        { path: "valeursTitle", label: "Valeurs — titre", type: "text" },
        { path: "valeurs", label: "Liste des valeurs", type: "listobj",
          item: [
            { path: "title", label: "Titre de la valeur", type: "text" },
            { path: "text", label: "Description", type: "textarea" }
          ] },
        { path: "promesse", label: "Notre promesse", type: "textarea" },
        { path: "ctaTitle", label: "Appel à l'action — titre", type: "text" },
        { path: "ctaText", label: "Appel à l'action — texte", type: "textarea" }
      ]
    },
    {
      key: "expertises", label: "Expertises", icon: "🎯",
      title: "Nos expertises",
      desc: "Les quatre expertises affichées sur les pages Services et Expertise.",
      base: [],
      fields: [
        { path: "expertises", label: "Liste des expertises", type: "listobj",
          item: [
            { path: "title", label: "Titre", type: "text" },
            { path: "lead", label: "Description", type: "textarea" },
            { path: "points", label: "Points clés", type: "liststr" }
          ] }
      ]
    },
    {
      key: "services", label: "Services", icon: "🧩",
      title: "Page Services",
      desc: "Bandeau, offre intégrée, approche et clients.",
      base: ["services"],
      fields: [
        { path: "heroTitle", label: "Titre du bandeau", type: "textarea" },
        { path: "heroLede", label: "Texte d'introduction", type: "textarea" },
        { path: "offreTitle", label: "Offre intégrée — titre", type: "text" },
        { path: "offreText", label: "Offre intégrée — texte", type: "textarea" },
        { path: "approcheTitle", label: "Approche — titre", type: "text" },
        { path: "approcheText", label: "Approche — texte", type: "textarea" },
        { path: "approcheSteps", label: "Approche — étapes", type: "liststr" },
        { path: "clientsTitle", label: "Clients — titre", type: "text" },
        { path: "clients", label: "Liste des clients", type: "liststr" },
        { path: "ctaTitle", label: "Appel à l'action — titre", type: "text" },
        { path: "ctaText", label: "Appel à l'action — texte", type: "textarea" }
      ]
    },
    {
      key: "expertise", label: "Expertise", icon: "📈",
      title: "Page Expertise",
      desc: "Bandeau, différence et parcours d'accompagnement.",
      base: ["expertise"],
      fields: [
        { path: "heroTitle", label: "Titre du bandeau", type: "textarea" },
        { path: "heroLede", label: "Texte d'introduction", type: "textarea" },
        { path: "differenceTitle", label: "Différence — titre", type: "textarea" },
        { path: "differenceText", label: "Différence — texte", type: "textarea" },
        { path: "differenceImage", label: "Différence — image", type: "image" },
        { path: "features", label: "Différence — points", type: "listobj",
          item: [
            { path: "title", label: "Titre", type: "text" },
            { path: "text", label: "Description", type: "text" }
          ] },
        { path: "parcoursTitle", label: "Parcours — titre", type: "text" },
        { path: "parcours", label: "Étapes du parcours", type: "listobj",
          item: [
            { path: "title", label: "Titre de l'étape", type: "text" },
            { path: "text", label: "Description", type: "textarea" }
          ] }
      ]
    },
    {
      key: "actualites", label: "Actualités", icon: "📰",
      title: "Page Actualités (Perspectives)",
      desc: "Bandeau, message de la rubrique et thématiques.",
      base: ["actualites"],
      fields: [
        { path: "heroTitle", label: "Titre du bandeau", type: "textarea" },
        { path: "heroLede", label: "Texte d'introduction", type: "textarea" },
        { path: "noticeBadge", label: "Étiquette", type: "text" },
        { path: "noticeTitle", label: "Titre du message", type: "text" },
        { path: "noticeText", label: "Texte du message", type: "textarea" },
        { path: "topics", label: "Thématiques", type: "liststr" }
      ]
    },
    {
      key: "carrieres", label: "Carrières", icon: "💼",
      title: "Page Carrières",
      desc: "Bandeau, culture, offres d'emploi et message par défaut.",
      base: ["carrieres"],
      fields: [
        { path: "heroTitle", label: "Titre du bandeau", type: "text" },
        { path: "heroLede", label: "Texte d'introduction", type: "textarea" },
        { path: "cultureTitle", label: "Culture — titre", type: "text" },
        { path: "culturePara1", label: "Culture — paragraphe 1", type: "textarea" },
        { path: "culturePara2", label: "Culture — paragraphe 2", type: "textarea" },
        { path: "cultureImage", label: "Culture — image", type: "image" },
        { path: "offersTitle", label: "Offres — titre de section", type: "text" },
        { path: "offers", label: "Offres d'emploi", type: "listobj",
          item: [
            { path: "title", label: "Intitulé du poste", type: "text" },
            { path: "location", label: "Lieu", type: "text" },
            { path: "type", label: "Type de contrat", type: "text" },
            { path: "description", label: "Description", type: "textarea" }
          ] },
        { path: "emptyTitle", label: "Message si aucune offre — titre", type: "text" },
        { path: "emptyText", label: "Message si aucune offre — texte", type: "textarea" }
      ]
    },
    {
      key: "partners", label: "Partenaires", icon: "🤝",
      title: "Section Partenaires",
      desc: "Titre, texte et logos des partenaires (affichés sur la page d'accueil).",
      base: ["partners"],
      fields: [
        { path: "title", label: "Titre de la section", type: "text" },
        { path: "lead", label: "Texte d'introduction", type: "textarea" },
        { path: "items", label: "Logos des partenaires", type: "listobj",
          item: [
            { path: "name", label: "Nom du partenaire", type: "text" },
            { path: "logo", label: "Logo", type: "image" },
            { path: "url", label: "Lien vers le site (optionnel)", type: "text" }
          ] }
      ]
    },
    {
      key: "contact", label: "Contact", icon: "✉️",
      title: "Page Contact",
      desc: "Bandeau et coordonnées du cabinet.",
      base: ["contact"],
      fields: [
        { path: "heroTitle", label: "Titre du bandeau", type: "text" },
        { path: "heroLede", label: "Texte d'introduction", type: "textarea" },
        { path: "infoTitle", label: "Coordonnées — titre", type: "text" },
        { path: "location", label: "Localisation", type: "text" },
        { path: "email", label: "Adresse e-mail", type: "text" },
        { path: "phone", label: "Téléphone", type: "text" },
        { path: "availability", label: "Disponibilité / horaires", type: "text" }
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
