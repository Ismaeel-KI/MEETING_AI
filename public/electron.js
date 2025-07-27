const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const isDev = require("electron-is-dev")

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "hiddenInset",
    show: false,
    backgroundColor: "#f8fafc",
  })

  const startUrl = isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../out/index.html")}`

  mainWindow.loadURL(startUrl)

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// IPC handlers for meeting platform integration
ipcMain.handle("start-transcript-capture", async () => {
  // Integration with meeting platforms would go here
  // This would connect to Google Meet, Zoom, etc. APIs
  return { success: true }
})

ipcMain.handle("stop-transcript-capture", async () => {
  return { success: true }
})

ipcMain.handle("process-ai-summary", async (event, transcript) => {
  // This would call your backend AI summary API
  return {
    summary: "AI-generated summary would be returned here",
    tasks: [],
  }
})
