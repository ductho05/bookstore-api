const Favorite = require("../models/Favorite");
const responeObject = require("../models/responeObject");

const resObj = new responeObject("", "", {});

class FavoriteControllers {

  // Kiểm tra sản phẩm đã được thêm vào yêu thích hay chưa
  async checkFavorite(req, res) {
    // console.log(req.query.userid, req.query.productid);
    try {
      const data = await Favorite.findOne({
        userid: req.query.userid,
        productid: req.query.productid,
      });
      if (data) {
        resObj.status = "OK";
        resObj.message = "Found favorite successfully";
        resObj.data = data;
        return res.json(resObj);
      } else {
        resObj.status = "Failed";
        resObj.message = "Not found data";
        resObj.data = "";
        return res.json(resObj);
      }
    } catch (err) {
      resObj.status = "Failed";
      resObj.message = "Error when get data" + err;
      resObj.data = "";
      return res.json(resObj);
    }
  }

  async getAllFavorite(req, res) {
    var userid = req.query.userid;
    var productid = req.query.productid;

    try {
      const data = await Favorite.find(
        userid ? { userid: userid } : productid ? { productid: productid } : {},
      ).populate({
        path: 'productid',
        populate: {
            path: 'categoryId',
            model: 'Category' // Tên của mô hình Category
        }
    })
    .populate({
        path: 'userid',
    })
      
      
      .exec();
      if (data) {
        resObj.status = "OK";
        resObj.message = "Found comment successfully";
        resObj.data = data;
        return res.json(resObj);
      } else {
        resObj.status = "Failed";
        resObj.message = "Not found data";
        resObj.data = "";
        return res.json(resObj);
      }
    } catch (err) {
      resObj.status = "Failed";
      resObj.message = "Error when get data" + err;
      resObj.data = "";
      return res.json(resObj);
    }
  }

  // Thêm yêu thích
  async addFavorite(req, res) {
    try {
      const data = await Favorite.create(req.body);
      if (data) {
        resObj.status = "OK";
        resObj.message = "Add favorite successfully";
        resObj.data = data;
        return res.json(resObj);
      } else {
        resObj.status = "Failed";
        resObj.message = "Add favorite failed";
        resObj.data = {};
        return res.json(resObj);
      }
    } catch (err) {
      resObj.status = "Failed";
      resObj.message = "Error when add favorite" + err;
      resObj.data = "";
      res.json(resObj);
    }
  }

  // Xóa yêu thích dựa vào userId và productId
  async deleteFavorite(req, res) {
    try {
      const data = await Favorite.findOneAndDelete({
        userid: req.body.userid,
        productid: req.body.productid,
      });
      if (data) {
        resObj.status = "OK";
        resObj.message = "Delete favorite successfully";
        resObj.data = data;
        res.json(resObj);
      } else {
        resObj.status = "Failed";
        resObj.message = "Not found data";
        resObj.data = "";
        res.json(resObj);
      }
    } catch (err) {
      resObj.status = "Failed";
      resObj.message = "Error when delete favorite";
      resObj.data = "";
      res.json(resObj);
    }
  }
}



module.exports = new FavoriteControllers();