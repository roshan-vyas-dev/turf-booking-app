const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


const {createTurf} = require("../controllers/turfController");

router.post("/",authMiddleware,adminMiddleware,createTurf);

module.exports = router;
