const orderRouter = require("./order")
const orderItemRouter = require("./orderItem")
const productRouter = require("./product")
const flashsaleRouter = require("./flashsale")
const userRouter = require("./user")
const shipperRouter = require("./shipper")
const categoryRouter = require("./category")
const uploadFileRouter = require("./uploadFiles")
const evaluateRouter = require("./evaluate")
const commentRouter = require("./comment")
const fieldRouter = require("./field")
const favoriteRouter = require('./favorite')
const webPushRouter = require('./webpush')
const flashuserRouter = require('./flashuser')
const systemRouter = require('./system')
const voucherRouter = require('./voucher')

function route(app) {
  app.use("/bookstore/api/v1/orders", orderRouter);
  app.use("/bookstore/api/v1/categories", categoryRouter);
  app.use("/bookstore/api/v1/orderitems", orderItemRouter);
  app.use("/bookstore/api/v1/products", productRouter);
  app.use("/bookstore/api/v1/flashsales", flashsaleRouter);
  app.use("/bookstore/api/v1/users", userRouter);
  app.use("/bookstore/api/v1/shippers", shipperRouter);
  app.use("/bookstore/api/v1/", uploadFileRouter);
  app.use("/bookstore/api/v1/evaluates", evaluateRouter);
  app.use("/bookstore/api/v1/comments", commentRouter);
  app.use("/bookstore/api/v1/favorites", favoriteRouter);
  app.use("/bookstore/api/v1/webpush", webPushRouter)
  app.use("/bookstore/api/v1/flashusers", flashuserRouter);
  app.use("/bookstore/api/v1/systems", systemRouter); 
  app.use("/bookstore/api/v1/vouchers", voucherRouter);
}

module.exports = route;
