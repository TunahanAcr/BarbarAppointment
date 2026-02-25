const mongoose = require("mongoose");

//Berberin kimlik kartı
const BarberSchema = new mongoose.Schema({
  name: { type: String, required: true }, //İsim zorunlu
  location: String,
  rating: Number,
  image: String, // Url veya dosya yolu
});

module.exports = mongoose.model("Barber", BarberSchema);
