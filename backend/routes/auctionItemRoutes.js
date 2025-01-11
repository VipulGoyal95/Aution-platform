const { addnewAuction, getAllItem, getAuctionDetails, removefromAuction, republishItem, getMyAuctionItems } = require("../controllers/auctioncontroller");
const {isAuth,isAuthorised} = require("../middlewares/auth");
const trackunpaidcommission = require("../middlewares/trackunpaidcommission");
const express = require("express");
const router = express.Router();

router.post("/create", isAuth,isAuthorised("Auctioneer"),trackunpaidcommission,addnewAuction);
router.get("/allitems",getAllItem);
router.get("/auction/:id",isAuth,getAuctionDetails);
router.get("/myitems",isAuth,isAuthorised("Auctioneer"), getMyAuctionItems);
router.delete("/delete/:id",isAuth,isAuthorised("Auctioneer"),removefromAuction);
router.put("/item/republish/:id",isAuth,isAuthorised("Auctioneer"),republishItem);
module.exports = router;

