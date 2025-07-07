// components/ReportPage.js
import React, { useContext } from 'react';
import Report from './Report';
import { BudgetContext } from './BudgetContext';


const ReportPage = () => {
  const { budgetDay, budgetMonth } = useContext(BudgetContext);

  return (
    <div style={{ padding: '20px' }}>
      
      <Report budgetDay={budgetDay} budgetMonth={budgetMonth} />
    </div>
  );
};

export default ReportPage;
