"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Clock,
  Scale,
  Search,
} from "lucide-react";
import {
  findArticle,
  knowledgeBase,
  type Article,
  type Category,
} from "../../data/knowledgeBase";

const icons = {
  "sirket-kurulumu": Building2,
  "mevzuat-kosesi": Scale,
  "muhasebe-finans": BookOpen,
} as const;

const upcoming = [
  { day: "17 Kas", title: "Geçici vergi", note: "3. dönem · Temmuz–Eylül" },
  { day: "26 Kas", title: "Muhtasar ve prim", note: "Ekim dönemi" },
  { day: "30 Kas", title: "KDV 1", note: "28’i hafta sonu, süre kaydı" },
];

function matches(article: Article, category: Category, query: string) {
  if (!query) return true;
  const haystack = `${article.title} ${article.summary} ${category.title}`.toLocaleLowerCase("tr");
  return haystack.includes(query.toLocaleLowerCase("tr"));
}

function articleSlugFromHash() {
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  return findArticle(hash)?.article.slug ?? null;
}

export default function RehberPage() {
  const [query, setQuery] = useState("");
  const [slug, setSlug] = useState<string | null>(null);
  const selected = slug ? findArticle(slug) : undefined;

  useEffect(() => {
    const apply = () => setSlug(articleSlugFromHash());
    apply();
    window.addEventListener("hashchange", apply);
    window.addEventListener("popstate", apply);
    return () => {
      window.removeEventListener("hashchange", apply);
      window.removeEventListener("popstate", apply);
    };
  }, []);

  useEffect(() => {
    if (slug) {
      window.scrollTo(0, 0);
      return;
    }
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!hash || findArticle(hash)) return;
    document.getElementById(hash)?.scrollIntoView();
  }, [slug]);

  const openArticle = (next: string) => {
    const nextHash = `#${next}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    }
    setSlug(next);
  };

  const closeArticle = () => {
    if (window.location.hash) {
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    setSlug(null);
  };

  const visible = useMemo(
    () =>
      knowledgeBase.categories
        .map((category) => ({
          category,
          articles: category.articles.filter((article) => matches(article, category, query.trim())),
        }))
        .filter((group) => group.articles.length > 0),
    [query],
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
          <button
            type="button"
            onClick={closeArticle}
            className="flex items-center gap-3"
          >
            <span className="grid size-9 place-items-center rounded-md bg-amber-500 font-serif text-base font-semibold text-slate-950">
              M
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-wide">{knowledgeBase.brand}</span>
              <span className="block text-xs text-slate-400">Bilgi merkezi</span>
            </span>
          </button>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Kategoriler">
            {knowledgeBase.categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                onClick={() => setSlug(null)}
                className="rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
              >
                {category.title}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="ust" className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:pt-14">
        {selected ? (
          <ArticleView
            category={selected.category}
            article={selected.article}
            onBack={closeArticle}
          />
        ) : (
          <Catalog
            query={query}
            onQuery={setQuery}
            groups={visible}
            onOpen={openArticle}
          />
        )}
      </main>
    </div>
  );
}

function Catalog({
  query,
  onQuery,
  groups,
  onOpen,
}: {
  query: string;
  onQuery: (value: string) => void;
  groups: { category: Category; articles: Article[] }[];
  onOpen: (slug: string) => void;
}) {
  return (
    <>
      <p className="text-xs font-semibold tracking-[0.18em] text-amber-500 uppercase">
        Mevzuat köşesi
      </p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight font-medium text-balance text-slate-100 sm:text-5xl">
        {knowledgeBase.slogan}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-slate-400">
        Şirket kuruluşu, vergi ve günlük muhasebe kararları için kısa notlar. Son gözden geçirme:{" "}
        {knowledgeBase.updated}.
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Kasım vadeleri">
        {upcoming.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => onOpen("aylik-vergi-takvimi")}
            className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-left transition-colors hover:border-amber-500/60"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-amber-500/15 font-serif text-sm font-semibold text-amber-500">
              {item.day.split(" ")[0]}
            </span>
            <span>
              <span className="block text-sm font-semibold">{item.title}</span>
              <span className="block text-xs text-slate-400">{item.note}</span>
            </span>
          </button>
        ))}
      </section>

      <label className="mt-8 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
        <Search className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
        <span className="sr-only">Yazılarda ara</span>
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Başlık veya konu ara"
          className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
        />
      </label>

      {groups.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-slate-700 px-5 py-10 text-center text-sm text-slate-400">
          Bu aramayla eşleşen yazı yok. Başlığı sadeleştirip yeniden deneyin.
        </p>
      ) : (
        <div className="mt-12 space-y-14">
          {groups.map(({ category, articles }) => {
            const Icon = icons[category.id as keyof typeof icons];
            return (
              <section key={category.id} id={category.id} className="scroll-mt-24">
                <div className="flex items-start gap-3 border-b border-slate-700 pb-4">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-lg bg-slate-900 text-amber-500">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl font-medium text-balance">{category.title}</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-pretty text-slate-400">
                      {category.description}
                    </p>
                  </div>
                </div>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <li key={article.slug}>
                      <button
                        type="button"
                        onClick={() => onOpen(article.slug)}
                        className="flex h-full w-full flex-col rounded-xl border border-slate-700 bg-slate-900 p-4 text-left transition-colors hover:border-amber-500/60"
                      >
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="size-3.5" aria-hidden="true" />
                          {article.minutes} dk
                        </span>
                        <span className="mt-3 font-serif text-lg leading-snug font-medium text-balance">
                          {article.title}
                        </span>
                        <span className="mt-2 text-sm leading-relaxed text-pretty text-slate-400">
                          {article.summary}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <p className="mt-14 max-w-3xl text-xs leading-relaxed text-slate-400">{knowledgeBase.disclaimer}</p>
    </>
  );
}

function ArticleView({
  category,
  article,
  onBack,
}: {
  category: Category;
  article: Article;
  onBack: () => void;
}) {
  return (
    <article id={article.slug} className="mx-auto max-w-3xl scroll-mt-24">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-md px-1 py-2 text-sm text-slate-400 transition-colors hover:text-slate-100"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Tüm yazılar
      </button>
      <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-amber-500 uppercase">
        {category.title}
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight font-medium text-balance">{article.title}</h1>
      <p className="mt-3 flex items-center gap-2 text-sm text-slate-400">
        <Clock className="size-4" aria-hidden="true" />
        {article.minutes} dakikalık okuma
      </p>
      <p className="mt-5 text-lg leading-relaxed text-pretty text-slate-200">{article.summary}</p>

      <div className="mt-8 space-y-8">
        {article.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-serif text-2xl font-medium">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-base leading-relaxed text-pretty text-slate-200">
                {paragraph}
              </p>
            ))}
            {section.points ? (
              <ul className="mt-4 space-y-2">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-200">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {article.table ? (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="border-b border-slate-700 bg-slate-900 px-4 py-3 text-left font-medium text-slate-100">
              {article.table.caption}
            </caption>
            <thead>
              <tr className="text-slate-400">
                {article.table.headers.map((header) => (
                  <th key={header || "bos"} className="px-4 py-3 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {article.table.rows.map((row) => (
                <tr key={row[0]} className="border-t border-slate-700">
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`} className="px-4 py-3 align-top text-slate-200">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {article.calendar ? (
        <ol className="mt-8 space-y-3">
          {article.calendar.map((item) => (
            <li
              key={item.day}
              className="flex gap-4 rounded-xl border border-slate-700 bg-slate-900 p-4"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-amber-500 font-serif text-lg font-semibold text-slate-950">
                {item.day}
              </span>
              <span>
                <span className="block font-semibold">{item.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-400">{item.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      {article.faq ? (
        <dl className="mt-8 space-y-3">
          {article.faq.map((item) => (
            <div key={item.question} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <dt className="font-semibold">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-pretty text-slate-400">{item.answer}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <p className="mt-10 text-xs leading-relaxed text-slate-400">{knowledgeBase.disclaimer}</p>
    </article>
  );
}
