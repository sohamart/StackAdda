const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatHistory = require("../Models/ChatHistory");
const YoutubeVideo = require("../Models/YoutubeVideo");
const Short = require("../Models/Short");
const User = require("../Models/User");
const Course = require("../Models/Course");

const getBaseSystemPrompt = (context) => {
  if (context === 'bangla') {
    return `You are the official AI Assistant for the upcoming 'Stack Adda Bangla' platform.
Your primary goal is to excite visitors about the upcoming launch and answer their questions about what to expect.
Respond primarily in Bengali using a friendly, welcoming, and helpful tone.

Key Knowledge about Stack Adda Bangla:
- **What is it?** A dedicated platform for Bengali-speaking students to learn software development in their mother tongue.
- **Launch Date:** It is coming very soon! (Do not give an exact date, just say "Coming very soon! Stay tuned").
- **Upcoming Features:** Full MERN Stack, Live DSA, Career Guidance tailored for Bengali students, and a strong community.
- **Pricing:** There will be both free content and premium structured courses.

Always emphasize that this is a dedicated initiative for the Bengali community to eliminate language barriers in tech education.`;
  }

  return `You are the official AI Assistant for 'Stack Adda'. 
Your primary goal is to assist students, prospective learners, and visitors on the Stack Adda platform.
Always be polite, professional, and encouraging. Use a friendly tone. You can respond in Bengali or English based on the user's language, but your default preference for technical explanations should be clear and simple.

Key Knowledge about Stack Adda:
- **What is Stack Adda?** A platform to learn web development, app development, and software engineering. Focuses on practical learning ("Build by doing"), clear structured courses, and career-focused skills.
- **Motto:** "A better place to learn, build and grow."
- **Features:** Comprehensive Courses, Live Classes, Progress Tracking, "Shorts" section, "Channels", "Student Dashboard".
- **Contact:** Email at stackaddacontact@gmail.com.
- **Community:** Active on YouTube (Stack Adda), Facebook, and LinkedIn.

When users ask questions, try to guide them to relevant sections of the website. If you don't know the answer to a very specific account question, advise them to contact support.`;
};

const chatWithAI = asyncHandler(async (req, res) => {
  const { messages, context } = req.body;
  const user = req.user; // From optionalAuthMiddleware

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid message format or empty messages" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, message: "AI service is currently unavailable. (Missing API Key)" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // --- 1. Gather Context Data ---
    // Fetch aggregate YouTube views
    const [ytVideos, shorts] = await Promise.all([
      YoutubeVideo.find({}),
      Short.find({})
    ]);
    
    const totalYtViews = ytVideos.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalShortViews = shorts.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalPlatformViews = totalYtViews + totalShortViews;

    let dynamicContext = `\n\n--- CURRENT PLATFORM DATA ---\n`;
    dynamicContext += `- Total YouTube Videos: ${ytVideos.length}\n`;
    dynamicContext += `- Total Shorts: ${shorts.length}\n`;
    dynamicContext += `- Total Views across platform: ${totalPlatformViews}\n`;

    // Add User-specific context
    if (user) {
      dynamicContext += `\n--- USER CONTEXT (This is the user talking to you) ---\n`;
      dynamicContext += `- Name: ${user.name}\n`;
      dynamicContext += `- Email: ${user.email}\n`;
      dynamicContext += `- Role: ${user.role}\n`;
      if (user.enrolledCourses && user.enrolledCourses.length > 0) {
         dynamicContext += `- Number of Enrolled Courses: ${user.enrolledCourses.length}\n`;
      } else {
         dynamicContext += `- The user is not currently enrolled in any premium courses.\n`;
      }

      // Add Founders' Special Data if Admin
      if (user.role === 'admin') {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        dynamicContext += `\n--- ADMIN / FOUNDER SPECIAL DATA ---\n`;
        dynamicContext += `[CONFIDENTIAL]: You are speaking to an Admin/Founder. You may share the following data:\n`;
        dynamicContext += `- Total Registered Users: ${totalUsers}\n`;
        dynamicContext += `- Total Published Courses: ${totalCourses}\n`;
        dynamicContext += `- Platform Status: Healthy and growing.\n`;
      }
    } else {
      dynamicContext += `\n--- USER CONTEXT ---\n`;
      dynamicContext += `- The user is currently browsing as a guest (Not logged in).\n`;
    }

    const currentSystemPrompt = getBaseSystemPrompt(context) + dynamicContext;
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        systemInstruction: currentSystemPrompt 
    });

    const currentMessage = messages[messages.length - 1].content;
    let historyForGemini = [];
    let chatHistoryDoc = null;

    // --- 2. Handle Chat History ---
    if (user) {
      // Find or create chat history for logged-in user
      chatHistoryDoc = await ChatHistory.findOne({ user: user._id });
      if (!chatHistoryDoc) {
        chatHistoryDoc = new ChatHistory({ user: user._id, messages: [] });
      }

      // Gemini requires history to start with user, alternate, and not include the current message yet.
      let dbMessages = chatHistoryDoc.messages;
      
      // Limit to last 40 messages to avoid context limits
      if (dbMessages.length > 40) {
        dbMessages = dbMessages.slice(dbMessages.length - 40);
      }

      // Ensure the first message in history is from 'user'
      while (dbMessages.length > 0 && dbMessages[0].role !== 'user') {
        dbMessages.shift();
      }

      historyForGemini = dbMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
    } else {
      // For guests, rely on frontend messages array (excluding the latest message)
      let parsedHistory = messages.slice(0, -1);
      while (parsedHistory.length > 0 && parsedHistory[0].role !== 'user') {
        parsedHistory.shift();
      }
      historyForGemini = parsedHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
    }

    // --- 3. Communicate with AI ---
    const chat = model.startChat({ history: historyForGemini });
    const result = await chat.sendMessage(currentMessage);
    const response = await result.response;
    const text = response.text();

    // --- 4. Save History ---
    if (user && chatHistoryDoc) {
      chatHistoryDoc.messages.push({ role: 'user', content: currentMessage });
      chatHistoryDoc.messages.push({ role: 'model', content: text });
      await chatHistoryDoc.save();
    }

    res.status(200).json({
      success: true,
      reply: text
    });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to generate AI response" });
  }
});

const getChatHistory = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(200).json({ success: true, messages: [] });
    }

    const chatHistory = await ChatHistory.findOne({ user: user._id });

    if (!chatHistory) {
      return res.status(200).json({ success: true, messages: [] });
    }

    // Format for frontend
    const formattedMessages = chatHistory.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    res.status(200).json({ success: true, messages: formattedMessages });
  } catch (error) {
    console.error("Fetch Chat History Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch chat history" });
  }
});

module.exports = {
  chatWithAI,
  getChatHistory,
};
