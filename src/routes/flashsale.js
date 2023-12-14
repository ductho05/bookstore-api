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

const isRun = true

if (isRun == true) {
    // lặp lại sale cho ngày hôm sau
    const rule = new schedule.RecurrenceRule()
    // local
    // rule.hour = 23
    // deloy
    rule.hour = 1
    rule.minute = 4
    rule.second = 0
    schedule.scheduleJob(rule, () => {
        //FlashSaleController.addLoopSale()
        console.log('loop sale')
    })

    // Tạo một quy tắc định kỳ cho mỗi 3 tiếng
    const rule1 = new schedule.RecurrenceRule();
    // local
    // rule1.hour = [0, 3, 6,  9,  12,  15,  18,  21]
    // deloy
    rule1.hour = [2, 5, 8, 11, 14, 17, 20, 23]
    rule1.minute = 0; // Các phút bạn muốn kiểm tra
    rule1.second = 0

    // Lên lịch kiểm tra giá với quy tắc định kỳ
    schedule.scheduleJob(rule1, () => {
        FlashSaleController.checkAndUpdatePrice();
    });
}

module.exports = router