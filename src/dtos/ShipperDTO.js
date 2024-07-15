class ShipperDTO {
  constructor(
    _id,
    isManager,
    fullName,
    images,
    gender,
    city,
    phoneNumber,
    // birth,
    email,
    isLock,
    isActive,
    money,
    bankName, 
    bankNumber,
    bankUser, 
    isDraw,
    drawingMoney,
  ) {
    this._id = _id;
    this.isManager = isManager;
    this.fullName = fullName;
    this.images = images;
    this.gender = gender;
    this.city = city;
    this.phoneNumber = phoneNumber;
    // this.birth = birth;
    this.email = email;
    this.isLock = isLock;
    this.isActive = isActive;
    this.money = money;
    this.bankName = bankName;
    this.bankNumber = bankNumber;
    this.bankUser = bankUser;
    this.isDraw = isDraw;
    this.drawingMoney = drawingMoney;
  }

  mapShipperToShipperDTO(shipper) {
    const {
      _id,
      isManager,
      fullName,
      images,
      gender,
      city,
      phoneNumber,
      // birth,
      email,
      isLock,
      isActive,
      money,
      bankName, 
      bankNumber,
      bankUser, 
      isDraw,
      drawingMoney,
    } = shipper;

    return new ShipperDTO(
      _id,
      isManager,
      fullName,
      images,
      gender,
      city,
      phoneNumber,
      // birth,
      email,
      isLock,
      isActive,
      money,
      bankName, 
      bankNumber,
      bankUser, 
      isDraw,
      drawingMoney,
    );
  }
}

module.exports = new ShipperDTO();
