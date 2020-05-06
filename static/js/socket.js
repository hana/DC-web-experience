//import v4 from 'https://cdn.jsdelivr.net/npm/uuid@8.0.0/dist/esm-browser/v4.js';


let socket
const Server_Address = 'http://qux-jp.com:53000';

export default class Socket {
    constructor()   {}

    setup() {
        socket = io(Server_Address);
        socket.on('connect', () => {
            console.log("Connection established");
            // socket.id;
            socket.emit('/user/enter', socket.id);
        });
    
        socket.on('/broadcast', (msg) => {
            document.getElementById('main').appendChild(txt);
        });
    
        socket.on('/json', (data) => {
            console.log(data);
        })
    
        $('button').on('click', (e) => {
            console.log("Clicked");
            socket.emit("/broadcast", socket.id);
        });
    
        window.addEventListener('beforeunload', (e) => {
            // e.preventDefault();
            socket.emit('/user/leave', socket.id);
        })
    }

    send(adr, data) {
        socket.emit(adr, data);
    }

    addEventListener(adr, func) {
        socket.on(adr, func);
    }

}
