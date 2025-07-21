import express from 'express';
import { isAuth, isAuthorised } from '../middlewares/auth.js';
import placebid from '../controllers/bidcontroller.js';
import checkAuctionEndtime from "../middlewares/checkAuctionEndtime.js";
const router = express.Router();

router.post("/place/:id",isAuth,isAuthorised("Bidder"),checkAuctionEndtime,placebid);

export default router;