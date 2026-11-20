export const INSTAGRAM_PROFILE = "https://www.instagram.com/smmmukellefdostu/";
export const INSTAGRAM_HANDLE = "@smmmukellefdostu";

export type InstagramPost = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  postUrl: string;
  isReels?: boolean;
};

export const instagramPosts: InstagramPost[] = [
  {
    id: "sahis-limited-2026",
    title: "Şahıs mı, limited mi? Eşiği ciro değil, kârın çekilip çekilmediği belirler.",
    category: "2026 karşılaştırma",
    imageUrl: "",
    postUrl: INSTAGRAM_PROFILE,
  },
  {
    id: "pazaryeri-kar",
    title: "Pazaryeri satıcısında tahsilat kâr değildir. Komisyon ve reklam düşülür.",
    category: "E-ticaret",
    imageUrl: "",
    postUrl: INSTAGRAM_PROFILE,
  },
  {
    id: "nace-secimi",
    title: "NACE kodunu faaliyet cümlesinden seçin. Eski dört haneli kod güncel sayılmaz.",
    category: "Kuruluş",
    imageUrl: "",
    postUrl: INSTAGRAM_PROFILE,
    isReels: true,
  },
];
