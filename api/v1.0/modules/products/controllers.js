const message = require("../../../../constants/messages");
const con = require("../../../../config/database");
const util = require("util");
const query = util.promisify(con.query).bind(con);
const cloudinary = require("cloudinary").v2;

const controller = {
  getAllProducts: async (req, res) => {
    try {
      const selectQuery = `SELECT * FROM ms_product`;
      const products = await query(selectQuery);

      if (!products) {
        res.status(401).json({
          status: false,
          message: "Error in fetching products from DB",
        });
      }
      res.status(200).json({
        success: true,
        message: "Products available",
        data: products,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: message.tryCatch,
      });
    }
  },

  createProduct: async (req, res) => {
    const {
      productId,
      categoryId,
      productName,
      productDescription,
      productPrice,
      productQuantity,
      discountInPercent,
      displayOrder,
    } = req.body.info;
    let imageResults = [];
    let result;
    try {
      if (!productId || !categoryId) {
        return res.status(401).json({
          success: false,
          message: "Id missing for Product or Category",
        });
      }
      if (!productName || !productPrice || !productQuantity) {
        return res.status(401).json({
          success: false,
          message: "Please provide all details",
        });
      }
      if (req.files) {
        let productImages = req.files.productImages;
        for (let index = 0; index < productImages.length; index++) {
          const element = productImages[index];
          result = await cloudinary.uploader.upload(element.tempFilePath, {
            folder: "mystores/categories",
          });
          if (result) {
            imageResults.push(result);
          }
        }
      }
    } catch (error) {
      res.status(401).json({
        success: false,
        message: message.tryCatch,
      });
    }
  },
};

module.exports = controller;
