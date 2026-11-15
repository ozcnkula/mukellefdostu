import { InfoPage } from "@/components/InfoPage";

export default function GizlilikPage() {
  return (
    <InfoPage title="Gizlilik ve çerez politikası">
      <p>
        Site, sayfa ziyareti ile simülatör, checklist ve AI sorusu olaylarını Vercel Analytics ile sayar. Bu ölçümde ad, telefon veya e-posta gönderilmez.
      </p>
      <p>
        Zorunlu teknik çerezler oturumun çalışması için kullanılabilir. Reklam çerezi veya üçüncü taraf pazarlama profili oluşturulmaz. Tarayıcı ayarlarından çerezleri silebilirsiniz; bu durumda sayfa ölçümü eksik kalabilir.
      </p>
      <p>
        Formda yazdığınız bilgiler talep kaydı ve size dönüş için kullanılır. Ön eşleştirmede, ayrı onay kutusundaki açık rıza kapsamında özet senaryo ilgili iş ortağıyla paylaşılabilir. Başka bir ürünün reklamı için satılmaz.
      </p>
    </InfoPage>
  );
}
