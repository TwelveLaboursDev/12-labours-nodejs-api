
const {getGoogleToken} = require('../../middleware/auth');

const User = require('../../controllers/User');

const express=require('express');
const router=express.Router();


router.post('/user/google/login', getGoogleToken, async (req,res)=>{ 
  try{
    //console.log(req.access_token)
    //const{email,googleId}=req.body;
    const email='zarar123@hotmail.com';
    const googleId='123-google-id'

    if (!(email && googleId)) {
      return res.status(400).send("Incomplete request.");
    }

    const userObj=new User();
    const usersFound=await userObj.authenticateGoogle(email,googleId);
    if(usersFound.length<=0){
      res.status(404).send("Unexpected error. Specified user does not exist.");
    }
    else{
      const {user_id}=usersFound[0];
      //const token='dummy token for '+ user_id;
      const token=userObj.signUserToken(user_id,email);  //signUserToken???
      res.status(200).send({access_token:token});
    }
  }
  catch (err) {
    console.log(err);
  }
});


/*
router.delete('/api/delete/:id',(req,res)=>{
 
});*/


module.exports=router;
