import { InfoPage } from "@/components/InfoPage";

const SOURCES = [
  { href: "https://www.gib.gov.tr", label: "Gelir İdaresi Başkanlığı" },
  { href: "https://www.mevzuat.gov.tr", label: "Mevzuat Bilgi Sistemi" },
  { href: "https://www.resmigazete.gov.tr", label: "Resmî Gazete" },
  { href: "https://www.sgk.gov.tr", label: "Sosyal Güvenlik Kurumu" },
  { href: "https://www.ticaret.gov.tr", label: "Ticaret Bakanlığı" },
  { href: "https://www.kvkk.gov.tr", label: "Kişisel Verileri Koruma Kurumu" },
];

export default function MevzuatKaynaklariPage() {
  return (
    <InfoPage title="Resmî mevzuat kaynakları">
      <p>Sitedeki notlar bu kurumların yayımladığı metinlere dayanır. Güncel hali için kaynağın kendisine bakın.</p>
      <ul className="list-disc space-y-2 pl-5">
        {SOURCES.map((source) => (
          <li key={source.href}>
            <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:text-teal-200">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </InfoPage>
  );
}
