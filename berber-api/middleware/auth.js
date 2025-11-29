const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  //Headerdan tokeni alcaz
  const authHeader = req.header("Authorization");
  console.log("------------------------------------------------");
  console.log("🛑 BACKEND AUTH KONTROLÜ");
  console.log("👉 Gelen Header:", authHeader);

  const token = authHeader?.replace("Bearer ", "");
  console.log("👉 Ayrıştırılan Token:", token);

  if (!token) {
    console.log("❌ Token Yok!");
    return res.status(401).json({ message: "Yetkisiz Erişim! Token Yok." });
  }

  try {
    //Token geçerli mi? Onada bakalım
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Token Geçerli. Kullanıcı:", decoded);

    //Token içindeki bilgileri requeste yapıştır
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Token GEÇERSİZ! Hata:", err.message);
    res.status(401).json({ message: "Geçersiz Token" });
  }
}

module.exports = auth;
