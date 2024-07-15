const ServiceResponse = require("../response/ServiceResponse.js");
const Shipper = require("../models/Shipper.js");
const ShipperDTO = require("../dtos/ShipperDTO.js");
const Messages = require("../utils/Messages.js");
const Status = require("../utils/Status.js");
const constants = require("../utils/api.js");
const transporter = require("../config/mail.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class ShipperService {
  async forgetPasswordShipper(email, password) {
    try {
      const findShipper = await Shipper.findOne({ email }).exec();
      if (findShipper) {
        const encryptedPassword = await bcrypt.hash(password, 10);
        findShipper.password = encryptedPassword;

        await findShipper.save();

        const token = jwt.sign(
          { isManager: findShipper.isManager, email, id: findShipper._id },
          constants.TOKEN_KEY,
          {
            expiresIn: constants.ExpiresIn,
          }
        );

        const shipperDTO = ShipperDTO.mapShipperToShipperDTO(findShipper);

        return new ServiceResponse(
          200,
          Status.SUCCESS,
          Messages.LOGIN_SUCCESS,
          shipperDTO,
          token
        );
      } else {
        return new ServiceResponse(400, Status.ERROR, Messages.NOT_FOUND_SHIPPER);
      }
    } catch (err) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async login(email, password) {
    try {
      const shipper = await Shipper.findOne({ email: email });
      if (shipper) {
        if (await bcrypt.compare(password, shipper.password)) {
          const token = jwt.sign(
            { isManager: shipper.isManager, email, id: shipper._id },
            constants.TOKEN_KEY,
            {
              expiresIn: constants.ExpiresIn,
            }
          );

          const shipperDTO = ShipperDTO.mapShipperToShipperDTO(shipper);

          return new ServiceResponse(
            200,
            Status.SUCCESS,
            Messages.LOGIN_SUCCESS,
            shipperDTO,
            token
          );
        } else {
          return new ServiceResponse(
            401,
            Status.ERROR,
            Messages.PASSWORD_NOT_MATCHED
          );
        }
      } else {
        return new ServiceResponse(
          401,
          Status.ERROR,
          Messages.EMAIL_NOT_REGISTERED
        );
      }
    } catch (err) {
      console.error(err);
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async getProfileByEmail(email) {
    try {
      const shipper = await Shipper.findOne({ email }).exec();

      const shipperDTO = ShipperDTO.mapShipperToShipperDTO(shipper);

      return new ServiceResponse(
        200,
        Status.SUCCESS,
        Messages.GET_PROFILE_SUCCESS,
        shipperDTO
      );
    } catch (err) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async sendEmail(to, subject, html, value) {
    return new Promise((resolve, reject) => {
      try {
        const mainOptions = {
          from: constants.mailSender,
          to: to,
          subject: subject,
          html: html,
        };

        transporter.sendMail(mainOptions, (err) => {
          if (err) {
            resolve(
              new ServiceResponse(400, Status.ERROR, Messages.SEND_EMAIL_ERROR)
            );
          } else {
            resolve(
              new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.SEND_EMAIL_SUCCESS,
                value
              )
            );
          }
        });
      } catch (err) {
        reject(
          new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER)
        );
      }
    });
  }

  // async loginWithFacebook(email, Shippername, image, faceId) {
  //   try {
  //     const findShipper = await Shipper.findOne({ facebookId: faceId }).exec();

  //     if (findShipper) {
  //       const token = jwt.sign(
  //         { isManager: findShipper.isManager, email, id: findShipper._id },
  //         constants.TOKEN_KEY,
  //         {
  //           expiresIn: constants.ExpiresIn,
  //         }
  //       );

  //       const ShipperDTO = ShipperDTO.mapShipperToShipperDTO(findShipper);

  //       return new ServiceResponse(
  //         200,
  //         Status.SUCCESS,
  //         Messages.LOGIN_SUCCESS,
  //         ShipperDTO,
  //         token
  //       );
  //     } else {
  //       const Shipper = new Shipper({
  //         email: email,
  //         fullName: Shippername,
  //         images: image,
  //         facebookId: faceId,
  //       });

  //       await Shipper.save();
  //       const token = jwt.sign(
  //         { isManager: Shipper.isManager, email, id: Shipper._id },
  //         constants.TOKEN_KEY,
  //         {
  //           expiresIn: constants.ExpiresIn,
  //         }
  //       );

  //       const ShipperDTO = ShipperDTO.mapShipperToShipperDTO(Shipper);

  //       return new ServiceResponse(
  //         200,
  //         Status.SUCCESS,
  //         Messages.LOGIN_SUCCESS,
  //         ShipperDTO,
  //         token
  //       );
  //     }
  //   } catch (err) {
  //     return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
  //   }
  // }

  // async register(email, password, fullName) {
  //   try {
  //     const oldShipper = await Shipper.findOne({ email });
  //     if (oldShipper) {
  //       return new ServiceResponse(400, Status.ERROR, Messages.SHIPPER_EXISTS);
  //     } else {
  //       const encryptedPassword = await bcrypt.hash(password, 10);
  //       const Shipper = new Shipper({
  //         email: email.toLowerCase(),
  //         password: encryptedPassword,
  //         fullName,
  //       });

  //       await Shipper.save();
  //       const token = jwt.sign(
  //         { isManager: Shipper.isManager, email, id: Shipper._id },
  //         constants.TOKEN_KEY,
  //         {
  //           expiresIn: constants.ExpiresIn,
  //         }
  //       );

  //       const ShipperDTO = ShipperDTO.mapShipperToShipperDTO(Shipper);

  //       return new ServiceResponse(
  //         200,
  //         Status.SUCCESS,
  //         Messages.REGISTER_SUCCESS,
  //         ShipperDTO,
  //         token
  //       );
  //     }
  //   } catch (err) {
  //     return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
  //   }
  // }

  async activeShipper(email) {
    try {
      const findShipper = await Shipper.findOne({ email });

      if (findShipper) {
        await Shipper.updateOne({ email }, { isActive: true });

        return new ServiceResponse(
          200,
          Status.SUCCESS,
          Messages.UPDATE_SHIPPER_SUCCESS
        );
      } else {
        return new ServiceResponse(404, Status.ERROR, Messages.NOT_FOUND_SHIPPER);
      }
    } catch (e) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async getAllPagination(page, limit) {
    try {
      const shipperList = await Shipper.find()
        .sort({ updateAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const shipperDTOList = [];
      shipperList.forEach((shipper) => {
        const shipperDTO = ShipperDTO.mapShipperToShipperDTO(shipper);
        shipperDTOList.push(shipperDTO);
      });

      return new ServiceResponse(
        200,
        Status.SUCCESS,
        Messages.GET_SHIPPER_SUCCESS,
        shipperDTOList
      );
    } catch (err) {
      console.log(err);
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async getAllByTime(page, limit, firstTime, lastTime) {
    try {
      const ShipperList = await Shipper.find({
        createAt: { $gte: firstTime, $lte: lastTime },
      })
        .sort({ updateAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const ShipperDTOList = [];
      ShipperList.forEach((shipper) => {
        const shipperDTO = ShipperDTO.mapShipperToShipperDTO(shipper);
        ShipperDTOList.push(shipperDTO);
      });

      return new ServiceResponse(
        200,
        Status.SUCCESS,
        Messages.GET_SHIPPER_SUCCESS,
        ShipperDTOList
      );
    } catch (err) {
      console.log(err);
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async getAllByName(page, limit, name) {
    try {
      const ShipperList = await Shipper.find({
        $text: {
          $search: name,
          $caseSensitive: false,
          $diacriticSensitive: false,
        },
      })
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const ShipperDTOList = [];
      ShipperList.forEach((shipper) => {
        const shipperDTO = ShipperDTO.mapShipperToShipperDTO(shipper);
        ShipperDTOList.push(shipperDTO);
      });

      return new ServiceResponse(
        200,
        Status.SUCCESS,
        Messages.GET_SHIPPER_SUCCESS,
        ShipperDTOList
      );
    } catch (err) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async getAll() {
    try {
      const ShipperList = await Shipper.find().sort({ updatedAt: -1 }).exec();

      const ShipperDTOList = [];
      ShipperList.forEach((shipper) => {
        const shipperDTO = ShipperDTO.mapShipperToShipperDTO(shipper);
        ShipperDTOList.push(shipperDTO);
      });

      return new ServiceResponse(
        200,
        Status.SUCCESS,
        Messages.GET_SHIPPER_SUCCESS,
        ShipperDTOList
      );
    } catch (err) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async getByField(field) {
    try {
      const shipper = await Shipper.findOne(field).exec();

      if (shipper) {
        const shipperDTO = ShipperDTO.mapShipperToShipperDTO(shipper);

        return new ServiceResponse(
          200,
          Status.SUCCESS,
          Messages.GET_ONE_SHIPPER_SUCCESS,
          shipperDTO
        );
      } else {
        return new ServiceResponse(404, Status.ERROR, Messages.NOT_FOUND_SHIPPER);
      }
    } catch (err) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async insert(value) {
    try {
      const findShipper = await Shipper.findOne({ email: value.email }).exec();

      if (findShipper) {
        return new ServiceResponse(400, Status.ERROR, Messages.SHIPPER_EXISTS);
      } else {

        console.log("da vao day")
        const shipper = new Shipper({ ...value });
        const encryptedPassword = await bcrypt.hash(shipper.password, 10);
        shipper.password = encryptedPassword;
        console.log("da vao day")
        await shipper.save();

        return new ServiceResponse(
          200,
          Status.SUCCESS,
          Messages.INSERT_SHIPPER_SUCCESS,
          shipper
        );
      }
    } catch (err) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async delete(id) {
    try {
      const shipper = await Shipper.findByIdAndRemove({ _id: id }).exec();
      if (shipper) {
        return new ServiceResponse(
          200,
          Status.SUCCESS,
          Messages.REMOVE_SHIPPER_SUCCESS
        );
      } else {
        return new ServiceResponse(400, Status.ERROR, Messages.NOT_FOUND_SHIPPER);
      }
    } catch (err) {
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async update(filter, newShipper) {
    try {
      if (newShipper.password) {
        const encryptedPassword = await bcrypt.hash(newShipper.password, 10);
        newShipper.password = encryptedPassword;
      }

      const ShipperUpdate = await Shipper.findByIdAndUpdate(filter, newShipper).exec();

      if (ShipperUpdate) {
        const updatedShipper = await Shipper.findOne({ _id: ShipperUpdate._id });
        const shipperDTO = ShipperDTO.mapShipperToShipperDTO(updatedShipper);

        return new ServiceResponse(
          200,
          Status.SUCCESS,
          Messages.UPDATE_SHIPPER_SUCCESS,
          shipperDTO
        );
      } else {
        return new ServiceResponse(400, Status.ERROR, Messages.NOT_FOUND_SHIPPER);
      }
    } catch (err) {
      console.log(err);
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  async updateEmail(id, email) {
    try {
      const findShipper = await Shipper.findOne({ email });
      if (findShipper) {
        return new ServiceResponse(400, Status.ERROR, Messages.EMAIL_IS_EXIST);
      } else {
        const ShipperUpdate = await Shipper.findByIdAndUpdate(
          { _id: id },
          { email: email }
        ).exec();

        if (ShipperUpdate) {
          const updatedShipper = await Shipper.findOne({ _id: ShipperUpdate._id });
          const shipperDTO = ShipperDTO.mapShipperToShipperDTO(updatedShipper);

          const token = jwt.sign(
            { isManager: updatedShipper.isManager, email, id: updatedShipper._id },
            constants.TOKEN_KEY,
            {
              expiresIn: constants.ExpiresIn,
            }
          );

          return new ServiceResponse(
            200,
            Status.SUCCESS,
            Messages.UPDATE_SHIPPER_SUCCESS,
            shipperDTO,
            token
          );
        } else {
          return new ServiceResponse(
            400,
            Status.ERROR,
            Messages.NOT_FOUND_SHIPPER
          );
        }
      }
    } catch (err) {
      console.log(err);
      return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
    }
  }

  // async updateTas(id, tas, action) {
  //   try {
  //     // lấy giá trị tas hiện tại
  //     const tasShipper = await Shipper.findOne({ _id: id }).exec();
  //     // lấy giá trị tas hiện tại
  //     const tasCurrent = tasShipper.tas;
  //     // ép kiểu tas về số
  //     tas = parseInt(tas);
  //     const Shipper = await Shipper.findByIdAndUpdate(
  //       { _id: id },
  //       { tas: action === "add" ? tasCurrent + tas : tasCurrent - tas }
  //     ).exec();
  //     return new ServiceResponse(
  //       200,
  //       Status.SUCCESS,
  //       Messages.UPDATE_SHIPPER_SUCCESS,
  //       Shipper
  //     );
  //   } catch (err) {
  //     console.log(err);
  //     return new ServiceResponse(500, Status.ERROR, Messages.INTERNAL_SERVER);
  //   }
  // }
}

module.exports = new ShipperService();
