const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

//! config using app
app.use(
  cors({
    origin: "*",
    exposedHeaders: "content-length",
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Accept-Encoding",
      "Accept-Language",
      "Host",
      "Referer",
      "User-Agent",
      "X-CSRF-Token",
    ],
    maxAge: 86400,
    preflightContinue: false,
  })
);
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
dotenv.config();

//! router
const authRouter = require("./routes/auth");
const placeRouter = require("./routes/place");
const tripRouter = require("./routes/trip");
const favoriteRouter = require("./routes/favorite");
const dayRouter = require("./routes/day");
const attractionRouter = require("./routes/attraction");
const budgetExpenseRouter = require("./routes/budget-expense");
const memoryRouter = require("./routes/memory");

//! Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

//! connect Database
connectDB();

//! use Router
app.use("/api/user", authRouter);
app.use("/api/place", placeRouter);
app.use("/api/trip", tripRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/day", dayRouter);
app.use("/api/attraction", attractionRouter);
app.use("/api/budget-expense", budgetExpenseRouter);
app.use("/api/memory", memoryRouter);

//! app listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
