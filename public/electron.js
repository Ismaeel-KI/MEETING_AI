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
  frame: false,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: path.join(__dirname, "preload.js"),
  },
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

ipcMain.on("minimize", () => mainWindow.minimize());

ipcMain.on("maximize", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on("close", () => mainWindow.close());

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

// Add this after the existing IPC handlers
ipcMain.handle("export-to-notion", async (event, config, data) => {
  try {
    const { Client } = require("@notionhq/client")

    const notion = new Client({
      auth: config.apiKey,
    })

    // Create a new page in the specified database
    const response = await notion.pages.create({
      parent: {
        database_id: config.databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: data.title,
              },
            },
          ],
        },
        Status: {
          select: {
            name: "Completed",
          },
        },
        Date: {
          date: {
            start: new Date().toISOString().split("T")[0],
          },
        },
      },
      children: [
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: "Meeting Summary",
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `Duration: ${data.meetingDuration}`,
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `Participants: ${data.participants.join(", ")}`,
                },
              },
            ],
          },
        },
        {
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: "Key Points",
                },
              },
            ],
          },
        },
        ...data.summary.keyPoints.map((point) => ({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: point,
                },
              },
            ],
          },
        })),
        {
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: "Action Items",
                },
              },
            ],
          },
        },
        ...data.tasks.map((task) => ({
          object: "block",
          type: "to_do",
          to_do: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `${task.title} (Assigned to: ${task.assignee})`,
                },
              },
            ],
            checked: task.completed,
          },
        })),
      ],
    })

    return { success: true, pageId: response.id }
  } catch (error) {
    console.error("Notion export error:", error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle("fetch-notion-databases", async (event, apiKey) => {
  try {
    const { Client } = require("@notionhq/client")

    const notion = new Client({
      auth: apiKey,
    })

    const response = await notion.search({
      filter: {
        value: "database",
        property: "object",
      },
    })

    const databases = response.results.map((db) => ({
      id: db.id,
      title: db.title?.[0]?.plain_text || "Untitled Database",
    }))

    return { success: true, databases }
  } catch (error) {
    console.error("Fetch databases error:", error)
    return { success: false, error: error.message }
  }
})
