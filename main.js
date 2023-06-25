async function requestMediaDevicePermission() {
  const stream = await window.navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  for (const track of stream.getTracks()) {
    track.stop();
  }
}

async function streamVideo() {
  const videoTarget = document.getElementById("video-devices")?.value;
  const width = parseInt(document.getElementById("width")?.value);
  const height = parseInt(document.getElementById("height")?.value);
  const frameRate = parseInt(document.getElementById("frame-rate")?.value);
  const audioTarget = document.getElementById("audio-devices")?.value;
  const sampleRate = parseInt(document.getElementById("sample-rate")?.value);
  const videoStream = await navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: videoTarget,
      width,
      height,
      frameRate
    },
    audio: false,
  });
  const audioStream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: {
      deviceId: audioTarget,
      sampleRate,
      sampleSize: 16
    }
  });

  const isMS2109 = document.getElementById("is-ms2109").checked;
  if (isMS2109) {
    const audioContext = new AudioContext({sampleRate});
    const source = audioContext.createMediaStreamSource(audioStream);
    source.channelCountMode = "explicit";
    const merger = audioContext.createChannelMerger(2);
    const destination = audioContext.createMediaStreamDestination();
    await audioContext.audioWorklet.addModule("mono-to-stereo.js");
    await audioContext.resume();
    const mono2Stereo = new AudioWorkletNode(audioContext, "mono-to-stereo");
    mono2Stereo.port.onmessage = (event) => {
      console.log(event.data);
    }
    source.connect(merger, 0, 0);
    source.connect(merger, 0, 1);
    merger.connect(mono2Stereo);
    mono2Stereo.connect(destination);
    videoStream.addTrack(destination.stream.getAudioTracks()[0]);
  } else {
    videoStream.addTrack(audioStream.getAudioTracks()[0]);
  }

  const mainVideo = document.getElementById("main-video");
  const rotate = document.getElementById("rotate-90")?.checked;
  if (rotate) {
    mainVideo.style.transformOrigin = "top left";
    mainVideo.style.transform = `translate(0px, ${height}px) rotate(-90deg)`;
  }
  mainVideo.srcObject = videoStream;
}

window.onload = async () => {
  await requestMediaDevicePermission();

  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDeviceInput = document.getElementById("video-devices");
  const audioDeviceInput = document.getElementById("audio-devices");
  devices.forEach((device) => {
    const item = document.createElement("option");
    item.value = device.deviceId;
    item.text = device.label;
    switch (device.kind) {
      case "videoinput":
        videoDeviceInput.appendChild(item);
        break;
      case "audioinput":
        audioDeviceInput.appendChild(item);
        break;
    }
  });

  const startBtn = document.getElementById("start");
  startBtn.addEventListener("click", streamVideo);
}