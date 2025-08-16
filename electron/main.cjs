const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron");
const storage = require("./storage.cjs");

ipcMain.handle("load-pages", () => storage.load());
ipcMain.on("save-page", (event, { file, page }) => {
  const data = storage.load();
  data[file] = page;
  storage.save(data);
});

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
