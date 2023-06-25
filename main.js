window.onload = async () => {
  const devices = (await navigator.mediaDevices.enumerateDevices());
  console.log(devices);
  const videoDeviceInput = document.getElementById("video-devices");
  const audioDeviceInput = document.getElementById("audio-devices")
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
  startBtn.addEventListener("click", () => {
    const videoTarget = videoDeviceInput.value;
    const width = parseInt(document.getElementById("width")?.value);
    const height = parseInt(document.getElementById("height")?.value);
    const audioTarget = audioDeviceInput.value;
    navigator.mediaDevices.getUserMedia({
      audio: {deviceId: audioTarget},
      video: {
        deviceId: videoTarget,
        width,
        height
      }
    }).then((stream) => {
      console.log(stream);
      const video = document.getElementById("main-video");
      video.srcObject = stream;
    })
  });
}