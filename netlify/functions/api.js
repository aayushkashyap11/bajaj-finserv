const express = require('express');
const { createServer } = require('http');
const { parse } = require('querystring');
const { Handler } = require('@netlify/functions');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.post('/bfhl', (req, res) => {
  const { status, userID, collegeEmail, collegeRollNumber, numbers, alphabets } = req.body;

  if (!status || !userID || !collegeEmail || !collegeRollNumber || !Array.isArray(numbers) || !Array.isArray(alphabets)) {
    return res.status(400).json({ is_success: false, message: 'Invalid input data' });
  }

  const user_id = `${userID.toLowerCase().replace(/\s/g, '_')}_${new Date().toLocaleDateString('en-GB').split('/').reverse().join('')}`;
  
  res.status(200).json({
    status,
    user_id,
    collegeEmail,
    collegeRollNumber,
    numbers,
    alphabets,
    is_success: true
  });
});

const server = createServer(app);
exports.handler = async (event, context) => {
  const req = { method: event.httpMethod, url: event.path, headers: event.headers, body: event.body };
  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader: (name, value) => { res.headers[name] = value; },
    end: (body) => { res.body = body; }
  };

  return new Promise((resolve) => {
    server.emit(req.method, req, res);
    res.on('finish', () => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: res.body
      });
    });
  });
};
