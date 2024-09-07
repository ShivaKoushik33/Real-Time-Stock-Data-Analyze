import './App.css'
import SearchBar from './components/SearchBar'
import LandingPage from './Pages/LandingPage'
import { BrowserRouter,Route,Routes,Link } from 'react-router-dom';
function App(){
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/SME" element={<SearchBar />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    );
}

export default App
