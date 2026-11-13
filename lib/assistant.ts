import { allArticles, findArticle, knowledgeBase, type Article, type Category } from "./knowledge-base";

export type AssistantSimulator = {
  profit: number;
  distribution: number;
  soleNet: number;
  ltdNet: number;
  winner: "sahis" | "ltd";
};

export type AssistantLink = {
  title: string;
  href: string;
};

export type AssistantReply = {
  text: string;
  source: AssistantLink | null;
  related: AssistantLink[];
  contactHref: string | null;
  calculatorHref: string | null;
};

const CONTACT_HREF = "/#lead-form";
const CALCULATOR_HREF = "/#hesaplayici";

const FOLD: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  i̇: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  â: "a",
  î: "i",
  û: "u",
};

const STOP = new Set([
  "acaba",
  "ama",
  "ayrica",
  "ben",
  "bana",
  "bile",
  "bir",
  "biz",
  "bize",
  "bu",
  "bunu",
  "butun",
  "cok",
  "da",
  "daha",
  "dahi",
  "de",
  "diye",
  "eder",
  "ederim",
  "edersen",
  "edersem",
  "ediyor",
  "en",
  "fakat",
  "gibi",
  "gore",
  "hakkinda",
  "hangi",
  "hem",
  "her",
  "icin",
  "ilgili",
  "ise",
  "kac",
  "kadar",
  "ki",
  "kim",
  "kime",
  "kimin",
  "lazim",
  "mi",
  "midir",
  "misin",
  "misiniz",
  "miyim",
  "mu",
  "mudur",
  "musun",
  "muyum",
  "nasil",
  "ne",
  "nedir",
  "neler",
  "neyi",
  "neden",
  "olan",
  "olarak",
  "olur",
  "olursa",
  "olurum",
  "o",
  "peki",
  "sadece",
  "sen",
  "sey",
  "siz",
  "sonra",
  "su",
  "tum",
  "var",
  "veya",
  "ve",
  "yok",
  "yani",
  "yapmali",
  "yapmaliyim",
  "yapmam",
  "gerekir",
]);

const KEEP = new Set([
  "anonim",
  "bagkur",
  "beyanname",
  "fatura",
  "gelir",
  "gider",
  "harcama",
  "ihbar",
  "kanun",
  "kasim",
  "limited",
  "muhtasar",
  "sermaye",
  "sirket",
  "vergi",
  "zarar",
]);

const SUFFIXES = [
  "ebilirim",
  "abilirim",
  "meliyim",
  "maliyim",
  "lerinden",
  "larindan",
  "ebilir",
  "abilir",
  "lerini",
  "larini",
  "lerin",
  "larin",
  "lugum",
  "ligim",
  "leri",
  "lari",
  "masi",
  "mesi",
  "maya",
  "meye",
  "sini",
  "sunu",
  "meli",
  "mali",
  "lugu",
  "ligi",
  "iniz",
  "unuz",
  "siniz",
  "sunuz",
  "ecek",
  "acak",
  "leri",
  "lar",
  "ler",
  "mak",
  "mek",
  "ini",
  "unu",
  "dan",
  "den",
  "tan",
  "ten",
  "nin",
  "nun",
  "yim",
  "yum",
  "yiz",
  "yuz",
  "dir",
  "dur",
  "tir",
  "tur",
  "mis",
  "mus",
  "yor",
  "ken",
  "luk",
  "lik",
  "siz",
  "suz",
  "sem",
  "sam",
  "si",
  "su",
  "yi",
  "yu",
  "ya",
  "ye",
  "da",
  "de",
  "ta",
  "te",
  "im",
  "um",
  "in",
  "un",
  "ci",
  "cu",
  "li",
  "lu",
  "mez",
  "maz",
  "me",
  "ma",
  "di",
  "du",
  "ti",
  "tu",
  "er",
  "ar",
  "ir",
  "ur",
].sort((a, b) => b.length - a.length);

const SYNONYMS: Record<string, readonly string[]> = {
  bagkur: ["sgk"],
  bagkurlu: ["sgk"],
  limited: ["ltd"],
  ltd: ["limited"],
  beyan: ["beyanname"],
  beyanname: ["beyan"],
  efatura: ["ebelge", "earsiv", "edefter"],
  earsiv: ["efatura", "ebelge"],
  ebelge: ["efatura", "earsiv"],
  edefter: ["ebelge", "efatura"],
};

const DEFAULT_RELATED = ["sirket-kurmadan-once", "isletme-giderleri", "aylik-vergi-takvimi"];

type Kind = "faq" | "calendar" | "paragraph" | "point" | "summary" | "table";

type Passage = {
  slug: string;
  title: string;
  kind: Kind;
  answer: string;
  norm: string;
  weights: Map<string, number>;
};

const SHORT_OK = new Set(["kdv", "sgk", "ltd", "ay"]);

const MONTHS = ["ocak", "subat", "mart", "nisan", "mayis", "haziran", "temmuz", "agustos", "eylul", "ekim", "kasim", "aralik"];

function foldTurkish(value: string): string {
  const lower = value.toLocaleLowerCase("tr").replace(/\u0307/g, "");
  let out = "";
  for (const char of lower) out += FOLD[char] ?? char;
  return out;
}

function normalize(value: string): string {
  const folded = foldTurkish(value)
    .replace(/['’‘]/g, "")
    .replace(/[-‐‑–—]/g, "");
  const joined = folded.replace(/\bbag kur\b/g, "bagkur");
  const digits = joined.replace(/(\d)\.(\d{3})(?!\d)/g, "$1$2").replace(/(\d)\.(\d{3})(?!\d)/g, "$1$2");
  return digits.replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value: string): string[] {
  const norm = normalize(value);
  return norm ? norm.split(" ") : [];
}

function stripOnce(token: string): string {
  for (const suffix of SUFFIXES) {
    if (suffix.length >= token.length || !token.endsWith(suffix)) continue;
    const next = token.slice(0, -suffix.length);
    if (next.length < 3) continue;
    if (next.length < 4 && suffix.length < 4 && !SHORT_OK.has(next)) continue;
    return next;
  }
  return token;
}

function collapseVerb(token: string): string {
  if (token.startsWith("yaz") && token.length > 3 && token.length <= 8) return "yaz";
  if (!token.startsWith("ode") || token.length === 3 || token.length > 11) return token;
  const tail = token.slice(3);
  if (/^(r|n|l|me|ma|mek|mak|nir|nmez|mez|yor|ecek|meli|ebilir|rsem|rse|m)?$/.test(tail)) return "ode";
  return token;
}

function stemToken(token: string): string {
  if (token === "aylar" || token === "aylik" || token === "ayin" || token === "aya") return "ay";
  if (STOP.has(token) || KEEP.has(token)) return token;
  let current = token;
  for (let step = 0; step < 4; step += 1) {
    if (KEEP.has(current)) return current;
    const next = stripOnce(current);
    if (next === current) break;
    current = next;
  }
  if (KEEP.has(current)) return current;
  return collapseVerb(current);
}

function usable(stem: string): boolean {
  if (!stem || STOP.has(stem)) return false;
  if (/^\d+$/.test(stem)) return stem.length >= 2;
  if (stem.length >= 3) return true;
  return SHORT_OK.has(stem);
}

function addText(weights: Map<string, number>, text: string, weight: number) {
  for (const token of tokenize(text)) {
    const stemmed = stemToken(token);
    if (!usable(stemmed)) continue;
    const previous = weights.get(stemmed) ?? 0;
    if (weight > previous) weights.set(stemmed, weight);
  }
}

function looseMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const short = a.length <= b.length ? a : b;
  const long = a.length <= b.length ? b : a;
  const diff = long.length - short.length;
  if (short.length < 3 || diff !== 1) return false;
  return long.startsWith(short) || long.endsWith(short);
}

function buildPassages(): Passage[] {
  const passages: Passage[] = [];

  for (const { category, article } of allArticles()) {
    passages.push(passage(category, article, "summary", article.summary, (weights) => {
      addText(weights, article.title, 4.6);
      addText(weights, category.title, 1.2);
      addText(weights, article.summary, 3);
    }));

    for (const section of article.sections) {
      for (const paragraph of section.paragraphs) {
        passages.push(passage(category, article, "paragraph", withHeading(section.heading, paragraph), (weights) => {
          addText(weights, article.title, 4.2);
          addText(weights, category.title, 1.1);
          addText(weights, section.heading, 3.8);
          addText(weights, paragraph, 2.6);
          for (const sibling of section.paragraphs) {
            if (sibling !== paragraph) addText(weights, sibling, 0.8);
          }
          for (const point of section.points ?? []) addText(weights, point, 0.7);
        }));
      }

      for (const point of section.points ?? []) {
        passages.push(passage(category, article, "point", withHeading(section.heading, point), (weights) => {
          addText(weights, article.title, 4);
          addText(weights, section.heading, 3.4);
          addText(weights, point, 3);
        }));
      }
    }

    if (article.table) {
      for (const row of article.table.rows) {
        const cells = row.slice(1).map((cell, index) => {
          const header = article.table?.headers[index + 1];
          return header ? `${header}: ${cell}` : cell;
        });
        const answer = `${row[0]} — ${cells.join("; ")}.`;
        passages.push(passage(category, article, "table", answer, (weights) => {
          addText(weights, article.title, 3.6);
          addText(weights, article.table?.caption ?? "", 2.4);
          addText(weights, row.join(" "), 3.4);
          addText(weights, (article.table?.headers ?? []).join(" "), 1.6);
        }));
      }
    }

    for (const item of article.calendar ?? []) {
      const answer = `${item.title}: ${item.detail}`;
      passages.push(passage(category, article, "calendar", answer, (weights) => {
        addText(weights, article.title, 3.4);
        addText(weights, item.title, 4.8);
        addText(weights, item.detail, 3);
        for (const section of article.sections) {
          addText(weights, section.heading, 1);
          for (const paragraph of section.paragraphs) addText(weights, paragraph, 0.7);
        }
      }));
    }

    for (const item of article.faq ?? []) {
      passages.push(passage(category, article, "faq", item.answer, (weights) => {
        addText(weights, article.title, 2.4);
        addText(weights, item.question, 6.4);
        addText(weights, item.answer, 3);
      }));
    }
  }

  return passages;
}

function withHeading(heading: string, body: string): string {
  const glue = /[.?:…]$/.test(heading.trim()) ? " " : ". ";
  return `${heading}${glue}${body}`;
}

function passage(
  category: Category,
  article: Article,
  kind: Kind,
  answer: string,
  fill: (weights: Map<string, number>) => void,
): Passage {
  const weights = new Map<string, number>();
  fill(weights);
  return {
    slug: article.slug,
    title: article.title,
    kind,
    answer,
    norm: normalize(`${category.title} ${article.title} ${answer}`),
    weights,
  };
}

const PASSAGES = buildPassages();

const IDF = new Map<string, number>();
{
  const docs = new Map<string, number>();
  for (const item of PASSAGES) {
    for (const stem of item.weights.keys()) docs.set(stem, (docs.get(stem) ?? 0) + 1);
  }
  const total = PASSAGES.length;
  for (const [stem, count] of docs) {
    IDF.set(stem, Math.log((total + 1) / (count + 1)) + 1);
  }
}

function idf(stem: string): number {
  return IDF.get(stem) ?? Math.log(PASSAGES.length + 1) + 1;
}

type Scored = {
  passage: Passage;
  score: number;
  matched: number;
  rareStrong: boolean;
  unknownMiss: boolean;
};

function phraseBoost(queryNorm: string, passageNorm: string): number {
  const words = queryNorm.split(" ").filter((word) => word.length > 2 && !STOP.has(word));
  let hits = 0;
  for (let index = 0; index < words.length - 1; index += 1) {
    if (passageNorm.includes(`${words[index]} ${words[index + 1]}`)) hits += 1;
  }
  return 1 + hits * 0.16;
}

function rank(question: string): { scored: Scored[]; tokens: number; when: boolean; who: boolean; tariff: boolean } {
  const norm = normalize(question);
  const when = norm.includes("ne zaman") || norm.includes("hangi gun") || norm.includes("hangi tarih") || /(^| )vade( |$)/.test(norm);
  const who = /(^| )(kim|kime|kimin|kimler)( |$)/.test(norm);
  const tariff = /(^| )(dilim|dilimler|tarife)( |$)/.test(norm);
  const stems: string[] = [];
  const seen = new Set<string>();
  for (const token of norm ? norm.split(" ") : []) {
    const stemmed = stemToken(token);
    if (!usable(stemmed) || seen.has(stemmed)) continue;
    seen.add(stemmed);
    stems.push(stemmed);
  }

  const scored = PASSAGES.map((item) => scorePassage(item, stems, { when, who }, norm))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return { scored, tokens: stems.length, when, who, tariff };
}

function scorePassage(item: Passage, stems: string[], intent: { when: boolean; who: boolean }, queryNorm: string): Scored {
  let score = 0;
  let matched = 0;
  let rareStrong = false;
  let unknownMiss = false;
  const answerStems = new Set(tokenize(item.answer).map((token) => stemToken(token)).filter(usable));

  for (const stem of stems) {
    const direct = lookup(item, stem, 1);
    const viaSynonym = (SYNONYMS[stem] ?? []).reduce((best, synonym) => Math.max(best, lookup(item, synonym, 0.92).weight), 0);
    const best = Math.max(direct.weight, viaSynonym);
    if (best <= 0) {
      if (!IDF.has(stem)) unknownMiss = true;
      continue;
    }
    matched += 1;
    score += best * idf(stem);
    if (answerStems.has(stem)) score += 0.55;
    if (direct.rare || (viaSynonym > direct.weight && idf(stem) >= 1.7 && viaSynonym >= 3.2)) rareStrong = true;
  }

  if (matched === 0) return { passage: item, score: 0, matched: 0, rareStrong: false, unknownMiss };

  const coverage = matched / stems.length;
  score *= 0.55 + 0.45 * coverage;
  score *= phraseBoost(queryNorm, item.norm);
  if (intent.when && item.kind === "calendar") score *= 1.72;
  if (intent.when && item.kind === "faq") score *= 0.92;
  if (intent.who && item.kind === "calendar") score *= 0.68;
  if (intent.who && (item.weights.has("isveren") || item.weights.has("mukellef") || item.norm.includes("isveren"))) {
    score *= 1.28;
  }
  if (queryNorm.includes("aylar") || queryNorm.includes("hangi ay")) {
    const monthHits = MONTHS.filter((month) => item.norm.includes(month)).length;
    score *= monthHits >= 2 ? 1.35 + (monthHits - 2) * 0.28 : 0.7;
  }
  if (item.kind === "faq") score *= 1.08;
  const answerNorm = normalize(item.answer);
  if ((queryNorm.includes("ne kadar") || queryNorm.includes("kac")) && /\d/.test(item.answer)) score *= 1.42;
  const genericKdv = queryNorm.includes("kdv") && !queryNorm.includes("tevkifat") && !/(^| )2( |$)/.test(queryNorm);
  if (genericKdv && answerNorm.includes("2 no") && !answerNorm.includes("1 no")) score *= 0.58;
  if (intent.when && queryNorm.includes("kdv") && item.slug === "aylik-vergi-takvimi") {
    score *= item.kind === "calendar" ? 1.72 : 1.12;
  }
  return { passage: item, score, matched, rareStrong, unknownMiss };
}

function lookup(item: Passage, stem: string, factor: number): { weight: number; rare: boolean } {
  const exact = item.weights.get(stem);
  if (exact) return { weight: exact * factor, rare: exact >= 3.4 && idf(stem) >= 1.45 && !/^\d+$/.test(stem) };
  if (stem.length < 3) return { weight: 0, rare: false };
  let best = 0;
  let rare = false;
  for (const [key, weight] of item.weights) {
    if (!looseMatch(stem, key)) continue;
    if (weight > best) {
      best = weight;
      rare = weight >= 3.4 && idf(key) >= 1.45 && !/^\d+$/.test(key);
    }
  }
  return { weight: best * factor * 0.9, rare };
}

function isConfident(best: Scored, runnerUp: Scored | undefined, tokenCount: number): boolean {
  if (tokenCount === 0 || best.matched === 0) return false;
  const coverage = best.matched / tokenCount;
  if (best.score < 3.4) return false;
  if (tokenCount >= 2 && best.matched < 2 && !(best.rareStrong && coverage >= 0.5)) return false;
  if (coverage < 0.34 && !best.rareStrong) return false;
  if (best.unknownMiss) {
    const agreed = !runnerUp || best.score >= runnerUp.score * 1.35;
    if (!(agreed && best.matched >= 2 && best.score >= 12)) return false;
  }
  if (
    runnerUp &&
    runnerUp.passage.slug !== best.passage.slug &&
    best.score < runnerUp.score * 1.08 &&
    !best.rareStrong &&
    coverage < 0.67
  ) {
    return false;
  }
  return true;
}

function articleLink(slug: string, title?: string): AssistantLink | null {
  const found = findArticle(slug);
  if (!found) return null;
  return { title: title ?? found.article.title, href: articleHref(slug) };
}

function relatedLinks(ranked: Scored[]): AssistantLink[] {
  const links: AssistantLink[] = [];
  const seen = new Set<string>();
  for (const item of ranked) {
    if (seen.has(item.passage.slug)) continue;
    const link = articleLink(item.passage.slug, item.passage.title);
    if (!link) continue;
    seen.add(item.passage.slug);
    links.push(link);
    if (links.length === 3) return links;
  }
  for (const slug of DEFAULT_RELATED) {
    if (links.length === 3) break;
    if (seen.has(slug)) continue;
    const link = articleLink(slug);
    if (!link) continue;
    seen.add(slug);
    links.push(link);
  }
  return links;
}

function disclaimer(): string {
  const sentences = knowledgeBase.disclaimer.split(/(?<=\.)\s+/);
  return sentences[sentences.length - 1] ?? knowledgeBase.disclaimer;
}

function assemble(parts: Array<string | null | undefined | false>): string {
  return parts.filter((part): part is string => Boolean(part)).join(" ");
}

function profileNote(profileLabel: string | null, question: string, answer: string): string {
  const blob = normalize(`${question} ${answer}`);
  const aboutDocument = /efatura|earsiv|ebelge|fatura|pazaryeri/.test(blob);
  if (profileLabel === "E-Ticaret Satıcısı" && aboutDocument) {
    return "Pazaryeri satışında alıcı ve platform genellikle e-fatura veya e-arşiv entegrasyonu ister.";
  }
  if (profileLabel === "Freelancer & Yazılımcı" && aboutDocument) {
    return "Yurt dışı hizmette belge türü, müşterinin statüsüne ve istisna şartlarına göre değişir.";
  }
  return "";
}

function isCompanyComparison(question: string): boolean {
  const norm = normalize(question);
  const sahis = norm.includes("sahis");
  const ltd = norm.includes("ltd") || norm.includes("limited");
  const anonim = norm.includes("anonim");
  const advantage = /avantaj|karsilastir|hangisi|tercih/.test(norm);
  if (sahis && (ltd || anonim)) return true;
  if ((sahis || ltd || anonim) && advantage) return true;
  return false;
}

export function articleHref(slug: string): string {
  return `/rehber#${slug}`;
}

export function simulatorSentence(simulator: AssistantSimulator): string {
  const winner = simulator.winner === "sahis" ? "şahıs şirketi" : "limited şirket";
  const mode =
    simulator.distribution <= 0
      ? "kâr şirkette kalırsa"
      : simulator.distribution >= 100
        ? "kârın tamamı dağıtılırsa"
        : `kârın %${simulator.distribution}’i dağıtılırsa`;
  const money = (amount: number) => `${Math.round(amount).toLocaleString("tr-TR")} TL`;
  return `Simülatörde yıllık ${money(simulator.profit)} vergi öncesi kâr ve “${mode}” seçili. Şahıs neti ${money(simulator.soleNet)}, limited neti ${money(simulator.ltdNet)}. Bu seçimde ${winner} daha avantajlı görünüyor.`;
}

export function answerQuestion(
  question: string,
  profileLabel: string | null,
  simulator: AssistantSimulator | null,
): AssistantReply {
  const trimmed = question.trim();
  const prefix = profileLabel ? `${profileLabel} profiline göre:` : "";
  const note = disclaimer();

  if (!trimmed) {
    return { text: "Sorunuzu yazın.", source: null, related: [], contactHref: null, calculatorHref: null };
  }

  if (simulator && isCompanyComparison(trimmed)) {
    const found = findArticle("sirket-turleri");
    const summary = found?.article.summary ?? "";
    return {
      text: assemble([prefix, simulatorSentence(simulator), summary, profileNote(profileLabel, trimmed, summary), note]),
      source: found ? { title: found.article.title, href: articleHref(found.article.slug) } : null,
      related: [],
      contactHref: null,
      calculatorHref: null,
    };
  }

  const { scored, tokens, tariff } = rank(trimmed);
  const best = scored[0];
  const runnerUp = scored.find((item) => item.passage.slug !== best?.passage.slug);

  if (!best || !isConfident(best, runnerUp, tokens)) {
    const calculatorHref = tariff ? CALCULATOR_HREF : null;
    const lead = tariff
      ? "Gelir vergisi dilimleri Bilgi Merkezi yazılarında ayrı bir tablo olarak yer almıyor. Karşılaştırma için hesaplayıcıya bakabilir veya aşağıdaki başlıklara göz atabilirsiniz."
      : "Bu soruyu Bilgi Merkezi yazılarıyla eşleştiremedim. Aşağıdaki başlıklara göz atabilir veya iletişim formundan yazabilirsiniz.";
    return {
      text: assemble([prefix, lead, note]),
      source: null,
      related: relatedLinks(scored),
      contactHref: CONTACT_HREF,
      calculatorHref,
    };
  }

  const answer = best.passage.answer;
  return {
    text: assemble([prefix, answer, profileNote(profileLabel, trimmed, answer), note]),
    source: { title: best.passage.title, href: articleHref(best.passage.slug) },
    related: [],
    contactHref: null,
    calculatorHref: null,
  };
}
