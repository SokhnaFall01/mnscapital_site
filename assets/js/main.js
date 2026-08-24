/* =========================================================================
   MNS CAPITAL — Interactions
   ========================================================================= */
(function () {
  "use strict";

  /* --- Marqueur JS : active les animations « reveal » (contenu visible sans JS) --- */
  document.documentElement.classList.add("js");

  /* --- En-tête : fond au défilement --- */
  var header = document.getElementById("header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Menu mobile --- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* --- Révélation au défilement --- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* --- Pré-remplissage du motif depuis l'URL (?motif=carrieres) --- */
  var motif = document.getElementById("motif");
  if (motif) {
    var params = new URLSearchParams(window.location.search);
    var m = params.get("motif");
    if (m) {
      for (var i = 0; i < motif.options.length; i++) {
        if (motif.options[i].value === m) { motif.selectedIndex = i; break; }
      }
    }
  }

  /* --- Formulaire de contact (démo côté client) --- */
  var form = document.getElementById("contactForm");
  var formMsg = document.getElementById("formMsg");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.reset();
      if (formMsg) {
        formMsg.style.display = "block";
        formMsg.textContent = "Merci ! Votre message a bien été pris en compte. Nous vous répondrons dans les meilleurs délais.";
      }
    });
  }

  /* --- Formulaire newsletter (démo côté client) --- */
  var nl = document.getElementById("newsletterForm");
  var nlMsg = document.getElementById("newsletterMsg");
  if (nl) {
    nl.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!nl.checkValidity()) { nl.reportValidity(); return; }
      nl.reset();
      if (nlMsg) {
        nlMsg.style.display = "block";
        nlMsg.textContent = "Merci ! Vous serez informé(e) dès la parution de nos prochaines publications.";
      }
    });
  }
})();
