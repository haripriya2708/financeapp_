Personal Finance Management App
Track your expenses, get smart reports, and plan your investments — all in one place.

Demo Video - https://drive.google.com/file/d/1_Ci5czNE3lq-dWBvoXByyvFrtHrINydT/view?usp=sharing


Features
📥 Expense & Income Tracker – Manually input or upload receipts via OCR
🧠 Smart Reports – Visual insights like pie charts and bar graphs for savings, EMI, etc.
💡 Investment Forecasting – Suggests where to invest (e.g., Mutual Funds, PPF, Stocks)
📊 Financial Health Score – Calculates savings rate, debt-to-income ratio, and more

Tech Stack
| Frontend            | Backend        | Data Handling         | Charts / Visualization |
| ------------------- | -------------- | --------------------- | ---------------------- |
| React               | Flask (Python) | Pandas, Scikit-learn  | Chart.js, React Charts |
| HTML + CSS          | Flask REST API | NumPy, StandardScaler |                        |
| Axios, React Router |                | Joblib (for model)    |                        |

Prerequisites
Node.js & npm
Python 3.9+
pip or conda

Run Locally
1. Clone the repo
git clone https://github.com/haripriya2708/financeapp_.git
cd financeapp_
2. Start Frontend
   cd client
   npm install
   npm start
3. Start the backend
   cd ../server
   pip install -r requirements.txt
   python app.py
4. Open http://localhost:3000 
