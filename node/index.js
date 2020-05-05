const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


io.on('connection', (socket) => {
    const id = socket.id;
    const data = {
        "elm1":1, 
        "elm2": 0.87,
        "elm3": "foo"
    };


    socket.on('/user/enter', (msg) => {
        console.log(`${msg} came in.`);
        console.log(id);
        io.to(id).emit('/json', data);
        // socket.emit('/json', data);
    })

    socket.on('/user/leave', (msg) => {
        console.log(`${msg} has left.`);
    })

    socket.on('/broadcast', (msg) => {
        socket.broadcast.emit("/broadcast", msg);
    })

    socket.on('disconnect', () => {
        console.log("A user disconnect");
    })
})

server.listen(3000, () => {
    console.log("Listening on 3000");
});

