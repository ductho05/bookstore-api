const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")
const FlashUser = require("../models/FlashUser")
const FlashSale = require("../models/FlashSale");
const OrderItem = require("../models/OrderItem");
const { format } = require('date-fns-tz');
const moment = require('moment-timezone');
class FlashUserService {

    async getById(id) {

        try {
            
            const data = await FlashUser.findById(id)
                .populate({
                    path: 'Flash',
                    populate: {
                        path: 'categoryId',
                        model: 'Category'
                    }
                })
                .exec();

            if (data) {

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.GET_DATA_SUCCESS,
                    data
                )
            } else {

                return new ServiceResponse(
                    404,
                    Status.ERROR,
                    Messages.NOT_FOUND_DATA
                )
            }
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getFlash(flashId, start, end, sort, filter) {

        try {

            const FlashUsers = await FlashUser

                .find(flashId ? { flashid: flashId } : {})
                .populate
                ({
                    path: 'userid', model: 'User'
                })

                .populate({
                    path: 'flashid',
                    populate: {
                        path: 'product',
                        model: 'Product',
                        populate: {
                            path: 'categoryId',
                            model: 'Category'
                        }
                    }
                })
                .skip(start)
                .limit(end)
                .exec();

            const FlashUsersWithCategory = FlashUsers.filter((FlashUser) => {
                return true
            });

            if (sort) {
                if (sort == "reverse") FlashUsersWithCategory.reverse();
                if (filter == "num_sale") {
                    FlashUsersWithCategory.sort(function (a, b) {
                        if (sort == "asc") {
                            return a.num_sale - b.num_sale;
                        }
                        if (sort == "desc") {
                            return b.num_sale - a.num_sale;
                        }
                    });
                }
                if (filter == "sold_sale") {
                    FlashUsersWithCategory.sort(function (a, b) {
                        if (sort == "asc") {
                            return a.sold_sale - b.sold_sale;
                        }
                        if (sort == "desc") {
                            return b.sold_sale - a.sold_sale;
                        }
                    });
                }
                if (filter == "current_sale") {
                    FlashUsersWithCategory.sort(function (a, b) {
                        if (sort == "asc") {
                            return a.current_sale - b.current_sale;
                        }
                        if (sort == "desc") {
                            return b.current_sale - a.current_sale;
                        }
                    });
                }
                if (filter == "date_sale") {
                    FlashUsersWithCategory.sort(function (a, b) {
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
                    FlashUsersWithCategory.sort(function (a, b) {
                        if (sort == "asc") {
                            return a.point_sale - b.point_sale;
                        }
                        if (sort == "desc") {
                            return b.point_sale - a.point_sale;
                        }
                    });
                }
                if (filter == "time_sale") {
                    FlashUsersWithCategory.sort(function (a, b) {
                        if (sort == "asc") {
                            return a.time_sale - b.time_sale;
                        }
                        if (sort == "desc") {
                            return b.time_sale - a.time_sale;
                        }
                    });
                }
            }

            if (FlashUsersWithCategory) {

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.GET_DATA_SUCCESS,
                    FlashUsersWithCategory
                )
            } else {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.NOT_FOUND_DATA
                )
            }
        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async add(data) {
      //  console.log('data21212', data);

        try {         
            const product = await FlashUser.create(data);              
          //  console.log(product);
            // Đặt múi giờ cho Việt Nam
            const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

            // Lấy thời gian hiện tại ở Việt Nam
            const currentTimeInVietnam = moment().tz(vietnamTimeZone);

            // Lấy số giờ hiện tại
            const currentHourInVietnam = currentTimeInVietnam.get('hours');
            //const flash = await FlashUser.create(req.body);
            const currentDate = new Date();
            let toDay = format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });
            let current_point_sale = Math.floor(currentHourInVietnam/3);
            
          //  console.log(toDay, current_point_sale);
            
            if (product) {
                const flashSale = await FlashSale.find({ _id: data.flashid });
              //  console.log('flashSale5rewf', flashSale);
                
                if (flashSale.length > 0) {
                    if (flashSale[0].sold_sale + data.mount <= flashSale[0].num_sale) {
                      //  console.log('flashSale212313213', flashSale[0].sold_sale , data.mount, flashSale[0].num_sale);
                        flashSale[0].sold_sale += data.mount;
                        await FlashSale.findByIdAndUpdate(flashSale[0]._id, flashSale[0]).exec();
                    }  
                    else {
                        return new ServiceResponse(
                            200,
                            Status.ERROR,
                            Messages.INSERT_DATA_ERROR
                        )
                    }    
                  //  console.log("doremon ",  await FlashSale.find({ _id: data.flashid }))           
                }            

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.INSERT_DATA_SUCCESS,
                    product
                )
            } else {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.INSERT_DATA_ERROR
                )
            }    
        } catch (err) {
          //  console.log('afdafdas', err);

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }
  async delete(id, updateFlash) {
        // console.log('data21212', id, updateFlash);

        // try {         
        //     const product = await FlashUser.create(data);              
        //   //  console.log(product);
        //     // Đặt múi giờ cho Việt Nam
        //     const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

        //     // Lấy thời gian hiện tại ở Việt Nam
        //     const currentTimeInVietnam = moment().tz(vietnamTimeZone);

        //     // Lấy số giờ hiện tại
        //     const currentHourInVietnam = currentTimeInVietnam.get('hours');
        //     //const flash = await FlashUser.create(req.body);
        //     const currentDate = new Date();
        //     let toDay = format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });
        //     let current_point_sale = Math.floor(currentHourInVietnam/3);
            
        //   //  console.log(toDay, current_point_sale);
            
        //     if (product) {
        //         const flashSale = await FlashSale.find({ _id: data.flashid });
        //       //  console.log('flashSale5rewf', flashSale);
                
        //         if (flashSale.length > 0) {
        //             if (flashSale[0].sold_sale + data.mount <= flashSale[0].num_sale) {
        //               //  console.log('flashSale212313213', flashSale[0].sold_sale , data.mount, flashSale[0].num_sale);
        //                 flashSale[0].sold_sale += data.mount;
        //                 await FlashSale.findByIdAndUpdate(flashSale[0]._id, flashSale[0]).exec();
        //             }  
        //             else {
        //                 return new ServiceResponse(
        //                     200,
        //                     Status.ERROR,
        //                     Messages.INSERT_DATA_ERROR
        //                 )
        //             }    
        //           //  console.log("doremon ",  await FlashSale.find({ _id: data.flashid }))           
        //         }            

        //         return new ServiceResponse(
        //             200,
        //             Status.SUCCESS,
        //             Messages.INSERT_DATA_SUCCESS,
        //             product
        //         )
        //     } else {

        //         return new ServiceResponse(
        //             400,
        //             Status.ERROR,
        //             Messages.INSERT_DATA_ERROR
        //         )
        //     }    
        // } catch (err) {
        //   //  console.log('afdafdas', err);

        //     return new ServiceResponse(
        //         500,
        //         Status.ERROR,
        //         Messages.INTERNAL_SERVER
        //     )
        // }
    }
    async update(id, updateFlash) {

        try {

            const result = await FlashUser.findByIdAndUpdate({ _id: id }, updateFlash).exec()
            if (result) {

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_DATA_SUCCESS,
                    result
                )
            } else {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.UPDATE_DATA_ERROR,
                    result
                )
            }
        } catch (error) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async deleteExpired() {

        try {

            const currentDate = new Date();
            //const inputDate = new Date(req.body.date_sale);

            const currentHour = currentDate.getHours();
            // const inputTime = req.body.point_sale;

            let toDay =  format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });
            //let inputDay = inputDate.().slice(0, 10);
            // Tìm tất cả các Flash Sale đã hết hạn
            const expiredSales = await FlashUser.find({ date_sale: { $lte: toDay } });
            // Xóa các Flash Sale đã hết hạn
            for (const sale of expiredSales) {
                await FlashUser.deleteOne({ _id: sale._id });
            }

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.DELETE_DATA_SUCCESS
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async delete(id) {

        try {

            const data = await FlashUser.deleteOne({ _id: id });

            if (data) {

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.DELETE_DATA_SUCCESS,
                    data
                )
            } else {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.DELETE_DATA_ERROR
                )
            }

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

}

module.exports = new FlashUserService
