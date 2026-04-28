const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAI() {
  const key = "AIzaSyCK5QT4OUbSl0vfkeJKkdQAkN8x3L3PKRo";
  const genAI = new GoogleGenerativeAI(key);
  
  const modelsToTest = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.5-flash-latest'];
  
  for (const modelName of modelsToTest) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, are you active?");
      const response = await result.response;
      console.log(`SUCCESS [${modelName}]: ${response.text()}`);
      return; // Stop if one works
    } catch (err) {
      console.log(`FAILED [${modelName}]: ${err.message}`);
    }
  }
}

testAI();
