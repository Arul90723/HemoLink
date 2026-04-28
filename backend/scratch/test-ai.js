async function testAI() {
  const key = "AIzaSyCK5QT4OUbSl0vfkeJKkdQAkN8x3L3PKRo";
  try {
    console.log("Testing raw fetch v1...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: "Hi" }] }] })
    });
    const data = await response.json();
    console.log("V1 Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("V1 failed:", err.message);
  }
}

testAI();
