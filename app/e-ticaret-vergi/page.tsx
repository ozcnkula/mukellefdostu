import { InfoPage } from "@/components/InfoPage";

export default function EticaretVergiPage() {
  return (
    <InfoPage title="E-ticaret yapanlar için vergi yükümlülükleri">
      <p>
        Bu sayfa, pazaryeri ve kendi sitesinden satış yapanlar için başlık listesidir. Tutar, had ve istisna kendi cironuz ve belge düzeninize göre değişir.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-white">E-belge</h2>
      <p>
        Pazaryeri satışı çoğu zaman e-fatura veya e-arşiv belgesi ister. Kağıt fatura sınırı ve ciro haddi aşıldığında e-belgeye geçiş ayrıca değerlendirilir.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-white">KDV ve komisyon</h2>
      <p>
        Satış bedeli ve pazaryerinin kestiği komisyon faturası ayrı izlenir. Komisyon, şartları varsa gider yazılabilir. KDV’nin hangi dönemde beyan edileceği fatura ve tahsilat düzenine bağlıdır.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-white">Stopaj ve kayıt</h2>
      <p>
        Bazı hizmet ve kira ödemelerinde tevkifat doğabilir. Ürün satışı ile hizmet satışı aynı kalıba girmez. Defter ve belge düzeni, şahıs veya limited ayrımına göre kurulur.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-white">Mikro ihracat</h2>
      <p>
        ETGB ile yapılan teslimlerde KDV istisnası ve iade, gümrük ve fatura belgelerinin uyumuna bağlıdır. Her kargo gönderisi kendiliğinden iade doğurmaz.
      </p>
      <p>
        Karşılaştırma için <a className="text-teal-300 hover:text-teal-200" href="/#hesaplayici">vergi ve Bağ-Kur hesaplayıcı</a>, kuruluştan sonraki liste için <a className="text-teal-300 hover:text-teal-200" href="/#lead-form">checklist</a> kullanılabilir. İkisi de bağlayıcı hesap değildir.
      </p>
    </InfoPage>
  );
}
