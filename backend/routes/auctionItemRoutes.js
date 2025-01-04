const { addnewAuction } = require("../controllers/auctioncontroller");
const isAuth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

router.post("/create", isAuth,addnewAuction);

module.exports = router;

