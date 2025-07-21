import { addnewAuction, getAllItem, getAuctionDetails, removefromAuction, republishItem, getMyAuctionItems } from "../controllers/auctioncontroller.js";
import { isAuth, isAuthorised } from "../middlewares/auth.js";
import trackunpaidcommission from "../middlewares/trackunpaidcommission.js";
import express from "express";
const router = express.Router();

router.post("/create", isAuth,isAuthorised("Auctioneer"),trackunpaidcommission,addnewAuction);
router.get("/allitems",getAllItem);
router.get("/auction/:id",isAuth,getAuctionDetails);
router.get("/myitems",isAuth,isAuthorised("Auctioneer"), getMyAuctionItems);
router.delete("/delete/:id",isAuth,isAuthorised("Auctioneer"),removefromAuction);
router.put("/item/republish/:id",isAuth,isAuthorised("Auctioneer"),republishItem);
export default router;

