import { create } from "zustand";

type UploadStore = {
  isUploaded: boolean;
  setIsUploaded: (value: boolean) => void;
  filename: string;
  setFilename: (value: string) => void;
};

export const useUploadStore = create<UploadStore>((set) => ({
  isUploaded: false,
  setIsUploaded: (value: boolean) => set({ isUploaded: value }),
  filename: "",
  setFilename: (value: string) => set({ filename: value }),
}));
