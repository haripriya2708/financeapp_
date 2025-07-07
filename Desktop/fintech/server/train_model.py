import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.naive_bayes import MultinomialNB
import joblib

# Load dataset
data = pd.read_csv('data\bill_dataset.csv')

# Features and labels
X = data['description']
y = data['category']

# Vectorizer and label encoding
vectorizer = TfidfVectorizer(max_features=3000, ngram_range=(1,2))
X_vec = vectorizer.fit_transform(X)

label_encoder = LabelEncoder()
y_enc = label_encoder.fit_transform(y)

# Train model using Multinomial Naive Bayes
model = MultinomialNB()
model.fit(X_vec, y_enc)

# Save model artifacts
joblib.dump(model, 'model/bill_classifier_model.pkl')
joblib.dump(vectorizer, 'model/tfidf_vectorizer.pkl')
joblib.dump(label_encoder, 'model/label_encoder.pkl')

print("✅ Training done with MultinomialNB. Model files saved.")
