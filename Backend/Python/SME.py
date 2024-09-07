import yfinance as yf
import pandas as pd
import sys
import json
ticker=sys.argv[1]
# ticker='JTLIND.NS'
try:
    stock = yf.Ticker(ticker)
    data = stock.history(period='1y')
    if data.empty:
            result={
        "SME_50":"No data available",
        "SME_200":"No data available",
        "suggestion":"No data"
    }
    else:
           df=pd.DataFrame(data)
    df.drop(columns={"Volume","Dividends","Stock Splits"},axis=1,inplace=True)
    df["Sum"]=(df["Open"]+df["Close"]+df["High"]+df["Low"])/4
    SME_50=df["Sum"].tail(50).mean()
    SME_200=df["Sum"].tail(200).mean()
    if(SME_200<=SME_50):
        suggestion="You can BUY"
    else:
        suggestion="Not a correct time"

    result={
        "SME_50":SME_50,
        "SME_200":SME_200,
        "suggestion":suggestion
    }
    print(json.dumps(result))
  
except Exception as e:
     print(json.dumps({'err':str(e)}))
finally:
    sys.stdout.flush()