<script setup lang="ts">
import {
  rooms,
  currentRoom,
  reconnectionAttempts,

  join,
  leave
} from './services/client';

// Components
import RoomLink from './components/RoomLink.vue';
import Chat from './components/Chat.vue';
</script>

<template>
  <div class="container-fluid" style="height: 100vh">
    <nav style="height: fit-content">
      <ul />

      <ul>
        <li><strong>Chat Rooms</strong></li>
      </ul>

      <ul>
        <li>
          <a href="https://github.com/humanfriend22/chat-rooms" class="contrast"
            aria-label="View the GitHub source page for this chat application">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-github"
              viewBox="0 0 16 16">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </li>
      </ul>
    </nav>

    <main class="container" style="width: 100%; height: 90%">
      <section v-if="currentRoom == ''">
        <form @submit.prevent="() => join()">
          <label for="room">
            <h6 style="margin-bottom: 0">New Room</h6>
          </label>
          <input v-focus type="text" placeholder="e.g. Gaming" id="room" required />

          <button type="submit">Join</button>
        </form>

        <div style="max-height: 65vh; overflow: auto;">
          <RoomLink v-for="name of Object.keys(rooms)" :name="name" :count="rooms[name].count"
            @click="() => join(name)" />
        </div>
      </section>

      <section v-else class="h-full">
        <nav>
          <ul>
            <li>
              <span style="vertical-align: middle">{{ rooms[currentRoom]?.count }}</span>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" width="24" height="24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </li>
          </ul>
          <ul>
            <li @click="leave"><a class="danger">Leave</a></li>
          </ul>
        </nav>
        <Chat />
      </section>
    </main>

    <dialog :open="reconnectionAttempts > 0">
      <article>
        <h3>Offline Server!</h3>
        <p>
          It seems like the server is offline. The client will try to reconnect 5 times.
        </p>
        <p>
          This may be happening because
          the server behind this website will sleep after 15 minutes of
          inactivity (to save resources). It may take a minute or two to restart. Note that the messages will also be
          reset. Server updates may also restart the server triggering the effects mentioned. These are usually really
          small and are not worth announcing in advance.
        </p>
        <footer>
          <progress class="danger" v-if="reconnectionAttempts < 5"></progress>
          <p v-else>Failed!</p>
        </footer>
      </article>
    </dialog>
  </div>
</template>