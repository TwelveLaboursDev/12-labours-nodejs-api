const Dhb = require('../controllers/Dhb');

const express=require('express');
const router=express.Router();

router.get('/dhbs',async (req,res)=>{
  try{
    const dhbObject=new Dhb();
    const dhbsNorth=await dhbObject.getNorth();
    const dhbsSouth=await dhbObject.getSouth();

    if(dhbsNorth.length<=0 || dhbsSouth.length<=0)
      res.status(403).send("Dhbs data not found");
    else {
      const dhbs=[{"label": "North Island","options":dhbsNorth},{"label": "South Island","options":dhbsSouth}]
      res.status(200).send(dhbs);
    }
  }
  catch (err) {
    console.log(err);
  }
});

module.exports=router;
