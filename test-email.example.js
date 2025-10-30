// Simple Mailgun test email script
// Copy this file to test-email.js and add your credentials
const https = require('https');

const API_KEY = 'your-mailgun-api-key-here';
const DOMAIN = 'your-mailgun-domain-here';

const data = new URLSearchParams({
  from: 'Mailgun Sandbox <postmaster@your-domain-here>',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'This is a test email!'
});

const auth = Buffer.from(`api:${API_KEY}`).toString('base64');

const options = {
  hostname: 'api.mailgun.net',
  port: 443,
  path: `/v3/${DOMAIN}/messages`,
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.toString().length
  }
};

console.log('Sending test email...\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', responseData);
    
    if (res.statusCode === 200) {
      console.log('\n✅ Email sent successfully!');
    } else {
      console.log('\n❌ Failed to send email');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data.toString());
req.end();

