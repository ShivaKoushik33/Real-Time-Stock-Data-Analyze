const mongoose=require("mongoose");
const tickerSchema=new mongoose.Schema({
    ticker:{
        type:String,
    }
})
const Ticker=mongoose.model("Ticker",tickerSchema);
module.exports=Ticker;