import express from 'express';
import { isAuth, isAuthorised } from "../middlewares/auth.js";
import {proofofcommission} from '../controllers/commissioncontroller.js';

const router = express.Router();

router.post("/proof",isAuth,isAuthorised("Auctioneer"),proofofcommission);

export default router;