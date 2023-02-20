// Imports
import { createServer } from 'http';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

// Initialize Server
const http = createServer((request, response) => {
    // response.setHeader('Access-Control-Allow-Origin', '*');
    // response.setHeader('Access-Control-Max-Age', 2592000); // 30 days

    // Render.com health check
    if (request.method === 'GET') {
        if (request.url === '/health') {


            response.statusCode = 200;
            response.end('Healthy Server!');
            return;
        }

        if (request.url === '/') {
            // Redirect to GitHub repository
            response.setHeader('location', 'https://github.com/humanfriend22/chat-rooms');
            response.statusCode = 302;
            response.end();
        }
    }
});

const server = new Server(
    http,
    { cors: { origin: true, credentials: true } },
);

// Initialize Admin UI Interface
instrument(server, {
    auth: {
        type: 'basic',
        username: 'admin',
        password: '$2a$10$g9YdSrS4Ner5AIiupsffmuxq7GsVZCQyK36mzq9YJ69t/JEe6Ebh2'
    },
    mode: process.env.NODE_ENV as 'development' | 'production'
});

// Data
let rooms: { [name: string]: Room } = {};

type Message = {
    author: string;
    body: string;
};

type Room = {
    count: number;
    messages: Message[];
};
// Listeners
server.on('connection', socket => {
    socket.emit('rooms', rooms);

    let currentRoom: string | null = null;

    function join(room: string) {
        rooms[room].count++;
        rooms[room].messages.push({
            author: 'Server',
            body: `A new user has joined: ${socket.id}!`
        });
        socket.join(room);
    };

    // Room Management
    socket.on('join', async (room: string) => {
        if (currentRoom !== null) socket.leave(currentRoom!);

        currentRoom = room;

        const targetRoom = rooms[room];

        if (targetRoom) {
            join(room);
        } else {
            rooms[room] = {
                count: 1,
                messages: [
                    {
                        author: 'Server',
                        body: 'Welcome!'
                    },
                    {
                        author: 'Server',
                        body: `A new user has joined: ${socket.id}!`
                    }
                ]
            }
        }

        server.emit('rooms', rooms);
    });

    // Messaging
    socket.on('message', (body: string) => {
        const message: Message = { author: socket.id, body };

        rooms[currentRoom!].messages.push(message);
        socket.to(currentRoom!).emit('message', message);
    });

    function leave() {
        if (currentRoom) {
            rooms[currentRoom!].count--;

            // Check for empty room
            if (rooms[currentRoom!].count < 1) {
                delete rooms[currentRoom!];
            } else {
                // Publicize The User Leaving
                rooms[currentRoom].messages.push({
                    author: 'Server',
                    body: `A user left: ${socket.id}!`
                });
            };

            currentRoom = null;

            server.emit('rooms', rooms);
        }
    };

    socket.on('leave', () => {
        socket.leave(currentRoom!);
        leave();
        server.emit('rooms', rooms);
    });

    socket.on('disconnecting', () => {
        leave();
        server.except(socket.id).emit('rooms', rooms);
    });
});

http.listen(
    process.env.NODE_ENV === 'production' ? (process.env.PORT || 10000) : 8080,
    () => console.info('Socket.io server is listening on port 8080')
);