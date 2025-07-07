// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import ReportPage from './components/ReportPage';

import { BudgetProvider } from './components/BudgetContext';
import InvestmentForecast from './components/InvestmentForecast'; // ⬅️ Add this at the top



function App() {
  useEffect(() => {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);  // create random id
      localStorage.setItem('userId', userId);
      console.log('Created new userId:', userId);
    } else {
      console.log('Existing userId found:', userId);
    }
  }, []);

  return (
    <BudgetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/investment" element={<InvestmentForecast />} /> // ⬅️ Add this line

        </Routes>
      </Router>
    </BudgetProvider>
  );
}

export default App;
