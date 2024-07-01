const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", ()=> {
    console.log("Connected to Browser");
})


socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data );
})

// disconnected
socket.addEventListener("close", ()=> {
    console.log("Connected from Server X");
})

setTimeout(()=> {
    socket.send("hello from the browser!");
}, 3000);
// socket is connection to server
// frontend here!