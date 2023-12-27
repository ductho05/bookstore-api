const express = require("express")
const router = express.Router()
const categoryController = require("../controllers/CategoryControllers")
const authorization = require("../middleware/Authorization")

router.get("/", categoryController.getAllCategory)
router.get("/:id", categoryController.getCategoryById)
router.post("/", authorization, categoryController.addCategory)
router.put("/:id", authorization, categoryController.updateCategory)
router.put("/update/many", authorization, categoryController.updateManyCategory)

module.exports = router;
