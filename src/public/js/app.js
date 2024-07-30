const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

const welcome = document.getElementById("welcome");
const call = document.getElementById("call");

call.hidden = true;


let myStream 
let muted = false;
let cameraoff = false;
let roomName = "";
let myPeerConnection;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId
            option.innerText = camera.label;
            if(currentCamera.label === camera.label) {
                option.selected = true;
            }
            cameraSelect.appendChild(option);
        })
    } catch(e) {
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio: true,
        video: {facingMode : "user"},
    };

    const cameraConstraints = {
        audio:true,
        video: {deviceId: {exact: deviceId}},
    };
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
           deviceId ? cameraConstraints : initialConstrains
        );
        myFace.srcObject  = myStream;
        console.log(myStream)
        if(!deviceId) {
            await getCameras();
        }
    } catch(e) {
        console.log(e);
    }
}

function handleMuteClick() {
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled))
    if(!muted) {
        muteBtn.innerText = "Unmute"
        muted = true;
    } else {
        muted = false;
        muteBtn.innerText = "Mute"
    }
}

function handleCameraClick() {
    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled))
    if(cameraoff) {
        cameraoff = false;
        cameraBtn.innerText = "Turn Camera Off";
    } else {
        cameraoff = true;
        cameraBtn.innerText = "Turn Camera On";
    }
}

async function handleCameraChange() {
    await getMedia(cameraSelect.value);
}

async function startMedia() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}
 
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);

welcomeForm = welcome.querySelector("form");

function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("join_room", input.value, startMedia);
    roomName = input.value; // save name of the room.
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket code

socket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
});

socket.on("offer", (offer) => {
    console.log(offer);
});

// RTC

function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}