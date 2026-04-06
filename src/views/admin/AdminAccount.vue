<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useNotification } from '../../composables/useNotification'

const { showAlert } = useNotification()

const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const isSubmitting = ref(false)
const error = ref('')

const validateForm = () => {
    if (!form.value.currentPassword || !form.value.newPassword || !form.value.confirmPassword) {
        error.value = 'Vui lòng điền đầy đủ các trường.'
        return false
    }
    if (form.value.newPassword.length < 8) {
        error.value = 'Mật khẩu mới phải có ít nhất 8 ký tự.'
        return false
    }
    if (form.value.newPassword !== form.value.confirmPassword) {
        error.value = 'Mật khẩu xác nhận không trùng khớp.'
        return false
    }
    error.value = ''
    return true
}

const submitChangePassword = async () => {
    if (!validateForm()) return
    
    isSubmitting.value = true
    try {
        const { data } = await axios.post('/api/auth/change-password', {
            currentPassword: form.value.currentPassword,
            newPassword: form.value.newPassword
        })

        if (data.success) {
            showAlert('Đổi mật khẩu thành công!', 'success')
            form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
        }
    } catch (err) {
        if (err.response?.data?.message) {
             error.value = err.response.data.message
        } else {
             error.value = 'Lỗi hệ thống. Không thể đổi mật khẩu lúc này.'
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
  <div class="animate-fade-in-up max-w-2xl mx-auto">
    <div class="mb-8 border-b border-gray-200 pb-4">
        <h1 class="text-3xl font-bold text-dark font-sans tracking-tight">Quản Lý Tài Khoản</h1>
        <p class="text-sm text-gray-500 mt-2 font-mono">Bảo mật / Đổi khóa hệ thống</p>
    </div>

    <!-- Password Area -->
    <div class="bg-white border-[0.5px] border-gray-300 shadow-sm p-8">
        <h2 class="text-sm font-black uppercase tracking-widest text-[#8b6b55] mb-6 border-b border-gray-100 pb-2">Thiết Lập Mật Khẩu</h2>
        
        <form @submit.prevent="submitChangePassword" class="space-y-6">
            <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">1. Mã khóa HIỆN TẠI</label>
                <input v-model="form.currentPassword" type="password" required
                       class="w-full bg-gray-50 border border-gray-300 p-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" 
                       placeholder="Nhập lại mã khóa bạn đang dùng để đăng nhập" />
            </div>
            
            <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">2. Mã khóa MỚI (Tối thiểu 8 ký tự)</label>
                <input v-model="form.newPassword" type="password" required minlength="8"
                       class="w-full bg-gray-50 border border-gray-300 p-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" 
                       placeholder="Ví dụ: MySecure@2026!" />
            </div>

             <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">3. Xác nhận lại Mã khóa MỚI</label>
                <input v-model="form.confirmPassword" type="password" required minlength="8"
                       class="w-full bg-gray-50 border border-gray-300 p-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition" 
                       placeholder="Gõ lại chính xác mã khóa bạn vừa nhập bên trên" />
            </div>

            <!-- Error message if any -->
            <div v-if="error" class="bg-red-50 border border-red-200 p-3 flex items-start gap-2">
                <span class="text-red-500 font-bold uppercase tracking-wider text-[10px] mt-0.5">LỖI:</span>
                <span class="text-xs text-red-600">{{ error }}</span>
            </div>

            <div class="pt-4 flex justify-end">
                <button type="submit" :disabled="isSubmitting"
                        class="bg-black text-white px-8 py-3 shadow-md hover:bg-gray-800 transition font-bold text-sm tracking-widest uppercase disabled:opacity-50 inline-flex items-center gap-2">
                    <span v-if="isSubmitting" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                    {{ isSubmitting ? 'ĐANG LƯU MÃ KHÓA...' : 'LƯU MẬT KHẨU MỚI' }}
                </button>
            </div>
        </form>
    </div>
  </div>
</template>
