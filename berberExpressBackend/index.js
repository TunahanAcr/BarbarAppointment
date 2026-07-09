const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); //.env dosyasını okumak için
const app = express();

const barberRoutes = require("./routes/barberRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

//Middleware
app.use(cors()); //Şimdilik her isteğe izin ver
app.use(express.json()); //Gelen string verileri json olarak oku

//MONGODB BAĞLANTISI
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Veritabanına bağlandı"))
  .catch((err) => console.log("Bağlantı HATASI", err));

app.use("/api/barbers", barberRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

//Sunucuyu Başlat
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor `);
});
