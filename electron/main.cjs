const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const storage = require("./storage.cjs");

ipcMain.handle("load-pages", () => storage.load());
ipcMain.on("save-page", (event, { file, page }) => {
  const data = storage.load();
  data[file] = page;
  storage.save(data);
});

ipcMain.handle("open-file", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "PDFs", extensions: ["pdf"] }],
  });
  if (canceled || filePaths.length === 0) return null;
  return filePaths[0]; // full absolute path
});

// ...rest as before

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // <-- Add this for dev only
    },
  });

  win.webContents.openDevTools(); // 👈 helps debug renderer errors
  console.log("Loading renderer...");
  win.loadURL("http://localhost:5173");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
