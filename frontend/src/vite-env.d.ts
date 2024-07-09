/// <reference types="vite/client" />

// 当前应用内所有文件夹组的状态store
export interface DirsState {
  dirs: DirType[];
  dirMap: Map<string, string>; //id - dName
  addDir: (newDir: Omit<DirType, "id">) => string; //返回新添加的图片组的id
  appendDir: (id: string, img: ImgObj) => void; //追加图片
  deleteDir: (id: string) => void;
  editDName: (id: string, newName: string) => void;
}

export interface ImgObj {
  order: number; //升序排序
  url: string; //(本地 url 形式或 base64 编码
}

// 一组图片，所有文件夹
export interface DirType {
  id: string; //文件夹id
  fatherDName: string; //（分象限的情况下）父文件夹名,否则保持原名不变
  dName: string; //图片组名
  imgs: ImgObj[]; //组内图片
}
// 来自服务端的 message
// export interface ESMessage {
//   data: ESData;
// }
export interface ESData {
  event: "add" | "addDir" | "unlink" | "change";
  dirPath: string;
}
