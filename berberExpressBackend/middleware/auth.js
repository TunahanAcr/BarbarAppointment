// FONKSİYON: auth (req, res, next)
// 1. Header'dan "Authorization" kısmını al.
// 2. İçindeki "Bearer " yazısını temizle, saf token kalsın.
// 3. Token var mı diye bak? Yoksa 401 hatası ver.
// 4. Token varsa Verify et (Secret key ile).
// 5. Çözülen kimliği req.user içine at.
// 6. Kapıyı aç (next).
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  //Headerdan tokeni alcaz
  const authHeader = req.header("Authorization");

  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    console.log("❌ Token Yok!");
    return res.status(401).json({ message: "Yetkisiz Erişim! Token Yok." });
  }

  try {
    //Token geçerli mi? Onada bakalım
    //Signature kontrolü
    //Secret key ile imzalanmış mı?
    //Expiration kontrolü
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Token içindeki bilgileri request objesine manuel olarak koyuyoruz
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Token GEÇERSİZ! Hata:", err.message);
    res.status(401).json({ message: "Geçersiz Token" });
  }
}

module.exports = auth;
