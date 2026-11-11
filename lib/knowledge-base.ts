export const slogan =
  "Doğru muhasebe, sağlıklı finansal kararlar ve güvenilir danışmanlık.";

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  points?: string[];
};

export type ArticleTable = {
  caption: string;
  headers: string[];
  rows: string[][];
};

export type CalendarItem = {
  day: string;
  title: string;
  detail: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Article = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  sections: ArticleSection[];
  table?: ArticleTable;
  calendar?: CalendarItem[];
  faq?: FaqItem[];
};

export type Category = {
  id: string;
  title: string;
  description: string;
  articles: Article[];
};

export const knowledgeBase = {
  brand: "Mükellef Dostu",
  slogan,
  disclaimer:
    "Bu köşe genel bilgilendirme içindir; beyanname, ceza veya yapılandırma kararı yerine geçmez. Süreler resmî tatile denk gelirse sonraki iş gününe kayar. İşleminize özel sonuç için güncel mevzuatı ve mali müşavirinizi esas alın.",
  updated: "Kasım 2026",
  categories: [
    {
      id: "sirket-kurulumu",
      title: "Şirket Kurulumu",
      description:
        "Faaliyete geçmeden önce tür, sermaye, sorumluluk ve ilk yükümlülükleri netleştirin.",
      articles: [
        {
          slug: "sirket-kurmadan-once",
          title: "Şirket Kurmadan Önce Bilmeniz Gerekenler",
          summary:
            "Faaliyet, adres, sermaye ve kişisel sorumluluk kurulmadan önce konuşulması gereken dört başlıktır.",
          minutes: 6,
          sections: [
            {
              heading: "Ne satacaksınız, kime, hangi belgelerle?",
              paragraphs: [
                "Kuruluş evrakından önce faaliyet konusu net olmalıdır. NACE kodu, ruhsat veya meslek odası kaydı gerektiren işler (gıda, sağlık, taşımacılık, yapı) ile serbest faaliyet aynı hızda ilerlemez.",
                "Müşteri kitlesi e-fatura, e-arşiv veya tevkifat uygulayıp uygulamayacağınızı da belirler. Büyük alıcılara çalışan bir işletme, kuruluşun ilk ayında e-belgeye geçmek zorunda kalabilir.",
              ],
            },
            {
              heading: "Adres ve görünürlük",
              paragraphs: [
                "Merkez adresi vergi dairesi, ticaret sicili ve tebligat içindir. Sanal ofis her faaliyet için yeterli olmayabilir; belediye ve oda, fiilî işyerini ayrıca sorabilir.",
                "Tabela, işyeri açma ve çalışma ruhsatı ile kira sözleşmesindeki kullanım amacı birbiriyle çelişmemelidir.",
              ],
            },
            {
              heading: "Para ve sorumluluk aynı karar",
              paragraphs: [
                "Sermaye şirketinde ortaklık kural olarak taahhüt edilen sermaye ile sınırlıdır. Vergi ve SGK gibi kamu alacaklarında kanuni temsilcinin sorumluluğu ise ayrıca doğabilir. “Şirket kurdum, şahsi mal varlığım tamamen güvende” cümlesi doğru değildir.",
                "Kuruluş masrafını yalnızca noter ve sicil harcı sanmayın. Damga vergisi, oda kaydı, mali müşavir, e-imza, banka ve ilk üç ayın muhtasar–KDV döngüsü nakit planının parçasıdır.",
              ],
              points: [
                "Ortaklar arası yetki ve kâr payı yazılı olsun.",
                "Kişisel hesap ile işletme hesabını ilk günden ayırın.",
                "Tahmini ciro, KDV ve stopaj takvimine göre 90 günlük nakit bırakın.",
              ],
            },
          ],
        },
        {
          slug: "sirket-turleri",
          title: "Şirket Türleri ve Karşılaştırmaları",
          summary:
            "Şahıs, limited ve anonim; sorumluluk, vergi türü ve asgari sermaye aynı tabloda.",
          minutes: 7,
          sections: [
            {
              heading: "Hangi tür ne işe yarar?",
              paragraphs: [
                "Şahıs işletmesi hızlı açılır ve gelir vergisine tabidir. Borçlardan işletme sahibi şahsen sorumludur. Tek kişilik, öngörülebilir cirolu ve düşük riskli işlerde hâlâ sık tercih edilir.",
                "Limited ve anonim şirket kurumlar vergisine tabidir. 1 Ocak 2024’ten beri yeni kuruluşlarda asgari sermaye limitedde 50.000 TL, anonimde 250.000 TL’dir. Kayıtlı sermaye sistemindeki halka açık olmayan anonim şirketlerde başlangıç sermayesi en az 500.000 TL’dir.",
                "Bu tutarların altında kalan mevcut şirketlere uyum için tanınan süre, 17 Ekim 2026 tarihli Resmî Gazete tebliği ile 31 Aralık 2027’ye uzatılmıştır. Süre dolunca yükümlülüğü yerine getirmeyen şirket infisah etmiş sayılır.",
              ],
            },
            {
              heading: "Seçimi ciro değil risk belirler",
              paragraphs: [
                "Personel, stok, ithalat veya uzun vadeli sözleşme varsa şahıs işletmesinin sınırsız sorumluluğu pahalıya gelir. Yatırımcı veya pay devri konuşuluyorsa anonim şirketin pay yapısı daha esnektir.",
                "Tek ortak hem limited hem anonimde mümkündür. Tür değiştirmek sonradan yapılabilir; fakat unvan, sözleşme ve vergi kimliği baştan doğru seçilirse ilk yıl daha sakin geçer.",
              ],
            },
          ],
          table: {
            caption: "Üç sık tür, aynı dört soru",
            headers: ["", "Şahıs", "Limited", "Anonim"],
            rows: [
              ["Vergi", "Gelir vergisi", "Kurumlar vergisi", "Kurumlar vergisi"],
              ["Asgari sermaye", "Yok", "50.000 TL", "250.000 TL"],
              ["Borç sorumluluğu", "Kişisel ve sınırsız", "Kural olarak sermaye ile sınırlı", "Kural olarak sermaye ile sınırlı"],
              ["Kuruluş", "Vergi dairesi ve oda", "Sözleşme ve ticaret sicili", "Esas sözleşme ve ticaret sicili"],
              ["Pay devri", "İşletmenin devri", "Noter ve sicil süreci", "Pay devri daha esnek"],
            ],
          },
        },
        {
          slug: "yeni-isletme-rehberi",
          title: "Yeni İşletmeler İçin Rehber",
          summary:
            "İlk otuz günde vergi levhasından e-belgeye, işe girişten ilk beyannameye giden kısa liste.",
          minutes: 5,
          sections: [
            {
              heading: "İlk hafta",
              paragraphs: [
                "Potansiyel vergi numaranız, yoksa kuruluşla birlikte oluşur. Vergi levhası, e-Devlet ve Dijital Vergi Dairesi erişimi, e-imza veya mali mühür bu haftanın işidir.",
                "Ticari işletmede banka hesabı unvanınıza açılmalıdır. Tahsilatın ortakların kişisel kartına düşmesi, ileride hem gider hem ortaklar cari hesabını karıştırır.",
              ],
            },
            {
              heading: "İlk ay",
              paragraphs: [
                "Fatura düzeni faaliyetin ilk gününde hazır olmalıdır. e-Fatura, e-arşiv ve e-defter zorunluluğu ciro ve sektöre göre değişir; eşiğin altı da “hiç kayıt tutmam” anlamına gelmez.",
                "İlk çalışan işe başlamadan önce SGK işe giriş bildirgesi verilir. Ücret, sözleşme ve bordro aynı gün konuşulmazsa ilk muhtasar dönemi hatalı açılır.",
              ],
              points: [
                "Vergi dairesi, sicil ve oda evrakının bir kopyasını dijital klasörde tutun.",
                "KDV, stopaj ve geçici vergi vadelerini takvime işleyin.",
                "İlk üç ayın beklenen giderini belge düzeniyle birlikte mali müşavirinize iletin.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "mevzuat-kosesi",
      title: "Mevzuat Köşesi",
      description:
        "Vergi, SGK ve iş hukuku başlıklarını kanun adıyla değil, işletmenin günlük kararıyla okuyun.",
      articles: [
        {
          slug: "vergi-mevzuati",
          title: "Vergi Mevzuatı",
          summary:
            "Beyannamenin dayandığı beş kanun: usul, gelir, kurumlar, KDV ve damga.",
          minutes: 6,
          sections: [
            {
              heading: "Hangi kanun neyi söyler?",
              paragraphs: [
                "Vergi Usul Kanunu belge, kayıt, değerleme, süre ve ceza düzeninin çatısıdır. Beyannameyi geç vermek ile hiç vermemek, bu kanundaki usule göre ayrılır.",
                "Gelir Vergisi Kanunu ticari, zirai ve serbest meslek kazancı ile ücret ve menkul sermaye iradını; Kurumlar Vergisi Kanunu sermaye şirketlerinin safi kurum kazancını düzenler.",
                "Katma Değer Vergisi Kanunu teslim ve hizmetteki KDV’yi, tevkifatı ve indirimi; Damga Vergisi Kanunu ise sözleşmelerdeki nispi veya maktu damgayı konu eder.",
              ],
            },
            {
              heading: "Mükellefin günlük karşılığı",
              paragraphs: [
                "Her ay çoğunlukla KDV ve muhtasar–prim döngüsü vardır. Çeyrekte geçici vergi, yılda gelir veya kurumlar beyannamesi eklenir. Damga, sürekli mükellefiyette ayrıca beyan edilir.",
                "Mevzuatı sirküler yığını olarak biriktirmek yerine her belgeyi şu üç soruyla okuyun: Hangi döneme ait? İndirim veya istisna şartı var mı? Süresi hangi gün bitiyor?",
              ],
            },
          ],
        },
        {
          slug: "guncel-vergi-duzenlemeleri",
          title: "Güncel Vergi Düzenlemeleri",
          summary:
            "2026’da masada tutulan dört başlık: sermaye uyumu, e-belge, asgari kurumlar vergisi ve süre kayması.",
          minutes: 5,
          sections: [
            {
              heading: "Sermaye uyumu 2027’ye kaldı",
              paragraphs: [
                "7887 sayılı Cumhurbaşkanı Kararı ile anonim şirket asgari sermayesi 250.000 TL’ye, limited 50.000 TL’ye çıkarılmıştı. Kanundaki tamamlanma süresi 31 Aralık 2026 idi.",
                "Ticaret Bakanlığı’nın 17 Ekim 2026 tarihli tebliği bu süreyi 31 Aralık 2027’ye uzattı. Uyum, “ileride bakarız” değildir; genel kurul, tescil ve gerekirse nakdi artırım takvimi şimdiden yazılmalıdır.",
              ],
            },
            {
              heading: "e-Belge ve asgari vergi",
              paragraphs: [
                "e-Fatura, e-arşiv ve e-defter zorunlulukları ciro haddi ve sektör tebliğleriyle güncellenir. Hadlerin altındaki işletme de alıcısının talebi veya kendi isteğiyle sisteme girebilir; bir kez girince çıkış kolay değildir.",
                "Asgari kurumlar vergisi, indirim ve istisnalar sonrası matrah çok düşük kalsa bile ticari kâr üzerinden asgari bir verginin hesaplanmasını öngörür. Oran ve istisna listesi yıla göre değişir; beyanname öncesi kanun metni okunmadan “istisna yazdık, vergi çıkmaz” denmemelidir.",
              ],
            },
            {
              heading: "Süre resmî tatilde uzar, unutulmaz",
              paragraphs: [
                "Vergi Usul Kanunu’nun 18. maddesi, sürenin son günü resmî tatile rastlarsa sürenin tatili izleyen ilk iş günü sonunda bittiğini söyler. Kasım 2026’da 1 No’lu KDV’nin kanuni günü 28 Kasım Cumartesi olduğu için uygulama 30 Kasım Pazartesi’ye kayar.",
              ],
            },
          ],
        },
        {
          slug: "sgk-ve-is-hukuku",
          title: "SGK ve İş Hukuku",
          summary:
            "İşe giriş, ücret, ihbar ve yıllık izin: bordro ile sözleşme aynı gerçeği anlatmalıdır.",
          minutes: 6,
          sections: [
            {
              heading: "Bildirge ücretten önce gelir",
              paragraphs: [
                "4/a kapsamındaki çalışan için işe giriş bildirgesi, çalışmanın başlamasından önce SGK’ya iletilir. Sigortasız deneme günü diye bir uygulama yoktur.",
                "Ücret, en az yürürlükteki asgari ücret olmalıdır. Elden kalan kısım hem işveren primini hem ücret stopajını eksik bırakır ve kayıtlar tutarsızlaşır.",
              ],
            },
            {
              heading: "Fesihte iki ayrı süre",
              paragraphs: [
                "4857 sayılı Kanun’a göre ihbar: 6 aya kadar 2 hafta, 6 aydan 1,5 yıla 4 hafta, 1,5 yıldan 3 yıla 6 hafta, 3 yıldan fazla 8 haftadır. İhbarı peşin olarak ödemek süresi ortadan kaldırır, kıdemi silmez.",
                "Kıdem tazminatı kendi şartlarına bağlıdır ve tavanı her dönem güncellenir. Yıllık ücretli izin, bir yılı dolduran işçi için kıdeme göre en az 14, 20 veya 26 gündür; on sekiz yaşından küçük ve elli yaşından büyük işçide izin 20 günden az olamaz.",
              ],
            },
          ],
        },
        {
          slug: "vergi-hatalari",
          title: "Vergi Hataları ve Doğru Bilinen Yanlışlar",
          summary:
            "Kasadan çekilen para gider değildir. Faturasız harcama indirim değildir. Zarar, KDV’yi durdurmaz.",
          minutes: 5,
          sections: [
            {
              heading: "Beş cümle, beş düzeltme",
              paragraphs: [
                "Belgesiz gider yazılamaz. Vergiyi doğuran olayın belgesi, türüne göre fatura, serbest meslek makbuzu, gider pusulası veya gümrük beyannamesidir. Banka dekontu tek başına alış belgesi değildir.",
                "Kasadan veya ortak hesabından çekilen nakit, gider fişi olmadıkça gider sayılmaz. Çoğu zaman ortaklara borç veya kâr dağıtımı tartışması doğurur.",
                "Dönem zararı, ödenecek KDV’yi kendiliğinden sıfırlamaz. KDV, kâr üzerinden değil teslim ve hizmet üzerinden doğar. İndirilecek KDV ancak yasal belgedeki vergi ise düşülür.",
                "Şahıs işletmesi “küçük olduğu için risksize” yakın değildir. Ticari borçta sorumluluk şahsidir.",
                "Aynı kişiyi hem ücretli gösterip hem serbest meslek makbuzu kestirmek, iki statüyü birden doğurabilir. Gerçek çalışma ilişkisi hangisiyse kayıt ona göre kurulur.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "muhasebe-finans",
      title: "Muhasebe & Finans Rehberi",
      description:
        "Gider, yükümlülük ve takvim: kârın değil, nakitin ne zaman çıkacağını görmek için.",
      articles: [
        {
          slug: "isletme-giderleri",
          title: "İşletme Giderleri Rehberi",
          summary:
            "İndirilecek giderin üç şartı: işletmeyle ilgili olmak, belgelenmek ve kanunen kabul edilmemişler listesinde olmamak.",
          minutes: 6,
          sections: [
            {
              heading: "Yazılması için yetmez, indirilmesi için şart vardır",
              paragraphs: [
                "Muhasebede görünen her tutar matrahtan düşmez. Kanunen kabul edilmeyen giderler beyannamede kâra eklenir: özel iletişim cezaları, belgesiz ödemeler, işle ilgisi kurulamayan kişisel harcamalar ve sınırını aşan temsil ağırlama bunlara örnektir.",
                "Binek oto, kira ve amortismanda hakkın tamamı değil, kanundaki sınır kullanılır. Sınır her yıl yeniden değerleme oranıyla güncellenebilir; geçen yılın hesabını bu yıla kopyalamayın.",
              ],
            },
            {
              heading: "Nakit planı gider listesinden çıkar",
              paragraphs: [
                "Sabit giderleri (kira, personel, yazılım, iletişim) aylık, stok ve taşeronu iş hacmine bağlı tutun. Tahsilat gecikince KDV’yi yine de ilgili dönemde ödeyeceğinizi ayrıca yazın.",
              ],
              points: [
                "Her giderin belgesi dönem kapanmadan klasörde olsun.",
                "Kişisel market, akaryakıt ve yemek fişini iş gideri sanmayın.",
                "Amortisman ayırmadan “bu yıl hepsini gider yazalım” demeyin.",
              ],
            },
          ],
        },
        {
          slug: "vergi-yukumlulukleri",
          title: "Vergi Yükümlülükleri",
          summary:
            "Aylık, üç aylık ve yıllık: hangi beyanname hangi kazancı izler.",
          minutes: 5,
          sections: [
            {
              heading: "Döngü üç katmandır",
              paragraphs: [
                "Aylık katman, çoğu mükellefte 1 No’lu KDV ile Muhtasar ve Prim Hizmet Beyannamesidir. Tevkifat sorumluluğu varsa 2 No’lu KDV ayrı ve daha erken bir günde verilir. Konaklama, dijital hizmet veya özel iletişim gibi vergiler faaliyete bağlıdır, herkese açık değildir.",
                "Üç aylık katman geçici vergidir. Ticari kazançta takvim yılı kullananlar için dönemler Mart, Haziran, Eylül ve Aralık sonunda kapanır; beyan, dönemi izleyen ikinci ayın 17’sine kalır.",
                "Yıllık katman şahısta gelir, şirkette kurumlar vergisi beyannamesidir. Geçici vergide ödenen tutar, yıllık vergiden mahsup edilir. Mahsup, yıllık beyannameyi gereksiz kılmaz.",
              ],
            },
          ],
        },
        {
          slug: "aylik-vergi-takvimi",
          title: "Aylık Vergi Takvimi",
          summary:
            "Tekrar eden dört gün: 17, 25, 26 ve 28. Kasım 2026’da KDV günü pazartesiye kaydı.",
          minutes: 4,
          sections: [
            {
              heading: "Her ay aynı iskelet",
              paragraphs: [
                "Aşağıdaki günler, özel bir sirküler veya resmî tatil yoksa izleyen ayda aranacak yerlerdir. SGK priminin ödeme günü, muhtasar beyannamesinin günüyle her zaman aynı değildir; prim tahakkukunu ayrıca kontrol edin.",
                "Kasım 2026 pratiği: 17 Kasım Salı üçüncü dönem geçici vergi (Temmuz–Eylül), 26 Kasım Perşembe muhtasar ve prim hizmet ile sürekli damga, 30 Kasım Pazartesi ise hafta sonuna denk gelen 1 No’lu KDV’dir.",
              ],
            },
          ],
          calendar: [
            {
              day: "17",
              title: "Geçici vergi",
              detail:
                "Çeyreği izleyen ikinci ayın 17’si. 2026 üçüncü döneminin son günü 17 Kasım.",
            },
            {
              day: "25",
              title: "2 No’lu KDV",
              detail:
                "Tevkifat sorumlularının beyannamesi, izleyen ayın 25’i. Her mükellefe ait değildir.",
            },
            {
              day: "26",
              title: "Muhtasar ve prim",
              detail:
                "Muhtasar ve Prim Hizmet Beyannamesi ile sürekli damga vergisi, izleyen ayın 26’sı.",
            },
            {
              day: "28",
              title: "1 No’lu KDV",
              detail:
                "İzleyen ayın 28’i. Cumartesi veya pazara denk gelirse sonraki ilk iş günü. Kasım 2026’da 30 Kasım.",
            },
          ],
        },
        {
          slug: "sik-sorulan-sorular",
          title: "Sık Sorulan Sorular",
          summary:
            "Kuruluş, fatura, çalışan ve zarar eden ay hakkında en çok gelen dört soru.",
          minutes: 4,
          sections: [
            {
              heading: "Kısa cevap, ardından kontrol",
              paragraphs: [
                "Aşağıdaki cevaplar tipik bir ticari faaliyeti anlatır. Serbest meslek, dernek işletmesi veya hasılat esaslı basit usul aynı cümleyle kapanmaz.",
              ],
            },
          ],
          faq: [
            {
              question: "Hiç satışım yokken beyanname verir miyim?",
              answer:
                "Mükellefiyet sürdüğü sürece dönem beyannamesi çoğunlukla boş da olsa verilir. Satış olmaması, KDV veya muhtasar yükümlülüğünü kendiliğinden kapatmaz. Faaliyeti bırakacaksanız terk bildirimi ayrıca yapılır.",
            },
            {
              question: "Faturayı sonraki aya bırakabilir miyim?",
              answer:
                "Fatura, malın teslimi veya hizmetin yapılmasıyla doğan sürede düzenlenir. Tahsilatı bekleyerek belgeyi ötelemek, hem KDV dönemini hem gelir kaydını kaydırır.",
            },
            {
              question: "Eşim işletmede yardım ediyorsa sigortasız olur mu?",
              answer:
                "Ücret karşılığı ve bağımlı çalışıyorsa bildirge gerekir. Karşılıksız kısa süreli aile yardımı ile ücretli çalışma aynı şey değildir; sınır, fiilî ilişkiye göre çizilir.",
            },
            {
              question: "Zarardayım, geçici vergi çıkar mı?",
              answer:
                "Geçici vergi matrahı o dönemin ticari kârına bağlıdır. Zarar çıkması vergiyi sıfırlayabilir; ancak KDV, stopaj ve prim bu hesaba dahil değildir. Onlar ayrı ödenir.",
            },
          ],
        },
      ],
    },
  ],
} as const satisfies {
  brand: string;
  slogan: string;
  disclaimer: string;
  updated: string;
  categories: Category[];
};

export type KnowledgeBase = typeof knowledgeBase;

export function allArticles(): { category: Category; article: Article }[] {
  return knowledgeBase.categories.flatMap((category) =>
    category.articles.map((article) => ({ category, article })),
  );
}

export function findArticle(slug: string) {
  return allArticles().find((item) => item.article.slug === slug);
}
