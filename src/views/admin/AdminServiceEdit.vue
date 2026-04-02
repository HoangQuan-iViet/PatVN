<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useNotification } from '../../composables/useNotification'
import { DocumentIcon, CheckBadgeIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const showPublishMenu = ref(false)
const scheduleDate = ref('')
const isEditMode = ref(false)
const isFetching = ref(false)
const { showAlert } = useNotification()

const initialForm = {
    title: '', slug: '', excerpt: '', category: '', image: '', imagePosition: '50% 50%',
    overview: '', targetAudience: [''], documents: [''],
    process: [{ title: '', desc: '', time: '' }], pricing: '',
    publishedAt: null
}
const currentService = ref(JSON.parse(JSON.stringify(initialForm)))
const availableCategories = ref([])

// --- Drag Cắt Cúp Ảnh Bìa ---
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const posStart = ref({ x: 50, y: 50 })

const parsePosition = (str) => {
    if (!str || str === 'center') return { x: 50, y: 50 }
    if (str === 'top') return { x: 50, y: 0 }
    if (str === 'bottom') return { x: 50, y: 100 }
    if (str === 'left') return { x: 0, y: 50 }
    if (str === 'right') return { x: 100, y: 50 }
    const parts = str.split(' ')
    if (parts.length >= 2) return { x: parseFloat(parts[0]) || 50, y: parseFloat(parts[1]) || 50 }
    return { x: 50, y: 50 }
}

const startDrag = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    isDragging.value = true
    dragStart.value = { x: clientX, y: clientY }
    posStart.value = parsePosition(currentService.value.imagePosition)
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', endDrag)
    window.addEventListener('touchmove', onDrag, { passive: false })
    window.addEventListener('touchend', endDrag)
}

const onDrag = (e) => {
    if (!isDragging.value) return
    e.preventDefault()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const dx = clientX - dragStart.value.x
    const dy = clientY - dragStart.value.y
    const sensitivity = 0.65
    let newX = posStart.value.x - (dx * sensitivity)
    let newY = posStart.value.y - (dy * sensitivity)
    newX = Math.max(0, Math.min(100, newX))
    newY = Math.max(0, Math.min(100, newY))
    currentService.value.imagePosition = `${newX.toFixed(1)}% ${newY.toFixed(1)}%`
}

const endDrag = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', endDrag)
    window.removeEventListener('touchmove', onDrag)
    window.removeEventListener('touchend', endDrag)
}

// --- Fetch Edit Data ---
onMounted(async () => {
    try {
        const catRes = await axios.get('/api/categories?type=service')
        if (catRes.data.success) availableCategories.value = catRes.data.data
    } catch(e) {}

    const { id } = route.params
    if (id) {
        isEditMode.value = true
        isFetching.value = true
        try {
            const { data } = await axios.get('/api/services?id=' + id)
            if (data.success && data.data) {
                // Đảm bảo không bị null các mảng
                const fetched = data.data
                if (!fetched.targetAudience || !fetched.targetAudience.length) fetched.targetAudience = ['']
                if (!fetched.documents || !fetched.documents.length) fetched.documents = ['']
                if (!fetched.process || !fetched.process.length) fetched.process = [{ title: '', desc: '', time: '' }]
                currentService.value = { ...fetched }
            }
        } catch(e) { console.error('Lỗi khi tải dịch vụ:', e) }
        finally { isFetching.value = false }
    }
})

const generateSlug = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

const saveService = async (actionType) => {
    showPublishMenu.value = false

    let missingFields = []
    if (!currentService.value.title || currentService.value.title.trim() === '') {
        missingFields.push('Tiêu đề Dịch Vụ')
    }
    if (actionType !== 'draft') {
        if (!currentService.value.category) {
            missingFields.push('Danh mục')
        }
        if (!currentService.value.overview || currentService.value.overview.trim() === '') {
            missingFields.push('Tổng quan dịch vụ (Overview)')
        }
        if (!currentService.value.image) {
            missingFields.push('Ảnh bìa')
        }
    }

    if (missingFields.length > 0) {
        showAlert(`Vui lòng nhập đầy đủ: ${missingFields.join(', ')}`, 'error')
        return
    }

    // Xoá bớt string rỗng trong mảng trước khi đẩy
    currentService.value.targetAudience = currentService.value.targetAudience.filter(i => i.trim() !== '')
    currentService.value.documents = currentService.value.documents.filter(i => i.trim() !== '')
    currentService.value.process = currentService.value.process.filter(p => p.title.trim() !== '')

    isLoading.value = true
    let successMessage = ''

    if (actionType === 'draft') {
        currentService.value.publishedAt = null
        successMessage = isEditMode.value ? 'Đã lưu lại các thay đổi vào Bản nháp.' : 'Đã tạo Bản nháp mới thành công.'
    } else if (actionType === 'publish_now') {
        currentService.value.publishedAt = new Date().toISOString()
        successMessage = isEditMode.value ? 'Đã lưu cập nhật và Dịch Vụ hiện đang Công khai!' : 'Tuyệt vời! Dịch Vụ đã được xuất bản công khai.'
    } else if (actionType === 'schedule') {
        if (!scheduleDate.value) {
            showAlert('Vui lòng chọn Ngày và Giờ để hệ thống tự động đăng', 'error')
            isLoading.value = false
            return
        }
        currentService.value.publishedAt = new Date(scheduleDate.value).toISOString()
        const d = new Date(scheduleDate.value)
        const formatString = d.toLocaleDateString('vi-VN') + ' lúc ' + d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
        successMessage = `Đã lên lịch! Dịch Vụ sẽ tự động lên trang chủ vào ${formatString}.`
    }

    try {
        if (isEditMode.value) {
            await axios.put(`/api/services?id=${currentService.value._id}`, currentService.value)
            showAlert(successMessage, 'success')
        } else {
            if (!currentService.value.slug) {
                currentService.value.slug = generateSlug(currentService.value.title)
            }
            await axios.post('/api/services', currentService.value)
            showAlert(successMessage, 'success')
        }
        router.push('/admin/services')
    } catch (error) {
        let errorText = 'Không thể lưu Dịch Vụ. Vui lòng tải lại trang và thử lại.'
        const beMessage = error.response?.data?.message || ''
        if (beMessage.includes('duplicate') || beMessage.includes('11000')) {
            errorText = 'Đường dẫn SEO đã tồn tại!'
        } else if (error.message === 'Network Error') {
            errorText = 'Máy tính của bạn đã mất mạng.'
        }
        showAlert(errorText, 'error')
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
  <div v-if="isFetching" class="w-full min-h-[60vh] flex flex-col items-center justify-center">
      <div class="w-12 h-12 border-[3px] border-gray-200 border-t-black rounded-full animate-spin mb-6"></div>
      <span class="text-sm font-black uppercase tracking-[0.3em] text-black">Đang tải...</span>
  </div>

  <div v-else class="animate-fade-in-up pb-32">
    <div class="flex items-center justify-between mb-8 cursor-pointer">
        <button @click="router.push('/admin/services')" class="text-xs uppercase font-bold tracking-widest text-gray-400 hover:text-black transition">
            ← Quay lại Danh sách Dịch vụ
        </button>
    </div>

    <h1 class="text-3xl font-bold font-sans text-dark tracking-tight mb-8">
        {{ isEditMode ? 'Chỉnh sửa Thông tin Dịch Vụ' : 'Khởi tạo Dịch vụ mới' }}
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="lg:col-span-2 space-y-6">
            <!-- Basic Info -->
            <div class="bg-white p-6 shadow-sm border-[0.5px] border-gray-200">
                <h2 class="text-sm font-black uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Thông Tin Căn Bản</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tên Dịch Vụ</label>
                        <input v-model="currentService.title" class="w-full border-b border-gray-300 py-2 text-xl font-bold text-dark focus:outline-none focus:border-black transition-colors" placeholder="Vd: Đăng ký Nhãn hiệu..." />
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 mt-2">Đường dẫn URL SEO (Để trống tự động sinh)</label>
                        <input v-model="currentService.slug" class="w-full bg-transparent border-b border-gray-200 py-2 text-sm text-gray-500 focus:outline-none focus:border-black transition-colors" placeholder="vd: dang-ky-nhan-hieu" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-4">Tóm tắt ngắn (Excerpt / Meta Desc)</label>
                        <textarea v-model="currentService.excerpt" rows="2" class="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50"></textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-4">Tổng quan / Giới thiệu chi tiết (Overview)</label>
                        <textarea v-model="currentService.overview" rows="4" class="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors"></textarea>
                    </div>
                </div>
            </div>

            <!-- Target Audience & Documents -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white p-6 shadow-sm border-[0.5px] border-gray-200">
                     <h2 class="text-sm font-black uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Đối Tượng Phù Hợp</h2>
                     <div v-for="(item, idx) in currentService.targetAudience" :key="'ta'+idx" class="flex gap-2 mb-2">
                         <input v-model="currentService.targetAudience[idx]" class="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-black" placeholder="Vd: Startup công nghệ..." />
                         <button @click="currentService.targetAudience.splice(idx, 1)" class="text-red-400 hover:text-red-600 px-2"><TrashIcon class="w-4 h-4"/></button>
                     </div>
                     <button @click="currentService.targetAudience.push('')" class="text-[10px] uppercase font-bold tracking-widest text-blue-500 mt-2 flex items-center gap-1 hover:text-black"><PlusIcon class="w-4 h-4"/> Thêm Đối tượng</button>
                </div>
                
                <div class="bg-white p-6 shadow-sm border-[0.5px] border-gray-200">
                     <h2 class="text-sm font-black uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Hồ Sơ Yêu Cầu</h2>
                     <div v-for="(item, idx) in currentService.documents" :key="'doc'+idx" class="flex gap-2 mb-2">
                         <input v-model="currentService.documents[idx]" class="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-black" placeholder="Vd: CMND/CCCD..." />
                         <button @click="currentService.documents.splice(idx, 1)" class="text-red-400 hover:text-red-600 px-2"><TrashIcon class="w-4 h-4"/></button>
                     </div>
                     <button @click="currentService.documents.push('')" class="text-[10px] uppercase font-bold tracking-widest text-blue-500 mt-2 flex items-center gap-1 hover:text-black"><PlusIcon class="w-4 h-4"/> Thêm Hồ sơ</button>
                </div>
            </div>

            <!-- Process -->
            <div class="bg-white p-6 shadow-sm border-[0.5px] border-gray-200">
                <h2 class="text-sm font-black uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Quy Trình & Thời Gian</h2>
                <div v-for="(proc, idx) in currentService.process" :key="'proc'+idx" class="p-4 bg-gray-50 border border-dash border-gray-200 mb-4 relative">
                    <button @click="currentService.process.splice(idx, 1)" class="absolute top-4 right-4 text-red-400 hover:text-red-600"><TrashIcon class="w-4 h-4"/></button>
                    <div class="grid grid-cols-2 gap-4 mb-2">
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Tên Bước</label>
                            <input v-model="proc.title" class="w-full border-b border-gray-300 py-1 bg-transparent text-sm font-bold focus:outline-none focus:border-black" placeholder="Tên bước thực hiện" />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Thời Gian Cần Thiết</label>
                            <input v-model="proc.time" class="w-full border-b border-gray-300 py-1 bg-transparent text-sm text-green-700 font-mono focus:outline-none focus:border-black" placeholder="vd: 5-7 ngày" />
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 uppercase">Mô tả công việc</label>
                        <input v-model="proc.desc" class="w-full border-b border-gray-300 py-1 bg-transparent text-sm focus:outline-none focus:border-black" placeholder="Mô tả chi tiết bước này sẽ làm gì..." />
                    </div>
                </div>
                <button @click="currentService.process.push({title:'',desc:'',time:''})" class="text-[10px] uppercase font-bold tracking-widest text-blue-500 flex items-center gap-1 hover:text-black mt-2"><PlusIcon class="w-4 h-4"/> Thêm Bước Mới</button>
            </div>

            <!-- Biểu phí -->
            <div class="bg-white p-6 shadow-sm border-[0.5px] border-gray-200 w-full mb-10">
                <h2 class="text-sm font-black uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Chính Sách Giá (Pricing Text)</h2>
                <textarea v-model="currentService.pricing" rows="2" class="w-full border border-gray-300 bg-[#f9f9f9] p-3 text-sm focus:outline-none focus:border-black" placeholder="Vd: Chi phí trọn gói 15.000.000 VNĐ..."></textarea>
            </div>
        </div>

        <!-- Sidebar phải -->
        <div class="space-y-6">
            <div class="bg-white border-[0.5px] border-gray-300 p-6 shadow-sm">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phân loại Danh mục</label>
                    <select v-model="currentService.category" class="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black font-bold text-dark mb-4 bg-transparent">
                        <option value="" disabled>-- Vui lòng chọn Danh mục --</option>
                        <option v-for="cat in availableCategories" :key="cat._id" :value="cat.slug">{{ cat.name }}</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Kèm Hình Ảnh Bìa (URL)</label>
                    <input v-model="currentService.image" class="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black mb-1" placeholder="https://..." />
                    
                    <div class="mb-2 mt-4 flex items-center justify-between">
                        <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex gap-2 items-center">
                            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> 
                            Di chuột để Crop mỏ neo
                        </label>
                        <span class="text-[10px] font-mono text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">{{ currentService.imagePosition || '50% 50%' }}</span>
                    </div>
                    
                    <div class="w-full h-48 bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative group cursor-move shadow-inner"
                         @mousedown.prevent="startDrag"
                         @touchstart.passive="startDrag">
                         
                        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none" :class="{ 'hidden': isDragging }">
                            <span class="text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded backdrop-blur">
                                Nắm Kéo
                            </span>
                        </div>

                        <img v-if="currentService.image" :src="currentService.image" draggable="false" :style="{ objectPosition: currentService.imagePosition || '50% 50%' }" class="w-full h-full object-cover pointer-events-none select-none transition-none" />
                        <span v-else class="text-xs text-gray-400 font-bold uppercase tracking-widest absolute">Không ảnh</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-100 p-5 rounded-md border border-gray-200">
                <h3 class="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Lưu ý cấu trúc Dịch Vụ:</h3>
                <p class="text-xs text-gray-500 leading-relaxed font-medium">
                    Bài Dịch vụ (Services) được xây dựng trên một bộ Data cứng (Data Arrays) thay vì nguyên một cục văn bản Rich Text (TipTap) lộn xộn như Bài Báo (News). Hãy bấm '+' ở từng mục để thêm các đối tượng Yêu cầu Hồ Sơ, Các bước Quy Trình và Hỏi Đáp...
                </p>
            </div>
        </div>
    </div>
    
    <!-- Thanh Panel Điều Khiển -->
    <div class="fixed bottom-0 left-0 lg:left-64 right-0 border-t border-gray-300 bg-white/95 backdrop-blur-md p-4 px-8 flex justify-between items-center z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div class="text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden md:flex items-center gap-3">
            Trạng Thái: 
            <span v-if="!currentService.publishedAt" class="text-gray-800 flex items-center gap-1.5 ml-1 bg-gray-100 px-3 py-1.5 rounded"><DocumentIcon class="w-4 h-4"/> BẢN NHÁP CHIẾN LƯỢC</span>
            <span v-else class="text-green-700 flex items-center gap-1.5 ml-1 bg-green-50/50 px-3 py-1.5 rounded border border-green-200"><CheckBadgeIcon class="w-4 h-4"/> ONLINE CÔNG KHAI</span>
        </div>

        <div class="flex gap-4">
            <button @click="router.push('/admin/services')" class="px-4 py-2 text-[10px] uppercase font-bold text-gray-500 hover:text-black">Quay Lại</button>
            <button v-if="currentService.publishedAt" @click="saveService('draft')" :disabled="isLoading" class="border border-gray-300 text-black px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-100">
                Gỡ thành Nháp
            </button>
            <button v-else @click="saveService('draft')" :disabled="isLoading" class="border border-gray-300 text-black px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-100">
                Lưu Nháp Tạm
            </button>

            <!-- Nút Lưu & Xuất Bàn -->
            <button @click="saveService('publish_now')" :disabled="isLoading" class="bg-black text-white px-8 py-3 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 shadow-xl transition transform hover:-translate-y-0.5">
                {{ isLoading ? 'Loading...' : 'LƯU & CÔNG KHAI' }}
            </button>
        </div>
    </div>
  </div>
</template>
