const util = require("util");
const jwt = require("jsonwebtoken");
const con = require("../config/database");
const query = util.promisify(con.query).bind(con);

const auth = {
  /**
   * VERIFY TOKEN MIDDLEWARE
   * @param {token} req
   * @param {Response with success/fail for verify token} res
   * @param {*} next
   * @returns
   */
  verifyToken: (req, res, next) => {
    const { token } = req.body.info;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
      console.log("Check token match", decode);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    return next();
  },

  isAdmin: async (req, res, next) => {
    try {
      const { mobileNumber } = req.body.info;
      if (!mobileNumber) {
        return res.status(401).json({
          success: false,
          message: "Mobile number required",
        });
      }

      const selectQuery = `SELECT * FROM ms_users WHERE mobileNumber= ? `;
      const getDetails = await query(selectQuery, [mobileNumber]);

      if (getDetails.length == 0) {
        return res.status(401).json({
          success: false,
          message: "No user found with this mobile number",
        });
      }

      if (getDetails.length > 0) {
        const { isAdmin } = getDetails[0];

        if (isAdmin == 0) {
          return res.status(401).json({
            success: false,
            message: "You are unauthorised to create category",
          });
        }
      }
      return next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  },
};

module.exports = auth;
