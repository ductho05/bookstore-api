const isDeploy = false

class Constants {
    TOKEN_KEY = 'ductho2002';
    deploy = isDeploy
    // local
      // urlapi = "https://bookstore-ta-v3.onrender.com/bookstore/api/v1"
    // deloy
    urlapi = !isDeploy ? "http://127.0.0.1:3000/bookstore/api/v1" :  "https://bookstore-ta-v3.onrender.com/bookstore/api/v1"

    // local
    urlui = !isDeploy ? "http://localhost:3456" : "https://bookstore-ta.vercel.app"
    // deloy111
    // urlui = "https://bookstore-ta.vercel.app"

    ExpiresIn = "2h"

    mailSender = "fahashashopclone@gmail.com"
    mailPassword = "woycibkntohskmnz"

    superAdminCode = "superadmin1811"

    flashSaleImage = 'https://img.freepik.com/free-vector/special-flash-sale-modern-banner-design-vector-illustration_1017-38337.jpg'
}

module.exports = new Constants
