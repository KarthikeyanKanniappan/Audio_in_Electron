// const { app, BrowserWindow, ipcMain, BrowserView } = require("electron");
// const fs = require("fs");
// const path = require("path");
// require('@electron/remote/main').initialize();

// let mainWindow;

// Create the main window and load the index.html file
// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 800,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//       enableRemoteModule: true,
//       webviewTag: true,
//     },
//   });
//   mainWindow.loadFile("index.html");
//   mainWindow.webContents.openDevTools();
// }

// app.on("ready", () => {
//   console.log("###main-WebView", Date.now());
//   createWindow();
// });

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// app.on("ready", () => {
//   console.log("###main-BrowserView", Date.now());
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//     },
//   });

//   // Create a BrowserView
//   const browserView = new BrowserView();
//   mainWindow.setBrowserView(browserView);
//   // Load web content into the BrowserView
//   browserView.webContents.loadURL("https://www.youtube.com");
//   const [width, height] = mainWindow.getContentSize();
//   browserView.setBounds({ x: 0, y: 0, width, height });
//   // Resize the BrowserView to match the window size

//   addingListener(browserView.webContents);

//   mainWindow.on("resize", () => {
//     const [newWidth, newHeight] = mainWindow.getContentSize();
//     browserView.setBounds({ x: 0, y: 0, width: newWidth, height: newHeight });
//   });

//   // Load the main window's HTML content
//   mainWindow.loadFile("index.html");

//   mainWindow.webContents.openDevTools();
// });

// function addingListener(webContents) {
//   webContents.on("did-start-loading", () => {
//     console.log("###did-start-loading", Date.now());
//   });
//   webContents.on("did-stop-loading", () => {
//     console.log("###did-stop-loading", Date.now());
//   });
//   webContents.on("did-attach", () => {
//     console.log("###did-attach", Date.now());
//   });
//   webContents.on("did-frame-finish-load", () => {
//     console.log("###did-frame-finish-load", Date.now());
//   });
//   webContents.on("did-finish-load", () => {
//     console.log("###did-finish-load", Date.now());
//   });
//   webContents.on("load-commit", () => {
//     console.log("###load-commit", Date.now());
//   });
//   webContents.on("dom-ready", () => {
//     console.log("###dom-ready", Date.now());
//   });
// }


// Import the required modules
const { app, BrowserWindow, ipcMain } = require('electron');
const AudioRecorder = require('node-audiorecorder');
const fs = require('fs');
const path = require('path');
const { RtAudio, RtAudioFormat } = require("audify");
// const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let mainWindow;
let audioRecorder;

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Use preload to handle IPC safely
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

// App ready
app.on('ready', createWindow);

// Setup IPC handlers
// ipcMain.on('start-recording', (event) => {
//   const { RtAudio, RtAudioFormat } = require("audify");

//   // Init RtAudio instance using default sound API
//   const rtAudio = new RtAudio(/* Insert here specific API if needed */);

//   // Open the input/output stream
//   rtAudio.openStream(
//     {
//       deviceId: rtAudio.getDefaultOutputDevice(), // Output device id (Get all devices using `getDevices`)
//       nChannels: 1, // Number of channels
//       firstChannel: 0, // First channel index on device (default = 0).
//     },
//     {
//       deviceId: rtAudio.getDefaultInputDevice(), // Input device id (Get all devices using `getDevices`)
//       nChannels: 1, // Number of channels
//       firstChannel: 0, // First channel index on device (default = 0).
//     },
//     RtAudioFormat.RTAUDIO_SINT16, // PCM Format - Signed 16-bit integer
//     48000, // Sampling rate is 48kHz
//     1920, // Frame size is 1920 (40ms)
//     "MyStream", // The name of the stream (used for JACK Api)
//     (pcm) => rtAudio.write(pcm) // Input callback function, write every input pcm data to the output buffer
//   );

//   // Start the stream
//   rtAudio.start();
//   console.log("***test",rtAudio)
//   // Create a write stream to save the recording locally
//   const outputFilePath = path.join(__dirname, 'recording.wav');
//   const writeStream = fs.createWriteStream(outputFilePath);
//   // rtAudio.on('data', (chunk) => {
//   //   writeStream.write(chunk);
//   // });

//   event.reply('recording-started', outputFilePath);
// });

// ipcMain.on('stop-recording', (event) => {
//   if (rtAudio) {
//     rtAudio.stop();
//     rtAudio.closeStream();
//     event.reply('recording-stopped');
//   }
// });

// function processPCM(pcm) {
//   const frameSize = 1920; // Given frame size
//   const channels = 1; // Number of output channels
//   const sampleRate = 48000; // Sample rate

//   // Convert PCM to Float32Array
//   const float32Array = new Float32Array(frameSize);
//   for (let i = 0; i < frameSize; i++) {
//     float32Array[i] = pcm.readInt16LE(i * 2) / 32768; // Normalize signed 16-bit PCM data to -1.0 to 1.0
//   }

//   // Create an AudioBuffer
//   const audioBuffer = audioContext.createBuffer(
//     channels, 
//     frameSize, 
//     sampleRate
//   );

//   // Copy the Float32Array data to the buffer
//   audioBuffer.copyToChannel(float32Array, 0);

//   // Create a buffer source to play the audio
//   const source = audioContext.createBufferSource();
//   source.buffer = audioBuffer;
//   source.connect(audioContext.destination);
//   source.start();
// }

let rtAudio = null;
let writeStream = null;
let pcmDataChunks = [];

ipcMain.on('start-recording', (event) => {
  console.log("***triggered");
  // Initialize RtAudio instance for capturing system audio output
  rtAudio = new RtAudio();

  rtAudio.openStream(
    { deviceId: rtAudio.getDefaultOutputDevice(), // Output device id (Get all devices using `getDevices`)
      nChannels: 1, // Number of channels
      firstChannel: 0 // First channel index on device (default = 0).
    },
    { deviceId: rtAudio.getDefaultInputDevice(), // Input device id (Get all devices using `getDevices`)
      nChannels: 1, // Number of channels
      firstChannel: 0 // First channel index on device (default = 0).
    },
    RtAudioFormat.RTAUDIO_SINT16, // PCM Format - Signed 16-bit integer
    48000, // Sampling rate is 48kHz
    1920, // Frame size is 1920 (40ms)
    "MyStream", // The name of the stream (used for JACK Api)
    pcm => processPCM(pcm) // Input callback function, write every input pcm data to the output buffer
  );

  rtAudio.start();
  // Reply to renderer process that recording has started
  // event.reply('recording-started', outputFilePath);
});

ipcMain.on('stop-recording', (event) => {
  if (rtAudio) {
    // Stop and close the audio stream
    rtAudio.stop();
    rtAudio.closeStream();

    const pcmBuffer = Buffer.concat(pcmDataChunks);
    saveAsWav(pcmBuffer, 48000, 1, 'output_audio.wav');

    console.log('Recording stopped and saved.');
    // Finish writing the WAV file

    console.log('Recording stopped and saved.');

    event.reply('recording-stopped');
  }
});

function processPCM(pcm) {
  // Accumulate PCM data chunks
  pcmDataChunks.push(pcm);
}

// Function to create WAV header
function createWavHeader(numFrames, numChannels, sampleRate) {
  const buffer = Buffer.alloc(44);
  const byteRate = sampleRate * numChannels * 2; // 2 bytes per sample for 16-bit audio

  buffer.write('RIFF', 0); // ChunkID
  buffer.writeUInt32LE(36 + numFrames * numChannels * 2, 4); // ChunkSize
  buffer.write('WAVE', 8); // Format
  buffer.write('fmt ', 12); // Subchunk1ID
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22); // NumChannels
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(byteRate, 28); // ByteRate
  buffer.writeUInt16LE(numChannels * 2, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample
  buffer.write('data', 36); // Subchunk2ID
  buffer.writeUInt32LE(numFrames * numChannels * 2, 40); // Subchunk2Size

  return buffer;
}

// Function to write PCM data as WAV
function saveAsWav(pcmBuffer, sampleRate, numChannels, filePath) {
  const numFrames = pcmBuffer.length / 2; // 2 bytes per sample for 16-bit PCM
  const wavHeader = createWavHeader(numFrames, numChannels, sampleRate);

  // Write header and PCM data to a file
  const writeStream = fs.createWriteStream(filePath);
  writeStream.write(wavHeader);
  writeStream.write(pcmBuffer);
  writeStream.end(() => {
    console.log(`WAV file saved to ${filePath}`);
  });
}
