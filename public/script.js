const socket = io();
const videoContainer = document.getElementById("video-container");
const localVideo = document.getElementById("local-video");
const muteBtn = document.getElementById("mute-btn");
const videoBtn = document.getElementById("video-btn");
const leaveBtn = document.getElementById("leave-btn");

const peer = new Peer();
let localStream;


navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    localStream = stream;
    localVideo.srcObject = stream;
    localVideo.play();

    peer.on("open", (id) => {
        socket.emit("join-room", "room1", id);
    });

    socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
    });
});


function connectToNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    call.on("stream", (userVideoStream) => {
        addVideoStream(userVideoStream);
    });
}


muteBtn.addEventListener("click", () => {
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
    muteBtn.innerText = localStream.getAudioTracks()[0].enabled ? "Mute" : "Unmute";
});


videoBtn.addEventListener("click", () => {
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
    videoBtn.innerText = localStream.getVideoTracks()[0].enabled ? "Video Off" : "Video On";
});


leaveBtn.addEventListener("click", () => {
    socket.disconnect();
    location.reload();
});


function addVideoStream(stream) {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.classList.add("rounded-lg", "border", "border-gray-600");
    video.play();
    videoContainer.appendChild(video);
}
