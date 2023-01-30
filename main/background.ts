import {
  app,
  globalShortcut,
  ipcMain,
  ipcRenderer,
  Menu,
  MenuItem,
} from "electron";
import serve from "electron-serve";
import path from "path";
import { createWindow } from "./helpers";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  // if you set `appSrcDir` in `nextron.config.js`
  // Remember to change directory here to match `appSrcDir`
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, "assets")
  : path.join(__dirname, "../assets");
const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};
(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    icon: getAssetPath("icon.ico"),
    width: 1000,
    height: 600,
  });
  const port = process.argv[2];
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "Controls",
      submenu: [
        {
          label: "DevTools",
          accelerator: "Ctrl+Shift+I",
          click: async (menuItem, browserWindow, event) => {
            browserWindow.webContents.openDevTools();
          },
        },
        {
          label: "Search",
          accelerator: "Ctrl+/",
          click: async (menuItem, browserWindow, event) => {
            browserWindow.webContents.send("hello", "your mom is gay");
          },
        },
      ],
    })
  );

  Menu.setApplicationMenu(menu);

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
