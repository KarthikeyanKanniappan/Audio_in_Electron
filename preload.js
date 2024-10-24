const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startRecording: () => ipcRenderer.send('start-recording'),
  stopRecording: () => ipcRenderer.send('stop-recording'),
  onRecordingStarted: (callback) => ipcRenderer.on('recording-started', (event, filePath) => callback(filePath)),
  onRecordingStopped: (callback) => ipcRenderer.on('recording-stopped', () => callback())
});
