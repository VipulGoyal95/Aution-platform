import express from 'express';
import { register, login, logout, getUserprofile } from '../controllers/userController.js';
import { isAuth } from '../middlewares/auth.js';
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",isAuth,logout);
router.get("/profile",isAuth,getUserprofile);
export default router;