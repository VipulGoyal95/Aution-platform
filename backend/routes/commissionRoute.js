const express = require('express');
const {isAuth,isAuthorised} = require("../middlewares/auth");
const proofofcommission = require('../controllers/commissioncontroller');

const router = express.Router();

router.post("/proof",isAuth,isAuthorised("Auctioneer"),proofofcommission);

module.exports = router