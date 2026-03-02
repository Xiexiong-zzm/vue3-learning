import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import {router} from './router'
import { createPersistPlugin } from '@/plugins/piniaPersist'
import 'vant/lib/index.css' // 引入 Vant 样式
import '@/styles/index.scss' // 引入全局样式和 TailwindCSS

const app = createApp(App);
const pinia = createPinia(); // 注册 pinia
pinia.use(createPersistPlugin())
app.use(pinia);
app.use(router);
app.mount('#app')