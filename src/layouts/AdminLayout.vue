<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 flex font-sans selection:bg-black selection:text-white">
    <!-- Sidebar Phẳng: Hairline, Negative Space -->
    <aside :class="['border-r-[0.5px] border-gray-300 bg-white flex flex-col justify-between shrink-0 shadow-sm relative z-20 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]', isSidebarOpen ? 'w-64' : 'w-20']">
      <div>
        <!-- Logo Area -->
        <div class="h-16 border-b-[0.5px] border-gray-300 flex items-center justify-center overflow-hidden whitespace-nowrap">
          <span v-if="isSidebarOpen" class="font-serif font-black text-xs tracking-[0.2em] text-black">PATVN SYSTEM</span>
          <span v-else class="font-serif font-black text-xs tracking-[0.2em] text-black">PV</span>
        </div>
        
        <!-- Navigation -->
        <nav class="p-6 space-y-6 flex flex-col overflow-hidden">
          <router-link to="/admin/contacts" class="group flex items-center gap-4 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors" active-class="text-black">
            <span class="w-2 h-2 rounded-full bg-transparent group-hover:bg-black transition-colors shrink-0" :class="{'bg-black scale-125': $route.path.startsWith('/admin/contact') || $route.path === '/admin', 'ml-3': !isSidebarOpen}"></span>
            <span v-if="isSidebarOpen" class="whitespace-nowrap">Khách Liên Hệ</span>
          </router-link>

          <router-link to="/admin/posts" class="group flex items-center gap-4 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors" active-class="text-black">
            <span class="w-2 h-2 rounded-full bg-transparent group-hover:bg-black transition-colors shrink-0" :class="{'bg-black scale-125': $route.path.startsWith('/admin/post'), 'ml-3': !isSidebarOpen}"></span>
            <span v-if="isSidebarOpen" class="whitespace-nowrap">Bài Viết</span>
          </router-link>

          <router-link to="/admin/services" class="group flex items-center gap-4 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors" active-class="text-black">
            <span class="w-2 h-2 rounded-full bg-transparent group-hover:bg-black transition-colors shrink-0" :class="{'bg-black scale-125': $route.path.startsWith('/admin/service'), 'ml-3': !isSidebarOpen}"></span>
            <span v-if="isSidebarOpen" class="whitespace-nowrap">Dịch Vụ</span>
          </router-link>
          
          <router-link to="/admin/categories" class="group flex items-center gap-4 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors" active-class="text-black">
            <span class="w-2 h-2 rounded-full bg-transparent group-hover:bg-black transition-colors shrink-0" :class="{'bg-black scale-125': $route.path.startsWith('/admin/categorie'), 'ml-3': !isSidebarOpen}"></span>
            <span v-if="isSidebarOpen" class="whitespace-nowrap">Danh Mục</span>
          </router-link>

          <router-link to="/admin/account" class="group flex items-center gap-4 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-black transition-colors" active-class="text-black mt-4 border-t border-gray-100 pt-4">
            <span class="w-2 h-2 rounded-full border border-gray-400 group-hover:border-black transition-colors shrink-0 flex items-center justify-center pt-0.5" :class="{'border-black bg-black scale-125': $route.path.startsWith('/admin/account'), 'ml-3': !isSidebarOpen}"></span>
            <span v-if="isSidebarOpen" class="whitespace-nowrap">Đổi Mật Khẩu</span>
          </router-link>
        </nav>
      </div>

      <!-- Logout (Âm bản) -->
      <div class="p-6 border-t-[0.5px] border-gray-300 overflow-hidden">
        <button @click="logout" class="text-xs uppercase tracking-widest font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-3">
          <svg v-if="!isSidebarOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5 ml-1.5 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
          <span v-if="isSidebarOpen" class="whitespace-nowrap">← Đăng Xuất</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-gray-50/50">
      <!-- Admin Header Hairline -->
      <header class="h-16 border-b-[0.5px] border-gray-300 bg-white/80 backdrop-blur flex items-center justify-between px-6 lg:px-12 shrink-0">
        <!-- Toggle Button -->
        <button @click="toggleSidebar" class="p-2 -ml-2 text-gray-400 hover:text-black transition-colors rounded hover:bg-gray-100 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>

        <div class="flex items-center gap-3 text-xs font-bold text-black uppercase tracking-widest">
           <span class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
           System Active
        </div>
      </header>

      <!-- Vùng Âm: Không sử dụng rounded/shadow mạnh, để thở nhiều -->
      <div class="flex-1 overflow-y-auto w-full px-6 lg:px-12 py-12 lg:py-16">
         <div class="max-w-6xl mx-auto w-full relative">
            <router-view />
         </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isSidebarOpen = ref(true)

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

const logout = async () => {
    try {
        await axios.post('/api/auth/logout')
        router.push('/login')
    } catch(e) {
        console.error(e)
    }
}
</script>

<style scoped>
/* Không để style rò rỉ ra ngoài DefaultLayout */
aside { font-feature-settings: "cv02", "cv03", "cv04", "cv11"; }
</style>
