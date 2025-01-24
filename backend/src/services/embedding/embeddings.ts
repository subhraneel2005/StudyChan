import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getGeminiEmbeddings(texts: string[]) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  const embeddings = await Promise.all(
    texts.map(async (text) => {
      const result = await model.embedContent(text);
      return result.embedding.values;
    })
  );

  return embeddings;
}