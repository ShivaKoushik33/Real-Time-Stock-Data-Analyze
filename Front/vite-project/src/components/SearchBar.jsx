import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import Data from '../Pages/StockData.json';

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState("");

  // Filter data by both Ticker and CompanyName
  const filteredData = Data.filter(item =>
    item.CompanyName.toLowerCase().includes(input.toLowerCase()) ||
    item.Ticker.toLowerCase().includes(input.toLowerCase())
  );

  const handleStockClick = async (ticker) => {
    console.log(ticker);
    setSelectedTicker(ticker);
    setInput(ticker);  // Update input with selected ticker
    setLoading(true);

    try {
      const response = await fetch("https://stocksense-backend-bmpn.onrender.com/tickerSME/rsi", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker }),
      });

      const data = await response.json();
      console.log(data);
      setResult(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setResult(null);

    // Optional: Clear selectedTicker if user starts typing again
    if (value === "") {
      setSelectedTicker("");
    }
  };

  return (
    <div className="container items-center justify-center bg-white text-white max-w-xl mx-auto p-4 border m-1">
      <section className="input-wrapper flex items-center ml-5 mt-3 mb-3 bg-white rounded-lg p-2 shadow-lg transition duration-500 ease-in-out hover:shadow-2xl border">
        <FaSearch className="w-5 h-5 text-black" />
        <input
          type="search"
          placeholder="Search by company or ticker"
          aria-label="Search"
          className="ml-4 p-2 w-full outline-none bg-transparent text-black placeholder-gray-400"
          value={input}  // Only input now
          onChange={handleInputChange}
        />
        
      </section>

      {/* Show filtered results only when input is not empty and no result is loaded */}
      {input && !result && (
        <div className="searchResults transition-all duration-500 ease-in-out">
          {filteredData.length > 0 ? (
            <ul className="bg-white text-black rounded-lg shadow-lg mt-2 max-h-60 overflow-auto">
              {filteredData.map((item, index) => (
                <li
                  key={index}
                  className="p-2 border-b border-gray-600 hover:bg-gray-200 cursor-pointer transition ease-in-out duration-300"
                  onClick={() => handleStockClick(item.Ticker)}
                >
                  <strong>{item.Ticker}</strong> - {item.CompanyName}
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow-lg mt-2 p-2">
              <p className="text-gray-400">No results found</p>
            </div>
          )}
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10 animate-spin"></div>
        </div>
      )}

     
  {result && !loading && (
  <div className="mt-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-xl transition duration-500 ease-in-out transform hover:scale-105">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">Stock Analysis</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <p className="text-sm text-gray-500">SMA 50</p>
        <p className="text-2xl font-semibold text-gray-900">{result.SME_50}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <p className="text-sm text-gray-500">SMA 200</p>
        <p className="text-2xl font-semibold text-gray-900">{result.SME_200}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <p className="text-sm text-gray-500">RSI</p>
        <p className="text-2xl font-semibold text-gray-900">{result.RSI}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <p className="text-sm text-gray-500">EMA</p>
        <p className="text-2xl font-semibold text-gray-900">{result.EMA_20}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => showInfo("MACD", "Measures trend momentum. Buy when MACD crosses above Signal line.")}>
        <p className="text-sm text-gray-500 ">MACD</p>
        <p className="text-2xl font-semibold text-gray-900">{result.MACD}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <p className="text-sm text-gray-500 ">Signal</p>
        <p className="text-2xl font-semibold text-gray-900">{result.Signal}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-600">
        <p className="text-sm text-gray-500">Histogram</p>
        <p className="text-2xl font-semibold text-gray-900">{result.Histogram}</p>
      </div>

      
        <p className="text-sm text-gray-500">Suggestion</p>
        <p className="text-2xl font-semibold capitalize text-gray-900">
          {result.suggestion}
        </p>
      </div>
    </div>
    
  )}


</div> 
   
  );
};

export default SearchBar;