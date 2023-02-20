import { ref, reactive } from 'vue';

import { io } from 'socket.io-client';

// Create Client
const connectionUrl = import.meta.env.DEV ?
    `http://${new URL(window.location.href).hostname}:8080`
    :
    'https://hf-chat-rooms-server.onrender.com';

export const socket = io(connectionUrl, { reconnectionAttempts: 5 });
console.info('Server is connnecting to ' + connectionUrl);

// Reactive Data
export const rooms: Rooms = reactive({});
export const currentRoom = ref('');
export const reconnectionAttempts = ref(0);

// Connection
socket.io.on('error', (err) => {
    if (err.message === 'xhr poll error') {
        reconnectionAttempts.value += 1;
        return;
    }

    console.error(err.message);

});

socket.io.on('reconnect', () => {
    reconnectionAttempts.value = 0;
});

// Synchronization
socket.on('rooms', (updatedRooms: Rooms) => {
    for (const room in updatedRooms)
        rooms[room] = updatedRooms[room];
});

// Incoming Messages
socket.on('message', message => {
    rooms[currentRoom.value].messages.push(message);
});

// Room Actions
export function join(name: string = (document.forms[0].elements[0] as HTMLInputElement).value) {
    socket.emit('join', name);
    currentRoom.value = name;
};

export function leave() {
    socket.emit('leave');
    currentRoom.value = '';
};