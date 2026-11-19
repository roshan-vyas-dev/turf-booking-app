const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");


const {createTurf,getAllTurfs,getTurfById,updateTurf,deleteTurf} = require("../controllers/turfController");

router.post("/",authMiddleware,adminMiddleware,upload.array("images", 5),createTurf);
router.get("/",getAllTurfs);
router.get("/:id",getTurfById);
router.patch("/:id",authMiddleware,adminMiddleware,upload.array("images", 5),updateTurf);
router.delete("/:id",authMiddleware,adminMiddleware,deleteTurf);

module.exports = router;
