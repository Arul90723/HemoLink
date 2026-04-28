async function testAI() {
  const key = "AIzaSyCK5QT4OUbSl0vfkeJKkdQAkN8x3L3PKRo";
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("List failed:", err.message);
  }
}

testAI();
