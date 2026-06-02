/* ============================================================
   HOLDOUT - site interactions
   - Bilingual toggle (EN / TR) persisted in localStorage
   - Mobile nav, FAQ accordion, pricing billing toggle
   - Scroll reveal + animated stat counters
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Language ---------- */
  var STORE_KEY = "holdout-lang";
  var META = {
    en: {
      title: "Holdout - Beat your friend. Build the habit.",
      desc: "Holdout turns every habit into a 1-on-1 duel. Invite a friend, check in daily, and whoever breaks the streak first loses."
    },
    tr: {
      title: "Holdout - Arkadaşını yen. Alışkanlığı kazan.",
      desc: "Holdout her alışkanlığı birebir düelloya çevirir. Bir arkadaşını davet et, her gün check-in yap; seriyi önce kim koparırsa kaybeder."
    }
  };

  function setLang(lang) {
    if (lang !== "en" && lang !== "tr") lang = "en";
    var root = document.documentElement;
    root.classList.remove("lang-en", "lang-tr");
    root.classList.add("lang-" + lang);
    root.setAttribute("lang", lang);
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}

    // Update <title> + meta description if the page declares overrides
    var page = document.body.getAttribute("data-page") || "home";
    if (page === "home" && META[lang]) {
      document.title = META[lang].title;
      var md = document.querySelector('meta[name="description"]');
      if (md) md.setAttribute("content", META[lang].desc);
    }
  }

  function currentLang() {
    try { return localStorage.getItem(STORE_KEY) || "en"; } catch (e) { return "en"; }
  }

  // Apply once DOM is ready (class was pre-set inline to avoid flash)
  setLang(currentLang());

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lang]");
    if (!btn) return;
    e.preventDefault();
    setLang(btn.getAttribute("data-lang"));
  });

  /* ---------- Mobile nav ---------- */
  var nav = document.querySelector(".nav");
  var burger = document.querySelector(".nav__burger");
  if (burger && nav) {
    burger.addEventListener("click", function () { nav.classList.toggle("open"); });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var item = q.closest(".faq");
      var ans = item.querySelector(".faq__a");
      var open = item.classList.toggle("open");
      ans.style.maxHeight = open ? ans.scrollHeight + "px" : null;
      q.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // Keep open FAQ heights correct after a language switch (content length differs)
  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-lang]")) return;
    setTimeout(function () {
      document.querySelectorAll(".faq.open .faq__a").forEach(function (a) {
        a.style.maxHeight = a.scrollHeight + "px";
      });
    }, 20);
  });

  /* ---------- Pricing billing toggle ---------- */
  var bill = document.querySelector(".bill-toggle");
  if (bill) {
    bill.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      bill.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      var plan = b.getAttribute("data-plan"); // monthly | yearly | lifetime
      document.querySelectorAll("[data-price]").forEach(function (el) {
        el.style.display = el.getAttribute("data-price") === plan ? "" : "none";
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1100, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- Fit phone mockup to viewport (scale, no crop) ---------- */
  function fitPhone() {
    var phone = document.querySelector(".phone");
    if (!phone) return;
    var byH = (window.innerHeight - 170) / 660; // reserve nav + hero padding + scroll cue
    var byW = (window.innerWidth - 48) / 320;   // never wider than the viewport
    var ps = Math.max(0.62, Math.min(1, byH, byW));
    phone.style.zoom = ps.toFixed(3);
  }
  fitPhone();
  window.addEventListener("resize", fitPhone);

  /* ---------- Footer year ---------- */
  var yr = document.querySelector("[data-year]");
  if (yr) {
    var d = new Date();
    yr.textContent = String(d.getFullYear() || 2026);
  }
})();
