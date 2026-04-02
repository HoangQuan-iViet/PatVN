<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { isRouteLoading } from './router/index.js'
import GlobalNotification from './components/GlobalNotification.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()

// Đóng vai trò làm "Người điều phối" (Coordinator) đa Layout.
const layout = computed(() => {
  if (route.meta.layout === 'admin') return AdminLayout
  if (route.meta.layout === 'auth') return AuthLayout
  return DefaultLayout
})
</script>

<template>
  <GlobalNotification />

  <!-- Lớp Khiên Loading Ngăn Trắng Màn Hình -->
  <div v-if="isRouteLoading" class="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-all">
      <div class="w-12 h-12 border-[3px] border-gray-200 border-t-black rounded-full animate-spin"></div>
      <span class="mt-6 text-sm font-black uppercase tracking-[0.3em] text-black">Đang tải...</span>
  </div>

  <component :is="layout">
    <router-view />
  </component>
</template>

<style scoped>
</style>
