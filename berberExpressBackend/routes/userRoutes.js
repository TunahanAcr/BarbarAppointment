const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.put("/update", auth, userController.updateUserInfo);

router.post("/toggle-favorite", auth, userController.toggleFavorite);

router.get("/favorites", auth, userController.getUserFavorites);

module.exports = router;
