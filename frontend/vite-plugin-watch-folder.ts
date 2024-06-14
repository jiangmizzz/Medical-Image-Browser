import chokidar from "chokidar";

export default function watchFolderPlugin(folderPath: string) {
  return {
    name: "watch-folder-plugin",
    configureServer(server: {
      ws: {
        send: (arg0: { type: string; event: string; path: string }) => void;
      };
    }) {
      const watcher = chokidar.watch(folderPath, {
        persistent: true,
      });

      watcher
        .on("add", (path) => {
          server.ws.send({
            type: "custom",
            event: "file-added",
            path,
          });
        })
        .on("unlink", (path) => {
          server.ws.send({
            type: "custom",
            event: "file-removed",
            path,
          });
        })
        .on("change", (path) => {
          server.ws.send({
            type: "custom",
            event: "file-changed",
            path,
          });
        });
    },
  };
}
