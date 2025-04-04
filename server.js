const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { ExpressPeerServer } = require("peer");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const peerServer = ExpressPeerServer(server, { debug: true });

app.use(express.static("public"));
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
    });
});

server.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});
