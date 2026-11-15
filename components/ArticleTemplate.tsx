import { ArrowLeft, Clock } from "lucide-react";
import { simulatorHref } from "@/lib/simulator-link";
import { knowledgeBase, type Article, type Category } from "@/lib/knowledge-base";

export function ArticleTemplate({
  category,
  article,
  onBack,
}: {
  category: Category;
  article: Article;
  onBack: () => void;
}) {
  const showBrief = Boolean(article.updated || article.scopeNote || article.presets?.length);

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
      <p className="mt-6 text-xs font-semibold tracking-[0.16em] text-amber-500 uppercase">{category.title}</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight font-medium text-balance">{article.title}</h1>
      <p className="mt-3 flex items-center gap-2 text-sm text-slate-400">
        <Clock className="size-4" aria-hidden="true" />
        {article.minutes} dakikalık okuma
      </p>

      {showBrief ? (
        <div className="mt-5 space-y-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-4 text-sm leading-relaxed text-slate-300">
          {article.updated ? <p>Son güncelleme: {article.updated}</p> : null}
          {article.scopeNote ? <p>{article.scopeNote}</p> : null}
          {article.presets?.map((preset) => (
            <p key={preset.label}>
              <a href={simulatorHref(preset)} className="font-medium text-amber-400 underline decoration-amber-500/50 underline-offset-2">
                Simülatörde aç: {preset.label}
              </a>
            </p>
          ))}
        </div>
      ) : null}

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
            <li key={item.day} className="flex gap-4 rounded-xl border border-slate-700 bg-slate-900 p-4">
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

      {article.presets?.length ? (
        <p className="mt-8 text-sm leading-relaxed text-slate-300">
          {article.presets.map((preset, index) => (
            <span key={preset.label}>
              {index > 0 ? " " : null}
              <a href={simulatorHref(preset)} className="text-amber-400 underline decoration-amber-500/50 underline-offset-2">
                {preset.label}
              </a>
              {index < article.presets!.length - 1 ? "," : ""}
            </span>
          ))}{" "}
          bağlantısı aynı varsayımı simülatöre taşır.
        </p>
      ) : null}

      <p className="mt-10 text-xs leading-relaxed text-slate-400">{knowledgeBase.disclaimer}</p>
    </article>
  );
}
