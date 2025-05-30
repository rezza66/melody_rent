import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database.js";
import passport from "passport";
import path from "path";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoutes.js";
import instrumentRoute from "./routes/instrumentRoutes.js";
import categoriesRoute from "./routes/categoryRoutes.js";
import loanRoute from "./routes/loanRoutes.js";
import returnRoute from "./routes/returnRoutes.js";
import fineRoute from "./routes/fineRoutes.js";
import paymentRoute from "./routes/paymentRoutes.js";

import configurePassport from "./config/passport.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

configurePassport();
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Welcome to the backend");
});

const app1Router = express.Router();

app1Router.use("/auth", authRoute);
app1Router.use("/api/users", userRoute);
app1Router.use("/api/instruments", instrumentRoute);
app1Router.use("/api/categories", categoriesRoute);
app1Router.use("/api/loans", loanRoute);
app1Router.use("/api/returns", returnRoute);
app1Router.use("/api/fines", fineRoute);
app1Router.use("/api/payments", paymentRoute);

app.use("/app1", app1Router);

app.listen(port, () => {
  console.log(`Server up and running on port ${port}`);
});
