// login.js (example)
import axios from 'axios';

async function loginUser(username, password) {
  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      username,
      password
    });

    const token = response.data.token;
    localStorage.setItem('token', token); // Store the token securely
    alert('Login successful!');
  } catch (err) {
    alert('Login failed: ' + err.response.data.error);
  }
}
