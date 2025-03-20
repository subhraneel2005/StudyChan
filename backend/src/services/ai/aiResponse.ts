import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAIResponse(
  query: string,
  relevantChunks: Array<{ text: string; score: number }>,
  chatHistory: Array<{ role: string; content: string }>
) {
  const context = relevantChunks.map((chunk) => chunk.text).join("\n\n");

  const formattedChatHistory = chatHistory
    .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
    .join("\n");

  const prompt = `
    You are a helpful assistant analyzing a PDF document. The document contains text content and URLs/hyperlinks.
    
    Context: ${context}
    Conversation History: ${formattedChatHistory}
    Question: ${query}
    
    Please provide a precise, contextually accurate answer based on the given context and the Conversation History. When mentioning any links or URLs:
    1. Format them as proper clickable links
    2. Include the relevant text or title associated with the link
    3. Explain what the link refers to or leads to
    
    If you mention any projects, include their associated GitHub/demo links if available in the context.
    
    If the context doesn't contain enough information to answer the question accurately, please say so clearly.
    
    Remember to:
    - Be concise but thorough
    - Include relevant links when available
    - Make links accessible by explaining what they lead to
    - Stay strictly within the provided context
    `;

  // Generate response using Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return {
      answer: response,
      contextualScore: calculateContextRelevance(relevantChunks),
    };
  } catch (error) {
    console.error("AI Response Generation Error:", error);
    return {
      answer: "I'm unable to generate a response at the moment.",
      contextualScore: 0,
    };
  }
}

// Utility function to calculate context relevance
function calculateContextRelevance(chunks: Array<{ score: number }>) {
  const avgRelevance =
    chunks.reduce((sum, chunk) => sum + chunk.score, 0) / chunks.length;
  return avgRelevance;
}
