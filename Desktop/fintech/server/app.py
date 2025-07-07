from flask import Flask, request, jsonify

from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from PIL import Image
import pytesseract
import os
import joblib
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['fintechDB']
transactions_col = db['transactions']
budget_col = db['budget_limits']
profiles_col = db['profiles']  # For questionnaire data

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load ML model artifacts
model = joblib.load('model/bill_classifier_model.pkl')
vectorizer = joblib.load('model/tfidf_vectorizer.pkl')
label_encoder = joblib.load('model/label_encoder.pkl')


def extract_total_amount(text):
    patterns = [
        r'Total(?:\s+Amount)?\s*[:\-]?\s*₹?\s*(\d+[.,]?\d*)',
        r'Bill Amount\s*[:\-]?\s*₹?\s*(\d+[.,]?\d*)',
        r'Total due\s*[:\-]?\s*₹?\s*(\d+[.,]?\d*)',
        r'Amount\s*Payable\s*[:\-]?\s*₹?\s*(\d+[.,]?\d*)',
        r'Balance\s*Due\s*[:\-]?\s*₹?\s*(\d+[.,]?\d*)',
        r'TOTAL\s*[-–—]*\s*(\d+(?:\.\d{2})?)',
        r'(?i)total\s*[-–—]*\s*(\d+(?:\.\d{2})?)',  # matches TOTAL -- 1590.00
        r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)',  # fallback: any number with commas/decimals

    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).replace(",", "").strip()
    
    return None


def predict_category(text):
    text_vec = vectorizer.transform([text])
    pred_encoded = model.predict(text_vec)[0]
    pred_label = label_encoder.inverse_transform([pred_encoded])[0]
    return pred_label

# Add Transaction
@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    result = transactions_col.insert_one(data)
    return jsonify({"msg": "Transaction added", "id": str(result.inserted_id)}), 201

# Get Transactions
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    user_id = request.args.get('userId')  # Get userId from query parameter
    if not user_id:
        return jsonify({'error': 'userId is required'}), 400
    
    transactions = []
    for txn in transactions_col.find({'userId': user_id}):
        txn['_id'] = str(txn['_id'])
        transactions.append(txn)
    
    return jsonify(transactions), 200
# Delete Transaction
@app.route('/api/transactions/<string:txn_id>', methods=['DELETE'])
def delete_transaction(txn_id):
    result = transactions_col.delete_one({'_id': ObjectId(txn_id)})
    if result.deleted_count == 1:
        return jsonify({"msg": "Transaction deleted"}), 200
    else:
        return jsonify({"error": "Transaction not found"}), 404

# OCR Upload
@app.route('/api/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']

    print("🔍 File received:", file.filename)
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        img = Image.open(file.stream)
        extracted_text = pytesseract.image_to_string(img, config="--psm 6")

        print("📄 OCR Extracted:", extracted_text)

        if not extracted_text.strip():
            return jsonify({'error': 'Text could not be extracted from image'}), 400

        predicted_category = predict_category(extracted_text)
        print("🔮 Predicted category:", predicted_category)
        total_amount = extract_total_amount(extracted_text) 

        return jsonify({
            'extracted_text': extracted_text,
            'predicted_category': predicted_category,
            'total_amount': total_amount
        })
    except Exception as e:
        print("❌ OCR processing failed:", e)
        return jsonify({'error': 'OCR processing failed', 'details': str(e)}), 500


# Set or update budget limits
@app.route('/api/budget', methods=['POST'])
def set_budget():
    data = request.json
    daily = data.get('daily_limit')
    monthly = data.get('monthly_limit')

    if not isinstance(daily, (int, float)) or not isinstance(monthly, (int, float)):
        return jsonify({"error": "Invalid data type"}), 400

    budget_col.delete_many({})
    budget_col.insert_one({"daily_limit": daily, "monthly_limit": monthly})
    return jsonify({"msg": "Budget limits saved"}), 201

# Save questionnaire/profile data
@app.route('/api/questionnaire', methods=['POST'])
def save_profile():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    profiles_col.replace_one({"user_id": user_id}, data, upsert=True)
    return jsonify({"msg": "Profile saved successfully"}), 201

# ✅ NEW: Get questionnaire/profile data
@app.route('/api/questionnaire/<string:user_id>', methods=['GET'])
def get_profile(user_id):
    print("Fetching profile for user_id:", user_id)
    profile = profiles_col.find_one({"user_id": user_id})
    print("Profile found:", profile)
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    profile['_id'] = str(profile['_id'])
    return jsonify(profile), 200


# Generate financial report
@app.route('/api/report', methods=['GET'])
def financial_report():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    profile = profiles_col.find_one({"user_id": user_id})
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    budget = budget_col.find_one()
    if not budget:
        return jsonify({"error": "No budget set yet"}), 404

    now = datetime.now()
    today_start = datetime(now.year, now.month, now.day)
    month_start = datetime(now.year, now.month, 1)

    def parse_date(txn):
        txn_date = txn.get("date")
        if txn_date:
            try:
                return datetime.fromisoformat(txn_date.replace('Z', ''))
            except:
                return None
        return None

    transactions = list(transactions_col.find({"user_id": user_id}))
    today_txns = [txn for txn in transactions if (d := parse_date(txn)) and d >= today_start]
    month_txns = [txn for txn in transactions if (d := parse_date(txn)) and d >= month_start]

    total_today = sum(float(txn['amount']) for txn in today_txns)
    total_month = sum(float(txn['amount']) for txn in month_txns)

    category_totals = {}
    for txn in month_txns:
        cat = txn.get('category', 'Other')
        category_totals[cat] = category_totals.get(cat, 0) + float(txn['amount'])

    sorted_cats = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)
    top_categories = sorted_cats[:5]

    income = profile.get("monthly_income", 0) + profile.get("other_income", 0)
    savings = income - total_month
    savings_rate = savings / income if income > 0 else 0

    total_debt = sum([
        profile.get("liabilities", {}).get("debts", 0),
        profile.get("liabilities", {}).get("loans", 0),
        profile.get("liabilities", {}).get("credit_card_balance", 0)
    ])
    dti_ratio = total_debt / income if income > 0 else 0

    recommended_fund_months = 3
    emergency_fund_months = profile.get("emergency_fund_months", 0)
    emergency_fund_status = "Adequate" if emergency_fund_months >= recommended_fund_months else "Insufficient"

    retirement_age = profile.get("retirement", {}).get("target_age", 65)
    current_age = profile.get("retirement", {}).get("current_age", 30)
    years_to_retirement = max(retirement_age - current_age, 0)

    advice = []
    if savings_rate < 0.1:
        advice.append("Try to increase your savings rate to at least 10% of your income.")
    if dti_ratio > 0.4:
        advice.append("Your debt to income ratio is high; consider paying down debts.")
    if emergency_fund_status == "Insufficient":
        advice.append("Build a larger emergency fund of at least 3 months' expenses.")
    if total_today > budget['daily_limit']:
        advice.append("You're exceeding your daily budget today.")
    if total_month > budget['monthly_limit']:
        advice.append("You're exceeding your monthly budget.")
    if top_categories:
        advice.append(f"Top spending category this month: {top_categories[0][0]}.")

    return jsonify({
        "income": income,
        "totalSpent": total_month,
        "savings": savings,
        "savings_rate": savings_rate,
        "debt_to_income_ratio": dti_ratio,
        "emergency_fund_status": emergency_fund_status,
        "years_to_retirement": years_to_retirement,
        "dailyLimit": budget['daily_limit'],
        "monthlyLimit": budget['monthly_limit'],
        "categoryTotals": category_totals,
        "top_categories": top_categories,
        "advice": advice
    }), 200

if __name__ == '__main__':
    app.run(debug=True)