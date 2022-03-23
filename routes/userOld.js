
let {subjectTemplate,textTemplate,htmlTemplate} = require('../middleware/message');
const {verifyToken,getGoogleToken,signUserToken} = require("../middleware/auth");

const User = require('../controllers/User');
const SmtpSender = require('../middleware/smtp');

const express=require('express');
const router=express.Router();

router.get('/user/profile', verifyToken,async (req,res) =>{
  try{
    const usersFound=await new User().getProfileById(req.id)
    if(usersFound.length<=0)
      res.status(403).json({message:"User not found"});
    else  
      res.status(200).send({user:usersFound[0]});
  }
  catch (err) {
    console.log(err);
  }
});

router.post('/user/local/login', async (req,res)=>{
  try{
    const{email,password}=req.body;

    if (!(email && password)) 
      return res.status(400).json({message:'Provide email and password'}); 

    const userObj=new User();
    const usersFound=await userObj.authenticateLocal(email,password);
    if(usersFound.length<=0)
      return res.status(403).json({message:'User with specified email/password was not found'});
    
    const {user_id}=usersFound[0];
    const user=(await userObj.getProfileById(user_id))[0];
    const token=signUserToken(user.user_id,user.email)
    res.status(200).send({user:user,token:token});  
  }
  catch (err) {
    console.log(err);
  }
});


router.post('/user/google/login', getGoogleToken, async (req,res)=>{
  try{
    //console.log(req.access_token)
    //const{email,googleId}=req.body;
    /*const email='zarar123@hotmail.com';
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
      const token=userObj.signUserToken(user_id,email);
      res.status(200).send({access_token:token});
    }*/
  }
  catch (err) {
    console.log(err);
  }
});


router.post('/user/local/register', async(req,res)=>{
  try{
    const {userInfo,strategy}=req.body 

    if(!userInfo)
      return res.status(400).json({message:'User Information is missing'});
    
    const userObj=new User();
    if(await userObj.emailExists(userInfo.email))
      return res.status(409).json({message:'Email already exists'});

    //const newUserId=await userObj.createUser(userInfo,strategy)
    const newUserId=1
    const tokenExpiry='2 days';
    const token=signUserToken(newUserId,userInfo.email,tokenExpiry); 
    htmlTemplate=htmlTemplate.replace('[confirmLink]', `${process.env.USER_VERIFY_URL}/${token}`).replace('[tokenExpiry]',tokenExpiry);
    console.log(htmlTemplate);
  //userInfo.email
    const smtpObj=new SmtpSender('rnou112@aucklanduni.ac.nz',subjectTemplate,textTemplate,htmlTemplate);
    smtpObj.sendEmail();  //TBD response 202 need to be verified

    res.status(200).send('OK')
  }
  catch (err) {
    console.log(err);
  }
});


router.get('/user/types', async(req,res)=>{
  const userTypes=await new User().getTypes();
  res.status(200).send(userTypes);
});

router.get('/user/local/confirm', verifyToken, async(req,res)=>{
  const userObj=new User();
  if(!(await userObj.emailExists(req.email)))
    return res.status(400).json({message:'Invalid user '});

  res.status(200).send('OK');
});



router.delete('/api/delete/:id',(req,res)=>{
 
});


module.exports=router;
