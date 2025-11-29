const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); //.env dosyasını okumak için
const Barber = require("./models/Barber");
const Service = require("./models/Service");
const Appointment = require("./models/Appointment");
//Auth İşlemleri
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
//Regex
const { registerSchema, loginSchema } = require("./validation");
const app = express();

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
    const barbers = await Barber.find();
    res.json(barbers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Berber detay sayfası
app.get("/api/barbers/:barberId", async (req, res) => {
  try {
    const { barberId } = req.params; //Linkteki id yi alıyoruz

    const services = await Service.find({ barberId: barberId });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Randevu Oluşturma
app.post("/api/appointments", async (req, res) => {
  try {
    //Frontend den gelen req.body içindeki verileri al
    const yeniRandevu = new Appointment(req.body); // requestin body sinde appointmentData var onu Appointment schemamıza koyuyoruz

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
app.get("/api/appointments/:userName", async (req, res) => {
  try {
    const { userName } = req.params; //Linkteki ismi al

    //Db de ismi eşleşenleri bul
    //.sort({createdAt: -1}) En yeni randevu en üstte olsun
    const randevular = await Appointment.find({ userName: userName }).sort({
      createdAt: -1,
    });

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

    //Bu berberin bu tarihteki tüm randevuları

    const randevular = await Appointment.find({
      barberName: "Makas Sanat", //Burayı ilerde Id yapacaz
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
      return res.status(400).json({ message: error.details[0].message });
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
      return res.status(400).json({ message: "Kullanıcı Bulunamadı" });
    }
    //2- Kullanıcı Var mı
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Şifre Yanlış" });
    }
    //3- Başarılı Giriş Token Üret
    const token = jwt.sign(
      { id: user._id, name: user.name }, //Biletin içine ne yazayım
      process.env.JWT_SECRET, //Gizli Mühür
      { expiresIn: "1h" } //Token 1 saat geçerli
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
app.put("/api/appointments/cancel/:id", async (req, res) => {
  try {
    const { id } = req.params; //Linkteki ID yi al

    //findByIdAndUpdate(ID,{Yeni Verileri}, {new:true})
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        //Burada veriyi silmiyoruz sadece "status" diye bir alan uydurup güncelliyoruz
        //MongoDB şemamda status yok ama sorun olmaz
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
//Sunucuyu Başlat
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor `);
});
