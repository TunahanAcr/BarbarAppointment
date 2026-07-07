const Barber = require("../models/Barber");
const Service = require("../models/Service");

// Bütün berberleri getir anasayfa için
exports.getAllBarbers = async (req, res) => {
  try {
    const barbers = await Barber.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "barberId",
          as: "services",
        },
      },
    ]);
    res.json(barbers);
  } catch (err) {
    res.status(500).json({ message: "Sunucu Hatası" });
  }
};

// Berber detay sayfası
exports.getBarberById = async (req, res) => {
  try {
    const { barberId } = req.params;
    const services = await Service.find({ barberId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Geçersiz ID" });
  }
};
