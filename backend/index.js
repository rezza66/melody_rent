import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database.js";
import passport from "passport";
import path from "path";
import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoutes.js";
import instrumentRoute from "./routes/instrumentRoutes.js";
import categoriesRoute from "./routes/categoryRoutes.js"
import loanRoute from "./routes/loanRoutes.js";
import returnRoute from "./routes/returnRoutes.js";
import fineRoute from "./routes/fineRoutes.js";
import paymentRoute from "./routes/paymentRoutes.js";
import configurePassport from "./config/passport.js";

dotenv.config();

const app = express();
const port = process.env.PORT

app.use(cors());
app.use(express.json());

connectDB(); 

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

configurePassport();
app.use(passport.initialize());

app.use("/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/instruments", instrumentRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/loans", loanRoute);
app.use("/api/returns", returnRoute);
app.use("/api/fines", fineRoute);
app.use("/api/payments", paymentRoute);

app.listen(port, ()=> {
    console.log(`Server up and running on port ${port}`)
});