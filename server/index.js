const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const router = require("./routes/index");
const cookiesParser = require("cookie-parser");
const { app, server } = require("./socket/index");

// const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookiesParser());

app.get("/", (req, res) => {
  res.json({
    message: "Server running at " + PORT,
  });
});

// router
app.use("/api", router);

connectDB().then(() => {
  server.listen(process.env.PORT || 8080, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
