const VoucherService = require("../services/VoucherService")
const Response = require("../response/Response")
// const Validator = require("../validator/Validator")
const Status = require("../utils/Status")
// const VoucherService = require("../services/VoucherService")

class VoucherController {

    async getAllVoucher(req, res) {

        

        const response = await VoucherService.getAll(req)

        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    }

    async insertVoucher(req, res) {
       

            const response = await VoucherService.insert(req.body)

            res.status(response.statusCode).json(new Response(
                response.status,
                response.message,
                response.data
            ))
        
    }

    async updateVoucher(req, res) {       

        const id = req.params.id
        const data = req.body

        console.log("data", data, id)
        const response = await VoucherService.update(id, data)

        // console.log(response)
        res.status(response.statusCode).json(new Response(
            response.status,
            response.message,
            response.data
        ))
    
}
}


module.exports = new VoucherController