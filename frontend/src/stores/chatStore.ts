import { create } from "zustand";

type ChatState = {
  chatID: string;
  setChatID: (value: string) => void;
  firstQuestion: string;
  docName: string;
  setDocName: (value: string) => void;
  setFirstQuestion: (value: string) => void;
  aiResponse: string;
  setAiResponse: (value: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  chatID: "",
  setChatID: (value: string) => set({ chatID: value }),
  firstQuestion: "",
  setFirstQuestion: (value: string) => set({ firstQuestion: value }),
  docName: "",
  setDocName: (value: string) => set({ docName: value }),
  aiResponse: "",
  setAiResponse: (value: string) => set({ aiResponse: value }),
}));
