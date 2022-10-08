const { app, BrowserWindow, ipcMain, Tray } = require("electron");
const path = require("path");

function createWindow() {
  // Create the tray icon.
  tray = new Tray(path.join(__dirname, "assets", "chex.png"));

  // Create the main window.
  const mainWindow = new BrowserWindow({
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    x: 1586,
    y: 1004,
    width: 320, //300
    height: 65,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "./assets/js/preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  // mainWindow.webContents.openDevTools();

  // Create the menu window.
  menu = new BrowserWindow({
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    x: 1579,
    y: 751,
    width: 285, //300
    height: 250,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  menu.loadFile("menu.html");

  menu.webContents.openDevTools();

  mainWindow.on("close", function (event) {
    event.preventDefault();
    mainWindow.hide();
    return false;
  });

  tray.on('click', () => {
    if (menu.isVisible()) {
      menu.hide();
    }
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  tray.on('right-click', () => {
    if (process.platform !== "darwin") {
      tray.destroy();
      app.quit();
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on("close", function (event) {
    event.preventDefault();
    BrowserWindow.hide();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    tray.destroy();
    app.quit();
  }
});

ipcMain.on("open-menu-window", () => {
  menu.isVisible() ? menu.hide() : menu.show();
});

ipcMain.on("get-win-pos", () => {
  console.log(menu.getPosition());
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
