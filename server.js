const express = require('express');
const axios = require('axios');
const cors = require('cors');  // Add this line

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());  // Add this line

// Middleware to parse JSON bodies
app.use(express.json());

async function checkEmail(email) {
  const url = 'https://melink.vn/checkmail/checkemail.php';
  const data = `email=${encodeURIComponent(email)}`;

  try {
    const response = await axios({
      method: 'post',
      url: url,
      headers: {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Microsoft Edge\";v=\"128\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      data: data,
      withCredentials: true,
      maxRedirects: 0,
    });

    const html = response.data;
    if (html.includes('Valid')) {
      return { status: 'valid', message: 'Email is valid' };
    } else if (html.includes('Invalid')) {
      return { status: 'invalid', message: 'Email is invalid' };
    } else {
      return { status: 'unknown', message: 'Unexpected response', response: html };
    }
  } catch (error) {
    console.error('Error:', error.message);
    throw new Error('Error checking email');
  }
}

app.post('/check-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const result = await checkEmail(email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:3000`);
});