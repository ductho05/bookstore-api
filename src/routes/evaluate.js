const express = require("express")
const router = express.Router()
const authentication = require("../middleware/Authentication")

const evaluateController = require("../controllers/EvaluateController");

router.post("/product", evaluateController.getEvaluateByProductId);
router.post("/", authentication, evaluateController.getEvaluateByUser);
router.post("/insert", authentication, evaluateController.insertEvaluate);
router.post("/count", evaluateController.getCountEvaluateByProductId);
router.post("/like", authentication, evaluateController.likeComment);
router.get("/get", evaluateController.getAllComment);
router.post("/delete", authentication, evaluateController.removeEvaluate);

module.exports = router;
