const express=require('express')
const authController = require('../controllers/authController')
const router=express.Router();

const {signUp}=authController

router.post('/signup',signUp);

module.exports=router;