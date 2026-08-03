import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = ["index.html", "styles.css", "app.js", "privacy.html", "terms.html", "support.html", "delete-account.html", "i/index.html", "referral/index.html", "CNAME", "robots.txt", "sitemap.xml"];
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => readFileSync(join(root, file), "utf8");
const count = (source, pattern) => (source.match(pattern) || []).length;

for (const file of required) assert(existsSync(join(root, file)), `missing ${file}`);

const index = read("index.html");
const css = read("styles.css");
const js = read("app.js");
const invite = read("i/index.html");
const referral = read("referral/index.html");

assert(count(index, /<h1(?:\s|>)/gi) === 1, "home must have one h1");
assert(count(index, /<main(?:\s|>)/gi) === 1, "home must have one main landmark");
assert(/class=["'][^"']*skip-link/.test(index), "home must have a skip link");
assert(/id=["']winning["']/.test(index), "home must retain a dedicated winning-rules section");
assert(/Co-Win/.test(index) && /Ortak Galibiyet/.test(index), "home must explain Co-Win in EN/TR");
assert(/1\.5(?:×|x)/i.test(index), "home must explain the 1.5× reward");
assert(/round(?:ed|ing) up/i.test(index) && /yukarı yuvarlan/i.test(index), "home must explain integer reward rounding in EN/TR");
assert(/six-character/i.test(index) && /6 karakter/i.test(index), "home must promise six-character referral codes in EN/TR");
assert(/data-store-badge/.test(index) && /aria-disabled=["']true["']/.test(index), "store badges must remain disabled and marked coming soon");
assert(!/data-site-price|data-currency|SITE_PRICES|holdout-currency/.test(index + js), "site must not hard-code store pricing");
assert(/https:\/\/formspree\.io\/f\/mbdejlkb/.test(index), "waitlist endpoint must remain unchanged");
assert(/aria-live=["']polite["']/.test(index), "waitlist must provide localized live feedback");
assert(/privacy\.html/.test(index) && /terms\.html/.test(index) && /support\.html/.test(index) && /delete-account\.html/.test(index), "home must retain legal and support links");
assert(/href=["']i\//.test(index) && /href=["']referral\//.test(index), "home must retain invite and referral fallbacks");
assert(/application\/ld\+json/.test(index), "home must contain truthful structured data");
assert(!/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(index), "home must not block rendering on remote fonts");
assert(/mockup-full\.webp/.test(index) && /fetchpriority=["']high["']/.test(index), "hero must use an eager optimized mockup");
assert(/mockup-full-tr\.webp/.test(index) && /loading=["']lazy["']/.test(index), "hidden locale mockup must load lazily");
assert(/prefers-color-scheme:\s*light/.test(css), "site must support light mode");
assert(/prefers-reduced-motion:\s*reduce/.test(css), "site must support reduced motion");
assert(/:focus-visible/.test(css), "site must expose keyboard focus");
assert(/min-(?:height|width):\s*44px/.test(css), "interactive controls must include a 44px target");
assert(/Escape/.test(js) && /aria-expanded/.test(js), "mobile navigation must support Escape and ARIA state");
assert(/Accept["']?\s*:\s*["']application\/json/.test(js), "waitlist must progressively enhance Formspree feedback");
assert(/holdout:\/\//.test(invite) && /t=/.test(invite), "invite fallback contract changed");
assert(/holdout:\/\//.test(referral) && /(?:code|ref)=/.test(referral), "referral fallback contract changed");

for (const file of required.filter((item) => extname(item) === ".html")) {
  const source = read(file);
  const base = dirname(join(root, file));
  for (const match of source.matchAll(/(?:href|src)=["']([^"'#?]+)(?:[?#][^"']*)?["']/gi)) {
    const target = match[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(target)) continue;
    const resolved = resolve(base, target);
    const candidate = target.endsWith("/") ? join(resolved, "index.html") : resolved;
    assert(existsSync(candidate), `${file} has unresolved local reference ${target}`);
  }
}

if (failures.length) {
  console.error("site verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("site verification passed");
