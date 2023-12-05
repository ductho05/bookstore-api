
class OrderDTO {

    constructor(_id, name, address, city, country, districs, wards, phone, quantity, price, 
        message, status, payment_method, shipping_method, deliveryDate, shippingCost, createdAt,date, user) {

        this._id = _id
        this.name = name
        this.address = address
        this.city = city
        this.country = country
        this.districs = districs
        this.wards = wards
        this.phone = phone
        this.quantity = quantity
        this.price = price
        this.message = message
        this.status = status
        this.payment_method = payment_method
        this.shipping_method = shipping_method
        this.deliveryDate = deliveryDate
        this.shippingCost = shippingCost
        this.createdAt = createdAt
        this.date = date
        this.user = user
    }

    mapToOrderDTO(order) {
        var {
            _id,
            name,
            address,
            city,
            country,
            districs,
            wards,
            phone,
            quantity,
            price,
            message,
            status,
            payment_method,
            shipping_method,
            deliveryDate,        
            shippingCost,
            createdAt,
            date,
            user
        } = order

        if (createdAt) {
            const date = new Date(createdAt);

            const timeString = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const dateString = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

            createdAt = `${timeString} ${dateString}`;
        }

        if (Object.keys(user).length > 0) {
            user = {
                id: user._id,
                images: user.images,
                fullName: user.fullName
            }
        }

        return new OrderDTO(_id, name, address, city, country, districs, wards, phone, quantity, price,
            message, status, payment_method, shipping_method, deliveryDate, shippingCost, createdAt,date, user)
    }

}

module.exports = new OrderDTO
