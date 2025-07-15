const tickerModel=require('../Models/tickerModel');
// const yahooFinance = require('yahoo-finance');
const yfinance=require("yfinance")
const {spawn}=require("child_process");
const  path  = require('path');



const analyzeStock = async (req, res) => {
    const { ticker } = req.body;
    if (!ticker) {
          return res.status(400).json({
            SME_50: "Error",
            SME_200: "Error",
            suggestion: "Ticker is required"
        });
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
                       console.error(`Python process exited with code ${code}`);

            return res.status(500).json({
                SME_50: "Error",
                SME_200: "Error",
                suggestion: `Python process failed: Exit code ${code}`
            });
        }
         try {
            const parsedOutput = JSON.parse(output);
            // If Python script returns error structure, pass it through
            if (parsedOutput.err || parsedOutput.suggestion?.includes("Error")) {
                return res.status(500).json({
                    SME_50: "Error",
                    SME_200: "Error",
                    suggestion: parsedOutput.suggestion || "Failed to fetch data"
                });
            }

            return res.json(parsedOutput);
        } catch (err) {
            console.error("JSON parse error:", err.message);
            return res.status(500).json({
                SME_50: "Error",
                SME_200: "Error",
                suggestion: `Failed to analyze stock: ${err.message}`
            });
        }
    });
};





module.exports={analyzeStock};