<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { PhoneIcon, CheckCircleIcon, NoSymbolIcon } from '@heroicons/vue/24/outline'
import { useNotification } from '../../composables/useNotification'

const { showConfirm, showAlert } = useNotification()
const isFetching = ref(true)
const contacts = ref([])
const activeStatus = ref('new') // Các tab: 'all', 'new', 'processing', 'resolved', 'spam'

// Modal chi tiết
const selectedContact = ref(null)
const isUpdating = ref(false)

const tabs = [
    { id: 'new', label: 'Mới Nhận (Cần gọi)' },
    { id: 'processing', label: 'Đang Tư Vấn' },
    { id: 'resolved', label: 'Đã Chốt / Xong' },
    { id: 'all', label: 'Tất cả' },
    { id: 'spam', label: 'Thùng rác' }
]

let pollInterval = null

const fetchContacts = async (isQuiet = false) => {
    if (!isQuiet) isFetching.value = true
    try {
        const { data } = await axios.get(`/api/contact?status=${activeStatus.value === 'all' ? 'all' : activeType(activeStatus.value)}`)
        if (data.success) {
            contacts.value = data.data
        }
    } catch(e) {
        console.error(e)
        // showAlert('Lỗi tải danh sách liên hệ', 'error')
    } finally {
        if (!isQuiet) isFetching.value = false
    }
}

// Bắt filter linh hoạt không cần gọi lại API liên tục nếu lấy hết
const activeType = (tab) => tab

const changeTab = async (status) => {
    activeStatus.value = status
    await fetchContacts(false)
}

onMounted(() => {
    fetchContacts(false)
    
    // Tối ưu Vercel: Giãn cách thời gian lên 30s và kiểm tra Page Visibility API (Nghỉ chạy khi sang Tab khác)
    pollInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
            fetchContacts(true)
        }
    }, 30000)
})

onUnmounted(() => {
    if (pollInterval) clearInterval(pollInterval)
})

const formatDate = (dateString) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
}

const openDetail = (contact) => {
    selectedContact.value = JSON.parse(JSON.stringify(contact))
}

const updateStatus = async (newStatus) => {
    if (!selectedContact.value) return
    isUpdating.value = newStatus
    try {
        await axios.patch(`/api/contact?id=${selectedContact.value._id}`, { status: newStatus })
        showAlert('Đã cập nhật trạng thái', 'success')
        selectedContact.value.status = newStatus
        // Cập nhật lại list ở ngoài
        const index = contacts.value.findIndex(c => c._id === selectedContact.value._id)
        if (index !== -1) {
            contacts.value[index].status = newStatus
            // Loại luôn khỏi mảng nếu Tab ngoài không phải All
            if (activeStatus.value !== 'all' && activeStatus.value !== newStatus) {
                contacts.value.splice(index, 1)
                selectedContact.value = null // Đóng modal tự động nếu thẻ bị đá ra ngoài
            }
        }
    } catch(e) {
        showAlert('Lỗi cập nhật', 'error')
    } finally {
        isUpdating.value = false
    }
}

const saveNotes = async () => {
    isUpdating.value = true
    try {
        await axios.patch(`/api/contact?id=${selectedContact.value._id}`, { staffNotes: selectedContact.value.staffNotes })
        showAlert('Đã lưu ghi chú', 'success')
        const index = contacts.value.findIndex(c => c._id === selectedContact.value._id)
        if (index !== -1) contacts.value[index].staffNotes = selectedContact.value.staffNotes
    } catch(e) {
        showAlert('Lỗi lưu ghi chú', 'error')
    } finally {
        isUpdating.value = false
    }
}

const deleteContact = async (id) => {
    const cf = await showConfirm('Bạn có chắc chắn muốn xóa vĩnh viễn Form điền này không?')
    if (!cf) return
    try {
        await axios.delete(`/api/contact?id=${id}`)
        contacts.value = contacts.value.filter(c => c._id !== id)
        showAlert('Đã xóa vĩnh viễn', 'success')
        if (selectedContact.value && selectedContact.value._id === id) selectedContact.value = null
    } catch(e) {
        showAlert('Không thể xóa', 'error')
    }
}

</script>

<template>
  <div class="animate-fade-in-up pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b-[0.5px] border-gray-300 pb-4 gap-4">
        <div>
            <h1 class="text-3xl font-bold text-dark font-sans tracking-tight mb-2">Quản lý Khách Liên Hệ</h1>
            <p class="text-gray-500 text-xs uppercase tracking-widest font-bold">Giám sát yêu cầu từ Website</p>
        </div>
        
        <!-- Tabs Bấm -->
        <div class="flex flex-wrap gap-2">
            <button v-for="tab in tabs" :key="tab.id" 
                @click="changeTab(tab.id)"
                :class="['px-4 py-2 uppercase font-bold text-[10px] tracking-widest border transition', 
                activeStatus === tab.id ? 'bg-black text-white border-black shadow-md' : 'bg-transparent text-gray-500 border-gray-200 hover:border-black hover:text-black']">
                {{ tab.label }}
            </button>
        </div>
    </div>

    <!-- Danh sách -->
    <div class="bg-white border border-gray-300 shadow-sm overflow-x-auto">
        <div v-if="isFetching" class="w-full p-20 flex flex-col items-center">
             <div class="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
             <span class="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Đang tải data lưới...</span>
        </div>

        <table v-else class="w-full text-left min-w-[800px]">
            <thead>
                <tr class="bg-gray-50 text-[10px] uppercase tracking-widest font-black text-gray-400 border-b border-gray-200">
                    <th class="p-4 font-bold w-1/4">Lịch Sử Thời Gian</th>
                    <th class="p-4 font-bold w-1/4">Khách Hàng (Tên - SĐT)</th>
                    <th class="p-4 font-bold w-1/4">Nhu Cầu Gửi Gắm</th>
                    <th class="p-4 font-bold">Thao Tác</th>
                </tr>
            </thead>
            <tbody v-if="contacts.length > 0">
                <tr v-for="c in contacts" :key="c._id" 
                    class="border-b last:border-0 border-gray-100 transition group"
                    :class="{'bg-yellow-50/30': c.status === 'new', 'hover:bg-gray-50': true}">
                    
                    <td class="p-4">
                        <div class="text-xs font-bold text-gray-800">{{ formatDate(c.createdAt) }}</div>
                        <div class="text-[10px] font-mono text-gray-400 mt-1 uppercase" v-if="c.customerId">Tổng điền Form: <span class="text-blue-600 font-bold border-b border-blue-600 cursor-help" :title="'Khách này đã gửi '+c.customerId.totalRequests+' form khác nhau'">{{ c.customerId.totalRequests }} Lần</span></div>
                    </td>
                    
                    <td class="p-4">
                        <div class="text-sm font-bold text-dark">{{ c.submittedName }}</div>
                        <div class="text-xs font-mono font-bold text-gray-500 mt-1">{{ c.submittedPhone }}</div>
                    </td>
                    
                    <td class="p-4">
                        <div class="text-sm text-gray-800 line-clamp-2 max-w-xs">{{ c.message || '(Không Lời nhắn)' }}</div>
                        <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 border border-blue-100 bg-blue-50 text-blue-800 inline-block px-2 py-0.5" v-if="c.serviceInterest">{{ c.serviceInterest }}</div>
                    </td>
                    
                    <td class="p-4 space-x-3">
                        <button @click="openDetail(c)" class="text-[10px] uppercase font-bold text-blue-500 border border-blue-200 bg-blue-50 px-3 py-1.5 hover:bg-black hover:text-white hover:border-black transition tracking-widest">
                            Xử lý Ca Này
                        </button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="4" class="p-16 text-center text-xs uppercase font-bold tracking-widest text-gray-400">
                        Chưa có cái form yêu cầu nào trong khu vực này.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modal Xử Lý Chi Tiết Ca Tư Vấn -->
    <Teleport to="body">
        <div v-if="selectedContact" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
            <div class="bg-white w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
            
            <!-- HEADER MODAL -->
            <div class="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50 shrink-0">
                <div>
                    <h2 class="text-xl font-bold font-sans text-dark tracking-tight">Vào Việc: Khách Hàng {{ selectedContact.submittedName }}</h2>
                    <p class="text-[10px] font-mono font-bold mt-1 text-gray-400 uppercase">MÃ TỜ TRÌNH: {{ selectedContact._id }} • TỪ NGÀY: {{ formatDate(selectedContact.createdAt) }}</p>
                </div>
                <button @click="selectedContact = null" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-black hover:border-black transition">✕</button>
            </div>

            <!-- BODY MODAL -->
            <div class="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 grow">
                
                <!-- Cột trái: Thông tin Khách và Form -->
                <div class="space-y-6">
                    <div>
                        <h3 class="text-xs uppercase font-black text-gray-400 tracking-widest border-b border-gray-200 pb-2 mb-3">Thông Tin Lõi (Từ Form Gửi)</h3>
                        <div class="space-y-3">
                            <div class="flex justify-between text-sm"><span class="text-gray-500">Người Liên Hệ:</span> <span class="font-bold text-black">{{ selectedContact.submittedName }}</span></div>
                            <div class="flex justify-between text-sm"><span class="text-gray-500">SĐT Liên Hệ:</span> <span class="font-bold font-mono text-black">{{ selectedContact.submittedPhone }}</span></div>
                            <div class="flex justify-between text-sm"><span class="text-gray-500">Thư (Email):</span> <span class="font-bold text-black">{{ selectedContact.submittedEmail || 'Trống' }}</span></div>
                            <div class="flex justify-between text-sm"><span class="text-gray-500">Trang Nguồn Gửi:</span> <a v-if="selectedContact.urlSource" :href="selectedContact.urlSource" target="_blank" class="text-blue-500 underline font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">{{ selectedContact.urlSource }}</a><span class="text-gray-400 italic" v-else>Vô Danh</span></div>
                        </div>
                    </div>

                    <div class="bg-blue-50/50 p-4 border border-blue-100">
                        <h3 class="text-[10px] uppercase font-black text-blue-400 tracking-widest mb-3">Nội Dung Yêu Cầu Của Khách Trực Tiếp Nhập</h3>
                        <p class="text-sm text-gray-500 italic mb-2">Quan tâm chuyên môn: <strong class="text-black">{{ selectedContact.serviceInterest || 'Nói chung' }}</strong></p>
                        <p class="text-sm font-medium text-dark bg-white p-3 border border-gray-200 leading-relaxed shadow-inner">
                            "{{ selectedContact.message || '[Không Viết Gì]' }}"
                        </p>
                    </div>

                    <div v-if="selectedContact.customerId" class="bg-gray-50 p-4 border border-gray-200">
                        <h3 class="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2 flex justify-between items-center">
                            <span>Sơ Yếu Lý Lịch Máy Ghi (CRM)</span> 
                            <span class="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[9px]">Unique: Số Điện Thoại</span>
                        </h3>
                        <p class="text-[11px] text-gray-600 mt-2">Dữ liệu gốc máy chủ nhận diện đây là người đã gửi tổng cộng <strong class="text-black">{{ selectedContact.customerId.totalRequests }} Form khác nhau</strong> kể từ quá khứ (kể cả từ URL khác).</p>
                    </div>
                </div>

                <!-- Cột phải: Khối Tác Nghiệp Nội Bộ Nhân Viên -->
                <div class="space-y-6">
                    <div>
                        <h3 class="text-xs uppercase font-black text-gray-400 tracking-widest border-b border-gray-200 pb-2 mb-3">Cập Nhật Trạng Thái Gương Mặt Này</h3>
                        <div class="flex flex-col gap-2">
                            <button @click="updateStatus('processing')" :disabled="selectedContact.status === 'processing' || isUpdating === 'processing'" :class="['w-full py-3 text-sm font-bold border transition flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed', selectedContact.status === 'processing' ? 'bg-black text-white border-black' : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200']">
                                <span v-if="isUpdating === 'processing'" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
                                <PhoneIcon v-else class="w-5 h-5 shrink-0" />
                                <span>{{ isUpdating === 'processing' ? 'Đang cập nhật...' : 'Xác Nhận Đang Telesale / Tư Vấn (Processing)' }}</span>
                            </button>
                            <button @click="updateStatus('resolved')" :disabled="selectedContact.status === 'resolved' || isUpdating === 'resolved'" :class="['w-full py-3 text-sm font-bold border transition flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed', selectedContact.status === 'resolved' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-50 hover:bg-green-50 hover:text-green-700 hover:border-green-200 text-gray-600 border-gray-200']">
                                <span v-if="isUpdating === 'resolved'" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
                                <CheckCircleIcon v-else class="w-5 h-5 shrink-0" />
                                <span>{{ isUpdating === 'resolved' ? 'Đang cập nhật...' : 'Hoàn Trị / Chốt Thành Công (Resolved)' }}</span>
                            </button>
                            <button @click="updateStatus('spam')" :disabled="selectedContact.status === 'spam' || isUpdating === 'spam'" :class="['w-full py-3 text-sm font-bold border transition flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-not-allowed', selectedContact.status === 'spam' ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-gray-600 border-gray-200']">
                                <span v-if="isUpdating === 'spam'" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
                                <NoSymbolIcon v-else class="w-5 h-5 shrink-0" />
                                <span>{{ isUpdating === 'spam' ? 'Đang cập nhật...' : 'Fake / Lừa Đảo / Trêu Ghẹo (Spam)' }}</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex-1 flex flex-col">
                        <h3 class="text-xs uppercase font-black text-gray-400 tracking-widest border-b border-gray-200 pb-2 mb-3">Ghi Chú Đọc-Chéo Giữa Các Account Nội Bộ</h3>
                        <textarea v-model="selectedContact.staffNotes" class="w-full flex-1 min-h-[120px] bg-[#fdfdf3] p-4 text-sm font-mono border border-yellow-200 focus:outline-none focus:border-yellow-400" placeholder="Viết vài dòng chú ý để các Sale hoặc Admin khác vào xem sẽ biết chặng đường đàm phán tới đâu..."></textarea>
                        
                        <div class="flex gap-2 justify-end mt-4 shrink-0">
                            <button @click="deleteContact(selectedContact._id)" class="px-4 py-2 uppercase font-bold text-[10px] tracking-widest bg-red-50 border border-red-200 text-red-500 hover:bg-red-600 hover:text-white transition">Xóa Form Mãi Mãi</button>
                            <button @click="saveNotes" :disabled="isUpdating" class="px-6 py-2 uppercase font-bold text-xs tracking-widest bg-black text-white font-sans hover:bg-gray-800 transition disabled:opacity-50">Lưu Ghi Chú Sổ Sách Lại</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    </Teleport>
  </div>
</template>
