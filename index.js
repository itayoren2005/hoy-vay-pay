const express = require("express");
const app = express();
const routes = require("./routes/index");
const connectDB = require("./lib/connect");

app.use(express.json());
app.use(routes);
app.listen(3000, () => {
  connectDB();
  console.log("Server is running on http://localhost:3000");
});
