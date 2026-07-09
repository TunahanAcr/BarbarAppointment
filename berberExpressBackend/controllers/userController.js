const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { updateSchema } = require("../validation");

const FAKE_HASH =
  "$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa";

//Kullanıcı Bilgilerini Güncelle
exports.updateUserInfo = async (req, res) => {
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
      { new: true }, //Güncelennmiş halini bana geri döndür
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
};

//Favorilere Berber Ekleme Çıkarma
exports.toggleFavorite = async (req, res) => {
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
        (favId) => favId.toString() !== barberId,
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
};

exports.getUserFavorites = async (req, res) => {
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
};
