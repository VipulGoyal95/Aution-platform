import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { connection } from './db/connection.js';
import dotenv from 'dotenv';
import userroute from "./routes/userroutes.js";
import errorMiddleware from './middlewares/error.js';
import cloudinary from 'cloudinary';
import auctionItemRoute from "./routes/auctionItemRoutes.js";
import bidRoute from "./routes/bidRoute.js";
import commissionRoute from "./routes/commissionRoute.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";

dotenv.config();
app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["POST", "GET", "PUT", "DELETE"],
      credentials: true,
    })
  );

const app=express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));
cloudinary.v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.get("/",(req,res)=>{
    res.send("server is running");
})

app.use("/api/v1/user",userroute)
app.use("/api/v1/auctionitem",auctionItemRoute)
app.use("/api/v1/bid",bidRoute);
app.use("/api/v1/commission",commissionRoute);
app.use("/api/v1/superadmin",superAdminRoutes);

app.use(errorMiddleware);

endedAuctionCron();
verifyCommissionCron();
connection();

app.listen(process.env.PORT,()=>{
    console.log(`listening on http://localhost:${process.env.PORT}`);
})
