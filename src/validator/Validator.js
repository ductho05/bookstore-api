const Joi = require('joi')

class Validator {

    authValidator = Joi.object({
        email: Joi.string().email().max(225).required(),
        password: Joi.string().pattern(
            new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        ).required()
    })

    authFacebookValidator = Joi.object({
        faceId: Joi.string().required(),
        email: Joi.string().email().max(225).required(),
        username: Joi.string().required(),
        image: Joi.string().required()
    })

    emailValidator = Joi.string().email().max(225).required()

    idValidator = Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24,}$/)).required()

    idCategoryValidator = Joi.number().min(1).max(9999999999).required()

    userValidator = Joi.object({
        fullName: Joi.string().trim().min(3).max(255).required(),
        gender: Joi.string().valid("male", "female", "other"),
        address: Joi.string().trim().min(5).required(),
        city: Joi.string().trim().min(5).required(),
        phoneNumber: Joi.string().pattern(
            new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        ).required(),
        birth: Joi.string().pattern(new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)).required(),
        email: Joi.string().email().max(225).required(),
        password: Joi.string().pattern(
            new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        ).required(),
        isManager: Joi.boolean().required(),
    })

    userUpdateValidator = Joi.object({
        fullName: Joi.string().trim().min(3).max(255),
        gender: Joi.string().valid("male", "female", "other"),
        address: Joi.string().trim().min(5),
        city: Joi.string().trim().min(5),
        phoneNumber: Joi.string().pattern(
            new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        ),
        birth: Joi.string().pattern(
            new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)
        ),
        email: Joi.string().email().max(225),
        password: Joi.string().pattern(
            new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
        ),
        isManager: Joi.boolean(),
        isLock: Joi.boolean()
    })

    categoryValidator = Joi.object({
        name: Joi.string().trim().min(1).max(255).required(),
        status: Joi.string().valid("Hoạt động", "Không hoạt động")
    })

    categoryUpdateValidator = Joi.object({
        name: Joi.string().trim().min(1).max(255),
        status: Joi.boolean(),
        field: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24,}$/))
    })

    evaluateValidator = Joi.object({
        comment: Joi.string().trim().min(1).required(),
        rate: Joi.number().min(1).max(5).required(),
        product: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
        user: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required()
    })

    notificationValidator = Joi.object({
        title: Joi.string().trim().min(1).required(),
        description: Joi.string().trim().min(1).required(),
        image: Joi.string().required(),
        url: Joi.string().pattern(new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}/)).required(),
        user: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/))
    })

    orderValidator = Joi.object({
        name: Joi.string().trim().min(3).max(255).required(),
        address: Joi.string().trim().min(3).max(255).required(),
        email: Joi.string().email().max(225).required(),
        city: Joi.string().trim().min(5).required(),
        country: Joi.string().trim().min(5).required(),
        districs: Joi.string().trim().min(5).required(),
        wards: Joi.string().trim().min(1).required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(1).required(),
        payment_method: Joi.string().trim().min(1).required(),
        shipping_method: Joi.string().trim().min(1).required(),
        deliveryDate: Joi.string().trim().min(1).required(),
        shippingCost: Joi.number().min(1).required(),
        message: Joi.string().allow(null, '').optional(),
        user: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
        phone: Joi.string().pattern(
            new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        )
    })

    orderUpdateValidator = Joi.object({

        _id: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)),
        name: Joi.string().trim().min(3).max(255),
        address: Joi.string().trim().min(3).max(255),
        email: Joi.string().email().max(225),
        city: Joi.string().trim().min(5),
        country: Joi.string().trim().min(5),
        districs: Joi.string().trim().min(5),
        wards: Joi.string().trim().min(1),
        quantity: Joi.number().min(1),
        price: Joi.number().min(1),
        payment_method: Joi.string().trim().min(1),
        shipping_method: Joi.string().trim().min(1),
        deliveryDate: Joi.string().trim().min(1),
        status: Joi.string().trim().min(1),
        shippingCost: Joi.number().min(1),
        user: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)),
        phone: Joi.string().pattern(
            new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        )
    })

    orderItemValidator = Joi.object({
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(1).required(),
        order: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required(),
        product: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required()
    })

    orderItemUpdateValidator = Joi.object({
        status: Joi.string().valid("DADANHGIA").required()
    })

    productValidator = Joi.object({

        title: Joi.string().trim().min(3).max(255).required(),
        author: Joi.string().trim().min(3).max(255).required(),
        published_date: Joi.string().pattern(new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)).required(),
        price: Joi.number().min(1).required(),
        old_price: Joi.number().min(1).required(),
        desciption: Joi.string().trim().min(5).required(),
        quantity: Joi.number().min(1).required(),
        categoryId: Joi.string().trim().min(1).required()

    })

    productUpdateValidator = Joi.object({

        _id: Joi.string(),
        status: Joi.string(),
        sold: Joi.number().min(0),
        rate: Joi.number().min(0).max(5),
        title: Joi.string().trim().min(3).max(255),
        author: Joi.string().trim().min(3).max(255),
        published_date: Joi.string().pattern(new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)),
        price: Joi.number().min(1),
        old_price: Joi.number().min(1),
        desciption: Joi.string().trim().min(5),
        quantity: Joi.number().min(1),
        categoryId: Joi.string().trim().min(1),
        list_Images: Joi.string().trim().min(1),
        images: Joi.string().pattern(new RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/)),
        containprice: Joi.number().min(1),
        flashsaleprice: Joi.number().min(0),
        status_sell: Joi.boolean()
    })

    systemValidator = Joi.object({
        //start: Joi.string().pattern(new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)).required(),
        //end: Joi.string().pattern(new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)).required(),
        type: Joi.string().valid("week", "month", "year").required(),
        isRun: Joi.boolean().required(),
        kpi: Joi.number().min(1).required(),
        key: Joi.string().required()
        //isStatus: Joi.boolean().required()
    })

    soldValidator = Joi.object({
        sold: Joi.number().min(1).max(1000).required(),
        id: Joi.string().pattern(new RegExp(/^[a-fA-F0-9]{24}$/)).required()
    })

    forgetValidator = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
}

module.exports = new Validator
