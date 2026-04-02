<template>
  <div class="min-h-screen bg-paper flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-paper border-[0.5px] border-inherit p-8 shadow-sm">
        
        <div class="mb-10 text-center flex flex-col items-center">
             <img src="../assets/Logo.png" alt="PATVN" class="h-14 object-contain mb-6 drop-shadow-sm" />
             <h1 class="font-serif font-black text-xl tracking-[0.2em] uppercase text-ink">PATVN SYSTEM</h1>
             <p class="text-gray-400 text-xs tracking-widest uppercase mt-2 font-bold">{{ isSubmitting ? 'Verifying...' : 'System Login' }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6 flex flex-col items-center">
            <div class="w-full">
                <input v-model="form.email" type="email" placeholder="Email nhận dạng" required
                       class="w-full bg-transparent border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>
            
            <div class="w-full">
                <input v-model="form.password" type="password" placeholder="Chìa khóa bảo mật" required
                       class="w-full bg-transparent border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors" />
            </div>

            <!-- Vị trí cắm Cloudflare Turnstile -->
            <div class="w-full h-16 flex items-center justify-center">
                <vue-turnstile site-key="0x4AAAAAACuwpqhUHdLeij9W" v-model="form.turnstileToken" />
            </div>

            <!-- Lỗi: Nhả 1 kiểu lỗi chung chung duy nhất -->
            <div v-if="error" class="w-full text-center">
                <span class="text-xs font-bold text-red-500 uppercase tracking-wide">{{ error }}</span>
            </div>

            <button type="submit" :disabled="isSubmitting"
                    class="w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 mt-4">
                Đăng Nhập
            </button>
        </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import VueTurnstile from 'vue-turnstile'

const router = useRouter()
const form = reactive({ email: '', password: '' })
const error = ref('')
const isSubmitting = ref(false)

const handleLogin = async () => {
    error.value = ''
    isSubmitting.value = true

    try {
        const { data } = await axios.post('/api/auth/login', form)
        if (data.success) {
            router.push('/admin')
        }
    } catch (err) {
        if (err.response?.status === 400) {
            // Lỗi kỹ thuật từ Cloudflare hoặc thiếu Form
            error.value = err.response.data.message;
        } else if (err.response?.status === 429) {
            // Lỗi do Brute Force
            error.value = err.response.data.message;
        } else if (err.response?.status === 500) {
            error.value = "Lỗi Máy Chủ: Hãy bật Terminal Vercel để check log Mongoose";
        } else {
            // Lỗi 401 Unauthorized mới giấu thông báo để chống Hacker
            error.value = "Invalid email or password";
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>
