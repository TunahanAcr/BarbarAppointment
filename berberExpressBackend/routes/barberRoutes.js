// Gelen istekler ilk buraya düşer ve buradan ilgili controller fonksiyonlarına yönlendirilir.

const express = require("express");
const router = express.Router();
const barberController = require("../controllers/barberController");

router.get("/", barberController.getAllBarbers);
router.get("/:barberId", barberController.getBarberById);

module.exports = router;
