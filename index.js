require("dotenv").config();
require("./config/database");
const app = require("./app");

app.listen(process.env.PORT, (req, res) =>
  console.log(`App listing on port: ${process.env.PORT}`)
);
