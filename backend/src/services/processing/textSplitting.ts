import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const langchainSplitText = async(text:string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 50,
    separators: ['\n\n', '\n', ' ', '']
  });
      
      const output = await splitter.splitText(text);

      return output;
}