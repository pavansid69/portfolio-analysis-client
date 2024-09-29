import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import ClientList from './components/ClientList';
import ClientPortfolio from './components/ClientPortfolio';
import ClientDetails from './components/ClientDetails';
import './App.css'; // Import the global styles
import LoginPage from './components/LoginPage'; // Import the new LoginPage component

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Default route for login */}
          <Route path="/client-list" element={<ClientList />} />
          <Route path="/client/:id" element={<ClientDetails />} />
          <Route path="/portfolio/:id" element={<ClientPortfolio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
