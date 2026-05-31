/* ============================================================
   HOLDOUT — İlerleme Panosu
   Tek kaynak: aşağıdaki CONFIG. Tarihleri, hedefleri ve
   görevleri buradan düzenle — pano otomatik güncellenir.
   ============================================================ */

const CONFIG = {
  // --- Tarihler (YYYY-MM-DD) — bunları kendine göre düzenle ---
  projectStart: "2026-05-01",   // projeye başlangıç
  mvpTarget:    "2026-08-31",   // 🎯 MVP hedef tarihi (geri sayım buna)
  launchTarget: "2026-09-30",   // App Store / Play lansman hedefi

  // --- Hedefler (current = şu anki değer, ilerledikçe güncelle) ---
  goals: [
    { label: "Kullanıcı — 6. ay",     current: 0, target: 20000,  note: "İlk 6 ay hedefi (muhafazakâr senaryo)" },
    { label: "Kullanıcı — 12. ay",    current: 0, target: 100000, note: "12. ay hedefi (iyimser senaryo)" },
    { label: "Aylık gelir — 6. ay",   current: 0, target: 2050,   prefix: "$", note: "abonelik + reklam" },
    { label: "Aylık gelir — 12. ay",  current: 0, target: 15200,  prefix: "$" },
    { label: "K faktörü (viral)",     current: 0, target: 1.0,    decimals: 1, note: "her kullanıcı 1+ yeni kullanıcı getirmeli" },
    { label: "Premium dönüşüm",       current: 0, target: 5,      suffix: "%", note: "ödeme yapan kullanıcı oranı" }
  ],

  // --- Yol haritası fazları (tek kaynak: hem görsel hem yazısal) ---
  // mvp:true olan fazlar "MVP ilerlemesi" yüzdesine dahildir.
  phases: [
    { name: "Faz 0 — Fikir & Doğrulama", short: "Faz 0\nFikir", start: "2026-05-01", end: "2026-05-31", mvp: true, tasks: [
      { t: "Fikir doğrulama", d: true },
      { t: "Uygulama ismi: Holdout", d: true },
      { t: "Mockup tasarımı", d: true },
      { t: "Rakip & konumlandırma analizi", d: true }
    ]},
    { name: "Faz 1 — Hazırlık & Tasarım", short: "Faz 1\nHazırlık", start: "2026-05-31", end: "2026-06-30", mvp: true, tasks: [
      { t: "Pazarlama websitesi (canlı)", d: true },
      { t: "Mobbin araştırması (onboarding/paywall)", d: false },
      { t: "Figma ekran tasarımları", d: false },
      { t: "Developer hesapları (Apple/Google)", d: false },
      { t: "Supabase şemasını finalize et", d: false },
      { t: "Design system & bileşen kütüphanesi", d: false }
    ]},
    { name: "Faz 2 — MVP Geliştirme", short: "Faz 2\nMVP", start: "2026-06-30", end: "2026-08-31", mvp: true, tasks: [
      { t: "Kullanıcı kaydı & profil", d: false },
      { t: "Alışkanlık oluşturma", d: false },
      { t: "1-1 duel sistemi", d: false },
      { t: "Günlük check-in", d: false },
      { t: "Push notification", d: false },
      { t: "Deep link davet sistemi", d: false },
      { t: "Abonelik (RevenueCat)", d: false },
      { t: "Reklam (AdMob)", d: false }
    ]},
    { name: "Faz 3 — Lansman", short: "Faz 3\nLansman", start: "2026-08-31", end: "2026-09-30", mvp: false, tasks: [
      { t: "App Store / Play Store submit", d: false },
      { t: "ASO (anahtar kelime, görseller)", d: false },
      { t: "Beta & ilk yorum kampanyası", d: false },
      { t: "İlk kullanıcı kazanımı", d: false }
    ]},
    { name: "Faz 4 — MVP Sonrası", short: "Faz 4\nSonrası", start: "2026-09-30", end: "2026-12-31", mvp: false, tasks: [
      { t: "Bireysel puan & skor", d: false },
      { t: "Solo alışkanlık takibi", d: false },
      { t: "Quit / sobriety modu", d: false }
    ]}
  ]
};

/* ---------------- helpers ---------------- */
const DAY = 86400000;
const parse = (s) => new Date(s + "T00:00:00");
const daysBetween = (a, b) => Math.round((b - a) / DAY);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const pad = (n) => String(n).padStart(2, "0");
function fmtDate(d) { return pad(d.getDate()) + "." + pad(d.getMonth() + 1) + "." + d.getFullYear(); }
function fmtNum(v, g) {
  const s = (g && g.prefix ? g.prefix : "") +
    Number(v).toLocaleString("tr-TR", { maximumFractionDigits: (g && g.decimals) || 0 }) +
    (g && g.suffix ? g.suffix : "");
  return s;
}
function phaseStatus(p, now) {
  const allDone = p.tasks.length > 0 && p.tasks.every(t => t.d);
  if (allDone) return "done";
  if (now >= parse(p.start) && now <= parse(p.end)) return "active";
  if (now > parse(p.end)) return "active"; // süresi geçti ama bitmedi
  return "todo";
}
const tasksDone = (p) => p.tasks.filter(t => t.d).length;

/* ---------------- render ---------------- */
function render() {
  const now = new Date();
  const start = parse(CONFIG.projectStart);
  const mvp = parse(CONFIG.mvpTarget);

  // today label
  document.getElementById("today").textContent = fmtDate(now);
  document.getElementById("mvp-date").textContent = fmtDate(mvp);
  document.getElementById("updated").textContent = fmtDate(now);

  // active phase label
  const active = CONFIG.phases.find(p => phaseStatus(p, now) === "active") || CONFIG.phases[0];
  document.getElementById("phase-now").textContent = "Şu an: " + active.name.split(" — ")[0] + " (" + active.name.split(" — ")[1] + ")";

  // MVP progress ring (mvp:true fazlar)
  const mvpPhases = CONFIG.phases.filter(p => p.mvp);
  const mvpTotal = mvpPhases.reduce((a, p) => a + p.tasks.length, 0);
  const mvpDoneN = mvpPhases.reduce((a, p) => a + tasksDone(p), 0);
  const mvpPct = mvpTotal ? Math.round(mvpDoneN / mvpTotal * 100) : 0;
  const C = 2 * Math.PI * 70;
  const fg = document.getElementById("ring-fg");
  fg.style.strokeDasharray = C;
  fg.style.strokeDashoffset = C * (1 - mvpPct / 100);
  document.getElementById("ring-pct").textContent = mvpPct + "%";

  // stats
  const allTotal = CONFIG.phases.reduce((a, p) => a + p.tasks.length, 0);
  const allDoneN = CONFIG.phases.reduce((a, p) => a + tasksDone(p), 0);
  const elapsed = Math.max(0, daysBetween(start, now));
  const remain = Math.max(0, daysBetween(now, mvp));
  const milestones = CONFIG.phases.filter(p => phaseStatus(p, now) === "done").length;
  const f2 = CONFIG.phases.find(p => p.name.indexOf("Faz 2") === 0);
  const stats = [
    { v: elapsed, k: "Geçen gün (başlangıçtan)" },
    { v: remain, k: "MVP'ye kalan gün", lime: true },
    { v: allDoneN + "<small>/" + allTotal + "</small>", k: "Tamamlanan adım", raw: true },
    { v: tasksDone(f2) + "<small>/" + f2.tasks.length + "</small>", k: "MVP geliştirme görevi", raw: true },
    { v: milestones + "<small>/" + CONFIG.phases.length + "</small>", k: "Tamamlanan faz", raw: true },
    { v: mvpPct + "<small>%</small>", k: "MVP ilerlemesi", raw: true, lime: true }
  ];
  document.getElementById("stats").innerHTML = stats.map(s =>
    `<div class="stat"><div class="v ${s.lime ? "" : "muted"}">${s.raw ? s.v : s.v}</div><div class="k">${s.k}</div></div>`
  ).join("");

  // goals
  document.getElementById("goals").innerHTML = CONFIG.goals.map(g => {
    const pct = clamp(g.target ? g.current / g.target * 100 : 0, 0, 100);
    return `<div class="goal">
      <div class="goal-top"><span class="goal-label">${g.label}</span>
        <span class="goal-val">${fmtNum(g.current, g)} <i>/ ${fmtNum(g.target, g)}</i></span></div>
      <div class="goal-bar"><span style="width:${pct}%"></span></div>
      ${g.note ? `<div class="goal-note">${g.note}</div>` : ""}
    </div>`;
  }).join("");

  // timeline (visual)
  const tEnd = parse(CONFIG.phases[CONFIG.phases.length - 1].end);
  const span = daysBetween(start, tEnd) || 1;
  const segHtml = CONFIG.phases.map(p => {
    const w = clamp(daysBetween(parse(p.start), parse(p.end)) / span * 100, 0, 100);
    const st = phaseStatus(p, now);
    return `<div class="tl-seg ${st}" style="width:${w}%"><span class="lab">${(p.short || p.name).replace(/\n/g, "<br>")}</span></div>`;
  }).join("");
  const todayPct = clamp(daysBetween(start, now) / span * 100, 0, 100);
  const mvpPctPos = clamp(daysBetween(start, mvp) / span * 100, 0, 100);
  const launchPctPos = clamp(daysBetween(start, parse(CONFIG.launchTarget)) / span * 100, 0, 100);
  document.getElementById("timeline").innerHTML =
    `<div class="tl-track">${segHtml}<div class="tl-today" style="left:${todayPct}%"></div></div>
     <div class="tl-milestones">
       <span class="tl-ms" style="left:${mvpPctPos}%">🎯 <b>MVP</b> ${fmtDate(mvp)}</span>
       <span class="tl-ms" style="left:${launchPctPos}%">🚀 Lansman ${fmtDate(parse(CONFIG.launchTarget))}</span>
     </div>`;

  // phases (textual)
  document.getElementById("phases").innerHTML = CONFIG.phases.map(p => {
    const st = phaseStatus(p, now);
    const done = tasksDone(p), total = p.tasks.length;
    const pct = total ? Math.round(done / total * 100) : 0;
    const badge = st === "done" ? "Tamamlandı" : st === "active" ? "Devam ediyor" : "Bekliyor";
    const items = p.tasks.map(t =>
      `<li class="${t.d ? "done" : ""}"><span class="box">${t.d ? "✓" : ""}</span><span>${t.t}</span></li>`
    ).join("");
    return `<div class="phase ${st === "active" ? "is-active" : ""} ${st === "done" ? "is-done" : ""}">
      <div class="phase-head">
        <span class="phase-name">${p.name}</span>
        <span class="phase-badge ${st}">${badge}</span>
        <span class="phase-dates">${fmtDate(parse(p.start))} → ${fmtDate(parse(p.end))}</span>
      </div>
      <div class="phase-prog"><div class="bar"><span style="width:${pct}%"></span></div><div class="pct">${done}/${total}</div></div>
      <ul class="tasks">${items}</ul>
    </div>`;
  }).join("");
}

/* ---------------- live countdown ---------------- */
function tickCountdown() {
  const now = new Date();
  const target = parse(CONFIG.mvpTarget);
  let ms = target - now;
  if (ms < 0) ms = 0;
  const d = Math.floor(ms / DAY);
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  document.getElementById("cd-days").textContent = d;
  document.getElementById("cd-h").textContent = pad(h);
  document.getElementById("cd-m").textContent = pad(m);
  document.getElementById("cd-s").textContent = pad(s);
}

render();
tickCountdown();
setInterval(tickCountdown, 1000);
