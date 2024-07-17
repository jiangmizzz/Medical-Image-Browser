import { create } from "zustand";
import { ESData } from "../vite-env";

export const useCountStore = create<{
  counter: number;
  lastEvent: ESData;
  updateLastPath: (newEvent: ESData) => void;
  increment: () => number;
}>((set, get) => ({
  counter: 1,
  lastEvent: { event: "add", dirPath: "" },
  updateLastPath: (newEvent: ESData) => {
    set(() => ({
      lastEvent: { ...newEvent },
    }));
  },
  increment: () => {
    const now = get().counter;
    set((prevCnt) => ({
      counter: prevCnt.counter + 1,
    }));
    return now;
  },
}));
