import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database.js";
import userRoute from "./routes/userRoutes.js";
import instrumentRoute from "./routes/instrumentRoutes.js";
import loanRoute from "./routes/loanRoutes.js";
import returnRoute from "./routes/returnRoutes.js";
import fineRoute from "./routes/fineRoutes.js";
import paymentRoute from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT

app.use(cors());
app.use(express.json());

connectDB(); 

app.use("/api/users", userRoute);
app.use("/api/instruments", instrumentRoute);
app.use("/api/loans", loanRoute);
app.use("/api/returns", returnRoute);
app.use("/api/fines", fineRoute);
app.use("/api/payments", paymentRoute);

app.listen(port, ()=> {
    console.log(`Server up and running on port ${port}`)
});