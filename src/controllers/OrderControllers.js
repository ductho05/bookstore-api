const Response = require("../response/Response");
const OrderService = require("../services/OrderService");
const Status = require("../utils/Status");
const Validator = require("../validator/Validator");
const FlashSale = require("../models/FlashSale");
const moment = require("moment-timezone");
const { format } = require("date-fns-tz");
const Product = require("../models/Product");
class OrderController {
  async getAllOrderByUser(req, res) {
    const id = req.id;
    const limit = req.query.limit;

    const response = await OrderService.getByUser(id, limit);

    res
      .status(response.statusCode)
      .json(new Response(response.status, response.message, response.data));
  }

  // Lấy tổng số lượng đơn hàng theo cả 5 trạng thái
  async getTotalOrderByStatus(req, res) {
    const response = await OrderService.getTotalbyStatus();

    res
      .status(response.statusCode)
      .json(new Response(response.status, response.message, response.data));
  }

  // Lấy đơn hàng theo trạng thái đơn hàng
  async getAllOrderByStatus(req, res) {
    const page = req.query.page;
    const limit = req.query.limit;
    const status = req.query.status;
    const user = req.query.user;
    const shipper = req.query.shipper;
    const city = req.query.city;
    const id = req.id;

    const response = await OrderService.getAllByUser(
      page,
      limit,
      status,
      city,
      id,
      user,
      shipper
    );

    res
      .status(response.statusCode)
      .json(new Response(response.status, response.message, response.data));
  }

  // // Lấy đơn hàng theo trạng thái đơn hàng
  // async getAllOrderByShipper(req, res) {

  //     const page = req.query.page;
  //     const limit = req.query.limit;
  //     const status = req.query.status;
  //     const shipper = req.query.shipper
  //     const id = req.id

  //     const response = await OrderService.getAllByUser(page, limit, status, id, shipper)

  //     res.status(response.statusCode).json(new Response(
  //         response.status,
  //         response.message,
  //         response.data
  //     ))
  // }

  // Lấy đơn hàng theo phân trang
  async getAllOrderPaginaion(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const id = req.query.id;

    const response = await OrderService.getAllByUserPagination(page, limit, id);

    res
      .status(response.statusCode)
      .json(new Response(response.status, response.message, response.data));
  }

  // Lấy tất cả đơn hàng theo thời gian tạo đơn hàng
  async getAllOrderByTime(req, res) {
    const page = req.query.page;
    const limit = req.query.limit;
    const firstTime = req.query.ftime;
    const lastTime = req.query.ltime;

    const response = await OrderService.getAllByTime(
      page,
      limit,
      firstTime,
      lastTime
    );

    res
      .status(response.statusCode)
      .json(new Response(response.status, response.message, response.data));
  }

  // Tìm kiếm đơn hàng theo tên
  async getAllOrderByName(req, res) {
    const name = req.query.name;
    const page = req.query.page;
    const limit = req.query.limit;

    const response = await OrderService.getAllByName(page, limit, name);

    res
      .status(response.statusCode)
      .json(new Response(response.status, response.message, response.data));
  }

  // Lấy tất cả các đơn hàng
  async getAllOrders(req, res) {
    var page = req.query.page;
    var limit = req.query.limit;
    var status = req.query.status;
    var name = req.query.name;
    var firstTime = req.query.ftime;
    var lastTime = req.query.ltime;
    var sort = req.query.sort;
    var id = req.query.id;

    const response = await OrderService.getAll(
      page,
      limit,
      name,
      status,
      sort,
      id
    );

    res
      .status(response.statusCode)
      .json(new Response(response.status, response.message, response.data));
  }

  // Lấy 1 đơn hàng theo id
  async getOrderById(req, res) {
    const { error, value } = Validator.idValidator.validate(req.params.id);

    if (error) {
      res.status(400).json(new Response(Status.ERROR, error.message));
    } else {
      const response = await OrderService.getById(value);

      res
        .status(response.statusCode)
        .json(new Response(response.status, response.message, response.data));
    }
  }

  // Thêm mới 1 đơn hàng
  async insertOrder(req, res) {
    // console.log('adgjasd', req.body)

    const { flashsales, items, ...data } = req.body;
    // Đặt múi giờ cho Việt Nam
    const vietnamTimeZone = "Asia/Ho_Chi_Minh";

    // Lấy thời gian hiện tại ở Việt Nam
    const currentTimeInVietnam = moment().tz(vietnamTimeZone);

    // Lấy số giờ hiện tại
    const currentHourInVietnam = currentTimeInVietnam.get("hours");
    //const flash = await FlashUser.create(req.body);
    const currentDate = new Date();
    let toDay = format(currentDate, "yyyy-MM-dd", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    let current_point_sale = Math.floor(currentHourInVietnam / 3);

    const { error, value } = Validator.orderValidator.validate(data);
    // console.log('flashsales1', flashsales, data, items)
    if (error) {
      res.status(400).json(new Response(Status.ERROR, error.message));
    } else {
      //console.log('flashsales132', items)
      // Kiểm tra product còn trong kho hay không
      // Check trường hợp có cả product và flashsale
      const listID = [];
      items.forEach((item) => {
        if (!listID.includes(item.product._id)) {
          listID.push(item.product._id);
        } else {
          // tìm vị trí của item trong list
          const index = listID.indexOf(item.product._id);
          // cộng dồn số lượng
          items[index].quantity += item.quantity;
        }
      });

      const ProductPromises = items.map(async (item) => {
        const produc = await Product.find({ _id: item.product._id });
        if (item.quantity > produc[0].quantity) {
          //console.log("da vao roi nha")
          return "No" + produc[0]._id;
        } else {
          return "OK";
        }
      });

      // Kiểm tra có đơn hàng có vượt quá chương trình FL
      const flashSalePromises = flashsales.map(async (item) => {
        const flashSale = await FlashSale.find({ _id: item.flashid });
        if (flashSale.length > 0) {
          if (flashSale[0].sold_sale + item.mount > flashSale[0].num_sale) {
            return "Not quantity" + flashSale[0]._id;
          } else {
            return "OK";
          }
        }
        return "OK";
      });

      const productResults = await Promise.all(ProductPromises);
      const flashSaleResults = await Promise.all(flashSalePromises);
      // // 'Not quantity'

      //console.log('flashSaleResults', productResults);

      if (
        flashSaleResults.filter((item) => item.includes("Not quantity"))
          .length > 0
      ) {
        // console.log('da vao day roi ne')
        const flashs = flashSaleResults
          .filter((item) => item.includes("Not quantity"))
          .map((item) => item.split("Not quantity")[1]);

        return res
          .status(200)
          .json(
            new Response(
              Status.ERROR_FLASH_SALE,
              "Số lượng sản phẩm trong flash sale không đủ",
              flashs
            )
          );
      }

      if (productResults.filter((item) => item.includes("No")).length > 0) {
        // console.log('da vao day roi ne')
        const flashs = productResults
          .filter((item) => item.includes("No"))
          .map((item) => item.split("No")[1]);
        // console.log('flashs', flashs)
        return res
          .status(200)
          .json(
            new Response(
              Status.ERROR401,
              "Số lượng sản phẩm trong kho không đủ",
              flashs
            )
          );
      }

      // console.log('value, da vao day12312', value)
      const response = await OrderService.insert(value);

      res
        .status(response.statusCode)
        .json(new Response(response.status, response.message, response.data));
    }
  }

  // Xóa một đơn hàng
  async removeOrder(req, res) {
    const { error, value } = Validator.idValidator.validate(req.params.id);

    if (error) {
      res.status(400).json(new Response(Status.ERROR, error.message));
    } else {
      const response = await OrderService.delete(value);

      res
        .status(response.statusCode)
        .json(new Response(response.status, response.message, response.data));
    }
  }

  // Cập nhật một đơn hàng
  async updateOrder(req, res) {
    const id = req.params.id;
    const { error, value } = Validator.orderUpdateValidator.validate(req.body);

    if (error) {
      res.status(400).json(new Response(Status.ERROR, error.message));
    } else {
      const response = await OrderService.update(id, value);

      res
        .status(response.statusCode)
        .json(new Response(response.status, response.message, response.data));
    }
  }

  async createPaymentUrl(req, res) {
    // console.log('response122 da den 1', req)
    const response = await OrderService.createPaymentUrl(req);

    // console.log('response122 da den', response)
    res
      .status(response.statusCode)
      .json(new Response(response.status, response.message, response.data));
    // return res.json(obj);
  }

  async vnpayReturn(req, res) {
    const response = await OrderService.vnpayReturn(req, res);

    // res.status(response.statusCode).json(new Response(
    //     response.status,
    //     response.message,
    // ))
  }
}

module.exports = new OrderController();
