import React, { useState } from 'react';
import VoiceInput from './VoiceInput';
import { addTransaction } from '../services/api';

const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    type: 'income'
  });

  const handleVoiceCommand = (command) => {
    const lower = command.toLowerCase();
    const updatedData = { ...formData };

    const amountMatch = lower.match(/add amount\s+(\d+(\.\d+)?)/);
    const descriptionMatch = lower.match(/description\s+([a-zA-Z0-9\s\/]+)/);
    const categoryMatch = lower.match(/category\s+([a-zA-Z0-9\s\/]+)/);
    const typeMatch = lower.match(/(income|expense)/);

    if (amountMatch) updatedData.amount = amountMatch[1];
    if (descriptionMatch) updatedData.description = descriptionMatch[1].trim();
    if (categoryMatch) updatedData.category = categoryMatch[1].trim();
    if (typeMatch) updatedData.type = typeMatch[1];

    if (lower.includes('clear all')) {
      setFormData({ description: '', category: '', amount: '', type: 'income' });
    } else {
      setFormData(updatedData);
    }

    if (lower.includes('submit transaction')) {
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.description.trim() || !formData.category.trim() || !formData.amount.trim()) {
      alert('All fields are required!');
      return;
    }

    if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      alert('Amount must be a positive number!');
      return;
    }

    const dataWithDate = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString(),
      userId: localStorage.getItem('userId')

    };

    await addTransaction(dataWithDate);
    alert('Transaction added!');
    setFormData({ description: '', category: '', amount: '', type: 'income' });

    if (onTransactionAdded) onTransactionAdded(prev => prev + 1);
  };

  return (
    <div
      style={{
        backgroundColor: '#fff1f2', // 🌸 soft pink
        padding: '1.5rem',
        borderRadius: '12px',
        maxWidth: '500px',
        margin: '2rem auto',
        boxShadow: '0 4px 12px rgba(255, 182, 193, 0.25)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #f9a8d4',
            fontSize: '1rem',
            outline: 'none',
            backgroundColor: '#fff',
          }}
          onFocus={(e) => (e.target.style.border = '1px solid #ec4899')}
          onBlur={(e) => (e.target.style.border = '1px solid #f9a8d4')}
        />
        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          value={formData.category}
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #f9a8d4',
            fontSize: '1rem',
            outline: 'none',
            backgroundColor: '#fff',
          }}
          onFocus={(e) => (e.target.style.border = '1px solid #ec4899')}
          onBlur={(e) => (e.target.style.border = '1px solid #f9a8d4')}
        />
        <input
          name="amount"
          placeholder="Amount"
          onChange={handleChange}
          value={formData.amount}
          type="number"
          min="0.01"
          step="0.01"
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #f9a8d4',
            fontSize: '1rem',
            outline: 'none',
            backgroundColor: '#fff',
          }}
          onFocus={(e) => (e.target.style.border = '1px solid #ec4899')}
          onBlur={(e) => (e.target.style.border = '1px solid #f9a8d4')}
        />
        <select
          name="type"
          onChange={handleChange}
          value={formData.type}
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid #f9a8d4',
            fontSize: '1rem',
            backgroundColor: '#fff',
            outline: 'none',
          }}
          onFocus={(e) => (e.target.style.border = '1px solid #ec4899')}
          onBlur={(e) => (e.target.style.border = '1px solid #f9a8d4')}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button
          type="submit"
          style={{
            padding: '0.8rem',
            backgroundColor: '#ec4899',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#db2777')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#ec4899')}
        >
          Add Transaction
        </button>
      </form>
      <VoiceInput onCommand={handleVoiceCommand} />
    </div>
  );
};

export default TransactionForm;
