import { ref } from 'vue'
import axios from 'axios'

// Biến lưu trữ ở mức Toàn cục (Global State)
// Do nằm ngoài scope của composable, biến này tồn tại xuyên suốt vòng đời của ứng dụng SPA.
const cacheStore = ref({})

// Thời gian hết hạn cache: 5 phút
const CACHE_TTL = 5 * 60 * 1000 

export function useDataCache() {
    /**
     * Lấy dữ liệu từ cache, nếu chưa có hoặc quá hạn thì gọi API.
     * @param {string} key Khóa lưu trữ (VD: 'services_vi')
     * @param {string} apiEndpoint URL gọi API (VD: '/api/services?status=live&locale=vi')
     * @returns {Promise<any>}
     */
    const fetchWithCache = async (key, apiEndpoint) => {
        const now = Date.now()
        const cachedItem = cacheStore.value[key]

        // 1. Kiểm tra cache có hợp lệ không
        if (cachedItem && (now - cachedItem.timestamp < CACHE_TTL)) {
            // Trả về dữ liệu từ RAM tức thì
            return cachedItem.data
        }

        // 2. Nếu không có cache hoặc hết hạn -> Gọi API
        try {
            const { data } = await axios.get(apiEndpoint)
            
            // 3. Cập nhật cache
            if (data && data.success) {
                cacheStore.value[key] = {
                    data: data,
                    timestamp: now
                }
            }
            return data
        } catch (error) {
            console.error(`Lỗi khi gọi API (${key}):`, error)
            // Nếu API lỗi mà cache vẫn còn (dù hết hạn), tạm thời trả về cache cũ làm cứu cánh
            if (cachedItem) {
                return cachedItem.data
            }
            throw error
        }
    }

    /**
     * Hàm dùng để xóa cache thủ công (Dành cho việc Refresh)
     * @param {string} key Khóa cần xóa
     */
    const invalidateCache = (key) => {
        if (key) {
            delete cacheStore.value[key]
        } else {
            cacheStore.value = {}
        }
    }

    return {
        fetchWithCache,
        invalidateCache
    }
}
