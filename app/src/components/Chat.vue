<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { socket, rooms, currentRoom } from '../services/client';

const message = ref('');

let messages: HTMLDivElement;

function sendMessage() {
    if (message.value !== '') {
        rooms[currentRoom.value].messages.push({ author: socket.id, body: message.value });

        socket.send(message.value);

        message.value = '';

        messages.scrollTop = messages.scrollHeight;
    };
};

onMounted(() => {
    messages = document.querySelector('.messages')!;
});
</script>

<template>
    <div class="h-full">
        <div class="messages">
            <div v-for="message in rooms[currentRoom]?.messages"
                :style="message.author === socket.id && 'text-align: end' || ''">
                <span>{{ message.author }}</span>
                <p>{{ message.body }}</p>
            </div>
        </div>

        <form @submit.prevent="sendMessage" style="padding: 0">
            <input v-focus v-model="message" type="text" id="message" placeholder="Message" autocomplete="off" />
            <button type="submit">Send</button>
        </form>
    </div>
</template>