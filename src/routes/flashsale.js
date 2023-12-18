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
    rule.hour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,  13, 14, 15, 16, 17, 18, 19, 20, 21, 22,  23]

    rule.minute = [0, 1, 2, 3, 4, 5, 6, 7, 8,  9,  10,  11,  12,  13,  14,  15,
          16, 17, 18, 19, 20, 21, 22,  23,  24,  25,  26,  27,  28,  29, 30, 31,
           32 ,33, 34, 35, 36, 37, 38, 39, 40, 41, 42 ,43, 44, 45, 46, 47, 48, 
           49, 50, 51, 52 ,53, 54, 55, 56, 57, 58, 59]
    rule.second = 0
    schedule.scheduleJob(rule, () => {
        //FlashSaleController.addLoopSale()
        console.log('loop sale 3')
    })

    const rule3 = new schedule.RecurrenceRule()
    // local
    // rule.hour = 23
    // deloy
    rule3.hour = 0
    rule3.minute = 14
    rule3.second = 0
    schedule.scheduleJob(rule3, () => {
        //FlashSaleController.addLoopSale()
        console.log('loop sale 0')
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
