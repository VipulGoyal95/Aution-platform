const express = require('express');
const {register,login,logout,getUserprofile}  = require('../controllers/userController');
const {isAuth} = require('../middlewares/auth')
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",isAuth,logout);
router.get("/profile",isAuth,getUserprofile);
module.exports = router;