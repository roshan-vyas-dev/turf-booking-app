const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


const {createTurf,getAllTurfs,getTurfById,updateTurf,deleteTurf} = require("../controllers/turfController");

router.post("/",authMiddleware,adminMiddleware,createTurf);
router.get("/",getAllTurfs);
router.get("/:id",getTurfById);
router.patch("/:id",authMiddleware,adminMiddleware,updateTurf);
router.delete("/:id",authMiddleware,adminMiddleware,deleteTurf);

module.exports = router;
