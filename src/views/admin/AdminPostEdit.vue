<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useNotification } from '../../composables/useNotification'
import { generateSlug, sanitizeSlugInput } from '../../utils/slug'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { DocumentIcon, CheckBadgeIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const showPublishMenu = ref(false)
const showPreviewModal = ref(false)
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
    content: '', content_en: '',
    publishedAt: null 
}
const currentPost = ref(JSON.parse(JSON.stringify(initialForm)))
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
    posStart.value = parsePosition(currentPost.value.imagePosition)

    // Bắt sự kiện trên toàn cục Window để không bị rớt kéo khi lỡ văng chuột ra ngoài Box
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', endDrag)
    window.addEventListener('touchmove', onDrag, { passive: false })
    window.addEventListener('touchend', endDrag)
}

const onDrag = (e) => {
    if (!isDragging.value) return
    e.preventDefault() // Chống kẹt Native Drag của Trình duyệt

    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    
    const dx = clientX - dragStart.value.x
    const dy = clientY - dragStart.value.y

    // Tăng độ nhạy lên mượt hơn
    const sensitivity = 0.65
    let newX = posStart.value.x - (dx * sensitivity)
    let newY = posStart.value.y - (dy * sensitivity)

    newX = Math.max(0, Math.min(100, newX))
    newY = Math.max(0, Math.min(100, newY))

    currentPost.value.imagePosition = `${newX.toFixed(1)}% ${newY.toFixed(1)}%`
}

const endDrag = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', endDrag)
    window.removeEventListener('touchmove', onDrag)
    window.removeEventListener('touchend', endDrag)
}

// --- TipTap Editor Setup ---
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit.configure({
        heading: { levels: [2, 3, 4] }
    }),
    Link.configure({ openOnClick: false }),
    Image,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg focus:outline-none max-w-none',
    },
  },
  onUpdate: ({ editor }) => {
    if (activeLang.value === 'vi') {
        currentPost.value.content = editor.getHTML()
    } else {
        currentPost.value.content_en = editor.getHTML()
    }
  }
})

// Chuyển đổi ngôn ngữ soạn thảo
const switchLang = (lang) => {
    // Lưu nội dung hiện tại vào field tương ứng trước khi swap
    if (activeLang.value === 'vi') {
        currentPost.value.content = editor.value.getHTML()
    } else {
        currentPost.value.content_en = editor.value.getHTML()
    }

    activeLang.value = lang

    // Cập nhật nội dung editor mới
    if (lang === 'vi') {
        editor.value.commands.setContent(currentPost.value.content || '')
    } else {
        editor.value.commands.setContent(currentPost.value.content_en || '')
    }
}

onBeforeUnmount(() => {
  editor.value.destroy()
})

const promptModal = ref({
    isOpen: false,
    type: 'link', 
    value: '',
    title: '',
    placeholder: '',
    description: ''
})

// Custom Directive Focus
const vFocus = {
  mounted: (el) => el.focus()
}

const addImagePrompt = () => {
    promptModal.value = {
        isOpen: true,
        type: 'image',
        value: '',
        title: 'Nhúng Hình Ảnh vào Bài',
        placeholder: 'ví dụ: https://imgur.com/anh-dep.jpg',
        description: 'Dán đường dẫn (Link Ảnh URL) vào ô bên dưới. Ảnh sẽ được dán thẳng vào trình soạn thảo.'
    }
}

const addLinkPrompt = () => {
    const previousUrl = editor.value.getAttributes('link').href || ''
    promptModal.value = {
        isOpen: true,
        type: 'link',
        value: previousUrl,
        title: 'Chèn Liên Kết (Link)',
        placeholder: 'ví dụ: https://patvn.com/dich-vu',
        description: 'Bôi đen 1 đoạn chữ và dán Link vào ô bên dưới để chữ đó trở thành Nút (Clickable).'
    }
}

const submitPrompt = () => {
    const url = promptModal.value.value.trim()
    
    if (promptModal.value.type === 'image') {
        if (url) {
            editor.value.chain().focus().setImage({ src: url }).run()
        }
    } else if (promptModal.value.type === 'link') {
        if (url === '') {
            editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
        } else {
            editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }
    }
    
    promptModal.value.isOpen = false
}

const unLink = () => {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    promptModal.value.isOpen = false
}

// 5. FETCH DATA (NẾU LÀ RE-EDIT)
onMounted(async () => {
    const { id } = route.params
    if (id) {
        isEditMode.value = true
        isFetching.value = true
    }

    try {
        const catRes = await axios.get('/api/categories?type=post')
        if (catRes.data.success) availableCategories.value = catRes.data.data
    } catch(e) {}

    // Bắt sự kiện thả ảnh...
    if (id) {
        try {
            // Tải duy nhất 1 bài từ DB, tránh kéo cả MB Data thừa thãi
            const { data: res } = await axios.get('/api/posts?id=' + id)
            if (res.success && res.data) {
                currentPost.value = { ...initialForm, ...res.data }
                // Luôn ưu tiên hiển thị bản tiếng Việt trước khi load
                activeLang.value = 'vi'
                editor.value.commands.setContent(currentPost.value.content || '')
            }
        } catch(e) { console.error('Lỗi khi tải chi tiết bài viết:', e) }
        finally {
            isFetching.value = false
        }
    }
})

const onSlugInput = () => {
    currentPost.value.slug = sanitizeSlugInput(currentPost.value.slug)
}

const isTranslating = ref(false)

const autoTranslate = async () => {
    let contentToTranslate = currentPost.value.content;
    if (activeLang.value === 'vi' && editor.value) {
        contentToTranslate = editor.value.getHTML();
    }

    const payload = [
        currentPost.value.title || '',
        currentPost.value.excerpt || '',
        contentToTranslate || ''
    ];

    if (payload.every(p => p.trim() === '' || p.trim() === '<p></p>')) {
        showAlert('Chưa có nội dung Tiếng Việt để dịch!', 'error');
        return;
    }

    isTranslating.value = true;
    try {
        const { data } = await axios.post('/api/translate', { texts: payload });
        if (data.success && data.translations && data.translations.length === 3) {
            currentPost.value.title_en = data.translations[0];
            currentPost.value.excerpt_en = data.translations[1];
            currentPost.value.content_en = data.translations[2];
            
            if (activeLang.value === 'en') {
                if (editor.value) editor.value.commands.setContent(currentPost.value.content_en || '');
            } else {
                switchLang('en');
            }
            
            let info = 'Đã tự động dịch sang Tiếng Anh (Bằng AI)!';
            if (data.mode !== 'gemini') info = 'Đã tự động dịch bằng Google (Cơ chế fallback)';
            showAlert(info, 'success');
        } else {
            throw new Error(data.message || 'Lỗi dữ liệu trả về');
        }
    } catch (e) {
        console.error("Lỗi Dịch Tự động: ", e);
        showAlert('Có lỗi khi kết nối với AI dịch thuật.', 'error');
    } finally {
        isTranslating.value = false;
    }
}

const savePost = async (actionType) => {
    showPublishMenu.value = false

    // 1. KIỂM TRA DỮ LIỆU ĐẦU VÀO (Cho Người Dùng)
    let missingFields = []
    if (!currentPost.value.title || currentPost.value.title.trim() === '') {
        missingFields.push('Tiêu đề bài viết')
    }
    // Yêu cầu khắt khe hơn nếu xuất bản công khai
    if (actionType !== 'draft') {
        if (!currentPost.value.category) {
            missingFields.push('Danh mục')
        }
        if (!currentPost.value.content || currentPost.value.content === '<p></p>') {
            missingFields.push('Nội dung chi tiết (Trình soạn thảo)')
        }
        if (!currentPost.value.image) {
            missingFields.push('Ảnh bìa')
        }
    }

    if (missingFields.length > 0) {
        showAlert(`Vui lòng nhập đầy đủ: ${missingFields.join(', ')}`, 'error')
        return
    }

    // 2. GÁN TRẠNG THÁI VÀ CHUẨN BỊ THÔNG BÁO TỪNG TRƯỜNG HỢP
    isLoading.value = true
    let successMessage = ''

    if (actionType === 'draft') {
        currentPost.value.publishedAt = null
        successMessage = isEditMode.value ? 'Đã lưu lại các thay đổi vào Bản nháp.' : 'Đã tạo Bản nháp mới thành công. Bạn có thể sửa tiếp sau.'
    } else if (actionType === 'publish_now') {
        currentPost.value.publishedAt = new Date().toISOString()
        successMessage = isEditMode.value ? 'Đã lưu cập nhật và bài viết hiện đang Công khai!' : 'Tuyệt vời! Bài viết đã được xuất bản công khai lên trang web.'
    } else if (actionType === 'schedule') {
        if (!scheduleDate.value) {
            showAlert('Vui lòng chọn Ngày và Giờ để hệ thống tự động đăng', 'error')
            isLoading.value = false
            return
        }
        currentPost.value.publishedAt = new Date(scheduleDate.value).toISOString()
        
        // Format giờ Việt Nam rất dễ hiểu
        const d = new Date(scheduleDate.value)
        const formatString = d.toLocaleDateString('vi-VN') + ' lúc ' + d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
        successMessage = `Đã lên lịch! Bài viết sẽ tự động lên trang chủ vào ${formatString}.`
    }

    // 3. THỰC THI GỬI DỮ LIỆU VÀ XỬ LÝ LỖI CHUYÊN SÂU
    try {
        if (isEditMode.value) {
            await axios.put(`/api/posts?id=${currentPost.value._id}`, currentPost.value)
            showAlert(successMessage, 'success')
        } else {
            if (!currentPost.value.slug) {
                currentPost.value.slug = generateSlug(currentPost.value.title)
            }
            await axios.post('/api/posts', currentPost.value)
            showAlert(successMessage, 'success')
        }
        router.push('/admin/posts')
    } catch (error) {
        let errorText = 'Không thể lưu bài viết. Vui lòng tải lại trang và thử lại.'
        const beMessage = error.response?.data?.message || ''
        
        // Dịch các lỗi Kỹ thuật khô khan sang Ngôn ngữ phổ thông
        if (beMessage.includes('duplicate') || beMessage.includes('11000')) {
            errorText = 'Đường dẫn (URL SEO) này đã tồn tại trên một bài viết khác. Bạn hãy sửa đổi đường dẫn để nó không bị trùng lặp nhé!'
        } else if (error.message === 'Network Error') {
            errorText = 'Máy tính của bạn đã mất mạng. Bạn hãy kiểm tra lại WiFi trước khi bấm lưu tiếp!'
        } else if (error.response?.status === 413) {
            errorText = 'Dữ liệu hoặc ảnh bạn cung cấp quá lớn. Hãy sử dụng ảnh có hình thức nhỏ hơn (dưới 2MB).'
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

  <div v-else class="animate-fade-in-up pb-20">
    <div class="flex items-center justify-between mb-8 cursor-pointer">
        <button @click="router.push('/admin/posts')" class="text-xs uppercase font-bold tracking-widest text-gray-400 hover:text-black transition">
            ← Quay lại Danh sách
        </button>
        <button @click="showPreviewModal = true" class="text-xs uppercase font-bold tracking-widest text-blue-500 hover:text-blue-700 transition">
            ⚲ Chế độ Preview Trực Quan
        </button>
    </div>

    <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold font-sans text-dark tracking-tight">
            {{ isEditMode ? 'Chỉnh sửa tài liệu' : 'Khởi tạo tài liệu mới' }}
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
                <button @click="switchLang('vi')" 
                    class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all"
                    :class="activeLang === 'vi' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'">
                    Tiếng Việt
                </button>
                <button @click="switchLang('en')" 
                    class="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all"
                    :class="activeLang === 'en' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'">
                    English (EN)
                </button>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div class="md:col-span-2 space-y-5">
            <!-- VIETNAMESE FIELDS -->
            <div v-show="activeLang === 'vi'" class="space-y-5 animate-fade-in">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tiêu đề bài viết (VI)</label>
                    <input v-model="currentPost.title" class="w-full border-b border-gray-300 py-3 text-2xl font-bold text-dark focus:outline-none focus:border-black transition-colors" placeholder="Gõ tiêu đề cỡ lớn vào đây..." />
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Đoạn trích dẫn (VI)</label>
                    <textarea v-model="currentPost.excerpt" rows="2" class="w-full border-[0.5px] border-gray-300 bg-white p-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Tóm tắt ngắn gọn nội dung bài viết..."></textarea>
                </div>
            </div>

            <!-- ENGLISH FIELDS -->
            <div v-show="activeLang === 'en'" class="space-y-5 animate-fade-in">
                <div>
                    <label class="block text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Post Title (EN)</label>
                    <input v-model="currentPost.title_en" class="w-full border-b border-blue-200 py-3 text-2xl font-bold text-dark focus:outline-none focus:border-blue-600 transition-colors" placeholder="Type English title here..." />
                </div>
                <div>
                    <label class="block text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Excerpt (EN)</label>
                    <textarea v-model="currentPost.excerpt_en" rows="2" class="w-full border-[0.5px] border-blue-200 bg-white p-3 text-sm focus:outline-none focus:border-blue-600 transition-colors" placeholder="Short summary in English..."></textarea>
                </div>
            </div>

            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 mt-2">Đường dẫn URL SEO (Dùng chung)</label>
                <input v-model="currentPost.slug" @input="onSlugInput" class="w-full bg-transparent border-b border-gray-200 py-2 text-sm text-gray-500 focus:outline-none focus:border-black transition-colors font-mono" placeholder="vd: nhung-luu-y-khi-dk-shtt" />
            </div>
        </div>

        <div class="space-y-5 bg-white border-[0.5px] border-gray-300 p-6 shadow-sm">
            <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phân loại Danh mục</label>
                <select v-model="currentPost.category" class="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black font-bold text-dark bg-transparent">
                    <option value="" disabled>-- Vui chọn chọn Danh mục --</option>
                    <option v-for="cat in availableCategories" :key="cat._id" :value="cat.slug">{{ cat.name }}</option>
                </select>
            </div>
            <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Kèm Hình Ảnh Bìa (URL)</label>
                <input v-model="currentPost.image" class="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black mb-1" placeholder="https://..." />
                
                <div class="mb-2 mt-4 flex items-center justify-between">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex gap-2 items-center">
                        <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> 
                        Di chuột để Căn chỉnh (Crop)
                    </label>
                    <span class="text-[10px] font-mono text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">{{ currentPost.imagePosition || '50% 50%' }}</span>
                </div>
                
                <div class="w-full aspect-video bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden relative group cursor-move shadow-inner"
                     @mousedown.prevent="startDrag"
                     @touchstart.passive="startDrag">
                     
                    <!-- Overlay mờ nhỏ lúc Hover -->
                    <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none" :class="{ 'hidden': isDragging }">
                        <span class="text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded backdrop-blur border border-white/20">
                            Nắm & Kéo
                        </span>
                    </div>

                    <img v-if="currentPost.image" :src="currentPost.image" draggable="false" :style="{ objectPosition: currentPost.imagePosition || '50% 50%' }" class="w-full h-full object-cover pointer-events-none select-none transition-none" />
                    <span v-else class="text-xs text-gray-400 font-bold uppercase tracking-widest absolute">Không có ảnh</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Trình soạn thảo TipTap Có Cuộn Nội Bộ -->
    <div class="mb-24 shadow-sm border-[0.5px] border-gray-300 bg-white flex flex-col h-[70vh]">
        
        <div v-if="editor" class="bg-gray-50 border-b-[0.5px] border-gray-200 p-2 flex flex-wrap gap-1 items-center shrink-0">
            <!-- Nhóm Định dạng chữ -->
            <button @click="editor.chain().focus().toggleBold().run()" class="w-8 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-sm font-bold transition-colors" :class="{ 'bg-black text-white hover:bg-black': editor.isActive('bold'), 'text-gray-700': !editor.isActive('bold') }">B</button>
            <button @click="editor.chain().focus().toggleItalic().run()" class="w-8 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-sm italic font-serif transition-colors" :class="{ 'bg-black text-white hover:bg-black': editor.isActive('italic'), 'text-gray-700': !editor.isActive('italic') }">I</button>
            <button @click="editor.chain().focus().toggleUnderline().run()" class="w-8 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-sm underline transition-colors" :class="{ 'bg-black text-white hover:bg-black': editor.isActive('underline'), 'text-gray-700': !editor.isActive('underline') }">U</button>
            <button @click="editor.chain().focus().toggleStrike().run()" class="w-8 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-sm line-through transition-colors" :class="{ 'bg-black text-white hover:bg-black': editor.isActive('strike'), 'text-gray-700': !editor.isActive('strike') }">S</button>
            
            <div class="w-px h-5 bg-gray-300 mx-2"></div>
            
            <!-- Nhóm Cấu trúc Đoạn văn -->
            <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" class="px-2 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-[11px] font-black uppercase tracking-wider transition-colors" :class="{ 'bg-gray-800 text-white hover:bg-gray-800': editor.isActive('heading', { level: 2 }), 'text-gray-700': !editor.isActive('heading', { level: 2 }) }">H2</button>
            <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" class="px-2 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-[11px] font-black uppercase tracking-wider transition-colors" :class="{ 'bg-gray-800 text-white hover:bg-gray-800': editor.isActive('heading', { level: 3 }), 'text-gray-700': !editor.isActive('heading', { level: 3 }) }">H3</button>

            <div class="w-px h-5 bg-gray-300 mx-2"></div>
            
            <!-- Nhóm Danh sách & Trích dẫn -->
            <button @click="editor.chain().focus().toggleBulletList().run()" class="px-2 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-lg font-black transition-colors" :class="{ 'bg-gray-200 text-black': editor.isActive('bulletList'), 'text-gray-700': !editor.isActive('bulletList') }">.</button>
            <button @click="editor.chain().focus().toggleOrderedList().run()" class="px-2 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-sm font-bold transition-colors" :class="{ 'bg-gray-200 text-black': editor.isActive('orderedList'), 'text-gray-700': !editor.isActive('orderedList') }">1.</button>
            <button @click="editor.chain().focus().toggleBlockquote().run()" class="px-2 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-xl font-serif font-black transition-colors" :class="{ 'bg-gray-200 text-black': editor.isActive('blockquote'), 'text-gray-700': !editor.isActive('blockquote') }">„</button>
            <button @click="editor.chain().focus().toggleCodeBlock().run()" class="px-2 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-[11px] font-black uppercase tracking-wider font-mono transition-colors" :class="{ 'bg-gray-200 text-black': editor.isActive('codeBlock'), 'text-gray-700': !editor.isActive('codeBlock') }">&lt;/&gt;</button>

            <div class="w-px h-5 bg-gray-300 mx-2"></div>
            
            <!-- Căn lề -->
            <button @click="editor.chain().focus().setTextAlign('left').run()" class="px-2 h-8 text-[11px] font-black uppercase tracking-wider transition-colors" :class="{ 'bg-gray-200 text-black': editor.isActive({ textAlign: 'left' }), 'text-gray-700': !editor.isActive({ textAlign: 'left' }) }">Trái</button>
            <button @click="editor.chain().focus().setTextAlign('center').run()" class="px-2 h-8 text-[11px] font-black uppercase tracking-wider transition-colors" :class="{ 'bg-gray-200 text-black': editor.isActive({ textAlign: 'center' }), 'text-gray-700': !editor.isActive({ textAlign: 'center' }) }">Giữa</button>
            <button @click="editor.chain().focus().setTextAlign('right').run()" class="px-2 h-8 text-[11px] font-black uppercase tracking-wider transition-colors" :class="{ 'bg-gray-200 text-black': editor.isActive({ textAlign: 'right' }), 'text-gray-700': !editor.isActive({ textAlign: 'right' }) }">Phải</button>

            <div class="w-px h-5 bg-gray-300 mx-2"></div>
            
            <!-- Media & Tương tác -->
            <button @click="addLinkPrompt" class="px-3 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-[11px] font-black uppercase tracking-wider text-blue-600 transition-colors" :class="{ 'bg-gray-200': editor.isActive('link') }">🔗 Chèn Link</button>
            <button @click="addImagePrompt" class="px-3 h-8 flex justify-center items-center rounded hover:bg-gray-200 text-[11px] font-black uppercase tracking-wider text-green-600 transition-colors">🖼 Nhúng Ảnh</button>
            
            <div class="flex-1"></div>
            
            <!-- Undo Redo -->
            <button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().chain().focus().undo().run()" class="w-8 h-8 text-lg text-gray-400 hover:text-black transition-colors disabled:opacity-30">⟲</button>
            <button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().chain().focus().redo().run()" class="w-8 h-8 text-lg text-gray-400 hover:text-black transition-colors disabled:opacity-30">⟳</button>
        </div>
        
        <div class="flex-1 overflow-y-auto bg-[#fdfdfd]">
            <editor-content :editor="editor" />
        </div>
    </div>

    <!-- Thanh Panel Điều Khiển -->
    <div class="fixed bottom-0 left-0 lg:left-64 right-0 border-t border-gray-300 bg-white/90 backdrop-blur-md p-4 flex justify-between items-center z-40">
        <div class="text-xs font-bold uppercase tracking-widest text-gray-500 hidden sm:flex items-center gap-2">
            Trạng Thái Hiện Tại: 
            <span v-if="!currentPost.publishedAt" class="text-black flex items-center gap-1.5 ml-2"><DocumentIcon class="w-4 h-4 text-gray-500"/>Bản Nháp</span>
            <span v-else class="text-green-600 flex items-center gap-1.5 ml-2"><CheckBadgeIcon class="w-4 h-4 text-green-500"/>Đã Xuất Bản</span>
        </div>

        <div class="flex gap-4 relative">
            <button @click="router.push('/admin/posts')" class="px-6 py-3 text-xs uppercase font-bold text-gray-600 hover:text-black tracking-widest">Hủy Bỏ</button>
            
            <!-- Nút Unpublish (Gỡ bài) hoặc Lưu Nháp -->
            <button v-if="currentPost.publishedAt" @click="savePost('draft')" :disabled="isLoading" class="border border-gray-300 bg-gray-50 text-black px-6 py-3 text-xs uppercase font-bold tracking-widest hover:bg-gray-100 transition disabled:opacity-50">
                Gỡ thành Bản Nháp
            </button>
            <button v-else @click="savePost('draft')" :disabled="isLoading" class="border border-gray-300 bg-gray-50 text-black px-6 py-3 text-xs uppercase font-bold tracking-widest hover:bg-gray-100 transition disabled:opacity-50">
                Lưu Bản Nháp Trống
            </button>

            <!-- Nút Đa Nhiệm Xuất Bản -->
            <div class="relative">
                <button @click="showPublishMenu = !showPublishMenu" :disabled="isLoading" class="bg-black text-white px-8 py-3 text-xs uppercase font-bold tracking-widest shadow-lg hover:bg-gray-800 transition disabled:opacity-50 flex gap-3 items-center">
                    {{ isLoading ? 'Loading...' : 'Xuất Bản' }} <span>▾</span>
                </button>

                <!-- Popover Múi giờ Hướng lên trên (Bottom panel) -->
                <div v-if="showPublishMenu" class="absolute bottom-[110%] right-0 mb-2 w-72 bg-white border-[0.5px] border-gray-300 shadow-2xl p-6 z-50 animate-fade-in-up origin-bottom-right">
                    <div class="space-y-4">
                        <button @click="savePost('publish_now')" class="w-full bg-[#8b6b55] text-white text-xs font-bold tracking-widest px-4 py-3 hover:bg-[#a68269] transition uppercase">
                            Phát Hành Ngay
                        </button>
                        
                        <div class="border-t border-gray-100 pt-5">
                            <label class="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Lên lịch (Timezone Hiện tại)</label>
                            <input type="datetime-local" v-model="scheduleDate" class="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black mb-4 text-sm font-bold font-mono text-dark" />
                            <button @click="savePost('schedule')" class="w-full border-[0.5px] border-black text-black text-xs font-bold tracking-widest px-4 py-3 hover:bg-black hover:text-white transition uppercase">
                                Hoàn Tất Hẹn Giờ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Popup Prompt Nhúng Link & Ảnh thay thế Window.prompt() -->
    <Teleport to="body">
        <div v-if="promptModal.isOpen" class="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-10 relative animate-fade-in-up">
                <button @click="promptModal.isOpen = false" class="absolute top-6 right-6 text-2xl text-gray-400 hover:text-red-500 transition focus:outline-none">✕</button>
                
                <h3 class="text-3xl font-bold font-serif text-dark mb-4">{{ promptModal.title }}</h3>
                <p class="text-sm text-gray-500 mb-8 font-medium leading-relaxed">{{ promptModal.description }}</p>
                
                <input v-model="promptModal.value" @keyup.enter="submitPrompt" v-focus
                    class="w-full border-b-2 border-gray-200 py-4 text-lg text-dark focus:border-black focus:ring-0 outline-none transition-colors mb-10 placeholder:text-gray-300 font-mono"
                    :placeholder="promptModal.placeholder" />
                
                <div class="flex items-center justify-end gap-5">
                    <button v-if="promptModal.type === 'link' && promptModal.value !== ''" @click="unLink" class="text-xs uppercase font-bold tracking-widest text-red-500 hover:text-red-700 py-3 mr-auto transition focus:outline-none">
                        Quét Gỡ Link
                    </button>
                    <button @click="promptModal.isOpen = false" class="text-xs uppercase font-bold tracking-widest text-gray-500 hover:text-black px-6 py-3 transition focus:outline-none">
                        Huỷ Bỏ
                    </button>
                    <button @click="submitPrompt" class="bg-black text-white px-8 py-3.5 rounded shadow-lg shadow-black/20 hover:bg-gray-800 text-xs uppercase font-bold tracking-widest transition focus:outline-none">
                        Tích Hợp
                    </button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Modal Xem Trước (Preview) Toàn màn hình -->
    <Teleport to="body">
        <div v-if="showPreviewModal" class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm overflow-y-auto w-full p-0">
            <div class="w-full bg-white min-h-screen relative overflow-hidden flex flex-col">
                <!-- Topbar Fake in Preview -->
                <div class="h-16 bg-white/95 backdrop-blur border-b border-gray-100 flex justify-between items-center px-4 lg:px-8 sticky top-0 z-50 shadow-sm">
                    <span class="text-[10px] uppercase tracking-widest font-black text-blue-600 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> CHẾ ĐỘ XEM TRƯỚC (LIVE PREVIEW)</span>
                    <button @click="showPreviewModal = false" class="bg-gray-100 hover:bg-black hover:text-white text-gray-800 font-bold px-4 py-2 rounded text-[10px] tracking-widest uppercase transition">Đóng X</button>
                </div>
                
                <div class="flex-1 pb-20 pt-8 lg:pt-16 animate-fade-in-up">
                    <!-- Header Section -->
                    <header class="pt-12 pb-10 text-center container mx-auto px-4 max-w-4xl">
                      <div class="flex items-center justify-center gap-4 mb-4 text-sm">
                        <span class="bg-[#8b6b55] text-white px-4 py-1.5 rounded font-bold uppercase tracking-widest text-[11px]">
                            {{ currentPost.category || 'Danh mục' }}
                        </span>
                        <span class="text-gray-500 font-bold tracking-widest uppercase text-xs">{{ new Date().toLocaleDateString('vi-VN') }}</span>
                      </div>

                      <!-- Fake Breadcrumb -->
                      <div class="flex justify-center flex-wrap items-center gap-2 text-xs md:text-sm text-gray-400 mb-8 font-medium">
                        <span class="transition-colors">Trang chủ</span> 
                        <span>/</span> 
                        <span class="transition-colors">Tin tức</span>
                        <span>/</span> 
                        <span class="text-gray-800 line-clamp-1 max-w-[200px] md:max-w-md">{{ currentPost.title || 'Tiêu đề trống' }}</span>
                      </div>
                      
                      <h1 class="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8 max-w-4xl mx-auto">
                        {{ currentPost.title || 'Tiêu đề báo sẽ hiển thị ở đây' }}
                      </h1>
                      
                      <p v-if="currentPost.excerpt" class="text-xl text-gray-600 leading-relaxed font-light max-w-3xl mx-auto">
                          {{ currentPost.excerpt }}
                      </p>
                    </header>
                    
                    <!-- Feature Image -->
                    <div class="container mx-auto px-4 max-w-5xl mb-16">
                        <img v-if="currentPost.image" :src="currentPost.image" :style="{ objectPosition: currentPost.imagePosition || 'center' }" class="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-lg" />
                        <div v-else class="w-full h-[400px] md:h-[500px] bg-gray-100 flex items-center justify-center rounded-2xl shadow-inner border border-gray-200">
                            <span class="text-gray-400 uppercase tracking-widest font-bold text-sm">Ảnh bìa trống</span>
                        </div>
                    </div>

                    <!-- Content Body -->
                    <article class="container mx-auto px-4 max-w-3xl prose prose-lg prose-blue text-gray-800 mb-20 relative" v-html="currentPost.content || '<p class=\'text-gray-400 italic text-center\'>Chưa có nội dung soạn thảo để xem trước...</p>'">
                    </article>
                </div>
            </div>
        </div>
    </Teleport>

  </div>
</template>

<style>
/* Responsive reset TipTap */
.ProseMirror { outline: none; min-height: 100%; padding: 2rem; }
.ProseMirror.focus-visible { outline: none; }
.ProseMirror p { margin-top: 0.5rem; margin-bottom: 0.5rem; }
.ProseMirror img { max-width: 100%; border-radius: 4px; border: 1px solid #eee; margin: 1rem auto; display: block; }
.ProseMirror a { color: #2563eb; text-decoration: underline; cursor: pointer; }
.ProseMirror blockquote { border-left: 3px solid #8b6b55; padding-left: 1rem; color: #555; font-style: italic; }
.ProseMirror code { background: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.85em; font-family: monospace; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
