import React, { useState } from "react";
const API_BASE = "http://localhost:5000/api";


function QuestionnaireForm({onSaved }) {
   const userId = localStorage.getItem("userId") || "user_flr7527ft";
  const [formData, setFormData] = useState({
    monthly_income: "",
    other_income: "",
    assets_savings: "",
    liabilities_debts: "",
    liabilities_loans: "",
    liabilities_credit_card_balance: "",
    risk_tolerance: "medium",
    emergency_fund_months: "",
    current_age: "",
    retirement_target_age: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: userId,
      monthly_income: parseFloat(formData.monthly_income) || 0,
      other_income: parseFloat(formData.other_income) || 0,
      assets: {
        savings: parseFloat(formData.assets_savings) || 0
      },
      liabilities: {
        debts: parseFloat(formData.liabilities_debts) || 0,
        loans: parseFloat(formData.liabilities_loans) || 0,
        credit_card_balance: parseFloat(formData.liabilities_credit_card_balance) || 0
      },
      risk_tolerance: formData.risk_tolerance,
      emergency_fund_months: parseFloat(formData.emergency_fund_months) || 0,
      retirement: {
        current_age: parseInt(formData.current_age) || 0,
        target_age: parseInt(formData.retirement_target_age) || 0
      }
    };

    try {
      const res = await fetch(`${API_BASE}/questionnaire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        onSaved && onSaved();
        alert("Profile saved successfully!");
      } else {
        alert("Failed to save profile");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  return (
    <form
  onSubmit={handleSubmit}
  style={{
    backgroundColor: '#faf5ff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    maxWidth: '600px',
    margin: '2rem auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  }}
>
  {[
    { label: 'Monthly Income', name: 'monthly_income' },
    { label: 'Other Income', name: 'other_income' },
    { label: 'Savings', name: 'assets_savings' },
    { label: 'Debts', name: 'liabilities_debts' },
    { label: 'Loans', name: 'liabilities_loans' },
    { label: 'Credit Card Balance', name: 'liabilities_credit_card_balance' },
    { label: 'Emergency Fund (Months)', name: 'emergency_fund_months' },
    { label: 'Current Age', name: 'current_age' },
    { label: 'Retirement Target Age', name: 'retirement_target_age' }
  ].map((field) => (
    <label key={field.name} style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#333' }}>
      {field.label}:
      <input
        type="number"
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        required={['monthly_income', 'current_age', 'retirement_target_age'].includes(field.name)}
        style={{
          marginTop: '0.3rem',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '0.5rem',
          fontSize: '1rem'
        }}
      />
    </label>
  ))}

  <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#333' }}>
    Risk Tolerance:
    <select
      name="risk_tolerance"
      value={formData.risk_tolerance}
      onChange={handleChange}
      style={{
        marginTop: '0.3rem',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        border: '1px solid #ccc',
        fontSize: '1rem'
      }}
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </label>

  <button
    type="submit"
    style={{
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '0.75rem 1.2rem',
      borderRadius: '0.6rem',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '1rem',
      transition: 'background 0.3s ease'
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = '#5b21b6')}
    onMouseOut={(e) => (e.target.style.backgroundColor = '##7c3aed')}
  >
    Save Profile
  </button>
</form>

  );
}

export default QuestionnaireForm;
