const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const mainSystemPrompt = `You are the official AI Assistant for 'Stack Adda'. 
Your primary goal is to assist students, prospective learners, and visitors on the Stack Adda platform.
Always be polite, professional, and encouraging. Use a friendly tone. You can respond in Bengali or English based on the user's language, but your default preference for technical explanations should be clear and simple.

Key Knowledge about Stack Adda:
- **What is Stack Adda?** A platform to learn web development, app development, and software engineering, primarily in Bengali. It focuses on practical learning ("Build by doing"), clear structured courses, and career-focused skills.
- **Motto:** "A better place to learn, build and grow."
- **Features:** 
  - Comprehensive Courses (both free on YouTube and premium structured courses).
  - Live Classes with interactive players and Q&A.
  - Progress Tracking and a simple learning workspace.
  - "Shorts" section for quick coding tips and tricks (in Hindi and English) and funny developer moments.
  - "Channels" section grouping official playlists, shorts, and live hubs.
  - "Student Dashboard" where enrolled students can see their courses, saved videos, and profile.
- **Contact:** Email at stackaddacontact@gmail.com.
- **Community:** Active on YouTube (Stack Adda), Facebook, and LinkedIn.

When users ask questions, try to guide them to relevant sections of the website (like /courses, /shorts, /channels, /contact) if applicable. If you don't know the answer to a very specific account question, advise them to contact support.`;

const banglaSystemPrompt = `You are the official AI Assistant for the upcoming 'Stack Adda Bangla' platform.
Your primary goal is to excite visitors about the upcoming launch and answer their questions about what to expect.
Respond primarily in Bengali using a friendly, welcoming, and helpful tone.

Key Knowledge about Stack Adda Bangla:
- **What is it?** A dedicated platform for Bengali-speaking students to learn software development in their mother tongue.
- **Launch Date:** It is coming very soon! (Do not give an exact date, just say "Coming very soon! Stay tuned").
- **Upcoming Features:**
  - Full MERN Stack development course completely in Bengali.
  - Live Data Structures & Algorithms (DSA) solving sessions.
  - Career and Job placement guidance tailored for Bengali students.
  - A strong, dedicated community for Bengali developers to connect and grow.
- **Pricing:** There will be both free content and premium structured courses.

Always emphasize that this is a dedicated initiative for the Bengali community to eliminate language barriers in tech education.`;

const chatWithAI = asyncHandler(async (req, res) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: "Invalid message format" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ 
      success: false, 
      message: "AI service is currently unavailable. (Missing API Key)" 
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Choose prompt based on context
    const currentSystemPrompt = context === 'bangla' ? banglaSystemPrompt : mainSystemPrompt;

    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        systemInstruction: currentSystemPrompt 
    });

    // Format history for Gemini API
    // Gemini expects history to start with a 'user' message and alternate.
    let parsedHistory = messages.slice(0, -1);
    
    // Remove leading model messages (like the initial greeting)
    while (parsedHistory.length > 0 && parsedHistory[0].role !== 'user') {
      parsedHistory.shift();
    }

    const history = parsedHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const currentMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(currentMessage);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      reply: text
    });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to generate AI response" });
  }
});

module.exports = {
  chatWithAI,
};
