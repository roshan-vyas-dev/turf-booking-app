const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


const {createTurf,getAllTurfs} = require("../controllers/turfController");

router.post("/",authMiddleware,adminMiddleware,createTurf);
router.get("/",getAllTurfs);

module.exports = router;
