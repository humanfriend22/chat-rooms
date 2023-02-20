/// <reference types="vite/client" />

// Entity Types
type Message = { author: string; body: string; };

type Room = {
    owner: string;
    count: number;
    messages: Message[]
};

type Rooms = { [roomName: string]: Room };