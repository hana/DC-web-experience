const fs = require('fs');
const express = require('express');
const app = express();

const ssl_params = {
    key:fs.readFileSync('ssl/key,pem', 'utf8'),
    cert:fs.readFileSync('ssl/crt,pem', 'utf8')
}

const server = require('https').createServer(ssl_params, app);
const io = require('socket.io')(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.use(express.static('static'));
const Listen_Port = 53000;
const users = {}; 

io.on('connection', (socket) => {
    const id = String(socket.id);

    socket.on('/user/enter', (msg) => {
        console.log(`${msg} came in.`);
        
        for(user in users)  {
            console.log(user);
            io.to(id).emit('/user/enter', user);
        }
        
        users[id] = 1;
        socket.broadcast.emit('/user/enter', id);
    })

    socket.on('/user/leave', (msg) => {
        console.log(`${msg} has left.`);
        delete users[id];
        socket.broadcast.emit('/user/leave', id);
    })

    socket.on('/broadcast', (msg) => {
        socket.broadcast.emit("/broadcast", msg);
    })

    socket.on('/user/position', (pos) => {        
        const data = {
            id: id,
            x:pos.x,
            y:pos.y,
            z:pos.z
        }
        socket.broadcast.emit("/user/position", data);
    })

    socket.on('/user/rotation', (vec) => {
        const data = {
            id: id,
            x:vec._x,
            y:vec._y,
            z:vec._z
        }
        socket.broadcast.emit("/user/rotation", data);
    })


    socket.on('disconnect', () => {
        console.log("A user disconnect");
    })
})

server.listen(53000, () => {
    console.log("Listening on 53000");
});

