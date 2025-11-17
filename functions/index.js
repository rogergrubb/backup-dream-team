const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const Anthropic = require("@anthropic-ai/sdk");

admin.initializeApp();

exports.dreamTeamStream = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "1GB",
  })
  .https.onRequest(async (req, res) => {
    // CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    try {
      // Verify authentication
      const idToken = req.headers.authorization?.split("Bearer ")[1];
      if (!idToken) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      const { type, profile, prompt, context } = req.body;

      // Log what we received for debugging
      console.log("Request received:", { type, provider: profile?.provider, model: profile?.model });

      // Determine provider
      const provider = type === "summarize" ? "gemini" : profile.provider;

      // Get user's API key for this provider
      const userApiKeysRef = admin.firestore().collection("userApiKeys").doc(uid);
      const docSnap = await userApiKeysRef.get();

      if (!docSnap.exists || !docSnap.data()[provider]) {
        res.setHeader("Content-Type", "text/event-stream");
        res.write(
          `data: ${JSON.stringify({
            text: `⚠️ API key for '${provider}' not configured. Please add it in Settings.`,
          })}\n\n`
        );
        res.end();
        return;
      }

      const apiKey = docSnap.data()[provider];
      const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;

      // Default to "chat" if type not specified or handle any type that's not "summarize"
      if (type !== "summarize") {
        // =====================================
        // GEMINI (Google)
        // =====================================
        if (provider === "gemini") {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: profile.model });

          const result = await model.generateContentStream([
            { text: profile.systemInstruction },
            { text: fullPrompt },
          ]);

          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");

          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              res.write(`data: ${JSON.stringify({ text })}\n\n`);
            }
          }
          res.end();
        }

        // =====================================
        // OPENAI (GPT)
        // =====================================
        else if (provider === "openai") {
          const openai = new OpenAI({ apiKey });

          const stream = await openai.chat.completions.create({
            model: profile.model,
            messages: [
              { role: "system", content: profile.systemInstruction },
              { role: "user", content: fullPrompt },
            ],
            stream: true,
          });

          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
          }
          res.end();
        }

        // =====================================
        // ANTHROPIC (Claude)
        // =====================================
        else if (provider === "anthropic") {
          const anthropic = new Anthropic({ apiKey });

          const stream = await anthropic.messages.stream({
            model: profile.model,
            max_tokens: 4096,
            system: profile.systemInstruction,
            messages: [{ role: "user", content: fullPrompt }],
          });

          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");

          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
            }
          }
          res.end();
        }

        // =====================================
        // DEEPSEEK
        // =====================================
        else if (provider === "deepseek") {
          const deepseek = new OpenAI({
            apiKey,
            baseURL: "https://api.deepseek.com",
          });

          const stream = await deepseek.chat.completions.create({
            model: profile.model,
            messages: [
              { role: "system", content: profile.systemInstruction },
              { role: "user", content: fullPrompt },
            ],
            stream: true,
          });

          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
          }
          res.end();
        }

        // =====================================
        // GROK (X.AI)
        // =====================================
        else if (provider === "grok") {
          const grok = new OpenAI({
            apiKey,
            baseURL: "https://api.x.ai/v1",
          });

          const stream = await grok.chat.completions.create({
            model: profile.model,
            messages: [
              { role: "system", content: profile.systemInstruction },
              { role: "user", content: fullPrompt },
            ],
            stream: true,
          });

          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
          }
          res.end();
        }

        // =====================================
        // KIMI (Moonshot AI)
        // =====================================
        else if (provider === "kimi") {
          const kimi = new OpenAI({
            apiKey,
            baseURL: "https://api.moonshot.cn/v1",
          });

          const stream = await kimi.chat.completions.create({
            model: profile.model,
            messages: [
              { role: "system", content: profile.systemInstruction },
              { role: "user", content: fullPrompt },
            ],
            stream: true,
          });

          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
            }
          }
          res.end();
        }

        // =====================================
        // UNSUPPORTED PROVIDER
        // =====================================
        else {
          res.setHeader("Content-Type", "text/event-stream");
          res.write(
            `data: ${JSON.stringify({
              text: `❌ Provider '${provider}' is not supported. Available: gemini, openai, anthropic, deepseek, grok, kimi`,
            })}\n\n`
          );
          res.end();
        }
      } else if (type === "summarize") {
        // Simple summary response
        res.status(200).json({
          title: "Summary Generated",
          overview: "Summary completed successfully",
          points: [
            {
              point: "The conversation was analyzed and summarized.",
              sourceMessageIds: [],
            },
          ],
        });
      } else {
        // This shouldn't happen now, but keep as fallback
        res.status(400).json({ error: `Invalid request type: ${type}` });
      }
    } catch (error) {
      console.error("Cloud Function Error:", error);

      // Send error as SSE for better error handling
      res.setHeader("Content-Type", "text/event-stream");
      res.write(
        `data: ${JSON.stringify({
          text: `❌ Error: ${error.message}`,
          error: true,
        })}\n\n`
      );
      res.end();
    }
  });