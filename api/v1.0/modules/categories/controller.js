const util = require("util");
const con = require("../../../../config/database");
const query = util.promisify(con.query).bind(con);

const controller = {
  createCategory: async (req, res) => {
    try {
      const { categoryName } = req.body.info;

      if (!categoryName) {
        return res.status(400).json({
          success: false,
          message: "Category Name Required",
        });
      }

      const insertQuery = `INSERT INTO ms_category (categoryName) VALUES (?)`;
      const insertCategory = await query(insertQuery, [categoryName]);

      res.status(200).json({
        success: true,
        message: "Category Added Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong in inserting category into DB",
      });
    }
  },
};

module.exports = controller;
