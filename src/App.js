import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import IdeaPage from './components/IdeaPage';
import IdeaChatBot from './components/IdeaChatBot'; // ✅ chatbot route

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<IdeaPage />} />
        <Route path="/idea-chat/:id" element={<IdeaChatBot />} /> {/* ✅ THIS */}
      </Routes>
    </Router>
  );
}

export default App;
