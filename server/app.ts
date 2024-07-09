const express = require("express");
const chokidar = require("chokidar");
const path = require("path");
const cors = require("cors");
import type { ESData } from "./types";

const app = express();
const port = 8080;
const watchDir = "public";

app.use(cors());

app.get("/", (_req, res) => {
  // res.redirect("/listen");
  res.send("It is a simple File Watcher Server.");
});

app.get("/listen", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Function to send a message
  const sendEvent = (data: ESData) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  //初始化监听器
  const publicPath = path.join(__dirname, watchDir);
  const watcher = chokidar.watch(publicPath, {
    ignored: /(^|[\/\\])\../, // 忽略隐藏文件
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      //等待写入完成后再触发事件
      stabilityThreshold: 2000,
      pollInterval: 500,
    },
  });

  //监听各类文件夹变化
  watcher.on("add", (path: string) => {
    sendEvent({ event: "add", dirPath: path });
  });
  watcher.on("addDir", (path: string) => {
    sendEvent({ event: "addDir", dirPath: path });
  });
  watcher.on("unlink", (path: string) => {
    sendEvent({ event: "unlink", dirPath: path });
  });
  watcher.on("unlinkDir", (path: string) => {
    sendEvent({ event: "unlinkDir", dirPath: path });
  });
  watcher.on("change", (path: string) => {
    sendEvent({ event: "change", dirPath: path });
  });
  // Handle client disconnect
  req.on("close", () => {
    watcher.close();
    res.end();
  });
});
//提供静态文件访问服务
app.use(express.static(watchDir));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
