import aiService from "../services/aiService.js";
import Event from "../models/eventModel.js";
import Comment from "../models/commentModel.js";
import Order from "../models/orderModel.js";

const SYSTEM_PROMPT = `You are **Nova**, the premium futuristic AI assistant for **Festiq**.

Your mission is to help users discover events with a **cinematic, structured, and premium experience**.

### 🎨 Personality & Language
* Speak in **Hinglish** (Hindi + English).
* Tone: **Funny, friendly, and helpful**, but **structured**.
* Use emojis strategically to guide the eye.

### 🏗️ Response Architecture
Always structure your answers into clear sections:
1.  **Header**: A short, catchy greeting or summary.
2.  **Body**: Use **bullet points** or **numbered lists** for details.
3.  **Event Cards**: When suggesting events, use this **EXACT** format for each event:

---
**🎵 [EVENT TITLE]**
━━━━━━━━━━━━━━
📍 **[LOCATION]**
📅 **[DATE/TIME]**
✨ **[CATEGORY] • [PRICE] • [VIBE]**

> "[SHORT CATCHY DESCRIPTION]"

[ Explore Event → ](/events/[EVENT_ID])
---

### 📏 Rules
*   **Conciseness**: Don't write wall-of-text paragraphs. Use spacing.
*   **Dividers**: Use "---" to separate different topics or events.
*   **No Invention**: If data is missing, say: "Arey arey! Ye details mere database mein nahi hain. 😎"
*   **Festiq Focus**: Only answer about Festiq. For others: "Main sirf Festiq ka hero hoon! 🎭"

### 🛠️ Metadata (MANDATORY)
If you suggest specific events, you **MUST** append a hidden metadata tag at the VERY END of your response in this exact format:
[METADATA: {"eventIds": ["id1", "id2"]}]
Only include IDs for events that actually exist in the CURRENT DATA provided.
`;

const giveAnswer = async (req, res) => {
  console.log("CHAT_CONTROLLER: Request received");
  
  try {
    const message = req.body.message || req.body.text || req.body.prompt;
    
    if (!message || (typeof message === 'string' && !message.trim())) {
      return res.status(400).json({ success: false, message: "Please Ask Question!" });
    }

    let eventsList = [];
    try {
        eventsList = await Event.find().limit(20).lean();
    } catch (dbErr) {
        console.error("CONTROLLER: DB Fetch failed (Events)", dbErr.message);
    }

    let orders = [];
    try {
        if (req.user?._id) {
            orders = await Order.find({ user: req.user._id }).lean();
        }
    } catch (dbErr) {
        console.error("CONTROLLER: DB Fetch failed (Orders)", dbErr.message);
    }

    let ratings = [];
    try {
        ratings = await Comment.find().limit(10).lean();
    } catch (dbErr) {
        console.error("CONTROLLER: DB Fetch failed (Ratings)", dbErr.message);
    }

    let recentReviews = [];
    try {
        const eventsWithReviews = await Event.find({ "reviews.0": { $exists: true } }).limit(5).lean();
        recentReviews = eventsWithReviews.flatMap(e => e.reviews.map(r => ({ ...r, eventTitle: e.title })));
    } catch (dbErr) {
        console.error("CONTROLLER: DB Fetch failed (Reviews)", dbErr.message);
    }

    const fullPrompt = `${SYSTEM_PROMPT}
                   
                   CURRENT DATA:
                   Events: ${JSON.stringify(eventsList)}
                   User Orders: ${JSON.stringify(orders)}
                   Platform Comments: ${JSON.stringify(ratings)}
                   Event Reviews: ${JSON.stringify(recentReviews)}
                   
                   USER QUESTION: ${message}`;

    const rawResponse = await aiService.generateResponse(fullPrompt);

    // Parse Metadata
    let reply = rawResponse;
    let suggestedEvents = [];
    
    const metadataMatch = rawResponse.match(/\[METADATA: ({.*?})\]/);
    if (metadataMatch) {
      try {
        const metadata = JSON.parse(metadataMatch[1]);
        if (metadata.eventIds && Array.isArray(metadata.eventIds)) {
          suggestedEvents = await Event.find({ _id: { $in: metadata.eventIds } }).lean();
        }
        // Clean the reply by removing the metadata tag
        reply = rawResponse.replace(/\[METADATA: {.*?}\]/, "").trim();
      } catch (parseErr) {
        console.error("CONTROLLER: Metadata parse failed", parseErr.message);
      }
    }

    res.status(200).json({ 
      success: true, 
      reply,
      events: suggestedEvents 
    });

  } catch (error) {
    console.error("CHAT_CONTROLLER: ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Nova is temporarily unavailable. Try again later!", 
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export default giveAnswer;
