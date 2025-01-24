export function normalizeEmbeddings(embeddings: number[]) {
    if (embeddings.length === 1536) return embeddings;
    if (embeddings.length < 1536) {
      // Pad with zeros
      return [...embeddings, ...new Array(1536 - embeddings.length).fill(0)];
    }
    // Truncate
    return embeddings.slice(0, 1536);
  }