import express from "express"; 
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); // only use home


const handleListen = () => console.log("Listening on http://localhost:3000/");


// port is shared
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // for use http and ws, http is not essential

// socket is connection between browser and server
// server is browser
function handleConnection(socket) {
    console.log(socket);
}


wss.on("connection", (socket) => {
    console.log("Connected to Browser");
    socket.on("close", ()=> {
        console.log("Disconnected form client");
    });

    socket.on("message", (message) => {
        console.log(message.toString('utf8')); // change to string
    });
    socket.send("hello!!");
});

server.listen(3000, handleListen);
