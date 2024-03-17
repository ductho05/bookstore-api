const mongoose = require("mongoose");
const Evaluate = require("../models/Evaluate");
const ServiceResponse = require("../response/ServiceResponse");
const Status = require("../utils/Status");
const Messages = require("../utils/Messages");
const EvaluateDTO = require("../dtos/EvaluateDTO");
const User = require("../models/User");
const Product = require("../models/Product");

class EvaluateService {
  async getAll() {
    try {
      // console.log("EvaluateService.getAll");

      const data = await Evaluate.find()
        .populate("product")
        .populate("user")
        .sort({ createdAt: -1 })
        .exec();

      //console.log("EvaluateService.getAll", data);
      const evaluateDToList = [];
      data.forEach((evaluate) => {
        const evaluateDTO = EvaluateDTO.mapEvaluateToEvaluateDTO(evaluate);
        //console.log("EvaluateService.getAll", evaluateDTO);
        evaluateDToList.push(evaluateDTO);
      });

      return new ServiceResponse(
        200,
        Status.SUCCESS,
        Messages.GET_DATA_SUCCESS,
        evaluateDToList
      );
    } catch (err) {
      //console.log(err);
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async like(uid, evaluateId) {
    try {
      const evaluate = await Evaluate.findOne({ _id: evaluateId }).exec();
      if (evaluate) {
        const likes = evaluate.likes;
        const foundLike = likes.find((l) => l.equals(uid));

        if (foundLike) {
          const newLikes = likes.filter((l) => !l.equals(uid));
          evaluate.likes = [...newLikes];
        } else {
          likes.push(uid);
          evaluate.likes = [...likes];
        }
        await evaluate.save();

        return new ServiceResponse(
          200,
          Status.SUCCESS,
          Messages.LIKE_OR_QUIT_LIKE_SUCCESS,
          evaluate
        );
      } else {
        return new ServiceResponse(400, Status.ERROR, Messages.NOT_FOUND_DATA);
      }
    } catch (err) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async countByProductId(id) {
    try {
      let evaluates = [];
      await Promise.all([
        Evaluate.count({
          product: id,
        }),
        Evaluate.count({
          product: id,
          rate: 1,
        }),
        Evaluate.count({
          product: id,
          rate: 2,
        }),
        Evaluate.count({
          product: id,
          rate: 3,
        }),
        Evaluate.count({
          product: id,
          rate: 4,
        }),
        Evaluate.count({
          product: id,
          rate: 5,
        }),
      ]).then((result) => {
        evaluates = {
          total: result.shift(),
          rate: [...result],
        };
      });

      return new ServiceResponse(
        200,
        Status.SUCCESS,
        Messages.GET_DATA_SUCCESS,
        evaluates
      );
    } catch (err) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async getByUser(email) {
    try {
      const user = await User.findOne({ email }).exec();

      const evaluateList = await Evaluate.find({ user: user._id })
        .populate("user")
        .populate({
          path: "product",
          populate: {
            path: "categoryId",
            model: "Category",
          },
        })
        .sort({ createdAt: -1 })
        .exec();

      const evaluateDTOList = [];

      evaluateList.forEach((evaluate) => {
        const evaluateDTO = EvaluateDTO.mapEvaluateToEvaluateDTO(evaluate);
        evaluateDTOList.push(evaluateDTO);
      });

      return new ServiceResponse(
        200,
        Status.SUCCESS,
        Messages.GET_DATA_SUCCESS,
        evaluateDTOList
      );
    } catch (err) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async getByProduct(id, sort, typeSort) {
    try {
      var evaluateList = [];

      if (sort) {
        if (sort === "desc") {
          typeSort = 1;
        }
        const findId = new mongoose.Types.ObjectId(id);
        evaluateList = await Evaluate.aggregate([
          {
            $match: { product: findId },
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "product",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $unwind: "$product",
          },
          {
            $unwind: "$user",
          },
          {
            $project: {
              rate: 1,
              comment: 1,
              product: 1,
              user: 1,
              likes: { $ifNull: ["$likes", []] },
              createdAt: 1,
              likeCount: {
                $cond: [{ $isArray: "$likes" }, { $size: "$likes" }, 0],
              },
            },
          },
          {
            $sort: { likeCount: typeSort },
          },
        ]);
      } else {
        evaluateList = await Evaluate.find({ product: id })
          .populate("user")
          .populate({
            path: "product",
            populate: {
              path: "categoryId",
              model: "Category",
            },
          })
          .sort({ updatedAt: -1 })
          .exec();
      }

      const evaluateDToList = [];

      evaluateList.forEach((evaluate) => {
        const evaluateDTO = EvaluateDTO.mapEvaluateToEvaluateDTO(evaluate);

        evaluateDToList.push(evaluateDTO);
      });

      return new ServiceResponse(
        200,
        Status.SUCCESS,
        Messages.GET_DATA_SUCCESS,
        evaluateDToList
      );
    } catch (err) {
      console.log(err);
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async insert(evaluate) {
    try {
      const product = await Product.findOne({ _id: evaluate.product }).exec();

      if (product) {
        const user = await User.findOne({ _id: evaluate.user }).exec();

        if (user) {
          const newEvaluate = new Evaluate({ ...evaluate });

          await newEvaluate.save();

          return new ServiceResponse(
            200,
            Status.SUCCESS,
            Messages.INSERT_EVALUATE_SUCCESS,
            product
          );
        } else {
          return new ServiceResponse(
            400,
            Status.ERROR,
            Messages.NOT_FOUND_USER
          );
        }
      } else {
        return new ServiceResponse(
          400,
          Status.ERROR,
          Messages.NOT_FOUND_PRODUCT
        );
      }
    } catch (err) {
      console.log(err);
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }
}

module.exports = new EvaluateService();
