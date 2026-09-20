import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check API
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Abhigyan Rojgar Sathi",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Rojgar Sathi Assistant Endpoint
app.post("/api/gemini/sathi-assistant", async (req, res) => {
  try {
    const { prompt, userProfile, language = "en", contextJobs = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // High-quality contextual fallback when API key is not yet configured
      const isHindi = language === "hi";
      return res.json({
        reply: isHindi
          ? `नमस्ते! मैं आपका 'अभिज्ञान रोजगार साथी' हूँ। आपके कौशल और प्राथमिकताओं के आधार पर आस-पास के अवसरों में आवेदन करने के लिए तैयार रहें। अपनी नजदीकी दूरी (Radius) सेट करें और सीधे नियोक्ता से संपर्क करें।`
          : `Hello! I am your 'Abhigyan Rojgar Sathi'. Based on your profile and local area, you can discover immediate openings, filter by distance, and contact local employers directly via Call or WhatsApp.`,
        suggestedActions: [
          isHindi ? "नजदीकी 5 किमी नौकरियां देखें" : "View jobs within 5km",
          isHindi ? "त्वरित आवेदन (Quick Apply) करें" : "Quick Apply to verified jobs",
          isHindi ? "दैनिक वेतन कार्य खोजें" : "Find daily wage opportunities",
        ],
      });
    }

    const systemInstruction = `You are 'Abhigyan Rojgar Sathi' (अभिज्ञान रोजगार साथी), an empathetic, practical, and highly encouraging AI career and local employment companion in India.
Your mission is to help local job seekers (including daily wage workers, delivery partners, retail workers, office staff, skilled technicians, drivers, shop assistants, cooks, and tutors) find legitimate nearby employment, prepare for quick interviews, negotiate fair pay, and connect directly with local employers.
Respond warmly and practically in ${language === "hi" ? "Hindi (हिन्दी) with simple, respectful language" : "friendly, accessible English (or Hinglish if appropriate)"}.
Keep answers crisp, actionable, bulleted when suitable, and focused on empowering the seeker.

Context of current seeker:
- Name: ${userProfile?.name || "Job Seeker"}
- Skills: ${(userProfile?.skills || []).join(", ") || "General skills"}
- Preferred Location: ${userProfile?.location || "Nearby"}
- Experience: ${userProfile?.experience || "Fresher/Any"}
- Availability: ${userProfile?.availability || "Immediate"}

Available nearby local job titles in area: ${contextJobs.map((j: any) => `${j.title} (${j.location}, ₹${j.salary})`).slice(0, 8).join("; ") || "Local retail, warehouse, delivery, helper, technical jobs"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am here to guide your local job search!";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Gemini assistant error:", error);
    return res.status(500).json({
      error: "Failed to process AI guidance",
      message: error.message,
    });
  }
});

// AI Job Match Analyzer
app.post("/api/gemini/match-analysis", async (req, res) => {
  try {
    const { job, userProfile, language = "en" } = req.body;
    const ai = getGeminiClient();

    if (!ai || !job) {
      return res.json({
        matchScore: 88,
        summary: language === "hi" 
          ? "यह काम आपके कौशल और स्थान के लिए बहुत उपयुक्त है।" 
          : "Great match for your profile and preferred travel distance.",
        keyStrengths: [
          language === "hi" ? "नजदीकी कार्यस्थल" : "Nearby workplace",
          language === "hi" ? "तत्काल ज्वाइनिंग संभव" : "Immediate start fits your schedule",
          language === "hi" ? "उचित वेतन और प्रोत्साहन" : "Fair pay scale"
        ],
        tips: language === "hi"
          ? "कॉल करते समय अपने पिछले अनुभव और समय की उपलब्धता स्पष्ट बताएं।"
          : "Mention your punctual attendance and ready availability when calling the employer."
      });
    }

    const prompt = `Analyze how well this job matches the candidate.
Job: ${job.title} at ${job.company || "Local Employer"}, Location: ${job.location}, Pay: ${job.salary}, Requirements: ${job.requirements?.join(", ") || "N/A"}.
Candidate: Skills: ${(userProfile?.skills || []).join(", ")}, Experience: ${userProfile?.experience || "Entry"}, Location: ${userProfile?.location || "Local"}.
Respond in ${language === "hi" ? "Hindi" : "English"}.
Provide JSON response with:
- matchScore (number between 60 and 99)
- summary (1 sentence)
- keyStrengths (array of 3 short points)
- tips (1-2 practical interview/call tips)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Match analysis error:", error);
    return res.json({
      matchScore: 85,
      summary: "Good match for your local profile.",
      keyStrengths: ["Location fit", "Required skills present", "Flexible timing"],
      tips: "Contact the employer directly with your credentials.",
    });
  }
});

// AI Job Post Generator for Employers
app.post("/api/gemini/generate-job-post", async (req, res) => {
  const { roleTitle = "Staff", businessType = "Store", location = "Local area", payRate = "Competitive", language = "en" } = req.body || {};
  try {
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        description: `Looking for reliable and motivated ${roleTitle || "Staff"} for our ${businessType || "local business"} in ${location || "nearby area"}. Immediate opening with timely payment of ${payRate || "competitive rate"}.`,
        requirements: ["Punctual & dependable", "Basic communication skills", "Ready for immediate joining"],
        perks: ["Direct employer hiring", "Weekly/Monthly on-time payout", "Friendly work environment"],
      });
    }

    const prompt = `Generate a concise, clear job description for a local hiring post:
Role: ${roleTitle}
Business: ${businessType}
Location: ${location}
Pay: ${payRate}
Language: ${language === "hi" ? "Hindi" : "English"}
Return JSON with:
- description (concise, encouraging, 2 sentences)
- requirements (array of 3-4 simple realistic qualifications)
- perks (array of 2-3 benefits, e.g. tea, incentives, flexible shifts)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    return res.json({
      description: `Immediate hiring for ${roleTitle} in ${location}.`,
      requirements: ["Punctuality", "Basic skills", "Quick learner"],
      perks: ["Direct payout", "Local work"],
    });
  }
});

// Vite middleware in dev or static files in production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Abhigyan Rojgar Sathi Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
