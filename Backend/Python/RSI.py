import sys
import yfinance as yf
import pandas as pd
import json

def calculate_sma(data, window):
    return data['Close'].rolling(window=window).mean()

def calculate_rsi(data, period=14):
    delta = data['Close'].diff()
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)

    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_macd(data):
        ema_12 = data['Close'].ewm(span=12, adjust=False).mean()
        ema_26 = data['Close'].ewm(span=26, adjust=False).mean()
        macd = ema_12 - ema_26
        signal_line = macd.ewm(span=9, adjust=False).mean()
        histogram=macd - signal_line
        return {
        'macd_line': round(macd.iloc[-1], 2),
        'signal_line':round(signal_line.iloc[-1],2),
         'histogram':round(histogram.iloc[-1],2)
        }


def calculate_ema(data,window):
    return data['Close'].ewm(span=window, adjust=False).mean()

def main(ticker):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")

        if hist.empty:
            return {"suggestion": "Invalid ticker or no data found."}

        hist['SMA_50'] = calculate_sma(hist, 50)
        hist['SMA_200'] = calculate_sma(hist, 200)
        hist['RSI'] = calculate_rsi(hist)
        hist['EMA_20'] = calculate_ema(hist, 20)
        macd_data= calculate_macd(hist)
        

        latest = hist.iloc[-1]

        result = {
            "SME_50": round(latest['SMA_50'], 2) if pd.notna(latest['SMA_50']) else "N/A",
            "SME_200": round(latest['SMA_200'], 2) if pd.notna(latest['SMA_200']) else "N/A",
            "RSI": round(latest['RSI'], 2) if pd.notna(latest['RSI']) else "N/A",
            "EMA_20": round(latest['EMA_20'], 2) if pd.notna(latest['EMA_20']) else "N/A",
            "MACD": round(macd_data['macd_line'], 2),
            "Signal": round(macd_data['signal_line'], 2),
            "Histogram": round(macd_data['histogram'], 2),

            
            "suggestion": ""
        }

        # RSI-based suggestion
        if result["RSI"] != "N/A":
            if result["RSI"] < 30:
                result["suggestion"] = "Oversold (Potential Buy)"
            elif result["RSI"] > 70:
                result["suggestion"] = "Overbought (Potential Sell)"
            else:
                result["suggestion"] = "Neutral"

        return result

    except Exception as e:
        return {"suggestion": f"Error: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"suggestion": "Ticker symbol is required"}))
    else:
        ticker = sys.argv[1]
        result = main(ticker)
        print(json.dumps(result))