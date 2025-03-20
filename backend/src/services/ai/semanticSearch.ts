import { pinecone } from "../../lib/pinecone";
import { getSingleTextGeminiEmbedding } from "../embedding/embeddings";
import { normalizeEmbeddings } from "../embedding/normalizeEmbeddings";

export async function semanticSearch(query: string, documentId: string) {
  try {
    const queryEmbedding = await getSingleTextGeminiEmbedding(query);
    const normalEmbeddings = normalizeEmbeddings(queryEmbedding)

  // Pinecone search configuration
  const searchParams = {
    topK: 15,
    includeMetadata: true,
    vector: normalEmbeddings,
   filter:{
    documentId: documentId
   }
  };
  
  // Perform vector search
  const index = pinecone.Index('study-notes');
  const searchResults = await index.query(searchParams);

  console.log("Search results: "+searchResults);
  
  // Extract and process results
  const relevantChunks = searchResults.matches.map(match => ({
    text: match.metadata?.text as string,
    score: match.score!,
    documentId: match.metadata?.documentId
  }));

  console.log("Relevant chunks: "+relevantChunks);
  
  return relevantChunks;
  } catch (error) {
    console.log(error);
  }
}