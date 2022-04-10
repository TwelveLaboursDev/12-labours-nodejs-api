const Institution = require('../controllers/Institution');

const express=require('express');
const router=express.Router();

router.get('/institutions',async (req,res)=>{
  try{
      const institutions=await new Institution().getAll();
      if(institutions.length<=0)
        res.status(403).send("Institutions data not found");
      else  
        res.status(200).send(institutions);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports=router;
