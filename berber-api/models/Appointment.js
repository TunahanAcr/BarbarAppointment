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
});

//Aynı berber, aynı gün, aynı saatte sadece 1 randevu olabilir
AppointmentSchema.index(
  { barberId: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "cancelled" } } }, //İptal edilmiş randevuları dikkate alma
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
