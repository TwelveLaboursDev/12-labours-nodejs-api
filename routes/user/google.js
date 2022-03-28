
const {getGoogleToken,signUserToken} = require('../../middleware/auth');
const addNewUser=require('./user').addNewUser;
const User = require('../../controllers/User');

const express=require('express');
const router=express.Router();


router.post('/user/google/login', getGoogleToken, async (req,res)=>{ 
  try{     
    const{email,googleId}=req.googleProfile;

    const userObj=new User();
    const userFound=await userObj.authenticateGoogle(email,googleId);
    if(userFound){
      const user=await userObj.getProfileById(userFound.user_id);
      const token=signUserToken(user.user_id,user.email); 
      res.status(200).send({user:user,access_token:token});  
    }
    else{
      res.status(200).send({createAccount:true,googleProfile:req.googleProfile});
    }
  }
  catch (err) {
    console.log(err);
  }
});

router.post('/user/google/register', addNewUser, async(req,res)=>{
  try{
    const userId=req.newUserId;
    const user=await new User().getProfileById(userId);
    const token=signUserToken(user.user_id,user.email); 
    res.status(200).send({user:user,access_token:token});    
  }
  catch (err) {
    console.log(err)
    return res.status(404).json({message:'An error occured while creating user. Try again.'});
  }
});


router.delete('/user/google/delete',(req,res)=>{
  //revokeGoogleAccount();
});


module.exports=router;
