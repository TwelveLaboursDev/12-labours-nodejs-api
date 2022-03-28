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
    if(req.tokenStatus=='expired')
      return res.status(401).json({message:"Token expired"});

    const user=await new User().getProfileById(req.idFromToken)  
    if(user)
      return res.status(200).send({user:user});
    else  
      return res.status(403).json({message:"User not found"});
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

    if(req.tokenStatus=='expired' || userId!=req.idFromToken)
      return res.status(401).json({message:"Authentication failed"});

    if(await new User().deleteUser(userId))
      res.status(200).send('OK')
    else
      return res.status(400).json({message:'Your request can not be completed. Try again.'});
  }
  catch (err) {
    console.log(err);
  }
});

async function addNewUser (req, res, next)  {
  try{
    const {userInfo,strategy}=req.body 
    
    if(!userInfo || !userInfo.email || !userInfo.firstName || !userInfo.lastName || !userInfo.title)
      return res.status(400).json({message:'User Information is missing'});
    
    const userObj=new User();
    if(await userObj.emailExists(userInfo.email)){
      return res.status(409).json({message:'Email already exists'});
    }

    const newUserId=await userObj.createUser(userInfo,strategy)
    if(!newUserId)
      return res.status(404).json({message:'An error occured while creating user. Try again.'});

    req.newUserId=newUserId;
    next();
  }
  catch(err){
    console.log(err)
  }
};


module.exports = { 
  router:router,
  addNewUser:addNewUser
}

