const express = require('express');
const { isAuth, isAuthorised } = require('../middlewares/auth');
const placebid = require('../controllers/bidcontroller');
const checkAuctionEndtime = require("../middlewares/checkAuctionEndtime");
const router = express.Router();

router.post("/place/:id",isAuth,isAuthorised("Bidder"),checkAuctionEndtime,placebid);

module.exports = router;