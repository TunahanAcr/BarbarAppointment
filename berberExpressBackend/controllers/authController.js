const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerSchema, loginSchema } = require("../validation");

FAKE_HASH = "$2a$10$7QJ1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z"; //Fake hash for timing attack prevention

//Register
exports.register = async (req, res) => {
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
};

//Login
exports.login = async (req, res) => {
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
      { expiresIn: "100d" }, //Token 100 gün geçerli
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(5000).json({ message: "Server Error" });
  }
};
