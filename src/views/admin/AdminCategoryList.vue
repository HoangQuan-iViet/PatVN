<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useNotification } from '../../composables/useNotification'

const { showConfirm, showAlert } = useNotification()
const isFetching = ref(true)
const categories = ref([])
const activeType = ref('post')
const selectedIds = ref([])
const isDeleting = ref(null)

// Add/Edit State
const isEditing = ref(null)
const formData = ref({ name: '', name_en: '', slug: '', type: 'post' })

const fetchCategories = async () => {
    isFetching.value = true
    try {
        const { data } = await axios.get('/api/categories?type=all')
        if (data.success) {
            categories.value = data.data
        }
    } catch(e) {
        console.error(e)
    } finally {
        isFetching.value = false
    }
}

onMounted(() => {
    fetchCategories()
})

const filteredCategories = computed(() => {
    return categories.value.filter(c => c.type === activeType.value)
})

const generateSlug = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
       .replace(/đ/g, 'd').replace(/Đ/g, 'D')
       .toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

const syncSlug = () => {
    if (!isEditing.value) {
        formData.value.slug = generateSlug(formData.value.name)
    }
}
const isTranslating = ref(false)

const autoTranslate = async () => {
    if (!formData.value.name || formData.value.name.trim() === '') {
        showAlert('Chưa nhập tên danh mục tiếng Việt', 'error');
        return;
    }
    
    isTranslating.value = true;
    try {
        const { data } = await axios.post('/api/translate', { texts: [formData.value.name] });
        if (data.success && data.translations && data.translations.length > 0) {
            formData.value.name_en = data.translations[0];
            let info = 'Đã dịch tự động sang Tiếng Anh!';
            if (data.mode !== 'gemini') info = 'Dịch bằng Google (Cơ chế dự phòng)';
            showAlert(info, 'success');
        }
    } catch(e) {
        console.error(e);
        showAlert('Lỗi khi biên dịch AI', 'error');
    } finally {
        isTranslating.value = false;
    }
}

const saveCategory = async () => {
    if (!formData.value.name.trim() || !formData.value.slug.trim()) {
        showAlert('Vui lòng điền đủ Tên và Đường dẫn SEO', 'error')
        return
    }

    try {
        if (isEditing.value) {
            await axios.put('/api/categories?id=' + isEditing.value, formData.value)
            showAlert('Cập nhật Nhãn thành công!', 'success')
        } else {
            await axios.post('/api/categories', formData.value)
            showAlert('Tạo Nhãn danh mục mới thành công!', 'success')
        }
        await fetchCategories()
        cancelEdit()
    } catch(e) {
        const beMessage = e.response?.data?.message || ''
        if (beMessage.includes('duplicate') || beMessage.includes('11000')) {
            showAlert('Đường dẫn SEO (Slug) đã bị trùng với chuyên mục khác!', 'error')
        } else {
            showAlert('Lỗi không thể lưu. Vui lòng tải lại trang.', 'error')
        }
    }
}

const editCategory = (cat) => {
    isEditing.value = cat._id
    formData.value = { 
        name: cat.name, 
        name_en: cat.name_en || '', 
        slug: cat.slug, 
        type: cat.type 
    }
}

const cancelEdit = () => {
    isEditing.value = null
    formData.value = { name: '', name_en: '', slug: '', type: activeType.value }
}

const deleteCategory = async (id) => {
    const cf = await showConfirm('Bạn nhổ cỏ nhãn danh mục này, lưu ý các Dịch vụ/Bài viết cũ đang gán nhãn này có thể sẽ mất liên kết Filter. Bạn xác nhận chứ?')
    if (!cf) return;

    isDeleting.value = id
    try {
        await axios.delete('/api/categories?id=' + id)
        categories.value = categories.value.filter(c => c._id !== id)
        selectedIds.value = selectedIds.value.filter(i => i !== id)
        showAlert('Đã xóa Nhãn', 'success')
    } catch(e) {
        showAlert('Không xóa được', 'error')
    } finally {
        isDeleting.value = null
    }
}

const changeTab = (type) => {
    activeType.value = type
    selectedIds.value = []
    cancelEdit()
}

const toggleSelectAll = (e) => {
    if (e.target.checked) {
        selectedIds.value = filteredCategories.value.map(c => c._id)
    } else {
        selectedIds.value = []
    }
}

const deleteMultiple = async () => {
    if (selectedIds.value.length === 0) return;
    const cf = await showConfirm(`Xác nhận xóa ${selectedIds.value.length} danh mục? Hành động này có thể làm mất liên kết Filter của bài viết/dịch vụ cũ.`)
    if (!cf) return;

    isDeleting.value = 'multiple'
    try {
        await axios.delete('/api/categories?ids=' + selectedIds.value.join(','))
        categories.value = categories.value.filter(c => !selectedIds.value.includes(c._id))
        selectedIds.value = []
        showAlert(`Đã xóa thành công các nhãn đã chọn`, 'success')
    } catch(e) {
        showAlert('Không thể xóa hàng loạt', 'error')
    } finally {
        isDeleting.value = null
    }
}


</script>

<template>
  <div class="animate-fade-in-up">
    <!-- Header -->
    <div class="flex justify-between items-end mb-8 border-b-[0.5px] border-gray-300 pb-4">
        <div>
            <h1 class="text-3xl font-bold text-dark font-sans tracking-tight mb-2">Nhóm Danh Mục</h1>
            <p class="text-gray-500 text-xs uppercase tracking-widest font-bold">Thêm Filter phân loại Bài viết / Dịch vụ</p>
        </div>
        <div class="flex gap-2 items-center">
            <button v-if="selectedIds.length > 0" @click="deleteMultiple" :disabled="isDeleting === 'multiple'" class="flex items-center gap-2 px-4 py-2 uppercase font-bold text-[10px] tracking-widest bg-red-500 text-white hover:bg-red-700 transition mr-4 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="isDeleting === 'multiple'" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isDeleting === 'multiple' ? 'Đang Xóa...' : `Xóa Selected (${selectedIds.length})` }}</span>
            </button>
            <button @click="changeTab('post')" :class="['px-6 py-2 uppercase font-bold text-xs tracking-widest border transition', activeType === 'post' ? 'bg-black text-white border-black' : 'bg-transparent text-gray-500 border-gray-200 hover:border-black']">
                Tin Tức
            </button>
            <button @click="changeTab('service')" :class="['px-6 py-2 uppercase font-bold text-xs tracking-widest border transition', activeType === 'service' ? 'bg-black text-white border-black' : 'bg-transparent text-gray-500 border-gray-200 hover:border-black']">
                Dịch Vụ
            </button>
        </div>
    </div>

    <!-- Main Content Layout (Grid 4-8) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Cột Trái: Nơi Khởi tạo/Sửa Nhãn -->
        <div class="bg-gray-50 border border-gray-200 p-6 shadow-none h-fit">
            <h2 class="text-sm uppercase tracking-widest font-black text-dark border-b border-gray-200 pb-3 mb-5">
                {{ isEditing ? 'SỬA NHÃN' : 'TẠO NHÃN MỚI' }}
            </h2>
            <div class="space-y-4">
                <div>
                   <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tên Danh Mục (VI)</label>
                   <input v-model="formData.name" @input="syncSlug" type="text" class="w-full text-sm font-bold p-2 px-3 border border-gray-300 focus:outline-none focus:border-black transition" placeholder="VD: Sở hữu Trí Tuệ" />
                </div>
                <div>
                   <div class="flex items-center justify-between mb-2">
                       <label class="block text-[10px] font-bold uppercase tracking-widest text-blue-400">Tên Danh Mục (EN)</label>
                       <button @click="autoTranslate" :disabled="isTranslating" class="px-2 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-all flex items-center gap-1 disabled:opacity-50">
                            <span v-if="isTranslating" class="w-2 h-2 border-[1.5px] border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                            <span v-else>✨</span>
                            {{ isTranslating ? 'Đang dịch...' : 'Dịch AI' }}
                        </button>
                   </div>
                   <input v-model="formData.name_en" type="text" class="w-full text-sm font-bold p-2 px-3 border border-blue-200 focus:outline-none focus:border-blue-600 transition" placeholder="VD: Intellectual Property" />
                </div>
                <div>
                   <label class="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">URL SEO (Viết liền ko dấu)</label>
                   <input v-model="formData.slug" type="text" class="w-full text-sm text-gray-500 bg-white p-2 px-3 border border-gray-300 focus:outline-none focus:border-black transition" placeholder="vd: so-huu-tri-tue" />
                </div>
            </div>
            
            <div class="mt-6 flex gap-2">
                <button v-if="isEditing" @click="cancelEdit" class="flex-1 py-2 uppercase font-bold text-[10px] bg-white border border-gray-300 hover:bg-gray-100 transition tracking-widest text-gray-500">
                    Bỏ Qua
                </button>
                <button @click="saveCategory" class="flex-1 py-2 uppercase font-bold text-[10px] tracking-widest bg-black text-white hover:bg-gray-800 transition">
                    {{ isEditing ? 'CẬP NHẬT LƯU' : '↓ TẠO NHÃN NÀY' }}
                </button>
            </div>
        </div>

        <!-- Cột Phải: Danh sách nhãn hiện tại -->
        <div class="lg:col-span-2">
            <div v-if="isFetching" class="w-full p-20 flex flex-col items-center border border-gray-200 bg-white shadow-sm">
                 <div class="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                 <span class="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Đang quét...</span>
            </div>
            
            <div v-else class="bg-white border border-gray-300 shadow-sm">
                 <table class="w-full text-left">
                     <thead>
                         <tr class="bg-gray-50 text-[10px] uppercase tracking-widest font-black text-gray-400 border-b border-gray-200">
                             <th class="p-4 w-12 text-center border-r border-gray-200">
                                 <input type="checkbox" @change="toggleSelectAll" :checked="filteredCategories.length > 0 && selectedIds.length === filteredCategories.length" class="w-4 h-4 cursor-pointer accent-black" />
                             </th>
                             <th class="p-4 font-bold">Tên Danh Mục (VI / EN)</th>
                             <th class="p-4 font-bold">Quy Ước Code (Slug)</th>
                             <th class="p-4 font-bold text-right">Quản Trị</th>
                         </tr>
                     </thead>
                     <tbody v-if="filteredCategories.length > 0">
                         <tr v-for="cat in filteredCategories" :key="cat._id" class="border-b border-gray-100 hover:bg-gray-50 transition group">
                             <td class="p-4 text-center border-r border-gray-100">
                                 <input type="checkbox" v-model="selectedIds" :value="cat._id" class="w-4 h-4 cursor-pointer accent-black" />
                             </td>
                             <td class="p-4 border-r border-gray-50">
                                 <div class="font-bold text-sm text-dark">{{ cat.name }}</div>
                                 <div class="text-[10px] text-blue-500 font-bold uppercase tracking-wider mt-1">{{ cat.name_en || 'CHƯA DỊCH' }}</div>
                             </td>
                             <td class="p-4 font-mono text-xs text-gray-400 bg-gray-50">{{ cat.slug }}</td>
                             <td class="p-4 text-right space-x-3">
                                 <button @click="editCategory(cat)" :disabled="isDeleting === cat._id" class="text-[10px] uppercase font-bold text-gray-400 hover:text-black tracking-widest disabled:opacity-50">Sửa</button>
                                 <button @click="deleteCategory(cat._id)" :disabled="isDeleting === cat._id" class="text-[10px] uppercase font-bold text-red-400 hover:text-red-700 tracking-widest disabled:opacity-50 inline-flex items-center gap-1">
                                    <span v-if="isDeleting === cat._id" class="w-2.5 h-2.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                                    <span>{{ isDeleting === cat._id ? 'Đang Xóa...' : 'Xóa' }}</span>
                                 </button>
                             </td>
                         </tr>
                     </tbody>
                     <tbody v-else>
                         <tr>
                             <td colspan="4" class="p-12 text-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                 Thư mục này hiện chưa có nhãn lồng nào.
                             </td>
                         </tr>
                     </tbody>
                 </table>
            </div>
        </div>

    </div>
  </div>
</template>
