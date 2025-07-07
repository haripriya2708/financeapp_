import React, { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../services/api';

const TransactionTable = ({ refreshTrigger }) => {
  const [transactions, setTransactions] = useState([]);
  const [viewType, setViewType] = useState('expense');


  const fetchData = async () => {
    const res = await getTransactions();
    console.log('Transactions fetched:', res); // Should be an array
    setTransactions(res); // ✅ FIXED here
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirm) return;

    await deleteTransaction(id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);
  const filteredTransactions = transactions.filter(
  tx => viewType === 'income'
    ? tx.category.toLowerCase() === 'income'
    : tx.category.toLowerCase() !== 'income'
);


const total = Array.isArray(filteredTransactions)
  ? filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0)
  : 0;


  return (
    <div>
      <h2
  style={{
    fontSize: '1.75rem',
    marginBottom: '0.75rem',
    color: '#fce7f3',
    fontWeight: '600',
  }}
>
  Transaction History
</h2>
<button
  onClick={() => setViewType(viewType === 'expense' ? 'income' : 'expense')}
  style={{
    marginBottom: '1rem',
    padding: '8px 16px',
    background: 'linear-gradient(135deg, #fdf4ff, #fbcfe8)',
    color: '#581c87',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }}
>
  Show {viewType === 'expense' ? 'Income' : 'Expenses'}
</button>
      {filteredTransactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        
        <table
  style={{
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  }}
>
  <thead>
    <tr style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fdf4ff' }}>
      <th style={{
        padding: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'left',
        fontWeight: '600',
      }}>Description</th>
      <th style={{
        padding: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'left',
        fontWeight: '600',
      }}>Category</th>
      <th style={{
        padding: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'left',
        fontWeight: '600',
      }}>Amount (₹)</th>
      <th style={{
        padding: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'left',
        fontWeight: '600',
      }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {filteredTransactions.map((tx) => (
      <tr key={tx._id} style={{
        background: 'rgba(255, 255, 255, 0.06)',
        color: '#f9fafb'
      }}>
        <td style={{
          padding: '10px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>{tx.description}</td>
        <td style={{
          padding: '10px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>{tx.category}</td>
        <td style={{
          padding: '10px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>{tx.amount}</td>
        <td style={{
          padding: '10px',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <button
            onClick={() => handleDelete(tx._id)}
            style={{
              background: 'linear-gradient(135deg, #f9a8d4, #fbcfe8)',
              color: '#581c87',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🗑️ Delete
          </button>
        </td>
      </tr>
    ))}
    <tr style={{
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fdf4ff',
      fontWeight: 'bold'
    }}>
      <td style={{
        padding: '10px',
        border: '1px solid rgba(255,255,255,0.2)'
      }} colSpan="2">Total</td>
      <td style={{
        padding: '10px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>{total}</td>
      <td style={{
        padding: '10px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}></td>
    </tr>
  </tbody>
</table>

      )}
    </div>
  );
};

export default TransactionTable;