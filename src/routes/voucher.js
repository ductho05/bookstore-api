const express = require("express")
const router = express.Router()
// user
const authentication = require("../middleware/Authentication")
// admin
const authorization = require("../middleware/Authorization")
const voucherController = require("../controllers/VoucherControllers");

router.get("/", authentication, voucherController.getAllVoucher);
router.post("/add", authorization, voucherController.insertVoucher);
router.post("/user/add", voucherController.insertVoucher);
router.post("/update/:id", voucherController.updateVoucher);
router.post("/get/name", authorization, voucherController.getVoucherByName);

module.exports = router;
