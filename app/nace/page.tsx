import { NaceFinder } from "@/components/NaceFinder";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "NACE kod bulucu | Mükellef Dostu",
  description: "Anahtar kelimeyle güncel altılı NACE kodunu bulun ve kuruluş için ön görüşme talep edin.",
};

export default function NacePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />
      <NaceFinder />
      <SiteFooter />
    </main>
  );
}
