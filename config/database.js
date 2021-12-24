const mysql = require("mysql");
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

const con = mysql.createPool({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
});

con.getConnection(function (error) {
  if (error) throw error;
  console.log("DB Connected");
});

module.exports = con;
