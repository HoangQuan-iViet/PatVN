import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './plugins/i18n'
import router from './router'

createApp(App).use(i18n).use(router).mount('#app')
