const express = require("express")
const router = express.Router()
const productController = require("../controllers/ProductControllers")
const upload = require("../config/cloudinary")

router.get("/", productController.getAllProduct)
router.get("/count_product", productController.getCountProduct)
router.get("/id/:id", productController.getProductById)
router.get("/title/:title", productController.getProductByName)
router.get("/author/:author", productController.getProductByAuthor)
router.get("/published_date/:start/:end", productController.getProductByYear)
router.post("/category", productController.getProductByCategory)
router.get("/new/:num", productController.getNewProduct)
router.get("/sale/:num", productController.getLowestProduct)
router.get("/bestseller/:num", productController.getBestSellerProduct)
router.get("/price/:start/:end/:sort", productController.getProductByPrice)
router.get("/textbooks", productController.getProductByCategoryName)
router.post("/add", productController.addProduct)
router.put("/update/:id", upload.single('images'), productController.updateProduct)
router.get("/delete/:id", productController.deleteProduct)
router.get("/bestseller-limit", productController.getProductBestSellerLimit)



module.exports = router
