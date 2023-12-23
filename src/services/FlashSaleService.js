const ServiceResponse = require("../response/ServiceResponse")
const Status = require("../utils/Status")
const Messages = require("../utils/Messages")
const FlashSale = require("../models/FlashSale")
const Product = require("../models/Product")
const { format } = require('date-fns-tz');
const subDays = require('date-fns/subDays');
const moment = require('moment');
const User = require("../models/User")
const webpush = require('web-push')
const UserNotification = require("../models/UserNotification")
const { flashSaleImage, urlui } = require("../utils/api")
const Notification = require("../models/Notification")
class FlashSaleService {

    async getById(value, mount) {


        try {

            const data = await FlashSale.findById(value)
                .populate({
                    path: 'product',
                    populate: {
                        path: 'categoryId',
                        model: 'Category'
                    }
                })
                .exec();
            if (mount) {
                // //console.log("data: ", data, mount);
                // chuyển chuổi sang số nguyên
                mount = parseInt(mount);
                if (data.sold_sale + mount > data.num_sale) {
                    // //console.log("data: da vao", data.sold_sale, mount,  data.num_sale);
                    return new ServiceResponse(
                        200,
                        Status.WARNING,
                        Messages.NOT_ENOUGH_QUANTITY,                        
                            data
                    )
                }  
            }   
            
            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_FLASHSALE_SUCCESS,
                data
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async getProduct(categoryId, start, end, sort, filter, productId, date, point, enddate) {

        try {

            const currentDate = new Date();


            let current_point_sale = Math.floor(new Date().getHours() / 3);
            let toDay = format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });

            // //console.log("toDay: ", toDay, current_point_sale);
            // Lấy danh sách flash sale
            const flashSales = await FlashSale

                // tìm theo  id

                .find(productId ? { product: productId } : {})
                // tìm theo ngày và khung giờ

                .find(!date ? {} : enddate ? {
                    $and: [
                        { date_sale: { $gte: date } },
                        { date_sale: { $lte: enddate } },
                    ],
                } : {
                    date_sale: date,
                })
                .find(point ? {
                    point_sale: point
                } : {})

                .find(filter == "expired" ? {
                    $and: [
                        { date_sale: toDay },
                        { point_sale: current_point_sale },
                    ],
                } : {})
                .find(filter == "no-expired" ? {
                    $or: [
                        {
                            $and: [
                                { date_sale: toDay },
                                { point_sale: { $gt: current_point_sale } },
                            ],
                        },
                        {
                            date_sale: { $gt: toDay },
                        }
                    ]
                } : {})
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
                if (sort == "reverse") flashSalesWithCategory.reverse();
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
            }

            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.GET_DATA_SUCCESS,
                flashSalesWithCategory
            )

        } catch (err) {

            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async addProduct(currentHourInVietnam, currentHour, inputTime, toDay, inputDay, body) {

        try {

            if (inputDay < toDay || (inputDay == toDay && (inputTime + 1) * 3 <= currentHour)) {

                return new ServiceResponse(
                    200,
                    Status.ERROR1,
                    Messages.TIME_IN_PAST
                )
            }

            // const existingRecord = await FlashSale.findOne({
            //     date_sale: body.date_sale,
            //     point_sale: body.point_sale,
            //     product: body.product,
            //     current_sale: body.current_sale,
            // });

            // Tìm kiếm bản ghi trong cơ sở dữ liệu có các trường quan trọng giống với dữ liệu đầu vào
            const existingRecord = await FlashSale.findOne({
                date_sale: body.date_sale,
                point_sale: body.point_sale,
                product: body.product,
                //current_sale: req.body.current_sale,
                //Thêm bất kỳ trường quan trọng nào khác bạn muốn kiểm tra ở đây.
            });

            if (existingRecord) {
                // Tiến hành update lại giá của Product khi thêm FlashSale
                // Trong khung giờ hiện tại cần update lại giá của sản phẩm           
                if (body.date_sale == toDay && body.point_sale == Math.floor(currentHourInVietnam / 3)) {
                    await Product.findById(body.product).exec().then((product) => {
                        // product.containprice = product.price;//containprice đã được lưu trước đó
                        product.price = product.old_price * (100 - body.current_sale) / 100;
                        product.save();
                    });
                }

                // Nếu tìm thấy bản ghi trùng, cộng thêm số lượng
                existingRecord.num_sale += body.num_sale
                // lấy mức giảm sau
                existingRecord.current_sale = body.current_sale;

                // Lưu lại bản ghi
                await existingRecord.save()

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_DATA_SUCCESS,
                    existingRecord
                )

            } else {
                // trường hợp flashsale chưa tồn tại
                // Tiến hành update lại giá của Product khi thêm FlashSale
                // Trong khung giờ hiện tại            
                if (body.date_sale == toDay && body.point_sale == Math.floor(currentHourInVietnam / 3)) {
                    await Product.findById(body.product).exec().then((product) => {
                        product.containprice = product.price;
                        product.price = product.old_price * (100 - body.current_sale) / 100;
                        product.save();
                    });
                }
                // Trong khung giờ tương lai
                else {
                    await Product.findById(body.product).exec().then((product) => {
                        // lưu giá ban đầu
                        product.containprice = 1;
                        //product.price = product.old_price * (100 - req.body.current_sale)/100;
                        product.save();
                    });
                }
                // Thêm bản ghi mới FlashSale
                const data = await FlashSale.create(body);

                // thêm trường hide_price để ẩn giá khi hết flashsale
                // lấy giá sản phẩm vừa thêm
                await Product.findById(body.product).exec().then((product) => {
                    // Giả sử product.old_price và req.body.current_sale là các giá trị hợp lý
                    const price = product.old_price * (100 - body.current_sale) / 100;
                    // Chuyển đổi giá thành chuỗi
                    const priceString = price.toString();
                    const a = priceString.length - 1;
                    // Tạo chuỗi giá ẩn
                    let hiddenPriceString = '';
                    for (let i = 0; i < priceString.length; i++) {
                        // Nếu chữ số hiện tại là chữ số đầu tiên hoặc cuối cùng
                        if (i === 0 || i === a || i === a - 1 || i === a - 2) {
                            // Thêm chữ số vào chuỗi giá ẩn
                            hiddenPriceString += priceString[i];
                        } else {
                            // Thay thế chữ số bằng dấu *
                            hiddenPriceString += 'X';
                        }
                    }

                    let stringNum = hiddenPriceString.split('').reverse().join('');
                    // duyệt tất cả các chữ số trong giá
                    let formattedNumberString = '';
                    for (let i = 0; i < stringNum.length; i++) {
                        // thêm , vào sau mỗi 3 chữ số
                        if (i % 3 === 0 && i !== 0) {
                            formattedNumberString += ',';
                        }
                        // thêm chữ số vào chuỗi
                        formattedNumberString += stringNum[i];
                    }
                    // Đảo ngược chuỗi để có giá ẩn
                    const formattedNumberString2 = formattedNumberString.split('').reverse().join('');
                    // Gán giá che dấu vào thuộc tính hide_price trong đối tượng data
                    data.hide_price = formattedNumberString2;
                    data.save();
                });


                if (data) {
                    return new ServiceResponse(
                        200,
                        Status.SUCCESS,
                        Messages.INSERT_DATA_SUCCESS,
                        data
                    )
                } else {
                    return new ServiceResponse(
                        400,
                        Status.ERROR,
                        Messages.INSERT_DATA_ERROR
                    )
                }
            }
        } catch (err) {
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async update(id, updateProduct, currentHourInVietnam, toDay) {
        // console.log("da vao daycurrentHourInVietnam", currentHourInVietnam)
        try {
            const result = await FlashSale.findByIdAndUpdate({ _id: id }, {...updateProduct, sold_sale: 0}).exec()
            
            await Product.findById(result.product).exec().then((product) => {
                    //console.log("da vao d12121ay", updateProduct)
                    // từ hiện tại đến hiện tại, đã có contain nên chỉ update giá
                    if (result.date_sale == toDay && 
                        result.point_sale == Math.floor(currentHourInVietnam/3) &&
                        updateProduct.date_sale == toDay && 
                        updateProduct.point_sale == Math.floor(currentHourInVietnam/3)) {
                        product.price = product.old_price * (100 - updateProduct.current_sale)/100;
                    }   
                    // từ hiện tại đến tương lai, đã có contain nên chỉ update giá (giá là giá contain)
                    if (result.date_sale == toDay && 
                        result.point_sale == Math.floor(currentHourInVietnam/3) &&
                        (
                        updateProduct.date_sale > toDay || (updateProduct.date_sale == toDay && 
                        updateProduct.point_sale > Math.floor(currentHourInVietnam/3)))) {
                        product.price = product.containprice;
                        product.containprice = 1;
                    }   
                    // từ tương lai đến tương lai, chưa có contain và cũng không cần update giá (giá chưa sale)
                    if ((
                        result.date_sale > toDay || (result.date_sale == toDay && 
                        result.point_sale > Math.floor(currentHourInVietnam/3))) && (
                            updateProduct.date_sale > toDay || (updateProduct.date_sale == toDay && 
                            updateProduct.point_sale > Math.floor(currentHourInVietnam/3)))) {
                        product.price = product.price;
                    }     // OK
                    // từ tương lai đến hiện tại, chưa có contain nên cần tạo contain và update giá
                    if ((
                        result.date_sale > toDay || (result.date_sale == toDay && 
                        result.point_sale > Math.floor(currentHourInVietnam/3))) && (
                             (updateProduct.date_sale == toDay && 
                            updateProduct.point_sale == Math.floor(currentHourInVietnam/3)))) {
                                // console.log("da vao day", result, updateProduct)
                        product.containprice = product.price;
                        product.price = product.old_price * (100 - updateProduct.current_sale)/100;
                    }        

                    // đến quá khứ, contain đưa về giá 1 và giá đưa về giá ban đầu
                    if ((updateProduct.date_sale == toDay && 
                            updateProduct.point_sale < Math.floor(currentHourInVietnam/3)) || updateProduct.date_sale < toDay) {
                                // console.log("da vao day", result, updateProduct)
                        // product.containprice = product.price;
                        // product.price = product.old_price * (100 - updateProduct.current_sale)/100;

                        if (product.containprice == 1) {
                            // từ không phải hiện tại
                            product.price = product.price
                            product.containprice = 1
                        }
                        else if (product.containprice != 1) {
                            // từ hiện tại
                           product.price = product.containprice
                           product.containprice = 1
                        }
                    }  

                    // từ quá khứ đến hiện tại, đã có contain, cần cập nhập lại giá
                    if ( (updateProduct.date_sale == toDay && 
                        updateProduct.point_sale == Math.floor(currentHourInVietnam/3)) && (
                            result.date_sale < toDay || (result.date_sale == toDay && 
                                result.point_sale < Math.floor(currentHourInVietnam/3)))) {
                        
                        product.containprice = product.price
                        product.price = product.old_price * (100 - updateProduct.current_sale)/100;
                    }    

                    
                    // từ quá khứ đến tương lai, đã có contain, không cần cập nhập lại giá
                    if ( (updateProduct.date_sale > toDay) || (updateProduct.date_sale == toDay && 
                        updateProduct.point_sale > Math.floor(currentHourInVietnam/3)) && (
                            result.date_sale < toDay || (result.date_sale == toDay && 
                                result.point_sale < Math.floor(currentHourInVietnam/3)))) {
                        
                        product.price = product.price
                    }   
                    
                    // product.sold +=  flashSale.sold_sale; // update đã bán
                    // product.price = product.containprice; // lấy lại giá ban đầu
                    //console.log("da vao d212ay", product.price)
                    product.save();
                    // console.log("KQ", product)
                });
            //console.log("updateProduct: ", result, pro);
            if (result) {

                return new ServiceResponse(
                    200,
                    Status.SUCCESS,
                    Messages.UPDATE_DATA_SUCCESS,
                    updateProduct
                )
            } else {

                return new ServiceResponse(
                    400,
                    Status.ERROR,
                    Messages.UPDATE_DATA_ERROR
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

    async deleteExpired() {

        try {

            const currentDate = new Date();
            //const inputDate = new Date(req.body.date_sale);

            const currentHour = currentDate.getHours();
            // const inputTime = req.body.point_sale;

            let toDay = format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });
            //let inputDay = inputDate.toISOString().slice(0, 10);
            // Tìm tất cả các Flash Sale đã hết hạn
            const expiredSales = await FlashSale.find({ date_sale: { $lte: toDay } });
            // Xóa các Flash Sale đã hết hạn
            for (const sale of expiredSales) {
                await FlashSale.deleteOne({ _id: sale._id });
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

            const data = await FlashSale.deleteOne({ _id: id });

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

    async addLoopSale() {
        try {
            const currentDate = new Date();
            //const inputDate = new Date(req.body.date_sale);   
            // const inputTime = req.body.point_sale;
            let toDay = format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });
            //let toDay = currentDate.toISOString().slice(0, 10);
            //let inputDay = inputDate.toISOString().slice(0, 10);
            // Tìm tất cả các Flash Sale có is_loop = true và date_sale = hôm nay
            // console.log("toDay: ", toDay);
            const loopSales = await FlashSale.find({ is_loop: true, date_sale: toDay });
            //console.log("loopSales: ", loopSales);
            // Xóa các Flash Sale đã hết hạn
            //console.log("chua xoa", loopSales);
            for (const sale of loopSales) {
                //console.log("sale: ", sale);
                // thêm vào ngày hôm sau       
                sale.is_loop = false;
                await sale.save();

                // Tạo ra một bản ghi mới với các trường giống nhau nhưng có thể thay đổi một số trường
                const newSale = new FlashSale({
                    product: sale.product,
                    current_sale: sale.current_sale,
                    date_sale: format(new Date().setDate(new Date().getDate() + 1),
                        'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' }),
                    point_sale: sale.point_sale,
                    time_sale: sale.time_sale,
                    num_sale: sale.num_sale,
                    sold_sale: sale.sold_sale,
                    is_loop: true,
                });
                await newSale.save();
                console.log("dang chạy thêm lặp...", toDay)
       
            }
            return new ServiceResponse(
                200,
                Status.SUCCESS,
                Messages.UPDATE_FLASHSALE_SUCCESS
            )
        } catch (err) {
            return new ServiceResponse(
                500,
                Status.ERROR,
                Messages.INTERNAL_SERVER
            )
        }
    }

    async checkAndUpdatePrice() {
        //console.log("da vao day")
        try {
            // Đặt múi giờ cho Việt Nam
            const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
            //console.log("da vao day")
            // Lấy thời gian hiện tại ở Việt Nam
            const currentTimeInVietnam = moment().tz(vietnamTimeZone);
            // Lấy số giờ hiện tại
            const currentHourInVietnam = currentTimeInVietnam.get('hours');

            // tìm các flash sale có ngày và khung giờ hiện tại
            const currentDate = new Date();
            //console.log("da vao day")
            const yesterday = subDays(currentDate, 1);
            //console.log("yesterday: ", yesterday);
            let toDay = format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });
            // lấy giá trị ngày hôm trước
            let yes = format(yesterday, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });

            let current_point_sale = Math.floor(currentHourInVietnam / 3);
            //console.log("toDay: ", toDay, yes);
            // ngày hôm trước
                 console.log("Update giá flashsale dang chạy>>>: bây giờ là ", currentHourInVietnam, toDay);
           
            // // sửa giá của sản phẩm trong khung giờ đã qua
            // const flashSales1 = await FlashSale.find(current_point_sale == 0 ? { date_sale: yes, point_sale: 7 } : { date_sale: toDay, point_sale: current_point_sale - 1 });
            // flashSales1.forEach(async (flashSale) => {
            //     if (flashSale.product) {
            //     await Product.findById(flashSale.product).exec().then((product) => {
            //        // console.log("da vao day", product)
            //         //product.sold +=  flashSale.sold_sale; // update đã bán
            //         product.price = product.containprice; // lấy lại giá ban đầu
            //         product.containprice = 1;
            //         await product.save();
            //     });
            //     console.log("sau khi update -  của sản phẩm trong khung giờ đã qua:", await Product.findById(flashSale.product).exec());
            //     }
            // });

            // // Update lại giá của sản phẩm trong khung giờ hiện tại
            // const flashSales = await FlashSale.find({ date_sale: toDay, point_sale: current_point_sale });
            // flashSales.forEach(async (flashSale) => {
            //     //console.log("flashSale: ", flashSale);
            //     if (flashSale.product) {  
            //         await Product.findById(flashSale.product).exec().then((product) => {
            //             //console.log("da vao day")
            //             product.containprice = product.price; // chứa giá ban đầu
            //             product.price = product.old_price * (100 - flashSale.current_sale)/100; // giá mới trong flashsale
            //             await product.save();
            //         });
            //         console.log("sau khi update -  Update lại giá của sản phẩm trong khung giờ hiện tại:", await Product.findById(flashSale.product).exec());
            //     }
            // });
               // Sửa giá của sản phẩm trong khung giờ đã qua
               for (const flashSale of await FlashSale.find(current_point_sale === 0 ? { date_sale: yes, point_sale: 7 } : { date_sale: toDay, point_sale: current_point_sale - 1 })) {
                if (flashSale.product) {
                    const product = await Product.findById(flashSale.product).exec();
                    product.price = product.containprice;
                    product.containprice = 1;
                    await product.save();
                    console.log("Sau khi update - của sản phẩm trong khung giờ đã qua:", await Product.findById(flashSale.product).exec());
                }
            }
                
            // Update lại giá của sản phẩm trong khung giờ hiện tại
            for (const flashSale of await FlashSale.find({ date_sale: toDay, point_sale: current_point_sale })) {
                if (flashSale.product) {
                    const product = await Product.findById(flashSale.product).exec();
                    product.containprice = product.price;
                    product.price = product.old_price * (100 - flashSale.current_sale) / 100;
                    await product.save();
                    console.log("Sau khi update - Update lại giá của sản phẩm trong khung giờ hiện tại:", await Product.findById(flashSale.product).exec());
                }
            }
            const listUsers = await User.find().exec()
            let description = "Ưu đãi chương trình TA BookStore Flash Sale dành cho tất cả khách hàng. Xem ngay!"
            const url = `${urlui}/flashsale`
            const title = "Chường trình FlashSale"
            const image = flashSaleImage
            const notification = new Notification({
                title,
                description,
                url,
                image
            })
            await notification.save()
            listUsers.forEach(async (user) => {
                if (user.sw_id) {
                    webpush.sendNotification(
                        user.sw_id,
                        JSON.stringify(notification)
                    )
                }
                const userNotification = new UserNotification({
                    user: user._id,
                    notification: notification._id
                })

                await userNotification.save()
            })
        return new ServiceResponse(
            200,
            Status.SUCCESS,
            Messages.UPDATE_FLASHSALE_SUCCESS
        )}
    catch (err) {
        return new ServiceResponse(
            500,
            Status.ERROR,
            Messages.INTERNAL_SERVER
        )}
    }

    // check flashsale đã hết hàng chưa
    async checkFlashSale() {
        try {
            const currentDate = new Date();
            let toDay = format(currentDate, 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });
            // Tìm tất cả các Flash Sale có ngày hết hạn là hôm nay
            const expiredSales = await FlashSale.find({ date_sale: toDay });
            // Xóa các Flash Sale đã hết hạn
            for (const sale of expiredSales) {
                // Nếu số lượng đã bán lớn hơn số lượng trong kho
                if (sale.sold_sale > sale.num_sale) {
                    // Xóa Flash Sale
                    await FlashSale.deleteOne({ _id: sale._id });
                }
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

}

module.exports = new FlashSaleService
