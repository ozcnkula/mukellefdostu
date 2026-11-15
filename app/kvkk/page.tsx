import { InfoPage } from "@/components/InfoPage";

export default function KvkkPage() {
  return (
    <InfoPage title="KVKK aydınlatma metni">
      <p>
        Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun 10. maddesi kapsamında ön bilgilendirmedir. Veri sorumlusu, mukellefdostu.com sitesini işleten kişidir. Unvan ve adres, çalışmaya başlanacaksa yazılı olarak ayrıca bildirilir.
      </p>
      <p>
        Ön görüşme formunda ad soyad, telefon ve konu; teklif formunda ayrıca e-posta ile simülasyon sonucu işlenir. Ön eşleştirme formunda ad soyad, e-posta veya telefon, odak konusu ve simülatör özeti işlenir. Amaç, talebi kaydetmek ve sizinle dönüş yapmaktır. Hukuki sebep, talebinize bağlı iletişimdir. Ön eşleştirmede ayrıca açık rızanız vardır.
      </p>
      <p>
        Kayıtlar, talep listesini tutmak için Google Sheets’e webhook ile iletilebilir. Slack adresi tanımlıysa teklif ve ön eşleştirme bildirimi oraya da düşer. Ön eşleştirmede verdiğiniz açık rıza kapsamında özet senaryo, ilgili iş ortağıyla paylaşılabilir. Veriler, yasal süre ve talebin sonuçlanması için gerekli olan süreden uzun tutulmaz.
      </p>
      <p>
        KVKK’nın 11. maddesindeki erişim, düzeltme, silme ve itiraz haklarınızı ön görüşme formundaki iletişim yoluyla kullanabilirsiniz. Şikayet için Kişisel Verileri Koruma Kurulu’na başvurabilirsiniz.
      </p>
    </InfoPage>
  );
}
