const express=require("express");
const dotEnv=require("dotenv");
const port =process.env.PORT || 5000;
const app=express();
const bodyParser=require("body-parser");
const cors = require('cors');
const tickerRoute = require('./Routes/tickerRouter');
const cors = require('cors');
app.use(cors());
dotEnv.config();

app.use(bodyParser.json());
app.use(express.json());
const logger=require("./Middleware/logger");
app.use(logger);


app.use("/tickerSME",tickerRoute);
app.use("/tickerRSI",tickerRoute);

app.listen(port,()=>{
    console.log('Server started and running at '+port);
})
app.use("/",(req,res)=>{
    res.send("<h1>Welcome to Real-Time StockData Analyzer</h1>");
})
