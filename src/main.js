import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import router from './router'; // Configura Vue Router más abajo
import 'primevue/resources/themes/saga-blue/theme.css'; // Tema base, ajusta a purple/teal
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

const app = createApp(App);
app.use(PrimeVue);
app.use(router);
app.mount('#app');