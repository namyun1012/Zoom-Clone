import express from "express"; 
import http from "http";
import WebSocket from "ws";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/")); // only use home


const handleListen = () => console.log("Listening on http://localhost:3000/");


// port is shared
const httpServer = http.createServer(app);
// const wss = new WebSocket.Server({ server }); // for use http and ws, http is not essential
const io = new Server (httpServer, {});

io.on("connection", socket => {
    socket.on("join_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    })

    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
})

// socket is connection between browser and server
// server is browser

// each browser execute this code 

/*
const sockets = [];
wss.on("connection", (socket) => {
    
    sockets.push(socket);
    socket["nickname"] = "Anon";

    console.log("Connected to Browser");
    
    socket.on("close", ()=> {
        console.log("Disconnected form client");
    });

    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type) {
            case "new_message" :
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
                break; // if it is not, error occur

            case "nickname":
                socket["nickname"] = message.payload;
                break;

        }   

        // onst message_string = message.toString('utf8');
        
    });
    // socket.send("hello!!");
});
*/
httpServer.listen(3000, handleListen);

