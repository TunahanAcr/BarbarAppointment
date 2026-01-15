const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); //.env dosyasını okumak için
const Barber = require("./models/Barber");
const Service = require("./models/Service");
const Appointment = require("./models/Appointment");
//Auth İşlemleri
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
//Validation
const {
  registerSchema,
  loginSchema,
  appointmentSchema,
  updateSchema,
} = require("./validation");
const app = express();

const FAKE_HASH =
  "$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa";

//Middleware
app.use(cors()); //Şimdilik her isteğe izin ver
app.use(express.json()); //Gelen string verileri json olarak oku

//MONGODB BAĞLANTISI
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Veritabanına bağlandı"))
  .catch((err) => console.log("Bağlantı HATASI", err));

app.get("/", (req, res) => {
  res.send("Berber API çalışıyor");
});

//Berberleri listele
app.get("/api/barbers", async (req, res) => {
  try {
    const barbers = await Barber.aggregate([
      {
        $lookup: {
          from: "services", // Hangi koleksiyona bakayım
          localField: "_id", //Benim elimde olan ortak key
          foreignField: "barberId", // Onun elindeki ortak key
          as: "services", // Bulduklarımı hangi isimle kaydedeyim
        },
      },
    ]);
    res.json(barbers);
  } catch (err) {
    res.status(500).json({ message: "Sunucu Hatası" });
  }
});

//Berber detay sayfası
app.get("/api/barbers/:barberId", async (req, res) => {
  try {
    const { barberId } = req.params; //Linkteki id yi alıyoruz

    const services = await Service.find({ barberId: barberId });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Geçersiz ID" });
  }
});

//Randevu Oluşturma
app.post("/api/appointments", auth, async (req, res) => {
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
      0
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
});

//Kullancının randevularını getir
app.get("/api/appointments/my-appointments", auth, async (req, res) => {
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
});

//Belirli bir gündeki dolu saatleri getir
app.post("/api/appointments/availability", async (req, res) => {
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
});

//Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      console.log("Kayıt Hatası:", errorMessages);
      return res
        .status(400)
        .json({ message: "Veri Hatası", errors: errorMessages });
    }

    const { name, email, password } = req.body;

    //Eposta kayıtlı mı kontrolü
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı" });
    }

    //Hash işlemi
    const salt = await bcrypt.genSalt(10); //
    const hashedPassword = await bcrypt.hash(password, salt);

    //Kullanıcıyı Oluştur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Kullanıcı Başarıyla Oluşturuldu" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu Hatası" });
  }
});

//Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    //1- Kullanıcı Var mı
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Yanlış şifre veya email" });
    }
    //Kullacnı yoksa bile timing attack önlemek için şifre kontrolü yap
    let compareHash = FAKE_HASH;

    if (user) {
      compareHash = user.password;
    }

    const isMatch = await bcrypt.compare(password, compareHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Yanlış şifre veya email" });
    }
    //3- Başarılı Giriş Token Üret
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email }, //Biletin içine ne yazayım
      process.env.JWT_SECRET, //Gizli Mühür
      { expiresIn: "100d" } //Token 100 gün geçerli
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(5000).json({ message: "Server Error" });
  }
});

//Randevu İptali
app.put("/api/appointments/cancel/:id", auth, async (req, res) => {
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
      { new: true } //Güncelennmiş halini bana geri döndür
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Randevu Bulunamadı" });
    }

    res.json({ message: "Randevu iptal edildi", data: updatedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hata oluştu" });
  }
});

//Kullanıcı Bilgilerini Güncelle
app.put("/api/users/update", auth, async (req, res) => {
  try {
    //Güncelleme Kuralları
    const { error } = updateSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res
        .status(400)
        .json({ message: "Veri Hatası", errors: errorMessages });
    }

    const userId = req.user.id; //Token dan kullanıcı id sini al
    const { name, email } = req.body; //Güncellenecek veriler

    let updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (email) {
      updateData.email = email;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true } //Güncelennmiş halini bana geri döndür
    ).select("-password -__v"); //Şifre ve __v alanlarını döndürme

    res.json({ message: "Kullanıcı bilgileri güncellendi", user: updatedUser });
  } catch (error) {
    console.error("Update Hatası", error);

    //Eğer email benzersizliği ihlali ise özel mesaj gönder
    if (error.code === 11000) {
      return res.status(400).json({ message: "Bu email zaten kayıtlı" });
    }
    res.status(500).json({ message: "Güncelleme sırasında hata oluştu" });
  }
});

//Favorilere Berber Ekleme Çıkarma
app.post("/api/users/toggle-favorite", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { barberId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: " Kullanucı bulunamadu" });
    }

    //Favorilerde var mı kontrol et
    //User.favorites içinde barberId var mı diye bak toString ile ObjectId yi stringe çeviriyoruz

    const favoriteStrings = user.favorites.flatMap((favId) => favId.toString());

    if (favoriteStrings.includes(barberId)) {
      //Eğer favori ise kaldır
      user.favorites = user.favorites.filter(
        (favId) => favId.toString() !== barberId
      );
    } else {
      //Eğer favori değilse ekle
      user.favorites.push(barberId); //Mongoose string i otomatik ObjectId ye çevirir
    }

    await user.save();

    res.json({
      message: "Favori durumu güncellendi",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Favori Hatası", error);
    res.status(500).json({ message: "Favori işlemi sırasında hata oluştu" });
  }
});

app.get("/api/users/favorites", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Favori berberler getirilirken hata oluştu" });
  }
});
//Sunucuyu Başlat
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor `);
});
