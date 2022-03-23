const Hospital = require('../controllers/Hospital');

const express=require('express');
const router=express.Router();

router.get('/hospitals',async (req,res)=>{
  try{
      const hospitals=await new Hospital().getAll();
      if(hospitals.length<=0)
        res.status(403).send("Hospitals data not found");
      else  
        res.status(200).send(hospitals);
  }
  catch (err) {
    console.log(err);
  }
});

module.exports=router;
