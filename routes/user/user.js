const {verifyToken} = require('../../middleware/auth');
const User = require('../../controllers/User');

const express=require('express');
const router=express.Router();

router.get('/user/types', async(req,res)=>{
  const userTypes=await new User().getTypes();
  res.status(200).send(userTypes);
});

router.get('/user/profile', verifyToken, async (req,res) =>{ 
  try{
    if(req.tokenStatus!='valid')
      return res.status(401).json({message:"Authentication failed"});

    const usersFound=await new User().getProfileById(req.id)  
    if(usersFound.length<=0)
      return res.status(403).json({message:"User not found"});
    else  
      res.status(200).send({user:usersFound[0]});
  }
  catch (err) {
    console.log(err);
  }
});

router.post('/user/delete', verifyToken, async (req,res) =>{ 
  try{
    const{userId}=req.body;
    if(!userId)
      return res.status(404).json({message:'Incomplete data was provided.'});

    if(req.tokenStatus!='valid' || userId!=req.id)
      return res.status(401).json({message:"Authentication failed"});

    if(await new User().deleteUser(userId))
      res.status(200).send('OK')
    else
      return res.status(400).json({message:'Your request can not be authenticated. Try again.'});
  }
  catch (err) {
    console.log(err);
  }
});

module.exports=router;
