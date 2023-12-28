
class Messages {

    LOGIN_SUCCESS = "Login successfully"

    LOGIN_ERROR = "Login error"

    PASSWORD_NOT_MATCHED = "Password incorrect"

    INTERNAL_SERVER = "Internal server error"

    EMAIL_NOT_REGISTERED = "Email is not regsitered"

    NOT_AUTH = "Not authorized to access this resource"

    TOKEN_EXPIRED = "Jwt expired"

    GET_PROFILE_SUCCESS = "Get profile successfully"

    SEND_EMAIL_ERROR = "Send email error"

    SEND_EMAIL_SUCCESS = "Send email successfully"

    USER_EXISTS = "Account is exists"

    REGISTER_SUCCESS = "Register successfully"

    GET_USER_SUCCESS = "Get user list successfully"

    GET_ONE_USER_SUCCESS = "Get one user successfully"

    NOT_FOUND_USER = "Not found user"

    INSERT_USER_SUCCESS = "Insert user successfully"

    INSERT_EVALUATE_SUCCESS = "Insert evaluate successfully"

    REMOVE_USER_SUCCESS = "Remove user successfully"

    UPDATE_USER_SUCCESS = "Update user successfully"

    GET_CATEGORY_SUCCESS = "Get category successfully"

    CATEGORY_NOT_FOUND = "Category not found"

    NOT_FOUND_DATA = "Not found data"

    UPDATE_DATA_SUCCESS = "Update product quantity successfully"

    UPDATE_DATA_ERROR = "Update data error"

    INSERT_DATA_SUCCESS = "Insert data successfully"

    INSERT_DATA_ERROR = "Insert data error"

    NOT_KEY = "Mã kích hoạt không đúng"

    DELETE_DATA_SUCCESS = "Delete data successfully"

    DELETE_DATA_ERROR = "Delete data error"

    CATEGORY_EXISTS = "Category is exists"

    INSERT_CATEGORY_SUCCESS = "Insert category successfully"

    UPDATE_CATEGORY_SUCCESS = "Update category successfully"

    GET_COMMENT_SUCCESS = "Get comment successfully"

    GET_DATA_SUCCESS = "Get data successfully"

    GET_DATA_ERROR = "Get data error"

    LIKE_OR_QUIT_LIKE_SUCCESS = "Like or quit like successfully"

    NOT_FOUND_PRODUCT = "Not found product"

    PUSH_SUBSCRIPTION_SUCCESS = "Push subscription success"

    SEND_NOTICE_SUCCESS = "Send notification successfully"

    UPLOAD_FILE_SUCCESS = "Upload file successfully"

    FILE_EMPTY = "File is empty"

    GET_FLASHSALE_SUCCESS = "Get flash sale successfully"

    TIME_IN_PAST = "Không thể thiết đặt cho khung giờ quá khứ."

    PRODUCT_IS_EXISTING = "Product is already"

    PRODUCT_NOT_FOUND = "Product not found"

    UPDATE_FLASHSALE_SUCCESS = "Update flash sale successfully"
    NOT_ENOUGH_QUANTITY = "Not enough quantity"
    ERROR_PRICE = "Giá cũ phải lớn hơn hoặc bằng giá hiện tại"
    EMAIL_IS_EXIST = "Email đã được sử dụng"
}

module.exports = new Messages
