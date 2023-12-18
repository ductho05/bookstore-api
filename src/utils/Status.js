class Status {

    ERROR = "Failure"
    ERROR400 = "ERROR"
    // khong đủ số lượng hàng
    ERROR401 = "Not enough quantity"
    SUCCESS = "OK"
    ERROR1 = "Failed"
    WARNING = "WARNING"
    ERROR_FLASH_SALE="Not enough quantity in flash sale"
}

module.exports = new Status
