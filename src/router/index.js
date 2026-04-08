import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import HomeView from '../views/HomeView.vue'

export const isRouteLoading = ref(false)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { layout: 'default' }
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/services',
        name: 'services',
        component: () => import('../views/ServicesView.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/services/danh-muc/:categorySlug',
        name: 'services-category',
        component: () => import('../views/ServicesView.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/services/:slug',
        name: 'service-detail',
        component: () => import('../views/ServiceDetailView.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import('../views/ContactView.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/blog',
        name: 'blog',
        component: () => import('../views/BlogView.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/blog/danh-muc/:categorySlug',
        name: 'blog-category',
        component: () => import('../views/BlogView.vue'),
        meta: { layout: 'default' }
    },
    {
        path: '/blog/:slug',
        name: 'post-detail',
        component: () => import('../views/PostDetailView.vue'),
        meta: { layout: 'default', headerTheme: 'dark' }
    },
    // ---- PHÂN HỆ QUẢN TRỊ ADMIN ----
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { layout: 'auth' }
    },
    {
        path: '/admin',
        redirect: '/admin/contacts'
    },
    {
        path: '/admin/posts',
        name: 'admin-posts',
        component: () => import('../views/admin/AdminPostList.vue'),
        meta: { layout: 'admin', requiresAuth: true }
    },
    {
        path: '/admin/posts/create',
        name: 'admin-post-create',
        component: () => import('../views/admin/AdminPostEdit.vue'),
        meta: { layout: 'admin', requiresAuth: true }
    },
    {
        path: '/admin/posts/:id/edit',
        name: 'admin-post-edit',
        component: () => import('../views/admin/AdminPostEdit.vue'),
        meta: { layout: 'admin', requiresAuth: true }
    },
    {
        path: '/admin/services',
        name: 'admin-services',
        component: () => import('../views/admin/AdminServiceList.vue'),
        meta: { layout: 'admin', requiresAuth: true }
    },
    {
        path: '/admin/services/create',
        name: 'admin-service-create',
        component: () => import('../views/admin/AdminServiceEdit.vue'),
        meta: { layout: 'admin', requiresAuth: true }
    },
    {
        path: '/admin/services/:id/edit',
        name: 'admin-service-edit',
        component: () => import('../views/admin/AdminServiceEdit.vue'),
        meta: { layout: 'admin', requiresAuth: true }
    },
    {
        path: '/admin/categories',
        name: 'admin-categories',
        component: () => import('../views/admin/AdminCategoryList.vue'),
        meta: { layout: 'admin', requiresAuth: true }
    },
    {
        path: '/admin/contacts',
        name: 'admin-contacts',
        component: () => import('../views/admin/AdminContactList.vue'),
        meta: { layout: 'admin', requiresAuth: true }
    },
    {
        path: '/admin/account',
        name: 'admin-account',
        component: () => import('../views/admin/AdminAccount.vue'),
        meta: { layout: 'admin', requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        if (to.hash) return { el: to.hash, behavior: 'smooth' }
        return { top: 0, left: 0 }
    }
})

// Chống đánh cắp tài khoản & Vượt rào Frontend
router.beforeEach(async (to, from, next) => {
    // Bật hiệu ứng Loading Trình Diệt Virus/Security
    isRouteLoading.value = true;

    if (to.meta.requiresAuth) {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                next();
            } else {
                next('/login');
            }
        } catch(e) {
            next('/login');
        }
    } else {
        next();
    }
});

router.afterEach(() => {
    // Tắt hiệu ứng Loading khi đã Load xong trang
    isRouteLoading.value = false;
});

export default router