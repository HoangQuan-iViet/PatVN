import { ViteSSG } from 'vite-ssg'
import axios from 'axios'
import './style.css'
import App from './App.vue'
import i18n from './plugins/i18n'
import { routes, scrollBehavior, setupRouterHooks } from './router'
import vAnimateOnScroll from './directives/vAnimateOnScroll'

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ app, router, routes, isClient, initialState }) => {
    // Thông minh cấu hình Axios:
    if (!isClient) {
      // Đang Build tĩnh ở Node: gọi đến Server thật
      axios.defaults.baseURL = 'https://pat-vn.vercel.app'
    } else {
      // Đang ở trình duyệt: chạy relative path để không dính CORS
      axios.defaults.baseURL = ''
    }

    app.use(i18n)
    app.directive('animate-on-scroll', vAnimateOnScroll)
    setupRouterHooks(router)
  }
)
