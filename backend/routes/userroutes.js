import express from 'express';
import { fetchLeaderboard, register, login, logout, getUserprofile } from '../controllers/userController.js';
import { isAuth } from '../middlewares/auth.js';
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/logout",isAuth,logout);
router.get("/me",isAuth,getUserprofile);
router.get("/leaderboard", fetchLeaderboard);

export default router;