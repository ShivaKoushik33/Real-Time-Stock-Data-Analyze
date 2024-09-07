import React from 'react';
import { BrowserRouter,Route,Routes,Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

function LandingPage() {
  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <header className="text-5xl font-bold mb-10 text-black">
        Real-Time Stock Data Explorer
      </header>
      <Link to="/SME">
        <button className="bg-black text-white py-2 px-4 rounded hover:bg-gray-700">
          Explore Stock Data
        </button>
      </Link>
    </div>
    </>
  );
}

export default LandingPage;