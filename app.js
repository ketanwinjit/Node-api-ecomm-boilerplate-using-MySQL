const express = require("express");
const app = express();
const api = require("./api");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const corsOptions = {
  origin: "*",
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  // allowedHeaders: ["Content-Type", "x-auth-token"],
  exposedHeaders: ["x-auth-token"],
};
// TO set ejs
app.set("view engine", "ejs");
/**
 * MIDDLEWARE
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //* IMPORTANT TO UPLOAD IMAGE
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);
app.use(cors(corsOptions));

app.use("/api", api);

module.exports = app;
