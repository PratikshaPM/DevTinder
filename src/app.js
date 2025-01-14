const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Test page 1");
});

app.use("/", (req, res) => {
  res.send("Home page");
});

app.listen(3000, () => {
  console.log("started listening on port 3000");
});
