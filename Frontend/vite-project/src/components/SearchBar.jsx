import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import Data from '../Pages/StockData.json';

const SearchBar = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);  // Loading state for buffering
  const [selectedTicker, setSelectedTicker] = useState("");  // To keep track of selected ticker

  const filteredData = Data.filter(item =>
    item.CompanyName.toLowerCase().includes(input.toLowerCase()) ||
    item.Ticker.toLowerCase().includes(input.toLowerCase())
  );

  const handleStockClick = async (ticker) => {
    console.log(ticker);
    setSelectedTicker(ticker);
    setLoading(true);  
    try {
      const response = await fetch("http://localhost:5000/tickerSME/result", {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ ticker }),
      });

      const data = await response.json();
      console.log(data);
      setResult(data);  // Set result before stopping the loader
      setLoading(false);  // Stop loader right after fetching data
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setLoading(false);  // Stop loader even if there's an error
    }
  };

  // Handle input change and reset result if user starts typing again
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setResult(null);  // Clear the previous result when input changes
  };

  return (
    <div className="container items-center justify-center bg-white text-white max-w-xl mx-auto p-4">
      <section className="input-wrapper flex items-center ml-5 mt-3 mb-3 bg-white rounded-lg p-2 shadow-lg transition duration-500 ease-in-out hover:shadow-2xl">
        <FaSearch className="w-5 h-5 text-black" />
        <input
          type="search"
          placeholder="Search by company or ticker"
          aria-label="Search"
          className="ml-4 p-2 w-full outline-none bg-transparent text-black placeholder-gray-400"
          value={input || selectedTicker}  // Show the selected ticker if it's chosen, otherwise the input
          onChange={handleInputChange}  // Handle typing and input changes
        />
      </section>

      {/* Filtered Search Results */}
      {input && !result && (
        <div className="searchResults transition-all duration-500 ease-in-out">
          {filteredData.length > 0 ? (
            <ul className="bg-white text-black rounded-lg shadow-lg mt-2 max-h-60 overflow-auto">
              {filteredData.map((item, index) => (
                <li key={index} className="p-2 border-b border-gray-600 hover:bg-gray-200 cursor-pointer transition ease-in-out duration-300" onClick={() => handleStockClick(item.Ticker)}>
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

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10 animate-spin"></div>
        </div>
      )}

      {/* Stock Result Display */}
      {result && !loading && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg transition duration-500 ease-in-out">
          <p className="text-black text-lg"><strong>SMA_50:</strong> {result.SME_50}</p>
          <p className="text-black text-lg"><strong>SMA_200:</strong> {result.SME_200}</p>
          <p className="text-black text-lg"><strong>Suggestion:</strong> {result.suggestion}</p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
