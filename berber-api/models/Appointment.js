const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  barberName: String, //Hangi Berber
  date: String, //Hangi Gün
  time: String, //Saat Kaçta
  services: Array, // Hangi Hizmetler
  totalPrice: Number, //Kaç Para4
  userName: {
    //Randevuyu kim aldı
    type: String,
    default: "Ahmet Yılmaz",
  },
  createdAt: {
    //Ne zaman aldı
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
