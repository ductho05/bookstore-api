const System = require("../models/System");
const responeObject = require("../models/responeObject");
const Validator = require("../validator/Validator");
const SystemService = require("../services/SystemService");
const OrderService = require("../services/OrderService");
const Response = require("../response/Response");
const Status = require("../utils/Status");
// var resObj = new responeObject("", "", {});
class SystemControllers {

  // check system
  async checkSystem(req, res) {
    const response = await SystemService.checkSystem()
            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))  
  }

  // check nếu hết hạn thì đổi trạng thái
  async checkStatus(req, res) {

      const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
      const currentTimeInVietnam = moment().tz(vietnamTimeZone);
      const date =  currentTimeInVietnam.format('YYYY-MM-DD');
      const response = await SystemService.checkStatus(date)
            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,        
            ))
  
}


  // Thêm mới 1 đơn hàng
  async insertSystem(req, res) {
    // const { error, value } = Validator.systemValidator.validate(req.body)

    // if (error) {

    //     res.status(400).json(new Response(
    //         Status.ERROR,
    //         error.message
    //     ))
    // } else {

        const response = await SystemService.insertSystem(req.body)

        console.log("response", response)
        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,        
        ))
    }
//   }
}

module.exports = new SystemControllers();
