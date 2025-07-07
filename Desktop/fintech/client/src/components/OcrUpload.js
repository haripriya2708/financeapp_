import React, { useState } from 'react';
import { uploadImageForOCR,addTransaction } from '../services/api';

function OcrUpload({ onDataExtracted, onUploadComplete }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setCategory('');
    setTotalAmount('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select an image file!');
      return;
    }
    setLoading(true);
    setError('');


    try {
      const res = await uploadImageForOCR(selectedFile);

      const predictedCategory = res.predicted_category || 'Other';
      const totalAmount = res.total_amount || 'Not found';

      setCategory(predictedCategory);
      setTotalAmount(totalAmount.toString());
      if (totalAmount === 'Not found') {
        throw new Error('Total amount not extracted');
      }

      // Save as transaction
      const transactionData = {
        userId: localStorage.getItem('userId')
,
        description: `OCR Transaction ${predictedCategory}`,
        category: predictedCategory,
        amount: parseFloat(totalAmount),
        type: 'expense',
        date: new Date().toISOString()
      };

      await addTransaction(transactionData);

      if (onDataExtracted) {
        onDataExtracted({ category: predictedCategory, totalAmount });
      }

      if (onUploadComplete) {
        onUploadComplete();
      }

    } catch (err) {
      setError('Failed to extract or classify text. Try again!');
    }
    setLoading(false);
  };

  return (
    <div
  style={{
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginTop: '4.5rem',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fef2f2',
    maxWidth: '500px',
    margin: 'auto'
  }}
>
  <h2
    style={{
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#f9a8d4',
      marginBottom: '1rem'
    }}
  >
    Upload Image for OCR
  </h2>
  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      style={{
        padding: '10px',
        background: 'rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '8px',
        color: '#fff'
      }}
    />
    <button
      type="submit"
      disabled={loading}
      style={{
        background: loading
          ? 'linear-gradient(to right, #fbcfe8, #f9a8d4)'
          : 'linear-gradient(to right, #f472b6, #ec4899)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontWeight: '600',
        transition: 'transform 0.2s ease-in-out'
      }}
      onMouseOver={(e) => {
        if (!loading) e.currentTarget.style.transform = 'scale(1.03)';
      }}
      onMouseOut={(e) => {
        if (!loading) e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {loading ? 'Processing...' : 'Extract & Classify'}
    </button>
  </form>
  {error && (
    <p style={{ color: '#fecaca', fontWeight: '500', marginTop: '1rem' }}>
      ❌ {error}
    </p>
  )}
  {category && (
    <p style={{ marginTop: '1rem' }}>
      <strong>📁 Category:</strong>{' '}
      <span style={{ color: '#f9a8d4' }}>{category}</span>
    </p>
  )}
  {totalAmount && totalAmount !== 'Not found' && (
    <p>
      <strong>💰 Total Amount:</strong>{' '}
      <span style={{ color: '#f9a8d4' }}>₹{totalAmount}</span>
    </p>
  )}
  {totalAmount === 'Not found' && (
    <p>
      <strong>💰 Total Amount:</strong>{' '}
      <span style={{ color: '#f87171' }}>Not found</span>
    </p>
  )}
</div>

  );
}

export default OcrUpload;