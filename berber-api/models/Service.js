const mongoose = require("mongoose");
const Barber = require("./Barber");

//Hizmetin Özellikleri
const ServiceSchema = new mongoose.Schema({
  //İlişki kuruyoruz
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barber", //Hangi modele bağlı olduğunu yazdık
    required: true,
  },
  name: String,
  price: Number,
  duration: String,
});

module.exports = mongoose.model("Service", ServiceSchema);
