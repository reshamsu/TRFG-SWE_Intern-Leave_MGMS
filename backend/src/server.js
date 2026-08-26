// import express from "express";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();
const port = 8000;

// app.get("/", (req, res) => {
//   res.send("Hello, Welcome to Express.js World!");
// });


app.listen(port, () => {
  console.log(`Your app is running on localhost:${port}`);
});
