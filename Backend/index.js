const express=require("express");
const dotEnv=require("dotenv");
const port =process.env.PORT || 5000;
const app=express();
const bodyParser=require("body-parser");
const cors = require('cors');
const tickerRoute = require('./Routes/tickerRouter');
dotEnv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());





app.use("/tickerSME",tickerRoute)
app.listen(port,()=>{
    console.log('Server started and running at '+port);
})
app.use("/",(req,res)=>{
    res.send("<h1>Welcome to Real-Time StockData Analyzer</h1>");
})
