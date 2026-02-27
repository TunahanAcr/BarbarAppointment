const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Race condition önlemek için
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  favorites: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Barber",
  },
});

module.exports = mongoose.model("User", UserSchema);
