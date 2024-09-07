const express=require("express");
const {analyzeStock}=require("../Controllers/tickerController");
const router = express.Router();


router.post('/result',analyzeStock);
// router.post('/result',async (req,res)=>{
//     try{
//         const result=await analyzeStock(req);
//         res.json(result);
//     }
//     catch(error){
//         res.status(500).json({error:error.message});
//     }
// } );


module.exports=router