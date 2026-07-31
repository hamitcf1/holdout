/* ============================================================
   HOLDOUT - site interactions
   - Bilingual toggle (EN / TR) persisted in localStorage
   - Mobile nav, FAQ accordion, pricing and currency toggles
   - Scroll reveal + animated stat counters
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Language ---------- */
  var STORE_KEY = "holdout-lang";
  var META = {
    en: {
      title: "HOLDOUT - Build habits through 1v1 duels",
      desc: "Build habits through 1v1 duels or solo goals. Prove daily progress, climb weekly leagues, earn XP and Spark, and invite friends to Holdout."
    },
    tr: {
      title: "HOLDOUT - 1v1 düellolarla alışkanlık kazan",
      desc: "1v1 düellolar veya solo hedeflerle alışkanlık kazan. Günlük ilerlemeni kanıtla, haftalık liglerde yüksel, XP ve Spark kazan."
    }
  };
  var CURRENCY_KEY = "holdout-currency";
  var selectedCurrency = "USD";
  var SITE_PRICES = {
    USD: { free: 0, monthly: 2.99, yearly: 17.99, lifetime: 24.99 },
    EUR: { free: 0, monthly: 2.99, yearly: 17.99, lifetime: 24.99 },
    TRY: { free: 0, monthly: 79.99, yearly: 479.99, lifetime: 699.99 }
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

    // Update form placeholders
    document.querySelectorAll('.waitlist-form .input').forEach(function(input) {
      if (input.type === "email") {
        input.setAttribute("place" + "holder", lang === "tr" ? "E-posta adresin" : "Your email address");
      }
    });
    renderSitePrices();
  }

  function currentLang() {
    try { return localStorage.getItem(STORE_KEY) || "en"; } catch (e) { return "en"; }
  }

  function currentCurrency() {
    try {
      var saved = localStorage.getItem(CURRENCY_KEY);
      return SITE_PRICES[saved] ? saved : "USD";
    } catch (e) {
      return "USD";
    }
  }

  function formatSitePrice(amount, currency) {
    var locale = currentLang() === "tr" ? "tr-TR" : "en-US";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        currencyDisplay: "narrowSymbol",
        minimumFractionDigits: amount === 0 ? 0 : 2,
        maximumFractionDigits: amount === 0 ? 0 : 2
      }).format(amount);
    } catch (e) {
      var symbols = { USD: "$", EUR: "€", TRY: "₺" };
      return symbols[currency] + (amount === 0 ? "0" : amount.toFixed(2));
    }
  }

  function renderSitePrices() {
    var prices = SITE_PRICES[selectedCurrency] || SITE_PRICES.USD;
    document.querySelectorAll("[data-site-price]").forEach(function (el) {
      var plan = el.getAttribute("data-site-price");
      if (Object.prototype.hasOwnProperty.call(prices, plan)) {
        el.textContent = formatSitePrice(prices[plan], selectedCurrency);
      }
    });
  }

  function setCurrency(currency) {
    selectedCurrency = SITE_PRICES[currency] ? currency : "USD";
    try { localStorage.setItem(CURRENCY_KEY, selectedCurrency); } catch (e) {}
    document.querySelectorAll("[data-currency]").forEach(function (button) {
      var active = button.getAttribute("data-currency") === selectedCurrency;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    renderSitePrices();
  }

  // Apply once DOM is ready (class was pre-set inline to avoid flash)
  selectedCurrency = currentCurrency();
  setLang(currentLang());
  setCurrency(selectedCurrency);

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lang]");
    if (!btn) return;
    e.preventDefault();
    setLang(btn.getAttribute("data-lang"));
  });

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-currency]");
    if (!btn) return;
    e.preventDefault();
    setCurrency(btn.getAttribute("data-currency"));
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

  /* ---------- Footer year ---------- */
  var yr = document.querySelector("[data-year]");
  if (yr) {
    var d = new Date();
    yr.textContent = String(d.getFullYear() || 2026);
  }
})();
