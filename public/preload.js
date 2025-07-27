const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  startTranscriptCapture: () => ipcRenderer.invoke("start-transcript-capture"),
  stopTranscriptCapture: () => ipcRenderer.invoke("stop-transcript-capture"),
  processAISummary: (transcript) => ipcRenderer.invoke("process-ai-summary", transcript),

  // Meeting platform integrations
  onTranscriptUpdate: (callback) => ipcRenderer.on("transcript-update", callback),
  onMeetingStatusChange: (callback) => ipcRenderer.on("meeting-status-change", callback),
})
