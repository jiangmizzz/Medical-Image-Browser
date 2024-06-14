/// <reference types="vite/client" />

// 当前应用内所有文件夹组的状态store
export interface DirsState {
  dirs: DirType[];
  addDir: (newDir: Omit<DirType, "id">) => string; //返回新添加的图片组的id
  deleteDir: (id: string) => void;
  editDName: (id: string, newName: string) => void;
}

// 一组图片
export interface DirType {
  id: string; //文件夹id
  dName: string; //图片组名
  imgs: string[]; //组内图片 (本地 url 形式或 base64 编码
}
