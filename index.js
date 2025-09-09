const express = require('express');
const axios = require('axios');
const qs = require('qs');
const rateLimit = require('express-rate-limit');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rate limiter: max 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests. Please slow down.' }
});
app.use(limiter);

// Environment variables
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'validunlocker2025';
const DHRU_ENDPOINT = process.env.DHRU_ENDPOINT || 'https://www.habeshaunlocker.com/api/index.php';
const DHRU_USERNAME = process.env.DHRU_USERNAME || 'supplier_user';
const DHRU_API_KEY = process.env.DHRU_API_KEY || 'supplier_api_key';

app.post('/', async (req, res) => {
  const token = req.query.auth;
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  console.log(`🔐 Incoming request from IP: ${clientIP}`);

  if (token !== AUTH_TOKEN) {
    console.warn(`❌ Unauthorized access attempt from ${clientIP}`);
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

  console.log('📤 Forwarding to DHRU with:', payload);

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
  console.log(`✅ Secure proxy running on port ${PORT}`);
});
