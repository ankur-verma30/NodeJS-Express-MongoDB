const express=require('express')
const authController = require('../controllers/authController')
const userController=require('../controllers/userController');
const router=express.Router();

const {signUp,login,forgotPassword,resetPassword,protect,updatePassword}=authController

const {getAllUsers,updateMe,deleteMe}=userController


router.post('/signup',signUp);
router.post('/login',login)
router.get('/',getAllUsers);
router.post('/forgot-password',forgotPassword);
router.patch('/reset-password/:token',resetPassword);
router.patch('/update-my-password',protect,updatePassword);
router.patch('/update-me',protect,updateMe);
router.delete('/delete-me',protect,deleteMe);



module.exports=router;