<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useNotification } from '../../composables/useNotification'

const services = ref([])
const router = useRouter()
const isFetching = ref(true)
const selectedIds = ref([])
const deletingIds = ref([])
const { showConfirm, showAlert } = useNotification()

const fetchServices = async () => {
    isFetching.value = true
    try {
        const { data } = await axios.get('/api/services')
        if (data.success) services.value = data.data
    } catch (error) {
        console.error('API Error:', error)
    } finally {
        isFetching.value = false
    }
}

const toggleSelectAll = (e) => {
    if (e.target.checked) selectedIds.value = services.value.map(p => p._id);
    else selectedIds.value = [];
}

const deleteService = async (id) => {
    const isConfirmed = await showConfirm('Bạn có chắc chắn muốn xoá dịch vụ này không? Dịch vụ bị xoá sẽ không thể khôi phục lại được.')
    if (!isConfirmed) return

    deletingIds.value.push(id)
    try {
        await axios.delete(`/api/services?id=${id}`)
        services.value = services.value.filter(p => p._id !== id)
        selectedIds.value = selectedIds.value.filter(selectedId => selectedId !== id)
        showAlert('Đã xoá dịch vụ thành công.', 'success')
    } catch (error) {
        showAlert('Không thể xoá dịch vụ. Vui lòng tải lại trang và thử lại.', 'error')
    } finally {
        deletingIds.value = deletingIds.value.filter(d => d !== id)
    }
}

const bulkDeleteServices = async () => {
    if (selectedIds.value.length === 0) return;
    const isConfirmed = await showConfirm(`Bạn đang chọn xoá ${selectedIds.value.length} dịch vụ cùng lúc. Các dịch vụ đã xoá sẽ bị mất vĩnh viễn. Bạn đồng ý chứ?`)
    if (!isConfirmed) return

    deletingIds.value.push(...selectedIds.value)
    try {
        await axios.delete(`/api/services`, { data: { ids: selectedIds.value } })
        services.value = services.value.filter(p => !selectedIds.value.includes(p._id))
        showAlert(`Đã xoá thành công ${selectedIds.value.length} dịch vụ.`, 'success')
        selectedIds.value = []
    } catch (error) {
        showAlert('Hệ thống đang bận, không thể xoá đồng loạt lúc này!', 'error')
    } finally {
        deletingIds.value = []
    }
}

const getServiceStatus = (publishedAt) => {
    if (!publishedAt) return { label: 'Bản Nháp', class: 'bg-gray-200 text-gray-800' }
    if (new Date(publishedAt).getTime() > Date.now()) return { label: 'Hẹn Giờ', class: 'bg-yellow-100 text-yellow-800' }
    return { label: 'Đã Đăng', class: 'bg-green-100 text-green-800' }
}

onMounted(() => {
    fetchServices()
})
</script>

<template>
  <!-- Trạng Thái Loading Nội Bộ component -->
  <div v-if="isFetching" class="w-full min-h-[60vh] flex flex-col items-center justify-center">
      <div class="w-12 h-12 border-[3px] border-gray-200 border-t-black rounded-full animate-spin mb-6"></div>
      <span class="text-sm font-black uppercase tracking-[0.3em] text-black">Đang tải...</span>
  </div>

  <div v-else class="animate-fade-in-up">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-dark font-sans tracking-tight">Dịch Vụ <span class="text-gray-400 font-normal">({{ services.length }})</span></h1>
        
        <div class="flex items-center gap-4">
            <button v-if="selectedIds.length > 0" @click="bulkDeleteServices" class="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 shadow-sm hover:bg-red-500 hover:text-white transition font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                <span v-if="deletingIds.length > 1" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                Xoá {{ selectedIds.length }} mục
            </button>
            <router-link to="/admin/services/create" class="bg-black text-white px-6 py-2.5 shadow-sm hover:bg-gray-800 transition font-bold text-sm tracking-widest uppercase">
                + ĐÓNG GÓP BÀI MỚI
            </router-link>
        </div>
    </div>

    <div class="bg-white border-[0.5px] border-gray-300 shadow-sm">
        <table class="w-full text-left border-collapse">
            <thead>
                <tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b-[0.5px] border-gray-300">
                    <th class="p-4 w-12 text-center">
                        <input type="checkbox" :checked="services.length > 0 && selectedIds.length === services.length" @change="toggleSelectAll" class="w-4 h-4 accent-black cursor-pointer" />
                    </th>
                    <th class="p-4 font-bold">Hình ảnh</th>
                    <th class="p-4 font-bold">Tiêu đề dịch vụ</th>
                    <th class="p-4 font-bold">Danh mục</th>
                    <th class="p-4 font-bold">Ngày đăng</th>
                    <th class="p-4 font-bold w-32">Trạng thái</th>
                    <th class="p-4 font-bold text-right min-w-[160px]">Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in services" :key="p._id" :class="['hover:bg-gray-50 transition border-b-[0.5px] border-gray-200 group', deletingIds.includes(p._id) ? 'opacity-50 pointer-events-none' : '']">
                    <td class="p-4 w-12 text-center">
                        <input type="checkbox" :value="p._id" v-model="selectedIds" class="w-4 h-4 accent-black cursor-pointer" />
                    </td>
                    <td class="p-4 w-24">
                        <div class="w-20 h-16 bg-gray-100 overflow-hidden relative">
                            <img v-if="p.image" :src="p.image" :style="{ objectPosition: p.imagePosition || '50% 50%' }" class="w-full h-full object-cover" />
                            <span v-else class="absolute inset-0 flex items-center justify-center text-[10px] uppercase font-bold text-gray-400">Trống</span>
                        </div>
                    </td>
                    <td class="p-4">
                        <div class="font-bold text-dark text-base line-clamp-2 max-w-sm">{{ p.title }}</div>
                    </td>
                    <td class="p-4">
                        <span class="text-xs font-bold uppercase tracking-widest text-[#8b6b55]">{{ p.category }}</span>
                    </td>
                    <td class="p-4 text-xs font-bold text-gray-500 tracking-wider">
                        {{ p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('vi-VN') : 'Chưa xếp lịch' }}
                    </td>
                    <td class="p-4">
                        <span :class="`px-2 py-1 text-[11px] font-bold uppercase tracking-wider ${getServiceStatus(p.publishedAt).class}`">
                            {{ getServiceStatus(p.publishedAt).label }}
                        </span>
                    </td>
                    <td class="p-4">
                        <div class="flex items-center justify-end gap-4 whitespace-nowrap text-right">
                            <a :href="`/services/${p.slug}`" target="_blank" class="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-700">Xem</a>
                            <router-link :to="`/admin/services/${p._id}/edit`" class="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-black">Sửa</router-link>
                            <button @click="deleteService(p._id)" class="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 inline-flex items-center gap-1.5 focus:outline-none">
                                <span v-if="deletingIds.includes(p._id)" class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                {{ deletingIds.includes(p._id) ? 'Đang xoá...' : 'Xóa' }}
                            </button>
                        </div>
                    </td>
                </tr>
                <tr v-if="services.length === 0">
                    <td colspan="7" class="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">Chưa có dịch vụ nào được tìm thấy.</td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>
