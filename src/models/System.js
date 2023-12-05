const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const System = new Schema ({
    // thong ke
    isRun: {type:Boolean},
    type: {type:String},
    kpi: {type:Number},
    start: {type: String},
    achieved: {type: Number},
    end: {type: String},
    isStatus: {type:Boolean, default: true},
    key: {type:String}
})

module.exports = mongoose.model('System', System)