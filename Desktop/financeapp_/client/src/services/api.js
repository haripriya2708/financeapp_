const API_BASE = 'https://finance-backend-ukuv.onrender.com/api';


// ✅ Add Transaction
export const addTransaction = async (transaction) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not logged in');

    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...transaction, userId }),
    });

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ✅ Get Transactions
export const getTransactions = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) throw new Error('User not logged in');
  console.log('Fetching transactions for userId:', userId);


    const response = await fetch(`${API_BASE}/transactions?userId=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } 

// ✅ Delete Transaction
export const deleteTransaction = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/transactions/${id}`, {
      method: 'DELETE',
    });

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ✅ Upload image for OCR
export const uploadImageForOCR = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE}/ocr`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to extract or classify text');
    }

    console.log("✅ OCR Response:", result);
    return result;
  } catch (error) {
    console.error('🔥 OCR Upload Error:', error);
    throw error;
  }
};

// ✅ Get questionnaire/profile data
export const getQuestionnaire = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User not logged in');

    const response = await fetch(`${API_BASE}/questionnaire/${userId}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
