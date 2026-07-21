// constants/colors.js
// BerberApp ortak renk paleti — tüm ekranlarda buradan import edilip kullanılmalı.
// Yeni bir renk gerektiğinde burada tanımla, ekranlarda asla hex/rgba yazma.

export const Colors = {
  // Zemin
  background: "#141210", // ana arkaplan — sıcak, neredeyse siyah
  surface: "#1E1B18", // kart / panel zemini
  surfaceElevated: "#262220", // vurgulu / yükseltilmiş yüzeyler (ör. seçili kart üstü)
  border: "#332E29", // ince ayraç çizgileri

  // Marka & durum renkleri
  primary: "#C9A24B", // altın — berber jileti tonu, ana marka rengi
  primaryMuted: "rgba(201, 162, 75, 0.14)", // primary'nin soft/arkaplan versiyonu
  accent: "#D98C3D", // amber — "bekliyor" gibi dikkat çeken durumlar
  accentMuted: "rgba(217, 140, 61, 0.14)",
  error: "#C0453A", // bastırılmış kırmızı — iptal / hata
  errorMuted: "rgba(192, 69, 58, 0.14)",
  success: "#5B8C5A", // ileride onay/başarı mesajları için

  // Tipografi
  text: "#F2EDE4", // ana metin — sıcak kırık beyaz
  textMuted: "#9C948A", // ikincil metin
  textFaint: "#6B645C", // en düşük vurgulu metin (placeholder vb.)
  white: "#FFFFFF",

  // Gölge
  shadow: "#000000",
};