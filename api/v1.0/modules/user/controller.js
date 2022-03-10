const util = require("util");
const con = require("../../../../config/database");
const message = require("../../../../constants/messages");
const query = util.promisify(con.query).bind(con);
const {
  encryptPassword,
  decryptPassword,
  generateAuthToken,
  generateOTP,
} = require("../common/functions");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const controller = {
  /**
   * USER REGISTRATION API
   * @param {fullName, emailAddress, mobileNumber, userPassword} req
   * @param {Response with success / fail to register user in DB} res
   * @returns
   */

  registerUser: async (req, res) => {
    try {
      const { fullName, emailAddress, mobileNumber, userPassword } =
        req.body.info;

      if (!fullName || !emailAddress || !userPassword) {
        return res.status(400).json({
          success: false,
          message: message.require,
        });
      }

      const sqlQuerySelect = `SELECT * FROM ms_users WHERE emailAddress= ?`;
      const getDetails = await query(sqlQuerySelect, [emailAddress]);

      if (getDetails.length > 0) {
        return res.status(400).json({
          success: false,
          message: message.duplicateEmail,
        });
      }

      if (getDetails.length == 0) {
        const encryptedPassword = await encryptPassword(userPassword);
        const sqlQuery = `INSERT INTO ms_users(fullName, emailAddress, userPassword, mobileNumber) VALUES (?, ?, ?, ?)`;
        const registrationDetails = await query(sqlQuery, [
          fullName,
          emailAddress,
          encryptedPassword,
          mobileNumber,
        ]);
        const token = await generateAuthToken(emailAddress);
        return res.status(200).json({
          success: true,
          message: message.register,
          token: token,
        });
      }
    } catch (error) {
      res.status(401).json({
        success: false,
        message: message.tryCatch,
      });
    }
  },

  /**
   * LOGIN USER API
   * @param {emailAddress, password} req
   * @param {Response with success / fail to login user} res
   * @returns
   */

  loginUser: async (req, res) => {
    console.log("Login user", req.body.info);
    try {
      const { emailAddress, password } = req.body.info;

      if (!emailAddress || !password) {
        return res.status(400).json({
          success: false,
          message: message.require,
        });
      }
      const sqlQuerySelect = `SELECT * FROM ms_users WHERE emailAddress= ?`;
      const getUserDetails = await query(sqlQuerySelect, [emailAddress]);
      if (getUserDetails.length == 0) {
        return res.status(400).json({
          success: false,
          message: message.noUser,
        });
      }

      if (getUserDetails.length > 0) {
        const {
          id,
          emailAddress,
          userPassword,
          fullName,
          mobileNumber,
          isAdmin,
          forgetPasswordOTP,
        } = getUserDetails[0];
        const decrypt = await decryptPassword(password, userPassword);
        console.log("Check Decrypt", decrypt);
        if (decrypt) {
          const token = await generateAuthToken(emailAddress);
          res.status(200).json({
            success: true,
            message: message.login,
            userDetails: {
              userId: id,
              name: fullName,
              email: emailAddress,
              mobile: mobileNumber,
              isAdmin: isAdmin,
            },
            token: token,
          });
        } else {
          res.status(400).json({
            success: false,
            message: message.incorrect,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({
        success: false,
        message: message.tryCatch,
      });
    }
  },

  /**
   * FORGET PASSWORD API
   * @param {mobileNumber} req
   * @param {Response with success / fail to user for sending OTP} res
   * @returns
   */

  forgetPasswordMobile: async (req, res) => {
    try {
      const { mobileNumber } = req.body.info;

      const selectQuery = `SELECT * FROM ms_users WHERE mobileNumber= ?`;

      const getUserDetails = await query(selectQuery, [mobileNumber]);

      if (getUserDetails.length == 0) {
        return res.status(401).json({
          success: false,
          message: "No Account is registered with this mobile number",
        });
      }

      if (getUserDetails.length > 0) {
        const sendOTP = await generateOTP(mobileNumber);
        if (sendOTP) {
          const userDetail = await query(
            "UPDATE ms_users SET forgetPasswordOTP = ? WHERE mobileNumber= ?",
            [sendOTP, mobileNumber]
          );
          res.status(200).json({
            success: true,
            message: `OTP: ${sendOTP} has been send to ${mobileNumber}`,
          });
        } else {
          res.status(401).json({
            success: false,
            message: "Error in sending OTP",
          });
        }
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
  },

  /**
   * RESET PASSWORD API
   * @param {mobileNumber, OTP, password, conformPassword} req
   * @param {Response with success / fail to user for changing password} res
   * @returns
   */

  resetPasswordMobile: async (req, res) => {
    try {
      const { mobileNumber, otp, password, conformPassword } = req.body.info;
      if (!password || !conformPassword) {
        return res.status(401).json({
          success: false,
          message: "Password and conform password required",
        });
      }
      if (password !== conformPassword) {
        return res.status(401).json({
          success: false,
          message: "Password and conform password does not matched",
        });
      }

      const selectQuery = `SELECT * FROM ms_users WHERE mobileNumber= ?`;
      const getUserDetails = await query(selectQuery, [mobileNumber]);

      if (getUserDetails.length == 0) {
        return res.status(401).json({
          success: false,
          message: "No user found with this mobile number",
        });
      }

      if (getUserDetails.length > 0) {
        const { forgetPasswordOTP } = getUserDetails[0];

        if (forgetPasswordOTP !== otp) {
          return res.status(401).json({
            success: false,
            message: "OTP does not matched",
          });
        }
        const newPassword = await encryptPassword(password);

        const updateQuery = `UPDATE ms_users SET userPassword= ? WHERE mobileNumber= ?`;
        const userDetail = await query(updateQuery, [
          newPassword,
          mobileNumber,
        ]);
        res.status(200).send({
          success: true,
          message: "Password updated successfully",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
  },

  getDashboard: async (req, res) => {
    const { token } = req.body.info;
    res.status(200).send(token);
  },
};

module.exports = controller;
