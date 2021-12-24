const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_TOKEN_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const functions = {
  encryptPassword: async (password) => {
    return await bcrypt.hash(password, 10);
  },

  decryptPassword: async (password, userPassword) => {
    console.log(userPassword);
    return await bcrypt.compare(password, userPassword);
  },

  generateAuthToken: async (email) => {
    const token = jwt.sign({ email: email }, SECRET_TOKEN_KEY, {
      expiresIn: "3h",
    });
    return token;
  },

  generateOTP: async (mobilenumber) => {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    await client.messages.create({
      body: `Your OTP to reset password is : ${OTP}`,
      from: "+16189364237",
      to: mobilenumber,
    });
    return OTP;
  },
};

module.exports = functions;
