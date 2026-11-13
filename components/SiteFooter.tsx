import Link from "next/link";

const LINKS = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim ve çalışma adresi" },
  { href: "/kvkk", label: "KVKK aydınlatma metni" },
  { href: "/gizlilik", label: "Gizlilik ve çerez politikası" },
  { href: "/kullanim-kosullari", label: "Kullanım koşulları" },
  { href: "/arac-sinirlari", label: "Araçların kullanım sınırları" },
  { href: "/mevzuat-kaynaklari", label: "Resmî mevzuat kaynakları" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 pb-20 pt-10 text-slate-400 sm:pb-10">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="font-semibold text-slate-200">mukellefdostu.com</p>
          <p className="mt-2 text-xs leading-relaxed">
            Vergi, SGK ve şirket kuruluşu hakkında güncel bilgi ve hesaplama araçları. Mesleki hizmet, yazılı sözleşme olmadan başlamaz.
          </p>
        </div>
        <nav className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2" aria-label="Yasal bağlantılar">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-teal-300">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-4 text-xs text-slate-500 sm:px-6">© 2026 mukellefdostu.com</p>
    </footer>
  );
}
