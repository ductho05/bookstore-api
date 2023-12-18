const express = require("express")
const router = express.Router()
const FlashSaleController = require("../controllers/FlashSaleControllers")
const authentication = require("../middleware/Authentication")
const authorization = require("../middleware/Authorization")
const schedule = require('node-schedule')

router.get("/", FlashSaleController.getProduct)
router.post("/add", authorization, FlashSaleController.addProduct)
router.post("/update/:id", authorization, FlashSaleController.updateFlashSale)
router.get("/delete/:id", authorization, FlashSaleController.deleteFlashSale)
router.get("/:id", FlashSaleController.getFlashById)

const isRun = false

if (isRun == true) {
    // lặp lại sale cho ngày hôm sau

    const rule = new schedule.RecurrenceRule()
    rule.hour = 23
    rule.minute = 59
    rule.second = 0
    schedule.scheduleJob(rule, () => {
        FlashSaleController.addLoopSale()
    })

    // Tạo một quy tắc định kỳ cho mỗi 3 tiếng
    const rule1 = new schedule.RecurrenceRule();
    rule1.hour = [0, 3, 6, 9, 12, 15, 18, 21]
    rule1.minute = 0; // Các phút bạn muốn kiểm tra
    rule1.second = 0

    // Lên lịch kiểm tra giá với quy tắc định kỳ
    schedule.scheduleJob(rule1, () => {
        FlashSaleController.checkAndUpdatePrice();
    });
}

module.exports = router