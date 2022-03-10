const util = require("util");
const jwt = require("jsonwebtoken");
const con = require("../config/database");
const query = util.promisify(con.query).bind(con);
const moment = require("moment");

const auth = {
  /**
   * VERIFY TOKEN MIDDLEWARE
   * @param {token} req
   * @param {Response with success/fail for verify token} res
   * @param {*} next
   * @returns
   */
  verifyToken: async (req, res, next) => {
    console.log("Token", req.body);
    console.log("Token HEADER", req.header("Authorization"));
    const token =
      req.body.token || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      const decode = await jwt.verify(token, process.env.SECRET_TOKEN_KEY);
      console.log("Check token match", decode);
      if (decode.exp) {
        let date = moment(decode.iat).format("DD-MM-YYYY");
        console.log(date);
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    return next();
  },

  isAdmin: async (req, res, next) => {
    console.log("Admin", req.body);
    try {
      const userId = req.body.userId || req.body.info.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User id required",
        });
      }

      const selectQuery = `SELECT * FROM ms_users WHERE id= ? `;
      const getDetails = await query(selectQuery, [userId]);

      if (getDetails.length == 0) {
        return res.status(401).json({
          success: false,
          message: "No user found with this user id",
        });
      }

      if (getDetails.length > 0) {
        const { isAdmin } = getDetails[0];

        if (isAdmin == 0) {
          return res.status(401).json({
            success: false,
            message: "You are not an Admin, Access Denied.",
          });
        }
      }
      return next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Something went wrong.",
      });
    }
  },
};

module.exports = auth;
