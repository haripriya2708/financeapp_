import React, { useState, useContext } from 'react';
import { BudgetContext } from './BudgetContext';

const BudgetSetter = () => {
  const { setBudgetDay, setBudgetMonth } = useContext(BudgetContext);
  const [dayInput, setDayInput] = useState('');
  const [monthInput, setMonthInput] = useState('');

  const handleSetBudget = () => {
    setBudgetDay(parseFloat(dayInput));
    setBudgetMonth(parseFloat(monthInput));
  };

  return (
    <div
      style={{
        backgroundColor: '#fff1f2', // 🌸 soft blush pink background
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(255, 182, 193, 0.25)',
        maxWidth: '420px',
        margin: '2rem auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h3
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#be185d', // 🍓 deep rose-pink header
          textAlign: 'center',
          marginBottom: '0.25rem',
        }}
      >
        Set Your Budget
      </h3>

      {/* Daily budget input */}
      <input
        type="number"
        placeholder="Daily Budget"
        value={dayInput}
        onChange={(e) => setDayInput(e.target.value)}
        style={{
          padding: '0.75rem',
          borderRadius: '8px',
          border: '1px solid #f9a8d4',
          fontSize: '1rem',
          outline: 'none',
          backgroundColor: '#fff',
          transition: 'border 0.2s',
        }}
        onFocus={(e) => (e.target.style.border = '1px solid #ec4899')} // focus = hot pink
        onBlur={(e) => (e.target.style.border = '1px solid #f9a8d4')}
      />

      {/* Monthly budget input */}
      <input
        type="number"
        placeholder="Monthly Budget"
        value={monthInput}
        onChange={(e) => setMonthInput(e.target.value)}
        style={{
          padding: '0.75rem',
          borderRadius: '8px',
          border: '1px solid #f9a8d4',
          fontSize: '1rem',
          outline: 'none',
          backgroundColor: '#fff',
          transition: 'border 0.2s',
        }}
        onFocus={(e) => (e.target.style.border = '1px solid #ec4899')}
        onBlur={(e) => (e.target.style.border = '1px solid #f9a8d4')}
      />

      {/* Save button */}
      <button
        onClick={handleSetBudget}
        style={{
          padding: '0.8rem',
          backgroundColor: '#ec4899', // 💖 vibrant pink
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#db2777')} // hover = deeper pink
        onMouseOut={(e) => (e.target.style.backgroundColor = '#ec4899')}
      >
        Save Budget
      </button>
    </div>
  );
};

export default BudgetSetter;
