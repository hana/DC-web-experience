'use strict';
require('dotenv').config();

const fs = require('fs');
const express = require('express');
const app = express();

let server;

if(process.env.TARGET_ENV === 'production') {
    const ssl_params = {
        key:fs.readFileSync('ssl/key.pem', 'utf8'),
        cert:fs.readFileSync('ssl/cert.pem', 'utf8')
    }
    server = require('https').createServer(ssl_params, app);
} else {
    server = require('http').createServer(app);
}

const io = require('socket.io')(server);
app.use(express.static('static'));

const helmet = require('helmet');
app.use(helmet());

//Gzip
const compression = require('compression');
app.use(compression());

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get("/face", (req, res) => {
    res.sendFile(__dirname + '/views/face.html');
});


const Listen_Port = 53000;
const users = {}; 


io.on('connection', (socket) => {
    const Client_ID = String(socket.id);

    
    console.log(`${Client_ID} came in.`);
            
    console.log(users);
    // init incoming user
    io.to(Client_ID).emit('/init', users);       
    
    // notify existing users
    users[Client_ID] = {
        id:Client_ID,
        position:{x:0 ,y:0, z:0 },
        rotation:{x:0, y:0, z:0 }
    };
    
    console.log(users[Client_ID]);
    socket.broadcast.emit('/user/enter', Client_ID);


    socket.on('/user/enter', (msg) => {});

    socket.on('/user/leave', (msg) => {
        console.log(`${msg} has left.`);
        delete users[Client_ID];
        socket.broadcast.emit('/user/leave', Client_ID);
    });

    socket.on('/broadcast', (msg) => {
        socket.broadcast.emit("/broadcast", msg);
    });

    socket.on('/user/position', (pos) => {        
        users[Client_ID].position.x = pos.x;
        users[Client_ID].position.y = pos.y;
        users[Client_ID].position.z = pos.z;

        const data = {
            id: Client_ID,
            x:pos.x,
            y:pos.y,
            z:pos.z
        }
        socket.broadcast.emit("/user/position", data);
    });

    socket.on('/user/rotation', (vec) => {
        users[Client_ID].rotation.x = vec._x;
        users[Client_ID].rotation.y = vec._y;
        users[Client_ID].rotation.z = vec._z;

        const data = {
            id: Client_ID,
            x:vec._x,
            y:vec._y,
            z:vec._z
        }
        socket.broadcast.emit("/user/rotation", data);
    });


    socket.on('disconnect', () => {
        console.log("A user disconnect");
        if(users[Client_ID])    {
            delete users[Client_ID];
            socket.broadcast.emit('/user/leave', Client_ID);
        }
    });
});

server.listen(Listen_Port, () => {
    console.log(`Listening on ${Listen_Port}`);
});

