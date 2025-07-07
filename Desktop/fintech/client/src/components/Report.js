import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { getTransactions, getQuestionnaire } from '../services/api';
import './Report.css';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Report = () => {
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user_id = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchData() {
      try {
        const transRes = await getTransactions(user_id);
        console.log('Raw Transactions:', transRes);
        console.log('Transaction count:', transRes?.length || 0);
        console.log('Transactions with negative amounts or expense type:', transRes?.filter(t => t.amount < 0 || t.type === 'expense') || []);

        const profileRes = await getQuestionnaire(user_id);
        console.log('Profile:', profileRes);

        const processedTransactions = Array.isArray(transRes)
          ? transRes.map(t => ({
              ...t,
              amount: Number(t.amount) || 0,
              category: t.category || 'Other'
            }))
          : [];

        console.log('Processed Transactions:', processedTransactions);
        setTransactions(processedTransactions);
        setProfile(profileRes.data || profileRes);
      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.response?.data || error.message);
        setTransactions([]);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl text-gray-600 animate-pulse">
            We're gathering your financial data to create a personalized report. This will only take a moment!
          </p>
        </div>
      ) : !profile || !profile.monthly_income || !profile.assets?.savings || !profile.liabilities?.debts || !profile.retirement?.target_age
? (
        <div className="flex flex-col justify-center items-center h-screen bg-red-50 p-4 text-center">
          <p className="text-2xl text-red-600 font-semibold mb-4">
            It looks like we don’t have your financial profile yet!
          </p>
          <p className="text-gray-700 mb-6 max-w-md">
            To unlock a detailed view of your finances, including personalized insights and recommendations, please take a moment to complete your financial questionnaire. This will help us understand your income, savings, and goals to tailor advice just for you.
          </p>
          <button
            onClick={() => navigate('/questionnaire')}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Fill Out Your Financial Profile
          </button>
        </div>
      ) : !transactions.length ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl text-yellow-500 max-w-md text-center">
            Your transaction list is empty right now. Add some income and expense records to see a clear picture of your financial habits and get customized insights!
          </p>
        </div>
      ) : (
        (() => {
          const monthlyIncome = Number(profile?.monthly_income) || 0;
          const otherIncome = Number(profile?.other_income) || 0;
          const savings = Number(profile?.assets?.savings) || 0;
          const debts = Number(profile?.liabilities?.debts) || 0;
          const riskTolerance = profile?.risk_tolerance || 'Unknown';
          const emergencyFundMonths = Number(profile?.emergency_fund_months) || 0;
          const currentAge = Number(profile?.retirement?.current_age) || 0;
          const targetAge = Number(profile?.retirement?.target_age) || 0;

          const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + Number(t.amount), 0);

          const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + Number(t.amount), 0);

          console.log('Total Income:', totalIncome, 'Total Expense:', totalExpense);

          const netSavings = totalIncome - totalExpense;
          const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;
          const debtToIncomeRatio = monthlyIncome > 0 ? ((debts / monthlyIncome) / 12 * 100).toFixed(1) : 0;

          const yearsToRetirement = targetAge - currentAge;
          const monthlySavings = monthlyIncome * 0.2;
          const futureValue = yearsToRetirement > 0
            ? savings * Math.pow(1 + 0.07 / 12, 12 * yearsToRetirement) +
              monthlySavings * ((Math.pow(1 + 0.07 / 12, 12 * yearsToRetirement) - 1) / (0.07 / 12))
            : savings;
          const retirementGoal = monthlyIncome * 12 * 25;

          const expenseCategories = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
              const category = t.category || 'Other';
              acc[category] = (acc[category] || 0) + Number(t.amount);
              return acc;
            }, {});

          console.log('Expense Categories:', expenseCategories);
          const hasExpenseData = Object.keys(expenseCategories).length > 0;

          const savingsGoal = monthlyIncome * 6;
          const savingsProgress = savingsGoal > 0 ? Math.min((savings / savingsGoal) * 100, 100) : 0;

          const barData = {
            labels: hasExpenseData ? Object.keys(expenseCategories) : ['No Data'],
            datasets: [
              {
                label: 'Expenses by Category',
                data: hasExpenseData ? Object.values(expenseCategories) : [0],
                backgroundColor: [
                  '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#FB7185', '#4ADE80', '#FDE047'
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
              },
            ],
          };

          const barOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `₹${context.parsed.y.toFixed(2)}`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                min: 0,
                suggestedMax: Math.max(...Object.values(expenseCategories)) * 1.2 || 100,
                title: { display: true, text: 'Amount (₹)' },
              },
              x: {
                title: { display: true, text: 'Category' },
              },
            },
          };

          const pieData = hasExpenseData ? {
            labels: Object.keys(expenseCategories),
            datasets: [
              {
                data: Object.values(expenseCategories),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'],
                borderColor: '#ffffff',
                borderWidth: 2,
              },
            ],
          } : {
            labels: ['No Expenses'],
            datasets: [
              {
                data: [1],
                backgroundColor: ['#C9CBCF'],
                borderColor: ['#ffffff'],
                borderWidth: 2,
              },
            ],
          };

          const pieOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: { size: 12 },
                  padding: 15,
                  usePointStyle: true
                }
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                  },
                },
              },
            },
          };

          return (
            <div className="glass-card report-container animate-fade-in">
              <h1 className="text-4xl font-extrabold text-gray-800 mb-6 flex items-center">
                Your Personalized Financial Report
              </h1>
              <p className="text-gray-600 mb-6 max-w-2xl">
                Welcome to your financial overview! This report is designed to give you a clear, detailed picture of your money—where it’s coming from, where it’s going, and how you can make it work harder for you. Think of it as a roadmap to help you navigate your financial journey with confidence and clarity.
              </p>
              <button
  onClick={() => navigate(-1)}
  style={{
    marginBottom: '1.5rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#f9a8d4', // soft pink
    color: '#fff',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = '#ec4899'; // deeper pink
    e.target.style.transform = 'scale(1.03)';
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = '#f9a8d4';
    e.target.style.transform = 'scale(1)';
  }}
>
  ⬅️ Return to Dashboard
</button>


              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Understanding Your Spending Habits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">How You Spend Your Money</h3>
                    <p className="text-sm text-gray-500 mb-2 max-w-md">
                      {hasExpenseData
                        ? 'This bar chart breaks down your expenses into categories, showing you exactly where your money is going each month. It’s like a spotlight on your spending habits—take a look to see if any areas surprise you or if there’s room to redirect some cash toward your goals.'
                        : 'We don’t have any spending data to show yet. Once you add your expense transactions, this chart will come to life, helping you see where your money flows and where you might save.'}
                    </p>
                    <div className="h-96">
                      {hasExpenseData ? (
                        <Bar data={barData} options={barOptions} />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-400 text-center">
                            Start tracking your expenses to see a detailed breakdown of your spending here!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Your Spending Breakdown</h3>
                    <p className="text-sm text-gray-500 mb-2 max-w-md">
                      {hasExpenseData
                        ? 'This pie chart slices up your expenses into clear segments, making it easy to see which categories are taking the biggest bites out of your budget. Use this to spot trends, like if you’re spending more on dining out or utilities, and consider if those align with your priorities.'
                        : 'No expenses recorded yet. Add your transactions to create a pie chart that shows how your spending is distributed across different categories.'}
                    </p>
                    <div className="h-96">
                      <Pie data={pieData} options={pieOptions} />
                    </div>
                  </div>
                </div>
              </section>

           <section className="mb-10">
  <h2 className="text-2xl font-semibold text-gray-100 mb-6 section-header">Your Financial Foundation</h2>
  <div className="dashboard-grid">
    {[
      { label: 'Monthly Income', value: `₹${monthlyIncome.toFixed(2)}`, tag: 'income' },
      { label: 'Additional Income', value: `₹${otherIncome.toFixed(2)}`, tag: 'income' },
      { label: 'Savings', value: `₹${savings.toFixed(2)}`, tag: 'savings' },
      { label: 'Debts', value: `₹${debts.toFixed(2)}`, tag: 'debt' },
      { label: 'Risk Tolerance', value: riskTolerance, tag: 'retirement' },
      { label: 'Emergency Fund', value: `${emergencyFundMonths} months`, tag: 'emergency' },
      { label: 'Current Age', value: `${currentAge} years`, tag: 'retirement' },
      { label: 'Retirement Age', value: `${targetAge} years`, tag: 'retirement' },
      { label: 'Net Savings', value: `₹${netSavings.toFixed(2)}`, tag: 'savings' },
    ].map((item, index) => (
      <div key={index} className={`card metric-card ${item.tag}`}>
        <h3>{item.label}</h3>
        <span className="value">{item.value}</span>
      </div>
    ))}
  </div>
</section>


              <section className="mb-10">
  <h2 className="text-3xl font-bold text-gray-100 mb-6">💡 Insights to Grow Your Wealth</h2>
  <p className="text-gray-300 mb-6 max-w-2xl">
    Your numbers speak volumes. Here's what they say — and what you can do to level up your financial journey.
  </p>

  <div className="grid md:grid-cols-2 gap-6">
    {/* Savings Rate Card */}
    <div className="insight-card border-l-4 border-yellow-400">
      <h3 className="insight-title">💰 Savings Rate: {savingsRate}%</h3>
      <p className="insight-text">
        You’re saving {savingsRate}% of your income. {savingsRate < 20
          ? "Try to nudge it above 20% by trimming non-essential expenses!"
          : "That’s fantastic — you're compounding wealth like a pro!"}
      </p>
    </div>

    {/* Debt-to-Income Ratio Card */}
    <div className="insight-card border-l-4 border-red-400">
      <h3 className="insight-title">📉 Debt-to-Income: {debtToIncomeRatio}%</h3>
      <p className="insight-text">
        {debtToIncomeRatio > 36
          ? "That’s a bit high — focus on knocking out high-interest debt."
          : "You're in a healthy zone. Keep managing debt smartly!"}
      </p>
    </div>

    {/* Retirement Planning */}
    <div className="insight-card border-l-4 border-blue-400">
      <h3 className="insight-title">🧓 Retirement Projection</h3>
      <p className="insight-text">
        By saving ₹{monthlySavings.toFixed(2)} monthly, you could hit ₹{futureValue.toFixed(2)} by age {targetAge}.
        {futureValue < retirementGoal
          ? ` You're short by ₹${(retirementGoal - futureValue).toFixed(2)}. Consider saving more or investing smarter.`
          : " You're set for a comfortable retirement. Bravo!"}
      </p>
    </div>

    {/* Emergency Fund */}
    <div className="insight-card border-l-4 border-green-400">
      <h3 className="insight-title">🛟 Emergency Fund: {emergencyFundMonths} months</h3>
      <p className="insight-text">
        {emergencyFundMonths < 3
          ? "You're off to a good start — aim for 3-6 months’ worth of coverage."
          : "You’re safe and sound with a strong emergency cushion!"}
      </p>
    </div>
  </div>

  {/* Action Plan */}
  <div className="mt-10 p-6 bg-blue-950 rounded-xl border border-blue-700 shadow-xl">
    <h3 className="text-xl font-bold text-blue-300 mb-3">🎯 Action Plan</h3>
    <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm md:text-base">
      <li>Track expenses for 30 days to spot savings leaks.</li>
      <li>Set up auto-savings to build wealth hands-free.</li>
      <li>Pay off high-interest debt aggressively.</li>
      <li>Start an SIP in mutual funds for long-term growth.</li>
      <li>Review this dashboard monthly & course-correct.</li>
    </ul>
  </div>
</section>


              <section className="bg-green-50 p-6 rounded-2xl border-l-8 border-green-400 shadow-md">
  <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
    🪙 Progress Toward Your Savings Goal
  </h2>

  <div className="bg-white p-4 rounded-xl shadow-inner border border-green-200">
    <p className="text-gray-700 leading-relaxed text-lg">
      💰 You've saved <span className="text-green-700 font-semibold text-xl">₹{savings.toFixed(2)}</span> 
      toward your goal of <span className="text-green-700 font-semibold text-xl">₹{savingsGoal.toFixed(2)}</span>. 
      That’s enough to cover <span className="font-semibold text-green-600">6 months</span> of expenses!
    </p>

    <p className="text-sm text-gray-600 mt-3 italic">
      This emergency fund is your financial shield—nice work! 🛡️ Keep the momentum going!
    </p>
  </div>

  <p className="mt-4 text-sm font-medium text-green-800">
    ✅ {savingsProgress.toFixed(1)}% of your 6-month savings goal reached. You're on a roll!
  </p>
  <div className="mt-10 text-center">
  <button
    onClick={() => navigate('/investment')}
    style={{
      padding: '0.75rem 1.5rem',
      backgroundColor: '#f9a8d4', // soft pink
      color: '#fff',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = '#ec4899'; // deeper pink on hover
      e.target.style.transform = 'scale(1.03)';
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = '#f9a8d4';
      e.target.style.transform = 'scale(1)';
    }}
  >
    🚀 Unlock Your Future: Explore Investment Forecast →
  </button>
</div>

</section>

            </div>
            
          );
        })()
      )}
    </div>
  );
};

export default Report;