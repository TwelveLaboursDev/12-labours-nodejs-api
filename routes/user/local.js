
let {subjectTemplate,textTemplate,htmlTemplate} = require('../../middleware/message');
const {verifyToken,signUserToken} = require("../../middleware/auth");

const User = require('../../controllers/User');
const SmtpSender = require('../../middleware/smtp');

const express=require('express');
const router=express.Router();


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
    const token=signUserToken(user.user_id,user.email);
    //console.log(token);
    res.status(200).send({user:user,access_token:token});  
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
    if(await userObj.localUserExists(userInfo.email))
      return res.status(409).json({message:'Email already exists'});

    const newUserId=await userObj.createUser(userInfo,strategy)
    const sendStatus=await askToConfirm(newUserId,userInfo.email)
 
    res.status(200).send({email:userInfo.email,emailSent:sendStatus})
  }
  catch (err) {
    console.log(err);
  }
});


router.post('/user/local/confirm' , verifyToken,async(req,res)=>{
  
  const {email,id,tokenStatus}=req;

  const userObj=await new User();
  const user=await userObj.localUserExists(email);

  if(!user || user.user_id!=id)
    return res.status(400).json({message:'Invalid user, please register a new account.'});

  if(user.is_active){
    return res.status(200).send('OK')
  }
  else{   
    if(tokenStatus==='expired'){
      const sendStatus=await askToConfirm(id,email);
      sendStatus? 
        res.status(400).json({message:'Your verification has expired. A new email with confirmation link has been sent to your inbox.'})
        :
        res.status(400).json({message:'Unexpected error occured. Try again later.'})
      return;
    }
    else{
      if(await userObj.activateLocal(id))
        res.status(200).send('OK') 
      else
        return res.status(400).json({message:'Unexpected error occured. Try again later.'})
    }
  }
});


router.post('/user/local/email' ,async(req,res)=>{
  try{
    const{email}=req.body;
    if(!email)
      return res.status(404).json({message:'Email not provided'});

    const user=await new User().localUserExists(email);
    if(!user)
      return res.status(400).json({message:'Invalid user, please register a new account.'});
 
    if(user.is_active){
      res.status(200).send({alreadyActive:true})
    }
    else{  
      const sendStatus=await askToConfirm(user.user_id,email);
      res.status(200).send({emailSent:sendStatus,email:email});
    }
  }
  catch(err){
    console.log(err)
  }
});

router.post('/user/local/password', verifyToken, async(req,res)=>{
  try{
    const{userId, newPassword, oldPassword}=req.body;

    if(!userId || !newPassword || !oldPassword)
      return res.status(404).json({message:'Incomplete data was provided.'});

    if(req.tokenStatus!='valid' || userId!=req.id)
      return res.status(401).json({message:"Authentication failed"});

    if(await new User().changePassword(userId,oldPassword,newPassword))
      res.status(200).send('OK')
    else
      return res.status(400).json({message:'Your request can not be authenticated. Try again.'});
  }
  catch(err){
    console.log(err)
  }
});

async function askToConfirm(userId,userEmail){
  try{
    const tokenExpiry='2 days';   //'2 days'
    const token=signUserToken(userId,userEmail,tokenExpiry); 
    htmlTemplate=htmlTemplate.replace('[confirmLink]', `${process.env.USER_VERIFY_URL}/${token}`).replace('[tokenExpiry]',tokenExpiry);
    const smtpObj=new SmtpSender(userEmail,subjectTemplate,textTemplate,htmlTemplate);
    return  await smtpObj.sendEmail();
  }
  catch(err){
    console.log(err)
  }
}

module.exports=router;
