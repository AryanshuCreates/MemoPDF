const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  savePage: (file, page) => ipcRenderer.send("save-page", { file, page }),
  loadPages: () => ipcRenderer.invoke("load-pages"),
});
