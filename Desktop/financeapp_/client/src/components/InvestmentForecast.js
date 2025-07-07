import React, { useState,useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './InvestmentForecast.css';
import { getQuestionnaire } from '../services/api';

const InvestmentForecast = () => {
  const [investmentPercentage, setInvestmentPercentage] = useState(25);
  
  // Sample user profile data
  const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const data = await getQuestionnaire();
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
}, []);
if (loading) return <div className="text-center text-white mt-10 text-xl">🔄 Fetching your profile...</div>;

if (!profile) return <div className="text-center text-red-500 mt-10 text-lg">⚠️ Could not load your financial profile</div>;

  // Enhanced investment options with detailed explanations
  const investmentOptions = {
    low: [
      { 
        name: 'Public Provident Fund (PPF)', 
        shortName: 'PPF',
        type: 'Government Scheme', 
        risk: 'Very Low', 
        returnRate: 7.1,
        lockIn: '15 years',
        taxBenefit: true,
        icon: '🏛️',
        description: 'Government-backed savings scheme with guaranteed tax-free returns',
        detailed_explanation: 'PPF is one of the safest investment options in India. Your money is completely secure as it\'s backed by the Government of India. The interest earned is tax-free, and you also get tax deduction on the amount invested.',
        pros: ['100% safe and government guaranteed', 'Tax-free returns', 'Tax deduction under 80C'],
        cons: ['15-year lock-in period', 'Limited annual investment (₹1.5L)', 'Lower liquidity'],
        bestFor: 'Long-term wealth creation and retirement planning'
      },
      { 
        name: 'Fixed Deposits', 
        shortName: 'Bank FD',
        type: 'Bank Product', 
        risk: 'Very Low', 
        returnRate: 6.5,
        lockIn: 'Flexible',
        taxBenefit: false,
        icon: '🏦',
        description: 'Traditional bank savings with guaranteed returns and flexible tenure',
        detailed_explanation: 'Fixed Deposits are the most traditional form of investment where you deposit money with a bank for a fixed period at a predetermined interest rate. Your principal is completely safe.',
        pros: ['Guaranteed returns', 'Flexible tenure options', 'Easy to understand'],
        cons: ['Interest is taxable', 'Returns may not beat inflation', 'Penalty for early withdrawal'],
        bestFor: 'Emergency funds and short-term financial goals'
      },
      { 
        name: 'Debt Mutual Funds', 
        shortName: 'Debt Funds',
        type: 'Mutual Fund', 
        risk: 'Low', 
        returnRate: 6.8,
        lockIn: 'None',
        taxBenefit: false,
        icon: '📊',
        description: 'Professional management of government and corporate bonds',
        detailed_explanation: 'These funds invest in government securities, corporate bonds, and money market instruments. Professional fund managers handle the investment decisions, providing better returns than traditional FDs.',
        pros: ['Professional management', 'Better liquidity than FDs', 'Diversified portfolio'],
        cons: ['Market risk involved', 'Exit load may apply', 'Returns not guaranteed'],
        bestFor: 'Conservative investors seeking better returns than FDs'
      },
      { 
        name: 'Sovereign Gold Bonds', 
        shortName: 'Gold Bonds',
        type: 'Government Bond', 
        risk: 'Medium', 
        returnRate: 6.8,
        lockIn: '8 years',
        taxBenefit: true,
        icon: '🪙',
        description: 'Digital gold investment with additional interest income',
        detailed_explanation: 'These are government securities denominated in grams of gold. You get the benefit of gold price appreciation plus an additional 2.5% annual interest. No storage or purity concerns like physical gold.',
        pros: ['Gold price appreciation + interest', 'No storage hassles', 'Tax benefits on maturity'],
        cons: ['8-year lock-in', 'Gold price volatility', 'Limited trading liquidity'],
        bestFor: 'Hedging against inflation and currency devaluation'
      },
    ],
  medium : [
      { 
        name: 'Balanced Mutual Funds', 
        shortName: 'Hybrid Funds',
        type: 'Mutual Fund', 
        risk: 'Medium', 
        returnRate: 9,
        lockIn: 'None',
        taxBenefit: false,
        icon: '⚖️',
        description: 'Perfect balance of growth and stability through equity-debt mix',
        detailed_explanation: 'These funds invest in both stocks (for growth) and bonds (for stability). The fund manager automatically balances the portfolio based on market conditions, giving you the best of both worlds.',
        pros: ['Balanced risk-return profile', 'Professional rebalancing', 'Good for beginners'],
        cons: ['Moderate returns', 'Management fees', 'Market dependency'],
        bestFor: 'First-time investors wanting balanced growth'
      },
      { 
        name: 'Index Funds', 
        shortName: 'Index Funds',
        type: 'Passive Fund', 
        risk: 'Medium', 
        returnRate: 10,
        lockIn: 'None',
        taxBenefit: false,
        icon: '📈',
        description: 'Mirror the stock market performance with minimal fees',
        detailed_explanation: 'These funds replicate popular stock market indices like Nifty 50 or Sensex. You get market returns without the guesswork of stock picking. Very low management fees make them cost-effective.',
        pros: ['Low expense ratios', 'Market-matching returns', 'Transparent strategy'],
        cons: ['No potential for beating market', 'Market risk', 'No active management'],
        bestFor: 'Long-term investors who believe in market growth'
      },
      { 
        name: 'Real Estate Investment Trusts', 
        shortName: 'REITs',
        type: 'Real Estate', 
        risk: 'Medium', 
        returnRate: 8,
        lockIn: 'None',
        taxBenefit: false,
        icon: '🏢',
        description: 'Invest in real estate without buying property',
        detailed_explanation: 'REITs allow you to invest in commercial real estate like office buildings, malls, and warehouses without actually buying property. You earn rental income and capital appreciation.',
        pros: ['Real estate exposure', 'Regular dividend income', 'Professional management'],
        cons: ['Interest rate sensitive', 'Limited options in India', 'Market volatility'],
        bestFor: 'Diversification and regular income seekers'
      },
      { 
        name: 'Corporate Bonds', 
        shortName: 'Corp Bonds',
        type: 'Fixed Income', 
        risk: 'Low-Medium', 
        returnRate: 7.5,
        lockIn: 'Varies',
        taxBenefit: false,
        icon: '🏢',
        description: 'Lend money to companies and earn fixed interest',
        detailed_explanation: 'When you buy corporate bonds, you\'re lending money to companies. In return, they pay you fixed interest at regular intervals. Higher returns than government bonds but with slightly higher risk.',
        pros: ['Fixed income stream', 'Higher than FD returns', 'Diversification option'],
        cons: ['Credit risk involved', 'Interest rate risk', 'Limited liquidity'],
        bestFor: 'Income-focused conservative investors'
      },
    ],
    high: [
      { 
        name: 'Equity Mutual Funds', 
        shortName: 'Equity Funds',
        type: 'Mutual Fund', 
        risk: 'High', 
        returnRate: 12,
        lockIn: 'None',
        taxBenefit: false,
        icon: '🚀',
        description: 'Professional stock market investment for high growth potential',
        detailed_explanation: 'These funds invest primarily in stocks of companies. Professional fund managers research and select the best stocks to maximize returns. Historical data shows excellent long-term performance despite short-term volatility.',
        pros: ['High growth potential', 'Professional management', 'Diversification across stocks'],
        cons: ['High volatility', 'Market risk', 'No guaranteed returns'],
        bestFor: 'Long-term wealth creation and beating inflation'
      },
      { 
        name: 'Direct Stock Investment', 
        shortName: 'Direct Stocks',
        type: 'Equity', 
        risk: 'Very High', 
        returnRate: 15,
        lockIn: 'None',
        taxBenefit: false,
        icon: '�',
        description: 'Own shares of companies directly for maximum growth potential',
        detailed_explanation: 'Buy shares of individual companies and become a part-owner. Requires research and market knowledge but offers the highest potential returns. Warren Buffett built his wealth through stock investing.',
        pros: ['Unlimited growth potential', 'No management fees', 'Direct ownership benefits'],
        cons: ['Requires expertise', 'High risk of losses', 'Time-intensive research needed'],
        bestFor: 'Experienced investors with time and knowledge'
      },
      { 
        name: 'Small Cap Funds', 
        shortName: 'Small Cap',
        type: 'Mutual Fund', 
        risk: 'Very High', 
        returnRate: 14,
        lockIn: 'None',
        taxBenefit: false,
        icon: '🌱',
        description: 'Invest in small growing companies with explosive potential',
        detailed_explanation: 'These funds invest in small companies that are in their growth phase. While risky, they have historically provided the highest returns as small companies can grow very fast.',
        pros: ['Highest growth potential', 'Early-stage company exposure', 'Potential for multibagger returns'],
        cons: ['Extremely volatile', 'Higher risk of losses', 'Illiquid during stress'],
        bestFor: 'Young aggressive investors with long investment horizon'
      },
      { 
        name: 'Sectoral Funds', 
        shortName: 'Sector Funds',
        type: 'Thematic Fund', 
        risk: 'High', 
        returnRate: 13,
        lockIn: 'None',
        taxBenefit: false,
        icon: '🎯',
        description: 'Focused investment in specific sectors like tech or pharma',
        detailed_explanation: 'These funds invest in companies from specific sectors like technology, pharma, or banking. When a sector performs well, these funds can give exceptional returns.',
        pros: ['Sector-specific exposure', 'High return potential', 'Capitalize on sector trends'],
        cons: ['Concentrated risk', 'Sector-dependent performance', 'Requires timing'],
        bestFor: 'Investors with strong sector conviction and risk appetite'
      },
    ],
  };

  // Strategic allocation percentages by risk profile
  const allocationStrategies = {
  low : [40, 30, 20, 10],
    medium : [35, 30, 25, 10],
    high : [40, 30, 20, 10],
  };

  const monthlyInvestment = profile.monthly_income * (investmentPercentage / 100);
  const riskProfile = profile.risk_tolerance.toLowerCase();
  const options = investmentOptions[riskProfile];
  const allocations = allocationStrategies[riskProfile];

  // Calculate SIP future value
  const calculateSIPValue = (monthlyAmount, annualRate, years) => {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) return monthlyAmount * months;
    return monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  };

  // Create investment plan
  const plans = options.map((opt, index) => {
    const percent = allocations[index] || (100 / options.length);
    const amount = (monthlyInvestment * percent) / 100;
    const fiveYearValue = calculateSIPValue(amount, opt.returnRate, 5);
    const totalInvested = amount * 12 * 5;
    const estimatedReturn = fiveYearValue - totalInvested;
    
    return {
      ...opt,
      percent: percent.toFixed(1),
      amount: Math.round(amount),
      estimatedReturn: Math.round(estimatedReturn),
      fiveYearValue: Math.round(fiveYearValue),
      totalInvested: Math.round(totalInvested),
    };
  });

  const totalFiveYearValue = plans.reduce((sum, plan) => sum + plan.fiveYearValue, 0);
  const totalInvested = monthlyInvestment * 12 * 5;
  const totalReturns = totalFiveYearValue - totalInvested;

  // Chart data
  const years = [1, 2, 3, 5, 10, 15, 20];
  const chartData = years.map(year => ({
    year: `${year}yr`,
    'Portfolio Value': Math.round(plans.reduce((sum, plan) => sum + calculateSIPValue(plan.amount, plan.returnRate, year), 0)),
    'Total Invested': Math.round(monthlyInvestment * 12 * year)
  }));

  const RiskIndicator = ({ risk }) => {
    const getRiskColor = (risk) => {
      switch(risk.toLowerCase()) {
        case 'very low': return 'bg-green-500 text-white';
        case 'low': return 'bg-green-400 text-white';
        case 'low-medium': return 'bg-yellow-500 text-white';
        case 'medium': return 'bg-orange-500 text-white';
        case 'high': return 'bg-red-500 text-white';
        case 'very high': return 'bg-red-600 text-white';
        default: return 'bg-gray-500 text-white';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk)}`}>
        {risk} Risk
      </span>
    );
  };

  // Common transparent card styling
  const transparentCardClasses = "bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-600 border-opacity-30 transition-all duration-300 ease-in-out hover:shadow-2xl";
  const headerGradientText = "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600";

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="header-container">
          <h1 className="header-text">💰 Your Personalized Investment Plan</h1>
          <p className="subheader-text">
            Based on your <span className="highlight">{profile.risk_tolerance}</span> risk profile 
            and monthly income of ₹{profile.monthly_income.toLocaleString()}
          </p>
        </div>

        {/* Investment Amount Controller */}
        <div className={`${transparentCardClasses} mb-10`}>
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-100">🎯 Set Your Investment Amount</h3>
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-6 mb-4">
              <span className="text-sm font-medium text-gray-300 min-w-0">5%</span>
              <div className="flex-1">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={investmentPercentage}
                  onChange={(e) => setInvestmentPercentage(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <span className="text-sm font-medium text-gray-300 min-w-0">50%</span>
              <div className="bg-blue-600 bg-opacity-30 backdrop-filter backdrop-blur-sm px-4 py-2 rounded-lg min-w-0 border border-blue-500 border-opacity-50">
                <span className="font-bold text-white">{investmentPercentage}%</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400 mb-2">₹{monthlyInvestment.toLocaleString()}/month</p>
              <p className="text-gray-300">That's ₹{Math.round(monthlyInvestment/30).toLocaleString()} per day - less than a coffee!</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Each summary card gets a distinct gradient for visual appeal, maintaining transparency feel */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 bg-opacity-70 p-6 rounded-2xl shadow-lg border border-green-500 border-opacity-50">
            <div className="text-center">
              <p className="text-green-200 text-sm mb-1">Monthly Investment</p>
              <p className="text-2xl font-bold text-white">₹{monthlyInvestment.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 bg-opacity-70 p-6 rounded-2xl shadow-lg border border-blue-500 border-opacity-50">
            <div className="text-center">
              <p className="text-blue-200 text-sm mb-1">5-Year Investment</p>
              <p className="text-2xl font-bold text-white">₹{totalInvested.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 bg-opacity-70 p-6 rounded-2xl shadow-lg border border-purple-500 border-opacity-50">
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-1">Expected Value</p>
              <p className="text-2xl font-bold text-white">₹{totalFiveYearValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 bg-opacity-70 p-6 rounded-2xl shadow-lg border border-orange-500 border-opacity-50">
            <div className="text-center">
              <p className="text-orange-200 text-sm mb-1">Profit Expected</p>
              <p className="text-2xl font-bold text-white">₹{totalReturns.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Investment Plan Cards */}
        {/* Investment Plan Cards */}
<div className="mb-10">
  <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">
    🎯 Your Investment Strategy Explained
  </h2>
  <div className="plan-cards-2x2">

    {plans.map((plan, idx) => (
      <div key={idx} className={`plan-card plan-card-${idx + 1} hover-effect`}>
        {/* Card Header */}
        <div className="card-header">
          <div className="header-top">
            <div className="icon-title">
              <span className="icon">{plan.icon}</span>
              <div>
                <h3 className="title">{plan.shortName}</h3>
                <p className="type">{plan.type}</p>
              </div>
            </div>
            <div className="allocation-box">
              <div className="allocation-percent">{plan.percent}%</div>
              <RiskIndicator risk={plan.risk} />
            </div>
          </div>
          {plan.taxBenefit && (
            <div className="tax-benefit">🎉 Tax Benefits Available</div>
          )}
          <p className="description">{plan.description}</p>
        </div>

        {/* Investment Details */}
        <div className="card-body">
          <div className="grid-2">
            <div className="detail-box">
              <p className="label">Monthly SIP</p>
              <p className="value">₹{plan.amount.toLocaleString()}</p>
            </div>
            <div className="detail-box">
              <p className="label">Expected Return</p>
              <p className="value">{plan.returnRate}% p.a.</p>
            </div>
            <div className="detail-box">
              <p className="label">5-Year Value</p>
              <p className="value">₹{plan.fiveYearValue.toLocaleString()}</p>
            </div>
            <div className="detail-box">
              <p className="label">Profit</p>
              <p className="value">₹{plan.estimatedReturn.toLocaleString()}</p>
            </div>
          </div>

          {/* Explanation */}
          <div className="explanation">
            <h4 className="section-title">💡 What is this?</h4>
            <p className="text">{plan.detailed_explanation}</p>

            <div className="info-box">
              <p><strong>Lock-in Period:</strong> {plan.lockIn}</p>
              <p><strong>Best For:</strong> {plan.bestFor}</p>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="pros-cons">
            <div className="pros">
              <h5 className="subheading">✅ Advantages</h5>
              <ul>
                {plan.pros.map((pro, i) => (
                  <li key={i}>• {pro}</li>
                ))}
              </ul>
            </div>
            <div className="cons">
              <h5 className="subheading">⚠️ Things to Consider</h5>
              <ul>
                {plan.cons.map((con, i) => (
                  <li key={i}>• {con}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Growth Chart */}
        <div className={`${transparentCardClasses} mb-10`}>
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-100">📈 Watch Your Money Grow</h3>
          <div style={{ height: '320px' }}>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /> {/* Darker grid lines */}
                <XAxis dataKey="year" stroke="#cbd5e0" />
                <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} stroke="#cbd5e0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '8px', backdropFilter: 'blur(10px)' }} 
                  labelStyle={{ color: '#cbd5e0' }} 
                  itemStyle={{ color: '#cbd5e0' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, '']} 
                />
                <Legend wrapperStyle={{ color: '#cbd5e0' }} />
                <Line 
                  type="monotone" 
                  dataKey="Portfolio Value" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Total Invested" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
        

          </div>
          <p className="text-center text-gray-300 mt-4">
            The gap between lines shows your profit! 📊
          </p>
        </div>

        {/* Success Tips */}
        <div className={`${transparentCardClasses} bg-gradient-to-r from-blue-700 to-purple-700 bg-opacity-70 p-8`}>
          <h3 className="text-2xl font-bold text-center mb-8 text-white">🚀 Tips for Investment Success</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-white border-opacity-30">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-bold mb-2 text-white">Start Early</h4>
              <p className="text-sm text-gray-200">Time is your biggest ally in investing. The earlier you start, the more your money grows through compounding.</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-white border-opacity-30">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="font-bold mb-2 text-white">Stay Consistent</h4>
              <p className="text-sm text-gray-200">Regular investing through SIPs helps you average out market volatility and build wealth systematically.</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-white border-opacity-30">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="font-bold mb-2 text-white">Keep Learning</h4>
              <p className="text-sm text-gray-200">Stay informed about your investments and market trends. Knowledge helps you make better financial decisions.</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className={`${transparentCardClasses} bg-yellow-800 bg-opacity-30 border-yellow-600 p-6 mt-8`}>
          <p className="text-sm text-yellow-200">
            <strong>📝 Important Note:</strong> This is an educational tool based on historical data and assumptions. 
            Actual returns may vary due to market conditions. Please consult a qualified financial advisor for personalized investment advice.
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6; /* Blue-500 */
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          border: 2px solid #bfdbfe; /* Blue-200 for contrast */
        }
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #3b82f6; /* Blue-500 */
          cursor: pointer;
          border: 2px solid #bfdbfe; /* Blue-200 for contrast */
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default InvestmentForecast;
