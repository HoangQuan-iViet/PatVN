import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        // Lazy Loading: Chỉ tải code của trang Home khi người dùng vào đúng route này
        component: () => import('../views/HomeView.vue')
    },
    // Sau này thêm trang About, Contact thì thêm vào dưới đây
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
