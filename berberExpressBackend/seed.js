const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Barber = require("./models/Barber");
const Service = require("./models/Service");

dotenv.config(); // .env dosyasını oku

// Veritabanına Bağlan
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🌱 Tohumlama Başladı..."))
  .catch((err) => console.log(err));

const seedData = async () => {
  try {
    // 1. Önce eski verileri temizle
    await Barber.deleteMany({});
    await Service.deleteMany({});
    console.log("🧹 Eski veriler temizlendi.");

    // --- BERBER 1: MAKAS SANAT (Aydın - Popüler) ---
    const makasSanat = await Barber.create({
      name: "Makas Sanat",
      location: "Aydın, Efeler",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000&auto=format&fit=crop",
    });

    await Service.insertMany([
      {
        barberId: makasSanat._id,
        name: "Saç Kesimi",
        price: 250,
        duration: "30 dk",
      },
      {
        barberId: makasSanat._id,
        name: "Sakal Tıraşı",
        price: 150,
        duration: "15 dk",
      },
      {
        barberId: makasSanat._id,
        name: "Damat Tıraşı",
        price: 1500,
        duration: "2 saat",
      },
      {
        barberId: makasSanat._id,
        name: "Saç Boyama",
        price: 800,
        duration: "1 saat",
      },
    ]);
    console.log("✅ Makas Sanat Eklendi");

    // --- BERBER 2: HIZIR BERBER (Aydın - Esnaf İşi) ---
    const hizirBerber = await Barber.create({
      name: "Hızır Berber Salonu",
      location: "Aydın, Mimar Sinan",
      rating: 4.2,
      image:
        "https://images.unsplash.com/photo-1503951914875-befbb71334d7?q=80&w=1000&auto=format&fit=crop",
    });

    await Service.insertMany([
      {
        barberId: hizirBerber._id,
        name: "Saç Kesimi",
        price: 150,
        duration: "25 dk",
      },
      {
        barberId: hizirBerber._id,
        name: "Sakal Tıraşı",
        price: 80,
        duration: "10 dk",
      },
      {
        barberId: hizirBerber._id,
        name: "Ense Tıraşı",
        price: 50,
        duration: "5 dk",
      },
    ]);
    console.log("✅ Hızır Berber Eklendi");

    // --- BERBER 3: SALON ELITE (İzmir - Lüks) ---
    const salonElite = await Barber.create({
      name: "Salon Elite VIP",
      location: "İzmir, Alsancak",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1000&auto=format&fit=crop",
    });

    await Service.insertMany([
      {
        barberId: salonElite._id,
        name: "VIP Saç Tasarım",
        price: 500,
        duration: "45 dk",
      },
      {
        barberId: salonElite._id,
        name: "Cilt Bakımı & Maske",
        price: 400,
        duration: "30 dk",
      },
      {
        barberId: salonElite._id,
        name: "Keratin Bakım",
        price: 1200,
        duration: "1 saat",
      },
    ]);
    console.log("✅ Salon Elite Eklendi");

    // --- BERBER 4: KARDEŞLER KUAFÖR (Aydın - Mahalle) ---
    const kardesler = await Barber.create({
      name: "Kardeşler Erkek Kuaförü",
      location: "Aydın, Girne Mah.",
      rating: 4.0,
      image:
        "https://images.unsplash.com/photo-1599351431202-6e0c051dd415?q=80&w=1000&auto=format&fit=crop",
    });

    await Service.insertMany([
      {
        barberId: kardesler._id,
        name: "Saç & Sakal",
        price: 200,
        duration: "40 dk",
      },
      {
        barberId: kardesler._id,
        name: "Çocuk Tıraşı",
        price: 100,
        duration: "20 dk",
      },
    ]);
    console.log("✅ Kardeşler Kuaför Eklendi");

    // --- BERBER 5: BARBER CLUB (İstanbul - Modern) ---
    const barberClub = await Barber.create({
      name: "The Barber Club",
      location: "İstanbul, Kadıköy",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1000&auto=format&fit=crop",
    });

    await Service.insertMany([
      {
        barberId: barberClub._id,
        name: "Modern Kesim",
        price: 400,
        duration: "45 dk",
      },
      {
        barberId: barberClub._id,
        name: "Amerikan Tıraşı",
        price: 350,
        duration: "30 dk",
      },
      {
        barberId: barberClub._id,
        name: "Saç Düzleştirme",
        price: 600,
        duration: "45 dk",
      },
    ]);
    console.log("✅ Barber Club Eklendi");

    // --- BERBER 6: EFSANE SAÇ TASARIM (Ankara) ---
    const efsane = await Barber.create({
      name: "Efsane Saç Tasarım",
      location: "Ankara, Çankaya",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1593702295094-aea8c5c13d7b?q=80&w=1000&auto=format&fit=crop",
    });

    await Service.insertMany([
      {
        barberId: efsane._id,
        name: "Saç Kesimi",
        price: 250,
        duration: "30 dk",
      },
      {
        barberId: efsane._id,
        name: "Sakal Şekillendirme",
        price: 150,
        duration: "20 dk",
      },
    ]);
    console.log("✅ Efsane Saç Tasarım Eklendi");

    console.log("🏁 TÜM TOHUMLAMA BAŞARIYLA BİTTİ!");
    process.exit();
  } catch (error) {
    console.error("Hata:", error);
    process.exit(1);
  }
};

seedData();
