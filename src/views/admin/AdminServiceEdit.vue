<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useNotification } from '../../composables/useNotification'
import { generateSlug, sanitizeSlugInput } from '../../utils/slug'
import { DocumentIcon, CheckBadgeIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const showPublishMenu = ref(false)
const scheduleDate = ref('')
const isEditMode = ref(false)
const isFetching = ref(false)
const { showAlert } = useNotification()

const activeLang = ref('vi')
const initialForm = {
    title: '', title_en: '',
    slug: '', 
    excerpt: '', excerpt_en: '',
    category: '', 
    image: '', imagePosition: '50% 50%',
    overview: '', overview_en: '',
    targetAudience: [''], targetAudience_en: [''],
    documents: [''], documents_en: [''],
    process: [{ title: '', desc: '', time: '' }],
    process_en: [{ title: '', desc: '', time: '' }],
    pricing: [{ title: '', desc: '' }], pricing_en: [{ title: '', desc: '' }],
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
    const { id } = route.params
    if (id) {
        isEditMode.value = true
        isFetching.value = true
    }

    try {
        const catRes = await axios.get('/api/categories?type=service')
        if (catRes.data.success) availableCategories.value = catRes.data.data
    } catch(e) {}

    if (id) {
        try {
            const { data: res } = await axios.get('/api/services?id=' + id)
            if (res.success && res.data) {
                // Đảm bảo không bị null các mảng
                const fetched = res.data
                if (!fetched.targetAudience || !fetched.targetAudience.length) fetched.targetAudience = ['']
                if (!fetched.targetAudience_en || !fetched.targetAudience_en.length) fetched.targetAudience_en = ['']
                if (!fetched.documents || !fetched.documents.length) fetched.documents = ['']
                if (!fetched.documents_en || !fetched.documents_en.length) fetched.documents_en = ['']
                if (!fetched.process || !fetched.process.length) fetched.process = [{ title: '', desc: '', time: '' }]
                if (!fetched.process_en || !fetched.process_en.length) fetched.process_en = [{ title: '', desc: '', time: '' }]
                
                // Migrate legacy string to array if needed
                if (typeof fetched.pricing === 'string') {
                    fetched.pricing = fetched.pricing ? [{ title: 'Phí dịch vụ', desc: fetched.pricing }] : [{ title: '', desc: '' }]
                } else if (!fetched.pricing || !fetched.pricing.length) {
                    fetched.pricing = [{ title: '', desc: '' }]
                }

                if (typeof fetched.pricing_en === 'string') {
                    fetched.pricing_en = fetched.pricing_en ? [{ title: 'Service Fee', desc: fetched.pricing_en }] : [{ title: '', desc: '' }]
                } else if (!fetched.pricing_en || !fetched.pricing_en.length) {
                    fetched.pricing_en = [{ title: '', desc: '' }]
                }
                
                currentService.value = { ...initialForm, ...fetched }
                activeLang.value = 'vi'
            }
        } catch(e) { console.error('Lỗi khi tải dịch vụ:', e) }
        finally { isFetching.value = false }
    }
})

const onSlugInput = () => {
    currentService.value.slug = sanitizeSlugInput(currentService.value.slug)
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
    currentService.value.targetAudience_en = currentService.value.targetAudience_en.filter(i => i.trim() !== '')
    currentService.value.documents = currentService.value.documents.filter(i => i.trim() !== '')
    currentService.value.documents_en = currentService.value.documents_en.filter(i => i.trim() !== '')
    currentService.value.process = currentService.value.process.filter(p => p.title.trim() !== '')
    currentService.value.process_en = currentService.value.process_en.filter(p => p.title.trim() !== '')
    currentService.value.pricing = (currentService.value.pricing || []).filter(p => p.title?.trim() !== '')
    currentService.value.pricing_en = (currentService.value.pricing_en || []).filter(p => p.title?.trim() !== '')

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

const isTranslating = ref(false)

const autoTranslate = async () => {
    let payload = [];
    
    payload.push(currentService.value.title || '');
    payload.push(currentService.value.excerpt || '');
    payload.push(currentService.value.overview || '');
    payload.push(currentService.value.pricing || '');
    
    const taLen = currentService.value.targetAudience.length;
    currentService.value.targetAudience.forEach(item => payload.push(item || ''));
    
    const docLen = currentService.value.documents.length;
    currentService.value.documents.forEach(item => payload.push(item || ''));
    
    const processLen = currentService.value.process.length;
    currentService.value.process.forEach(p => {
        payload.push(p.title || '');
        payload.push(p.desc || '');
        payload.push(p.time || '');
    });

    isTranslating.value = true;
    try {
        const { data } = await axios.post('/api/translate', { texts: payload });
        if (data.success && data.translations) {
            let t = data.translations;
            let cursor = 0;
            
            currentService.value.title_en = t[cursor++];
            currentService.value.excerpt_en = t[cursor++];
            currentService.value.overview_en = t[cursor++];
            currentService.value.pricing_en = t[cursor++];
            
            currentService.value.targetAudience_en = [];
            for(let i=0; i<taLen; i++) currentService.value.targetAudience_en.push(t[cursor++]);
            
            currentService.value.documents_en = [];
            for(let i=0; i<docLen; i++) currentService.value.documents_en.push(t[cursor++]);
            
            currentService.value.process_en = [];
            for(let i=0; i<processLen; i++) {
                currentService.value.process_en.push({
                    title: t[cursor++],
                    desc: t[cursor++],
                    time: t[cursor++]
                });
            }

            activeLang.value = 'en';
            let info = 'Đã tự động dịch sang Tiếng Anh (Bằng AI)!';
            if (data.mode !== 'gemini') info = 'Đã tự động dịch bằng Google (Cơ chế fallback)';
            showAlert(info, 'success');
        }
    } catch(e) {
        console.error(e);
        showAlert('Có lỗi khi tự động dịch dịch vụ.', 'error');
    } finally {
        isTranslating.value = false;
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

    <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold font-serif text-dark tracking-tight">
            {{ isEditMode ? 'Chỉnh sửa Dịch Vụ' : 'Thiết lập Dịch Vụ mới' }}
        </h1>

        <div class="flex flex-wrap items-center gap-2 md:gap-4">
            <!-- Nút Dịch AI -->
            <button @click="autoTranslate" :disabled="isTranslating" class="px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8b6b55] bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-all flex items-center gap-1.5 disabled:opacity-50">
                <span v-if="isTranslating" class="w-3 h-3 border-2 border-[#8b6b55] border-t-transparent rounded-full animate-spin"></span>
                <span v-else>✨</span>
                {{ isTranslating ? 'Đang dịch...' : 'Dịch AI (EN)' }}
            </button>

            <!-- Tab chuyển đổi ngôn ngữ -->
            <div class="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button @click="activeLang = 'vi'" 
                    class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all"
                    :class="activeLang === 'vi' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'">
                    Tiếng Việt
                </button>
                <button @click="activeLang = 'en'" 
                    class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all"
                    :class="activeLang === 'en' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'">
                    English (EN)
                </button>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Cột trái: Thông tin chính -->
        <div class="lg:col-span-2 space-y-6">
            <!-- VI FIELDS -->
            <div v-show="activeLang === 'vi'" class="space-y-6 animate-fade-in">
                <div class="bg-white p-6 shadow-sm border-[0.5px] border-gray-200">
                    <h2 class="text-xs font-black uppercase tracking-widest border-b border-gray-100 pb-3 mb-5 text-gray-400">Thông Tin Căn Bản (VI)</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tên Dịch Vụ (VI)</label>
                            <input v-model="currentService.title" @input="!isEditMode && (currentService.slug = generateSlug(currentService.title))" class="w-full border-b border-gray-300 py-2 text-xl font-bold text-dark focus:outline-none focus:border-black transition-colors" placeholder="Vd: Đăng ký Nhãn hiệu..." />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-4">Tóm tắt ngắn (VI)</label>
                            <textarea v-model="currentService.excerpt" rows="2" class="w-full border border-gray-200 p-3 text-sm focus:outline-none focus:border-black transition-colors bg-gray-50" placeholder="Hiển thị ở trang danh sách..."></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-4">Tổng quan chi tiết (VI)</label>
                            <textarea v-model="currentService.overview" rows="4" class="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Nội dung giới thiệu dịch vụ..."></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="activeLang === 'en'" class="space-y-6 animate-fade-in">
                <div class="bg-white p-6 shadow-sm border-[0.5px] border-blue-100">
                    <h2 class="text-xs font-black uppercase tracking-widest border-b border-blue-50 pb-3 mb-5 text-blue-400">Basic Information (EN)</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Service Name (EN)</label>
                            <input v-model="currentService.title_en" class="w-full border-b border-blue-200 py-2 text-xl font-bold text-dark focus:outline-none focus:border-blue-600 transition-colors" placeholder="Service name in English..." />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 mt-4">Short Excerpt (EN)</label>
                            <textarea v-model="currentService.excerpt_en" rows="2" class="w-full border border-blue-100 p-3 text-sm focus:outline-none focus:border-blue-600 transition-colors bg-blue-50/30" placeholder="English summary..."></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 mt-4">Detailed Overview (EN)</label>
                            <textarea v-model="currentService.overview_en" rows="4" class="w-full border border-blue-200 p-3 text-sm focus:outline-none focus:border-blue-600 transition-colors" placeholder="English detailed content..."></textarea>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Shared Data Arrays (Target Audience, Documents) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Target Audience -->
                <div class="bg-white p-6 shadow-sm border-[0.5px] border-gray-200">
                    <h2 class="text-xs font-black uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Đối Tượng {{ activeLang === 'vi' ? '(VI)' : '(EN)' }}</h2>
                    <div v-for="(item, idx) in (activeLang === 'vi' ? currentService.targetAudience : currentService.targetAudience_en)" :key="'ta'+idx" class="flex gap-2 mb-2">
                        <input v-model="(activeLang === 'vi' ? currentService.targetAudience : currentService.targetAudience_en)[idx]" class="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-black" placeholder="Người đại diện, doanh nghiệp..." />
                        <button @click="(activeLang === 'vi' ? currentService.targetAudience : currentService.targetAudience_en).splice(idx, 1)" class="text-red-400 hover:text-red-600 px-2"><TrashIcon class="w-4 h-4"/></button>
                    </div>
                    <button @click="(activeLang === 'vi' ? currentService.targetAudience : currentService.targetAudience_en).push('')" class="text-[10px] uppercase font-bold tracking-widest text-blue-500 mt-2 flex items-center gap-1 hover:text-black"><PlusIcon class="w-4 h-4"/> Thêm mục</button>
                </div>

                <!-- Documents -->
                <div class="bg-white p-6 shadow-sm border-[0.5px] border-gray-200">
                    <h2 class="text-xs font-black uppercase tracking-widest border-b border-gray-200 pb-3 mb-4">Hồ Sơ Cần Có {{ activeLang === 'vi' ? '(VI)' : '(EN)' }}</h2>
                    <div v-for="(item, idx) in (activeLang === 'vi' ? currentService.documents : currentService.documents_en)" :key="'doc'+idx" class="flex gap-2 mb-2">
                        <input v-model="(activeLang === 'vi' ? currentService.documents : currentService.documents_en)[idx]" class="w-full border-b border-gray-200 py-1 text-sm focus:outline-none focus:border-black" placeholder="Vd: Giấy phép kinh doanh..." />
                        <button @click="(activeLang === 'vi' ? currentService.documents : currentService.documents_en).splice(idx, 1)" class="text-red-400 hover:text-red-600 px-2"><TrashIcon class="w-4 h-4"/></button>
                    </div>
                    <button @click="(activeLang === 'vi' ? currentService.documents : currentService.documents_en).push('')" class="text-[10px] uppercase font-bold tracking-widest text-blue-500 mt-2 flex items-center gap-1 hover:text-black"><PlusIcon class="w-4 h-4"/> Thêm hồ sơ</button>
                </div>
            </div>

            <!-- Process -->
            <div class="bg-white p-6 shadow-sm border-[0.5px] border-gray-200">
                <h2 class="text-xs font-black uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Quy Trình Thực Hiện {{ activeLang === 'vi' ? '(VI)' : '(EN)' }}</h2>
                <div v-for="(proc, idx) in (activeLang === 'vi' ? currentService.process : currentService.process_en)" :key="'proc'+idx" class="p-4 bg-gray-50 border border-dash border-gray-200 mb-4 relative">
                    <button @click="(activeLang === 'vi' ? currentService.process : currentService.process_en).splice(idx, 1)" class="absolute top-4 right-4 text-red-400 hover:text-red-600"><TrashIcon class="w-4 h-4"/></button>
                    <div class="grid grid-cols-2 gap-4 mb-2">
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Tên Bước</label>
                            <input v-model="proc.title" class="w-full border-b border-gray-300 py-1 bg-transparent text-sm font-bold focus:outline-none focus:border-black" placeholder="Bước 1: Tiếp nhận..." />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Thời Gian</label>
                            <input v-model="proc.time" class="w-full border-b border-gray-300 py-1 bg-transparent text-sm text-green-700 font-mono focus:outline-none focus:border-black" placeholder="Vd: 3 ngày" />
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 uppercase">Mô tả công việc</label>
                        <input v-model="proc.desc" class="w-full border-b border-gray-300 py-1 bg-transparent text-sm focus:outline-none focus:border-black" placeholder="Ký kết hợp đồng và tạm ứng..." />
                    </div>
                </div>
                <button @click="(activeLang === 'vi' ? currentService.process : currentService.process_en).push({title:'',desc:'',time:''})" class="text-[10px] uppercase font-bold tracking-widest text-blue-500 flex items-center gap-1 hover:text-black mt-2"><PlusIcon class="w-4 h-4"/> Thêm Bước Mới</button>
            </div>

            <!-- Pricing List -->
            <div class="bg-white p-6 shadow-sm border-[0.5px] border-gray-200">
                <h2 class="text-xs font-black uppercase tracking-widest border-b border-gray-200 pb-3 mb-5">Chính Sách Giá {{ activeLang === 'vi' ? '(VI)' : '(EN)' }}</h2>
                <div v-for="(priceItem, idx) in (activeLang === 'vi' ? currentService.pricing : currentService.pricing_en)" :key="'price'+idx" class="p-4 bg-yellow-50/50 border border-dash border-yellow-200 mb-4 relative">
                    <button @click="(activeLang === 'vi' ? currentService.pricing : currentService.pricing_en).splice(idx, 1)" class="absolute top-4 right-4 text-red-400 hover:text-red-600"><TrashIcon class="w-4 h-4"/></button>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Hạng mục (Vd: Phí dịch vụ, Lệ phí...)</label>
                            <input v-model="priceItem.title" class="w-full border-b border-gray-300 py-1 bg-transparent text-sm font-bold focus:outline-none focus:border-black" placeholder="Phí dịch vụ..." />
                        </div>
                        <div>
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Mô tả giá (Có thể xuống dòng)</label>
                            <textarea v-model="priceItem.desc" rows="2" class="w-full border-b border-gray-300 py-1 bg-transparent text-sm text-yellow-700 font-mono focus:outline-none focus:border-black resize-y" placeholder="Vd: 2.000.000 VNĐ hoặc Liên hệ..."></textarea>
                        </div>
                    </div>
                </div>
                <button @click="(activeLang === 'vi' ? currentService.pricing : currentService.pricing_en).push({title:'',desc:''})" class="text-[10px] uppercase font-bold tracking-widest text-blue-500 flex items-center gap-1 hover:text-black mt-2"><PlusIcon class="w-4 h-4"/> Thêm Hạng Mục Giá</button>
            </div>
        </div>

        <!-- Sidebar phải: Cấu hình chung -->
        <div class="space-y-6">
            <div class="bg-white border-[0.5px] border-gray-300 p-6 shadow-sm">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phân loại Danh mục</label>
                    <select v-model="currentService.category" class="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black font-bold text-dark mb-4 bg-transparent">
                        <option value="" disabled>-- Chọn Danh mục --</option>
                        <option v-for="cat in availableCategories" :key="cat._id" :value="cat.slug">{{ cat.name }}</option>
                    </select>
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 mt-2">Đường dẫn SEO (Dùng chung)</label>
                    <input v-model="currentService.slug" @input="onSlugInput" class="w-full bg-transparent border-b border-gray-200 py-2 text-sm text-gray-500 focus:outline-none focus:border-black font-mono mb-6" />
                </div>

                <div>
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Hình Ảnh Bìa (URL)</label>
                    <input v-model="currentService.image" class="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black mb-1" placeholder="https://..." />
                    
                    <div class="mb-2 mt-4 flex items-center justify-between">
                        <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex gap-2 items-center">
                            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> 
                            Kéo ảnh để căn chỉnh
                        </label>
                        <span class="text-[10px] font-mono text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">{{ currentService.imagePosition || '50% 50%' }}</span>
                    </div>
                    
                    <div class="w-full h-48 bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative group cursor-move shadow-inner"
                         @mousedown.prevent="startDrag"
                         @touchstart.passive="startDrag">
                        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none" :class="{ 'hidden': isDragging }">
                            <span class="text-white text-[10px] font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded backdrop-blur">Nắm Kéo</span>
                        </div>
                        <img v-if="currentService.image" :src="currentService.image" draggable="false" :style="{ objectPosition: currentService.imagePosition || '50% 50%' }" class="w-full h-full object-cover pointer-events-none select-none transition-none" />
                        <span v-else class="text-[10px] text-gray-400 font-bold uppercase tracking-widest absolute">Không ảnh</span>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-100 p-5 rounded-md border border-gray-200">
                <h3 class="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Lưu ý Đa Ngôn Ngữ:</h3>
                <p class="text-xs text-gray-500 leading-relaxed">
                    Vui lòng nhập đầy đủ thông tin ở cả 2 Tab (Tiếng Việt & English) để nội dung hiển thị chính xác khi khách hàng chuyển đổi ngôn ngữ trên website. Các trường SEO và Ảnh sẽ được dùng chung.
                </p>
            </div>
        </div>
    </div>
    
    <!-- Thanh Panel Điều Khiển -->
    <div class="fixed bottom-0 left-0 lg:left-64 right-0 border-t border-gray-300 bg-white/95 backdrop-blur-md p-4 px-8 flex justify-between items-center z-40 shadow-lg">
        <div class="text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden md:flex items-center gap-3">
            Trạng Thái: 
            <span v-if="!currentService.publishedAt" class="text-gray-800 flex items-center gap-1.5 ml-1 bg-gray-100 px-3 py-1.5 rounded">BẢN NHÁP</span>
            <span v-else class="text-green-700 flex items-center gap-1.5 ml-1 bg-green-50 px-3 py-1.5 rounded border border-green-200">ĐÃ XUẤT BẢN</span>
        </div>

        <div class="flex gap-4">
            <button @click="router.push('/admin/services')" class="px-4 py-2 text-[10px] uppercase font-bold text-gray-500 hover:text-black">Hủy</button>
            <button @click="saveService('draft')" :disabled="isLoading" class="border border-gray-300 text-black px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-gray-100">
                Lưu Nháp
            </button>
            <button @click="saveService('publish_now')" :disabled="isLoading" class="bg-black text-white px-8 py-3 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-gray-800 shadow-xl transition transition-transform hover:-translate-y-0.5">
                {{ isLoading ? 'Đang xử lý...' : 'LƯU & XUẤT BẢN' }}
            </button>
        </div>
    </div>
  </div>
</template>
