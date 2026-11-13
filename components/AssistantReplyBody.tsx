import type { AssistantReply } from "@/lib/assistant";

const linkClass =
  "inline-flex text-sm font-medium text-teal-300 underline decoration-teal-700 underline-offset-2 hover:text-teal-200";
const actionClass =
  "inline-flex text-sm font-medium text-amber-200 underline decoration-amber-700 underline-offset-2 hover:text-amber-100";

export function AssistantReplyBody({ reply }: { reply: AssistantReply }) {
  return (
    <div className="space-y-2">
      <p>{reply.text}</p>
      {reply.source ? (
        <a href={reply.source.href} className={linkClass}>
          Yazının tamamı: {reply.source.title}
        </a>
      ) : null}
      {reply.related.length > 0 ? (
        <ul className="space-y-1">
          {reply.related.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={linkClass}>
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {reply.calculatorHref ? (
        <a href={reply.calculatorHref} className={actionClass}>
          Şahıs ve limited hesaplayıcı
        </a>
      ) : null}
      {reply.contactHref ? (
        <a href={reply.contactHref} className={actionClass}>
          İletişim formu
        </a>
      ) : null}
    </div>
  );
}
