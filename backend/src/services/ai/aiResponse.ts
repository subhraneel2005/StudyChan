import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAIResponse(query: string, relevantChunks: Array<{text: string, score: number}>) {
    // Construct context from relevant chunks
    const context = relevantChunks
      .map(chunk => chunk.text)
      .join('\n\n');
   
    // Prepare prompt for Gemini
    const prompt = `
      Context: ${context}
      Question: ${query}
   
      Provide a precise, contextually accurate answer based on the given context. 
      If the context doesn't contain sufficient information, state that clearly.
    `;
   
    // Generate response using Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
   
    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
   
      return {
        answer: response,
        contextualScore: calculateContextRelevance(relevantChunks)
      };
    } catch (error) {
      console.error('AI Response Generation Error:', error);
      return {
        answer: "I'm unable to generate a response at the moment.",
        contextualScore: 0
      };
    }
   }
   
   // Utility function to calculate context relevance
   function calculateContextRelevance(chunks: Array<{score: number}>) {
    const avgRelevance = chunks.reduce((sum, chunk) => sum + chunk.score, 0) / chunks.length;
    return avgRelevance;
   }