require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testLocal() {
  const apiKey = "AIzaSyBkTtCF-iRxcN4IEbvfwsARWLGrVOyCwJs";
  const https = require('https');

  console.log("Listing models for NEW Project Key...");
  https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, (res) => {
    let body = "";
    res.on("data", (chunk) => body += chunk);
    res.on("end", () => {
      try {
        const data = JSON.parse(body);
        if (data.models) {
          console.log("Found Models:");
          data.models.forEach(m => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
              console.log(`- ${m.name}`);
            }
          });
        } else {
          console.log("Error Listing Models:", data.error?.message || body);
        }
      } catch (e) {
        console.error("Parse Error:", e.message);
      }
    });
  }).on("error", (e) => {
    console.error("Request Error:", e.message);
  });
}

testLocal();
