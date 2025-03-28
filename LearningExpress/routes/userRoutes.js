const express=require('express')
const authController = require('../controllers/authController')
const router=express.Router();

const {signUp,login,getAllUsers}=authController

router.post('/signup',signUp);
router.post('/login',login)
router.get('/',getAllUsers);



module.exports=router;