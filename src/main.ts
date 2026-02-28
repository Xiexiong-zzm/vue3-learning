import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import {router} from './router'
import { createPersistPlugin } from '@/plugins/piniaPersist'

const app = createApp(App);
const pinia = createPinia(); // 注册 pinia
pinia.use(createPersistPlugin())
app.use(pinia);
app.use(router);
app.mount('#app')