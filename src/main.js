import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './plugins/i18n'
import router from './router'
import vAnimateOnScroll from './directives/vAnimateOnScroll'

const app = createApp(App)

app.use(i18n)
app.use(router)
app.directive('animate-on-scroll', vAnimateOnScroll)

app.mount('#app')
