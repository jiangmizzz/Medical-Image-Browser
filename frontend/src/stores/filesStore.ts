import { create } from "zustand";
import { DirType, DirsState } from "../vite-env";
import { v4 as uuidv4 } from "uuid";

export const useFileStore = create<DirsState>((set, get) => ({
  dirs: [],
  addDir: (newDir: Omit<DirType, "id">) => {
    const newId: string = uuidv4();
    set((prevDirs) => ({
      dirs: [...prevDirs.dirs, { ...newDir, id: newId }],
    }));
    return newId;
  },
  deleteDir: (id: string) => {
    const idx = get().dirs.findIndex((dir) => dir.id === id);
    if (idx >= 0) {
      set((prevState) => ({
        dirs: prevState.dirs
          .slice(0, idx)
          .concat(prevState.dirs.slice(idx + 1)),
      }));
    }
  },
  editDName: (id: string, newName: string) => {
    const idx = get().dirs.findIndex((dir) => dir.id === id);
    if (idx >= 0) {
      set((prevState) => ({
        dirs: prevState.dirs.map((dir, id) => {
          if (id === idx) {
            return { ...dir, dName: newName };
          } else {
            return { ...dir };
          }
        }),
      }));
    }
  },
}));
