import { InfoPage } from "@/components/InfoPage";

export default function IletisimPage() {
  return (
    <InfoPage title="İletişim ve çalışma adresi">
      <p>
        Ön görüşme için ana sayfadaki formu kullanın. Form, ad, telefon ve konuyu kaydeder. Bu kayıt bir sözleşme değildir.
      </p>
      <p>
        Çalışma adresi bu sayfada yayımlanmıyor. Çalışmaya başlanacaksa adres, sözleşme ve aydınlatma metninde yazılı olarak bildirilir.
      </p>
      <p>
        <a href="/#lead-form" className="font-semibold text-teal-300 hover:text-teal-200">Ön görüşme formuna git</a>
      </p>
    </InfoPage>
  );
}
