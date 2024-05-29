import { create } from "zustand";

export const useCountStore = create<{
  counter: number;
  increment: () => number;
}>((set, get) => ({
  counter: 1,
  increment: () => {
    const now = get().counter;
    set((prevCnt) => ({
      counter: prevCnt.counter + 1,
    }));
    return now;
  },
}));
