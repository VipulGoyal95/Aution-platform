const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { connection } = require('./db/connection.js');
require('dotenv').config();
const userroute = require("./routes/userroutes.js");
const errorMiddleware  = require('./middlewares/error.js');
const cloudinary = require('cloudinary');
const auctionItemRoute = require("./routes/auctionItemRoutes.js");
const bidRoute = require("./routes/bidRoute.js");
const commissionRoute = require("./routes/commissionRoute.js");
const superAdminRoutes = require("./routes/superAdminRoutes.js");

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
app.use("/api/v1/user",userroute)
app.use("/api/v1/auctionitem",auctionItemRoute)
app.use("/api/v1/bid",bidRoute);
app.use("/api/v1/commission",commissionRoute);
app.use("/api/v1/superadmin",superAdminRoutes);

app.use(errorMiddleware);


connection();
app.listen(process.env.PORT,()=>{
    console.log(`listening on http://localhost:${process.env.PORT}`);
})
