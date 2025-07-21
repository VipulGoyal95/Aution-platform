import express from 'express';
import { isAuth, isAuthorised } from "../middlewares/auth.js";
import { removefromAuction, getAllpaymentproofs, getpaymentproofDetail, updateproofStatus, deletePaymentproof, fetchAllusers } from '../controllers/superadmincontroller.js';
const router = express.Router();

router.delete("/auctionitem/delete/:id",isAuth,isAuthorised("Super Admin"),removefromAuction);

router.get("/paymentproofs/getall",isAuth,isAuthorised("Super Admin"),getAllpaymentproofs);

router.get("/paymentproof/:id",isAuth,isAuthorised("Super Admin"),getpaymentproofDetail);

router.put("/paymentproof/status/update/:id",isAuth,isAuthorised("Super Admin"),updateproofStatus);

router.delete("/paymentproof/delete/:id",isAuth,isAuthorised("Super Admin"),deletePaymentproof);

router.get("/users/getall",isAuth,isAuthorised("Super Admin"),fetchAllusers)

export default router;