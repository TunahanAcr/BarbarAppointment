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
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
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

module.exports = { registerSchema, loginSchema };
