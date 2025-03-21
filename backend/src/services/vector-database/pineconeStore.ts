import { pinecone } from "../../lib/pinecone";
import { getGeminiEmbeddings } from "../embedding/embeddings";
import { normalizeEmbeddings } from "../embedding/normalizeEmbeddings";

export const storePineconeVectors = async (documentId: string, chunks: string[]) => {

  const embeddings = await getGeminiEmbeddings(chunks);

  const vectors = chunks.map((chunk, index) => ({
    id: `${documentId}_${index}`,
    values: normalizeEmbeddings(embeddings[index]),
    metadata: {
      documentId,
      text: chunk,
      chunkIndex: index
    }
  }));

  const index = pinecone.Index('study-notes');

  await index.upsert(vectors);

  return {
    documentId,
    totalVectors: vectors.length
  };
  
};
