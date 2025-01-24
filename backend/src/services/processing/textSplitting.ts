import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const langchainSplitText = async(text:string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    separators: ['\n\n', '\n', ' ', '']
  });
      
      const output = await splitter.createDocuments([text]);

      return output;
}