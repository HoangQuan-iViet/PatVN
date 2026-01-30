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
    },
    {
        path: '/services',
        name: 'services',
        component: () => import('../views/ServicesView.vue')
    },
    {
        path: '/services/:slug',
        name: 'service-detail',
        component: () => import('../views/ServiceDetailView.vue')
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('../views/ContactView.vue')
    },
    {
        path: '/blog',
        name: 'blog',
        component: () => import('../views/BlogView.vue')
    },
    {
        path: '/blog/:slug',
        name: 'post-detail',
        component: () => import('../views/PostDetailView.vue'),
        meta: { headerTheme: 'dark' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 1. Nếu user bấm nút Back/Forward -> Trả về vị trí cũ
        if (savedPosition) {
            return savedPosition
        }
        // 2. Nếu link có hash (vd: #contact) -> Cuộn mượt đến id đó
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
        // 3. Mặc định: Cuộn lên đầu trang ngay lập tức
        return { top: 0, left: 0 }
    }
})

export default router