const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); //.env dosyasını okumak için

const app = express();

//Middleware
app.use(cors()); //Şimdilik her isteğe izin ver
app.use(express.json()); //Gelen verileri json olarak oku

//MONGODB BAĞLANTISI
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Veritabanına bağlandı"))
  .catch((err) => console.log("Bağlantı HATASI", err));

app.get("/", (req, res) => {
  res.send("Berber API çalışıyor");
});

//Sunucuyu Başlat
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor `);
});
