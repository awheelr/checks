const { app, BrowserWindow, ipcMain, Tray } = require("electron");
const path = require("path");

function createWindow() {
  // Create the tray icon.

  let tray = new Tray(path.join("assets/checks.ico"));

  // Create the main window.
  let mainWindow = new BrowserWindow({
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
      enableRemoteModule: true,
      preload: path.join(__dirname, "./assets/js/indexPreload.js"),
    },
  });
  mainWindow.loadFile("index.html");
  mainWindow.webContents.openDevTools();

  ipcMain.on("openMenu", () => {
    mainWindow.webContents.send("openMenu");
  });
  // mainWindow.on("close", function (event) {
  //   event.preventDefault();
  //   mainWindow.hide();
  //   return false;
  // });

  // Create the menu window.
  let menu = new BrowserWindow({
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    x: 1579,
    y: 690,
    width: 292, //300
    height: 311,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "./assets/js/menuPreload.js"),
    },
  });
  menu.loadFile("menu.html");
  // menu.webContents.openDevTools();

  ipcMain.on("open-menu-window", () => {
    // menu.webContents.send('updateMenu', {'SAVED': 'File Saved'}) [*] Removed becuase updateDay seems to solve the problem in a more efficent way.
    menu.isVisible() ? menu.hide() : menu.show();
  });

  tray.on("click", () => {
    if (menu.isVisible()) {
      menu.hide();
    }

    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.webContents.send("openMenu");
    }
    // mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  tray.on("right-click", () => {
    if (process.platform !== "darwin") {
      tray.destroy();
      app.quit();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  menu.on("closed", () => {
    menu = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
  createWindow();

  // app.on("activate", function () {
  //   // On macOS it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow();
  // });

  // app.on("close", function (event) {
  //   event.preventDefault();
  //   BrowserWindow.hide();
  // });
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

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
ipcMain.on("get-win-pos", () => {
  console.log(menu.getPosition());
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
