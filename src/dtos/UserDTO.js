class UserDTO {
  constructor(
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
    tas
  ) {
    this._id = _id;
    this.isManager = isManager;
    this.fullName = fullName;
    this.images = images;
    this.gender = gender;
    this.address = address;
    this.city = city;
    this.phoneNumber = phoneNumber;
    this.birth = birth;
    this.email = email;
    this.sw_id = sw_id;
    this.isLock = isLock;
    this.isActive = isActive;
    this.tas = tas;
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
      tas,
    } = user;

    return new UserDTO(
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
      tas
    );
  }
}

module.exports = new UserDTO();
