import { create } from "zustand";
import { DirType, DirsState, ImgObj } from "../vite-env";
import { v4 as uuidv4 } from "uuid";

export const useFileStore = create<DirsState>((set, get) => ({
  dirs: [],
  dirMap: new Map<string, string>(), // id - dName
  addDir: (newDir: Omit<DirType, "id">) => {
    const newId: string = uuidv4();
    set((prevDirs) => ({
      dirs: [...prevDirs.dirs, { ...newDir, id: newId }],
      dirMap: prevDirs.dirMap.set(newId, newDir.dName),
    }));
    return newId;
  },
  // 向文件夹中追加图片
  appendDir: (id: string, img: ImgObj) => {
    const idx = get().dirs.findIndex((dir) => dir.id === id);
    if (idx >= 0) {
      set((prevState) => ({
        dirs: prevState.dirs.map((dir, id) => {
          if (id === idx) {
            const newImgs = dir.imgs;
            if (
              !(
                (
                  newImgs.filter((previmg) => previmg.order === img.order)
                    .length > 0
                ) //对于多次发送的msg，进行图片去重
              )
            ) {
              newImgs.push(img);
              newImgs.sort((img1, img2) => img1.order - img2.order);
            }
            return { ...dir, imgs: [...newImgs] };
          } else {
            return { ...dir };
          }
        }),
      }));
    }
    return idx;
  },
  //删除文件夹
  deleteDir: (id: string) => {
    const idx = get().dirs.findIndex((dir) => dir.id === id);
    const newMap = get().dirMap;
    newMap.delete(id); //删除指定k-v对
    if (idx >= 0) {
      set((prevState) => ({
        dirs: prevState.dirs
          .slice(0, idx)
          .concat(prevState.dirs.slice(idx + 1)),
        dirMap: newMap,
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
        dirMap: prevState.dirMap.set(id, newName), //更换dName
      }));
    }
  },
}));
