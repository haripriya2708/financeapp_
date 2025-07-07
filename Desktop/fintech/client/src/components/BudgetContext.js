// components/BudgetContext.js
import React, { createContext, useState } from 'react';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgetDay, setBudgetDay] = useState(0);
  const [budgetMonth, setBudgetMonth] = useState(0);

  return (
    <BudgetContext.Provider value={{ budgetDay, setBudgetDay, budgetMonth, setBudgetMonth }}>
      {children}
    </BudgetContext.Provider>
  );
};
