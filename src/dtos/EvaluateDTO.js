
class EvaluateDTO {

    constructor(_id, rate, comment, createdAt, product, likes, user) {

        this._id = _id
        this.rate = rate
        this.comment = comment
        this.createdAt = createdAt
        this.product = product
        this.likes = likes
        this.user = user
    }

    mapEvaluateToEvaluateDTO(evaluate) {
        var {
            _id,
            rate,
            comment,
            createdAt,
            product,
            likes,
            user
        } = evaluate

        if (createdAt) {
            const date = new Date(createdAt);

            const timeString = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const dateString = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

            createdAt = `${timeString} ${dateString}`;
        }

        if (Object.keys(user).length > 0) {
            user = {
                images: user.images,
                fullName: user.fullName
            }
        }

        if (Object.keys(product).length > 0) {
            product = {
                _id: product._id,
                images: product.images,
                title: product.title
            }
        }

        return new EvaluateDTO(_id, rate, comment, createdAt, product, likes, user)
    }

}

module.exports = new EvaluateDTO
