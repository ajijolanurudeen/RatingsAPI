console.log("Current working directory:", process.cwd());
require("dotenv").config();
console.log("Loaded ENV user:", process.env.PG_USER);
const mysql = require("mysql2")


const pool = mysql.createPool({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    // port: process.env.PG_PORT,
    database:process.env.PG_DATABASE,
    host: process.env.PG_HOST
})
pool.getConnection((err, connection) => {
  if (err) console.error('MySQL connection failed:', err.message);
  else console.log('MySQL connected');
  connection.release();
});


const promisePool = pool.promise();

module.exports = promisePool;