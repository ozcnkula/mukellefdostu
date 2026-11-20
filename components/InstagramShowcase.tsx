import Image from "next/image";
import { BookOpen } from "lucide-react";
import { INSTAGRAM_HANDLE, INSTAGRAM_PROFILE, instagramPosts, type InstagramPost } from "@/data/instagramPosts";

function PostMedia({ post }: { post: InstagramPost }) {
  return (
    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950">
      {post.imageUrl ? (
        <Image
          src={post.imageUrl}
          alt=""
          fill
          sizes="(min-width: 768px) 320px, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <BookOpen className="h-8 w-8 text-slate-600" aria-hidden="true" />
        </div>
      )}
      {post.isReels ? (
        <span className="absolute right-2 top-2 rounded-full border border-slate-700 bg-slate-950/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-200 uppercase">
          Reels
        </span>
      ) : null}
    </div>
  );
}

export function InstagramShowcase() {
  return (
    <section className="border-t border-slate-800" aria-labelledby="instagram-vitrin">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-teal-400 uppercase">Sosyal Medyada Mükellef Dostu</p>
            <h2 id="instagram-vitrin" className="mt-2 text-xl font-bold text-slate-200">
              Kısa Mevzuat Notları & Rehberler
            </h2>
          </div>
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-teal-300 hover:text-teal-200"
          >
            {INSTAGRAM_HANDLE} hesabını takip et →
          </a>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {instagramPosts.map((post) => (
            <li key={post.id}>
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition hover:border-teal-500/50"
              >
                <PostMedia post={post} />
                <div className="p-4">
                  <p className="text-xs text-slate-500">{post.category}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">{post.title}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
