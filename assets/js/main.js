/* =========================================================================
   MNS Capital Africa — Interactions
   ========================================================================= */
(function () {
  "use strict";

  /* --- En-tête : fond au défilement --- */
  var header = document.getElementById("header");
  function onScroll() {
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

  /* --- Année dans le pied de page --- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* --- Formulaire de contact (démo côté client) --- */
  var form = document.getElementById("contactForm");
  var formMsg = document.getElementById("formMsg");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.reset();
      if (formMsg) {
        formMsg.style.display = "block";
        formMsg.textContent = "Merci ! Votre message a bien été pris en compte. Nous vous répondrons sous 48 heures.";
      }
    });
  }
})();
