import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import { loadFonts } from './plugins/webfontloader';
import store from './store/store';
loadFonts();

import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

createApp(App)
    .use(store)
    .use(createVuetify())
    .mount('#app');
