const Appointment = require("../models/Appointment");
const { appointmentSchema } = require("../validation");
const Service = require("../models/Service");

//Randevu Oluşturma
exports.createAppointment = async (req, res) => {
  try {
    //Frontend den sadece randevu detayları
    const { error } = appointmentSchema.validate(req.body, {
      abortEarly: false, //Tüm hataları döndür
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res
        .status(400)
        .json({ message: "Veri Hatası", errors: errorMessages });
    }

    const { barberId, barberName, date, time, services, fullDate } = req.body;

    //Aynı berber, aynı gün, aynı saatte randevu var mı kontrol et
    const existingAppointment = await Appointment.findOne({
      barberId: barberId,
      date: date,
      time: time,
      status: { $ne: "cancelled" }, //İptal edilmiş randevuları dikkate alma
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "Üzgünüz, seçtiğiniz saat dolu. Lütfen başka bir saat seçin.",
      });
    }

    //Toplam fiyatı db den hesapla
    const servicesFromDb = await Service.find({
      _id: { $in: services.map((s) => s._id) },
    });

    const totalPrice = servicesFromDb.reduce(
      (sum, service) => sum + service.price,
      0,
    );

    const yeniRandevu = new Appointment({
      barberId,
      userId: req.user.id, //Token
      userName: req.user.name,
      barberName,
      date,
      time,
      services,
      totalPrice,
      fullDate,
    }); // requestin body sinde appointmentData var onu Appointment schemamıza koyuyoruz

    //DB ye kaydet
    await yeniRandevu.save();

    res
      .status(201)
      .json({ message: "Randevu Başarıyla Oluşturuldu", data: yeniRandevu });
  } catch (err) {
    console.error("Kayıt Hatası", err);
    res.status(500).json({ message: "Bir hata oluştu" });
  }
};

//Kullancının randevularını getir
exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id; //Giriş yapanın token içindeki id si

    //Db de id ile eşleşenleri bul
    //.sort({createdAt: -1}) En yeni randevu en üstte olsun
    const randevular = await Appointment.find({ userId: userId })
      .sort({
        createdAt: -1,
      })
      .select("-__v"); //__v yi istemiyoruz

    res.json(randevular);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Hata Oluştu" });
  }
};

//Belirli bir gündeki dolu saatleri getir
exports.getAvailability = async (req, res) => {
  try {
    const { barberId, date } = req.body;

    // {"barberId": { "$ne": null },"date": { "$gt": "" }} tarzında bir sorgu gelirse bütün boş saatler döner ve çok fazla veri varsa sunucu çöker. Bunu engellemek için tip kontrolü yapıyoruz
    if (typeof barberId !== "string" || typeof date !== "string") {
      return res.status(400).json({ message: "Geçersiz Veri Formatı" });
    }

    //Bu berberin bu tarihteki tüm randevuları

    const randevular = await Appointment.find({
      barberId: barberId,
      date: date,
      status: { $ne: "cancelled" }, //$ne not equal anlamında
    }).select("time");

    const busyTimes = randevular.map((r) => r.time);
    res.json(busyTimes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sorgu Hatası" });
  }
};

//Randevu İptali
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params; //Linkteki ID yi al
    const userId = req.user.id; //Token dan kullanıcı id sini al

    //Sadece kendi randevusunu iptal edebilsin

    //findByIdAndUpdate(ID,{Yeni Verileri}, {new:true})
    const updatedAppointment = await Appointment.findOneAndUpdate(
      {
        _id: id,
        userId: userId,
      },
      {
        //Burada veriyi silmiyoruz sadece "status" diye bir alan uydurup güncelliyoruz
        status: "cancelled",
      },
      { new: true }, //Güncelennmiş halini bana geri döndür
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Randevu Bulunamadı" });
    }

    res.json({ message: "Randevu iptal edildi", data: updatedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hata oluştu" });
  }
};
