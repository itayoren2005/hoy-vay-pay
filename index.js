const express = require("express");
const routes = require("./routes/index");
const connectDB = require("./lib/connect");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.listen(3000, () => {
  connectDB();
  console.log("Server is running on http://localhost:3000");
});
