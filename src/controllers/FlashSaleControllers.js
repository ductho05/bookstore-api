const { Int, Float } = require("mssql");
const FlashSale = require("../models/FlashSale");
const Product = require("../models/Product")
const responeObject = require("../models/responeObject");

const resObj = new responeObject("", "", {});

class FlashSaleControllers {
  // Lấy tất cả dữ liệu sách + phân trang + sắp theo giá
  async getProduct(req, res) {

    // Tên danh mục
    var categoryId = req.query.categoryId;

    // Lấy num sản phẩm thôi
    var num = req.query.num;
    // Số trang
    var page = parseInt(req.query.page);
    // Số sản phẩm trên 1 trang
    var perPage = parseInt(req.query.perPage);
    // Tính số sản phẩm bỏ qua
    var start = (page - 1) * perPage;
    // Tính số sản phẩm lấy ra
    var end = perPage ? perPage : num

    // Sắp xếp
    var sort = req.query.sort;

    // Sắp xếp theo trường nào đó
    var filter = req.query.filter;



    try {

      const flashSales = await FlashSale.find( {})
      .populate({
        path: 'product',
        populate: {
          path: 'categoryId',
          model: 'Category' // Tên của mô hình Category
        }
      })
      .skip(start)
      .limit(end)
      .exec();
      
    // Lặp qua danh sách flashSales để lấy thông tin category từ biến product.category
    const flashSalesWithCategory = flashSales.filter((flashSale) => {
      return categoryId ? flashSale.product.categoryId._id == categoryId : true
    });  

      if (sort) {
        if (filter == "num_sale") {
          flashSalesWithCategory.sort(function (a, b) {
            if (sort == "asc") {
              return a.num_sale - b.num_sale;
            }
            if (sort == "desc") {
              return b.num_sale - a.num_sale;
            }
          });
        }
        if (filter == "sold_sale") {
          flashSalesWithCategory.sort(function (a, b) {
            if (sort == "asc") {
              return a.sold_sale - b.sold_sale;
            }
            if (sort == "desc") {
              return b.sold_sale - a.sold_sale;
            }
          });
        }
        if (filter == "current_sale") {
          flashSalesWithCategory.sort(function (a, b) {
            if (sort == "asc") {
              return a.current_sale - b.current_sale;
            }
            if (sort == "desc") {
              return b.current_sale - a.current_sale;
            }
          });
        }
        if (filter == "date_sale") {
          flashSalesWithCategory.sort(function (a, b) {
            let dateA = new Date(a.date_sale);
            let dateB = new Date(b.date_sale);
            if (sort == "asc") {
              return dateA - dateB;
            }
            if (sort == "desc") {
              return dateB - dateA;
            }
          });
        }
        if (filter == "point_sale") {
          flashSalesWithCategory.sort(function (a, b) {
            if (sort == "asc") {
              return a.point_sale - b.point_sale;
            }
            if (sort == "desc") {
              return b.point_sale - a.point_sale;
            }
          });
        }
        if (filter == "time_sale") {
          flashSalesWithCategory.sort(function (a, b) {
            if (sort == "asc") {
              return a.time_sale - b.time_sale;
            }
            if (sort == "desc") {
              return b.time_sale - a.time_sale;
            }
          });
        }
        // if (filter == "status") {
        //   flashSalesWithCategory.sort(function (a, b) {
        //     if (sort == "asc") {
        //       return a.status - b.status;
        //     }
        //     if (sort == "desc") {
        //       return b.status - a.status;
        //     }
        //   });
        // }
        // if (filter == "discount") {
        //   flashSalesWithCategory.sort(function (a, b) {
        //     let discountA = a.old_price / a.price;
        //     let discountB = b.old_price / b.price;
        //     if (sort == "asc") {
        //       return discountA - discountB;
        //     }
        //     if (sort == "desc") {
        //       return discountB - discountA;
        //     }
        //   });
        // }
      }

      // Lấy num sản phẩm thôi
      // if (num > 0) {
      //   flashSalesWithCategory.splice(num);
      // }

      if (flashSalesWithCategory) {
        resObj.status = "OK";
        resObj.message = "Found product successfully";
        resObj.data = flashSalesWithCategory;
        res.json(resObj);
      } else {
        resObj.status = "Failed";
        resObj.message = "Not found data";
        resObj.data = "";
        res.json(resObj);
      }
    } catch (err) {
      resObj.status = "Failed";
      resObj.message = "Error when get data" + err;
      resObj.data = "";
      res.json(resObj);
    }
  }
 
  // Thêm dữ liệu sách
  async addProduct(req, res) {
    try {
      const data = await FlashSale.create(req.body);
      if (data) {
        resObj.status = "OK";
        resObj.message = "Add product successfully";
        resObj.data = data;
        return res.json(resObj);
      } else {
        resObj.status = "Failed";
        resObj.message = "Add product failed";
        resObj.data = {};
        return res.json(resObj);
      }
    } catch (err) {
      resObj.status = "Failed";
      resObj.message = `Error add data. Error: ${err}`;
      resObj.data = {};
      return res.json(resObj);
    }
  }

  // Sửa dữ liệu sách theo id
  async updateProduct(req, res) {
    try {
      const data = await Product.updateMany(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            author: req.body.author,
            published_date: req.body.published_date,
            price: req.body.price,
            isbn: req.body.isbn,
            publisher: req.body.publisher,
            pages: req.body.pages,
          },
        }
      );
      if (data) {
        resObj.status = "OK";
        resObj.message = "Update product successfully";
        resObj.data = data;
        return res.json(resObj);
      } else {
        resObj.status = "Failed";
        resObj.message = "Update product failed";
        resObj.data = {};
        return res.json(resObj);
      }
    } catch (err) {
      resObj.status = "Failed";
      resObj.message = `Error update data. Error: ${err}`;
      resObj.data = {};
      return res.json(resObj);
    }
  }

  // Xóa dữ liệu sách theo id
  async deleteProduct(req, res) {
    try {
      const data = await Product.deleteOne({ _id: req.params.id });
      if (data) {
        resObj.status = "OK";
        resObj.message = "Delete product successfully";
        resObj.data = data;
        return res.json(resObj);
      } else {
        resObj.status = "Failed";
        resObj.message = "Delete product failed";
        resObj.data = {};
        return res.json(resObj);
      }
    } catch (err) {
      resObj.status = "Failed";
      resObj.message = `Error delete data. Error: ${err}`;
      resObj.data = {};
      return res.json(resObj);
    }
  }
}

module.exports = new FlashSaleControllers();
