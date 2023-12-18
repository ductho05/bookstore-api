const express = require("express");
const router = express.Router();
const systemController = require("../controllers/SystemControllers");
const authorization = require("../middleware/Authorization")
router.get("/", authorization, systemController.checkSystem);
router.post("/insert", authorization, systemController.insertSystem);
const constants = require('../utils/api.js')
const schedule = require('node-schedule')

if (constants.deploy == true) {
    const rule = new schedule.RecurrenceRule()
   // local
    //rule.hour = 0
    // deloy
    rule.hour = 17
    rule.minute = 0
    rule.second = 0
    schedule.scheduleJob(rule, () => {
        systemController.checkStatus();
    })
}

module.exports = router;