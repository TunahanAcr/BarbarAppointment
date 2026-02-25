const Joi = require("joi");

//Register Kuralları
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "İsim alanı metin olmalıdır",
    "string.empty": "İsim alanı boş bırakılamaz",
    "string.min": "İsim en az 3 karakter olmalıdır",
    "string.max": "İsim en fazla 50 karakter olabilir",
    "any.required": "İsim alanı zorunludur",
  }), //alphanum boşluğa, tireye, noktaya izin vermez. İsim soyisim alanlarında alphanum kullanmak genelde hatadır.
  email: Joi.string().email().required().messages({
    "string.email": "Lütfen geçerli bir e-posta adresi girin",
    "string.empty": "E-posta alanı boş bırakılamaz",
    "any.required": "E-posta alanı zorunludur",
  }),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,30}$"))
    .required()
    .messages({
      "string.min": "Şifreniz en az 6 karakter olmalıdır.",
      "string.pattern.base": "Şifreniz en az 1 harf ve 1 rakam içermelidir",
      "string.empty": "Şifre alanı boş bırakılamaz",
      "any.required": "Şifre alanı zorunludur",
    }),
});

//Login Kuralları
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Lütfen geçerli bir e-posta adresi girin",
    "string.empty": "E-posta alanı boş bırakılamaz",
    "any.required": "E-posta alanı zorunludur",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Şifre alanı boş bırakılamaz",
    "any.required": "Şifre alanı zorunludur",
  }),
});

//Randevu Oluşturma Kuralları
const appointmentSchema = Joi.object({
  barberId: Joi.string().required(),
  barberName: Joi.string().min(3).max(50).required().messages({
    "stirng.empty": "Berber adı boş bırakılamaz",
    "any.required": "Berber adı zorunludur",
  }),
  date: Joi.string().required(),
  time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.empty": "Saat alanı boş bırakılamaz",
      "string.pattern.base": "Lütfen geçerli bir saat girin (Örnek: 14:30)",
      "any.required": "Saat alanı zorunludur",
    }),

  //Hizmetler bir array olmalı ve en az 1 tane seçilmeli
  services: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string(),
        name: Joi.string().required(),
        duration: Joi.string(),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Lütfen en az bir hizmet seçin",
      "any.required": "Hizmetler alanı zorunludur",
    }),
  fullDate: Joi.string().required(),
});
const updateSchema = Joi.object({
  name: Joi.string().min(3).max(50).messages({
    "string.base": "İsim alanı metin olmalıdır",
    "string.empty": "İsim alanı boş bırakılamaz",
    "string.min": "İsim en az 3 karakter olmalıdır",
    "string.max": "İsim en fazla 50 karakter olabilir",
  }),
  email: Joi.string().email().messages({
    "string.email": "Lütfen geçerli bir e-posta adresi girin",
    "string.empty": "Lütfen geçerli bir e-posta adresi girin",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  appointmentSchema,
  updateSchema,
};
