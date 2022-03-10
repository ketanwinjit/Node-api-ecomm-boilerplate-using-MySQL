const util = require("util");
const con = require("../../../../config/database");
const query = util.promisify(con.query).bind(con);
const cloudinary = require("cloudinary").v2;
const req = require("express/lib/request");
const message = require("../../../../constants/messages");

const controller = {
  createCategory: async (req, res) => {
    console.log("req.body", req.body);
    console.log("req.files", req.files);
    try {
      let result;
      const { categoryName } = req.body;

      if (!categoryName) {
        return res.status(400).json({
          success: false,
          message: "Category Name Required",
        });
      }

      if (req.files) {
        let file = req.files.categoryImage;
        console.log("Check TEMP FILE Path", file);
        result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "mystores/categories", // Floder name under cloudinary
        });
      }
      console.log("Image Upload Result", result);
      const insertQuery = `INSERT INTO ms_category (categoryName, categoryImage, public_id) VALUES (?, ?, ?)`;
      const insertCategory = await query(insertQuery, [
        categoryName,
        result.secure_url,
        result.public_id,
      ]);
      if (insertCategory) {
        res.status(200).json({
          success: true,
          message: "Category Added Successfully",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong in inserting category into DB",
      });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const selectQuery = `SELECT * from ms_category`;
      const categoriesData = await query(selectQuery);

      if (!categoriesData) {
        res.status(401).json({
          success: false,
          message: "Something went wrong",
        });
      }

      res.status(200).json({
        success: true,
        message: "Categories available",
        data: categoriesData,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: message.tryCatch,
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id, public_id } = req.body;
      let result;
      if (public_id) {
        result = await cloudinary.uploader.destroy(public_id, (results) => {
          console.log("Delete Image Result", results);
        });
      }
      const selectQuery = `DELETE FROM ms_category WHERE id=? `;
      const deletedCategory = await query(selectQuery, [id]);
      console.log("Check delete category", deletedCategory);
      res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
      });
    } catch (error) {
      console.log("TRY", error);
      res.status(401).json({
        success: false,
        message: message.tryCatch,
      });
    }
  },

  editCategory: async (req, res) => {
    console.log("EDIT Category Call", req.params.id, req.body.categoryName);
    try {
      let result;
      const { id } = req.params;
      const { categoryName } = req.body;

      const selectQuery = `SELECT * FROM ms_category WHERE id=? `;
      const getCategory = await query(selectQuery, [id]);

      if (getCategory.length === 0) {
        res.status(401).json({
          success: false,
          message: "No Category available with this id",
        });
      }
      if (getCategory.length > 0) {
        // let existing_img_publicId = getCategory[0].public_id;
        // if (existing_img_publicId) {
        //   await cloudinary.uploader.destroy(
        //     existing_img_publicId,
        //     (results) => {
        //       console.log("Delete Image Result", results);
        //     }
        //   );
        // }

        if (req.files) {
          let file = req.files.categoryImage;
          console.log("Check TEMP FILE Path", file);
          result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "mystores/categories", // Floder name under cloudinary
          });
        }

        const insertQuery = `UPDATE ms_category SET categoryName=?, categoryImage=?, public_id=? WHERE id=?`;
        const updateCategory = await query(insertQuery, [
          categoryName,
          result.secure_url,
          result.public_id,
          id,
        ]);

        console.log("UPDATE QUERY", updateCategory);
        res.status(200).json({
          success: true,
          data: updateCategory,
          message: "Category Updated",
        });
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
