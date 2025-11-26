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
    // 1. Önce eski verileri temizle (Tekrar çalıştırırsan duble olmasın)
    await Barber.deleteMany({});
    await Service.deleteMany({});
    console.log("🧹 Eski veriler temizlendi.");

    // 2. Yeni Berber Oluştur
    const makasSanat = await Barber.create({
      name: "Makas Sanat",
      location: "Aydın, Efeler",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1536520002442-39764a41e987?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Temsili resim
    });
    console.log("💈 Berber oluşturuldu:", makasSanat.name);

    // 3. Bu Berbere Hizmetler Ekle
    // makasSanat._id diyerek oluşturduğumuz berberin ID'sini alıyoruz!
    const services = [
      {
        barberId: makasSanat._id,
        name: "Saç Kesimi",
        price: 200,
        duration: "30 dk",
      },
      {
        barberId: makasSanat._id,
        name: "Sakal Tıraşı",
        price: 100,
        duration: "15 dk",
      },
      {
        barberId: makasSanat._id,
        name: "Yıkama & Fön",
        price: 50,
        duration: "10 dk",
      },
      {
        barberId: makasSanat._id,
        name: "Damat Tıraşı",
        price: 1000,
        duration: "2 saat",
      },
    ];

    await Service.insertMany(services);
    console.log("✂️  Hizmetler eklendi.");

    console.log("✅ Tohumlama Başarıyla Tamamlandı!");
    process.exit(); // İş bitince çık
  } catch (error) {
    console.error("Hata:", error);
    process.exit(1);
  }
};

seedData();
