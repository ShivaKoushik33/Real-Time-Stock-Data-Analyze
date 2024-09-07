const tickerModel=require('../Models/tickerModel');
// const yahooFinance = require('yahoo-finance');
const yfinance=require("yfinance")
const {spawn}=require("child_process");
const  path  = require('path');

// const analyzeStock=async(req,res)=>{
//     const {ticker}=req.body;
//     if(!ticker){
//         res.status(400).json({error:"Ticker is required"});
//     }
//     try{
//         const data = await yfinance.getHistorical({
//             symbol: ticker,
//             from: '2023-08-01',
//             to: '2024-08-05'
//           });
//         const df=data.data
//         const dfAverage=df.map(row=>(row.Open+row.Close+row.High+row.Low)/4);
//         const SME_50=dfAverage.slice(-50).reduce((a,b)=> a+b,0)/50;
//         const SME_200=dfAverage.slice(-200).reduce((a,b)=> a+b,0)/200;

//         const suggestion= SME_50>=SME_200?"You Can Buy":"Not the correct time"
//         return  res.json({
//             SMA_50,SMA_200,suggestion});
//     }
//     catch(error){
//         res.status(500).json({error:error.message});
//     }
// }

// const analyzeStock=async(req,res)=>{
//     const {ticker}=req.body
//     if(!ticker){
//         res.status(500).json({error:"Ticker is required"});
//     }
//     const pythonProcess=spawn('python',['../Python/SME.py',ticker]);
    
 
    
//         pythonProcess.stdout.on('data', (data) => {
//             x=data.toString();
//             output  = JSON.parse(x);
//             console.log(x.Data);
            
//           });

//           pythonProcess.stderr.on('data', (data) => {
//             console.error(`${data}`);
//             // reject(`Python error: ${data}`);
//         });
//         //     pythonProcess.on('exit', (code) => {
//         //       console.log( `Child process exited with code ${code}`);
//         //       resolve(output);
//         // });
          
 
  
// }

const analyzeStock = async (req, res) => {
    const { ticker } = req.body;
    if (!ticker) {
        return res.status(400).json({ error: "Ticker is required" });
    }
    // const scriptPath=path.join('C:/Users/SHIVA/Desktop/Projects/STOCK/Backend/Python/SME.py');
    const scriptPath=path.join(__dirname,"../Python/SME.py");
    const pythonProcess = spawn('python', [scriptPath, ticker]);

    let output = '';

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString(); // Accumulate the data from stdout
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
        return res.status(500).json({ error: `Python error: ${data}` });
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: `Python process exited with code ${code}` });
        }
        try {
            const parsedOutput = JSON.parse(output); // Parse the JSON result from Python
            res.json(parsedOutput); // Send the parsed result to the client
        } catch (err) {
            res.status(500).json({ error: `Error parsing Python output: ${err.message}` });
        }
    });
};





module.exports={analyzeStock};