// components/HomePage.js
import React, { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import TransactionTable from './TransactionTable';
import OcrUpload from './OcrUpload';
import BudgetSetter from './BudgetSetter';
import QuestionnaireForm from './QuestionnaireForm';
import { addTransaction, getTransactions } from '../services/api';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [refresh, setRefresh] = useState(0); // ✅ Changed from false to number
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState({
    daily: Number(localStorage.getItem('dailyBudget')) || 0,
    monthly: Number(localStorage.getItem('monthlyBudget')) || 0,
  });

  const navigate = useNavigate();
  const userId = 'test-user-123'; // Replace later if needed

  useEffect(() => {
    async function fetchData() {
      try {
        const fetched = await getTransactions();
        setTransactions(fetched);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      }
    }
    fetchData();
  }, [refresh]); // ✅ Now updates when refresh increases

  const handleTransactionAdded = () => setRefresh(prev => prev + 1); // ✅ Use increment
  const handleOcrUploadComplete = () => setRefresh(prev => prev + 1);

  const handleOcrDataExtracted = async ({ category, totalAmount, description, date }) => {
    try {
      await addTransaction({
        description: description || 'OCR Transaction',
        category,
        amount: parseFloat(totalAmount),
        date: date || new Date().toISOString(),
        userId: localStorage.getItem('userId')

      });
      setRefresh(prev => prev + 1); // ✅ Trigger update
    } catch (error) {
      console.error('Failed to save OCR transaction:', error);
    }
  };

  const handleBudgetSet = () => {
    const daily = Number(localStorage.getItem('dailyBudget')) || 0;
    const monthly = Number(localStorage.getItem('monthlyBudget')) || 0;
    setBudget({ daily, monthly });
  };

  const handleQuestionnaireSaved = () => {
    alert("Questionnaire saved successfully!");
  };

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>Income & Expense Tracker 💸</h1>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <BudgetSetter onBudgetSet={handleBudgetSet} />
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
        </div>
      </div>

      <TransactionTable refreshTrigger={refresh} /> {/* ✅ This will update now */}

      <OcrUpload 
        onUploadComplete={handleOcrUploadComplete} 
        onDataExtracted={handleOcrDataExtracted} 
      />

      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginTop: '2rem',
          marginBottom: '1rem',
          color: '#9f1239',
          borderBottom: '2px solid #fecdd3',
          paddingBottom: '0.5rem',
          maxWidth: 'fit-content',
          marginLeft: 'auto',
          marginRight: 'auto',
          letterSpacing: '0.5px'
        }}
      >
        User Financial Profile
      </h2>

      <QuestionnaireForm userId={userId} onSaved={handleQuestionnaireSaved} />

      <button
        onClick={() => navigate('/report')}
        style={{
          backgroundColor: '#f9a8d4',
          color: '#fff',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          margin: '1.5rem auto',
          display: 'block',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#ec4899')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#f9a8d4')}
      >
        📊 Generate Financial Report
      </button>
    </div>
  );
};

export default HomePage;
