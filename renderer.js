// let selectedInputDeviceId;

// // Function to update the dropdown with the available audio input devices
// async function updateAudioDevices() {
//   const devices = await navigator.mediaDevices.enumerateDevices();
//   console.log(devices);
//   const audioDevices = devices.filter(
//     (device) => device.kind === "audiooutput"
//   );
//   const dropdown = document.getElementById("audioDevices");
//   dropdown.innerHTML = "";
//   audioDevices.forEach((device) => {
//     const option = document.createElement("option");
//     option.value = device.deviceId;
//     option.text = device.label;
//     dropdown.appendChild(option);
//   });
//   selectedInputDeviceId =
//     audioDevices.length > 0
//       ? audioDevices[0].deviceId
//       : "Waiting to audioDevice";

//   updateAudioPlay();
//   // setAudioDevice(audioPlayer, selectedInputDeviceId);
// }

// //DynamicChecking for audio Device
// navigator.mediaDevices.ondevicechange = (event) => {
//   updateAudioDevices();
// };

// async function updateAudioPlay() {
//   let audioPlayer = document.getElementById("audioPlayer");

//   console.log(selectedInputDeviceId);
//   if (selectedInputDeviceId) {
//     try {
//       const audioContext = new AudioContext();
//       const source = audioContext.createMediaElementSource(audioPlayer);
//       const destination = audioContext.createMediaStreamDestination();
//       source.connect(destination);
//       const audioStream = destination.stream;

//       const mediaRecorder = new MediaRecorder(audioStream);
//       let chunks = [];

//       mediaRecorder.ondataavailable = (event) => {
//         chunks.push(event.data);
//       };

//       mediaRecorder.onstop = async () => {
//         const blob = new Blob(chunks, { type: "audio/wav" });
//         const arrayBuffer = await blob.arrayBuffer();
//         console.log("***arr",arrayBuffer);
//       };

//       mediaRecorder.start();
//       setTimeout(() => {
//         mediaRecorder.stop();
//       }, 5000); // Record for 5 seconds

//       console.log(`Audio sink set to ${selectedInputDeviceId}`);
//     } catch (error) {
//       console.error("Error setting audio sink:", error);
//     }
//   }
// }



// document.getElementById("audioDevices").addEventListener("change", (event) => {
//   selectedInputDeviceId = event.target.value;
//   updateAudioPlay();
//   // setAudioDevice(audioPlayer, selectedInputDeviceId);
// });

// // Initialize the audio devices dropdown on page load
// window.addEventListener("load", () => {
//   updateAudioDevices();
// });


// let mediaRecorder;
// let recordedChunks = [];

// // Check if browser supports audio capture
// function startRecording() {
//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     // Access the user's microphone
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(function(stream) {
//         // Create a new MediaRecorder instance
//         mediaRecorder = new MediaRecorder(stream);

//         // When data is available, push it to recordedChunks
//         mediaRecorder.ondataavailable = function(event) {
//           if (event.data.size > 0) {
//             recordedChunks.push(event.data);
//           }
//         };

//         // Start recording
//         mediaRecorder.start();

//         // Stop recording after a certain time and save it (for example, after 5 seconds)
//         setTimeout(() => {
//           mediaRecorder.stop();
//         }, 20000);

//         // Handle when the recording stops
//         mediaRecorder.onstop = function() {
//           // Create a blob from the recorded chunks
//           const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });

//           // Create a downloadable link
//           const audioURL = URL.createObjectURL(audioBlob);
//           const downloadLink = document.createElement('a');
//           downloadLink.href = audioURL;
//           downloadLink.download = 'recorded_audio.webm';
//           downloadLink.textContent = 'Download Recorded Audio';
//           document.body.appendChild(downloadLink);
//         };
//       })
//       .catch(function(err) {
//         console.error('The following error occurred: ' + err);
//       });
//   } else {
//     console.error('getUserMedia not supported on your browser!');
//   }
// }

// const { desktopCapturer } = require('electron'); 
// let audioRecorder;

// function captureSystemAudio() {
//   const AudioRecorder = require('node-audiorecorder');

//   const options = {
//     program: `rec`,
//     device: null,
//     bits: 16,
//     channels: 1,
//     encoding: `signed-integer`,
//     format: `S16_LE`,
//     rate: 16000,
//     type: `wav`,
//     silence: 2,
//     thresholdStart: 0.5,
//     thresholdStop: 0.5,
//     keepSilence: true,
//   };

//   const logger = console;

//   audioRecorder = new AudioRecorder(options, logger);

//   audioRecorder.stream().on('data', (data) => {
//     recordedChunks.push(data);
//   });

//   audioRecorder.stream().on('end', () => {
//     const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });
//     const audioURL = URL.createObjectURL(audioBlob);
//     const audioElement = document.createElement('audio');
//     audioElement.controls = true;
//     audioElement.src = audioURL;
//     document.body.appendChild(audioElement);
//   });
// }

// captureSystemAudio();

// document.getElementById("startRecordingButton").addEventListener("click", () => {
//   recordedChunks = [];
//   audioRecorder.start();
// });

// document.getElementById("stopRecordingButton").addEventListener("click", () => {
//   audioRecorder.stop();
// });


//   const sources = await desktopCapturer.getSources({ types: ['screen'], fetchWindowIcons: true });
  //   for (const source of sources) {
  //     if (source.name === 'Entire Screen' || source.name.startsWith('Screen')) {
  //       // Get the screen media stream with system audio
  //       navigator.mediaDevices.getUserMedia({
  //         audio: {
  //           mandatory: {
  //             chromeMediaSource: 'desktop',
  //             chromeMediaSourceId: source.id,
  //           }
  //         },
  //         video: {
  //           mandatory: {
  //             chromeMediaSource: 'desktop',
  //             chromeMediaSourceId: source.id,
  //           }
  //         }
  //       }).then((stream) => {
  //         // Handle the stream, for example using MediaRecorder
  //         const mediaRecorder = new MediaRecorder(stream);
  //         let recordedChunks = [];

  //         mediaRecorder.ondataavailable = function(event) {
  //           if (event.data.size > 0) {
  //             recordedChunks.push(event.data);
  //           }
  //         };

  //         mediaRecorder.onstop = function() {
  //           const audioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
  //           const audioURL = URL.createObjectURL(audioBlob);
  //           const downloadLink = document.createElement('a');
  //           downloadLink.href = audioURL;
  //           downloadLink.download = 'system_audio_recording.webm';
  //           downloadLink.textContent = 'Download Recorded Audio';
  //           document.body.appendChild(downloadLink);
  //         };

  //         mediaRecorder.start();
  //         setTimeout(() => {
  //           mediaRecorder.stop();
  //         }, 5000);

  //       }).catch((err) => {
  //         console.error('Error accessing system audio:', err);
  //       });
  //       break;
  //     }
// }


document.getElementById('startRecordingButton').addEventListener('click', () => {
  window.electronAPI.startRecording();
});

document.getElementById('stopRecordingButton').addEventListener('click', () => {
  window.electronAPI.stopRecording();
});

window.electronAPI.onRecordingStarted((filePath) => {
  console.log('Recording started. Saving to:', filePath);
});

window.electronAPI.onRecordingStopped(() => {
  console.log('Recording stopped.');

  // After recording is stopped, create an audio player to play the saved file
  const audioElement = document.createElement('audio');
  audioElement.controls = true;
  audioElement.src = 'audio-output.wav'; // Assuming the file is saved in the same directory
  document.body.appendChild(audioElement);
});

