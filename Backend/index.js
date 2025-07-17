const express=require("express");
const dotEnv=require("dotenv");
const port =process.env.PORT || 5000;
const app=express();
const bodyParser=require("body-parser");
const tickerRoute = require('./Routes/tickerRouter');
const cors = require('cors');
dotEnv.config();
const corsOptions={
    origin:[
        "http://localhost:5173",
        "https://real-time-stock-data-analyze.vercel.app",
    ],
    credential:true,

}
app.use(cors());


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
    res.send("<h1>Welcome to Real-Time StockData Analyzer.Get in to experience</h1>");
})
