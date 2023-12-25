
class UserDTO {

    constructor(_id, isManager, fullName, images, gender, address, city, phoneNumber, birth, email, sw_id, isLock) {

        this._id = _id
        this.isManager = isManager
        this.fullName = fullName
        this.images = images
        this.gender = gender
        this.address = address
        this.city = city
        this.phoneNumber = phoneNumber
        this.birth = birth
        this.email = email
        this.sw_id = sw_id
        this.isLock = isLock
    }

    mapUserToUserDTO(user) {
        const {
            _id,
            isManager,
            fullName,
            images,
            gender,
            address,
            city,
            phoneNumber,
            birth,
            email,
            sw_id,
            isLock
        } = user

        return new UserDTO(_id, isManager, fullName, images, gender, address, city, phoneNumber, birth, email, sw_id, isLock)
    }

}

module.exports = new UserDTO
