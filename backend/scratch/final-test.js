const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAI() {
  const key = "AIzaSyCK5QT4OUbSl0vfkeJKkdQAkN8x3L3PKRo";
  const genAI = new GoogleGenerativeAI(key);
  
  // Try different ways to call the model
  const models = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.5-flash-latest'];
  
  for (const m of models) {
    try {
      console.log(`Testing ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Say 'HemoLink is Active'");
      const response = await result.response;
      console.log(`SUCCESS [${m}]: ${response.text()}`);
      return;
    } catch (e) {
      console.log(`FAILED [${m}]: ${e.message}`);
    }
  }
}

testAI();
