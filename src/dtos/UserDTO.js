class UserDTO {

  constructor(_id, isManager, fullName, images, gender, address, city, phoneNumber, birth, email, sw_id, isLock, isActive, device_token, point) {

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
    this.isActive = isActive
    this.device_token = device_token
    this.point = point
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
      isLock,
      isActive,
      device_token,
      point
    } = user

    return new UserDTO(_id, isManager, fullName, images, gender, address, city, phoneNumber, birth, email, sw_id, isLock, isActive, device_token, point)
  }

}

module.exports = new UserDTO();
