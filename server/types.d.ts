export interface ESData {
  event: "add" | "addDir" | "unlink" | "change" | "unlinkDir";
  dirPath: string;
}
