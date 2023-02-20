import { createApp } from 'vue';

import './assets/css/pico.min.css';
import './assets/css/main.scss';

import App from './App.vue';

const app = createApp(App)

app.directive('focus', {
    mounted: element => element.focus()
});

app.mount('#app');