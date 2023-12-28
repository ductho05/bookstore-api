const express = require("express")
const router = express.Router()
const FlashUserControllers = require("../controllers/FlashUserControllers")
const authorization = require("../middleware/Authorization")

router.get("/", FlashUserControllers.getFlash)
router.post("/add", FlashUserControllers.addFlash)
router.post("/delete/:id", FlashUserControllers.deleteFlashUser)
// router.get("/check", FlashUserControllers.checkFavorite)

module.exports = router
