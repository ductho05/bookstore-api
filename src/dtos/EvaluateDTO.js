
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
            let dateString = date.toLocaleDateString('en-GB', {year: 'numeric' , month: '2-digit',  day: '2-digit'});
            // const parts = dateString.split('/'); // Tách chuỗi thành mảng chứa ngày, tháng và năm
            // // Sắp xếp lại mảng để định dạng yyyy/mm/dd
            // const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            dateString = dateString.split('/').reverse().join('/');            

            console.log('dateString', dateString);
            createdAt = `${dateString} ${timeString}`;
        }

        if (Object.keys(user).length > 0) {
            user = {
                images: user.images,
                fullName: user.fullName,
                _id: user._id,
                gender: user.gender
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
