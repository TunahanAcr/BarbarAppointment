const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barber",
    required: true,
  },
  barberName: String, //Hangi Berber
  date: String, //Hangi Gün
  time: String, //Saat Kaçta
  fullDate: String, //Tam Tarih Bilgisi
  services: Array, // Hangi Hizmetler
  totalPrice: Number, //Kaç Para
  userName: {
    //Randevuyu kim aldı
    type: String,
    default: "Ahmet Yılmaz",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    //Ne zaman aldı
    type: Date,
    default: Date.now,
  },
  status: { type: String, default: "pending" },
  isActive: { type: Boolean, default: true }, //Randevu aktif mi? (iptal edilirse false olur)
});

//Aynı berber, aynı gün, aynı saatte sadece 1 randevu olabilir
AppointmentSchema.index(
  { barberId: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }, //İptal edilmiş randevuları dikkate alma
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

// 1. Mongoose'un sessizce yuttuğu hataları konsola yazdırması için dinleyici (listener) ekliyoruz:
Appointment.on("index", function (error) {
  if (error) {
    console.log("🚨 Index Yaratma Hatası:", error.message);
  } else {
    console.log("✅ Indexler arka planda başarıyla oluşturuldu!");
  }
});

// 2. İşi şansa bırakmıyoruz! Mongoose'a "Ne yapıyorsan bırak ve bu indexleri DB'ye yaz" emri veriyoruz:
Appointment.syncIndexes()
  .then(() =>
    console.log(
      "🛠️ syncIndexes komutu çalıştı: İndeksler veritabanı ile eşitlendi.",
    ),
  )
  .catch((err) => console.log("🚨 syncIndexes Hatası:", err));

module.exports = Appointment;
