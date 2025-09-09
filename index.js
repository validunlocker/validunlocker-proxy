const express = require('express');
const axios = require('axios');
const qs = require('qs');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load environment variables
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'validunlocker2025';
const DHRU_ENDPOINT = process.env.DHRU_ENDPOINT || 'https://www.validunlocker.com/api/index.php';
const DHRU_USERNAME = process.env.DHRU_USERNAME || 'dawit';
const DHRU_API_KEY = process.env.DHRU_API_KEY || 'S8Q-PA-L3C-LTJ-KD5-L77-MEN-UE7';

app.post('/', async (req, res) => {
  const token = req.query.auth;
  if (token !== AUTH_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const action = req.body.action;
  if (!action) {
    return res.status(400).json({ error: 'Missing action' });
  }

  const payload = {
    username: DHRU_USERNAME,
    apiaccesskey: DHRU_API_KEY,
    action: action,
    requestformat: 'JSON'
  };

  console.log('🔍 Sending form-encoded payload to DHRU:', payload);

  try {
    const response = await axios.post(DHRU_ENDPOINT, qs.stringify(payload), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('❌ Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy running on port ${PORT}`);
});
