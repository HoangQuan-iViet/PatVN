import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

/**
 * Composable quản lý thanh cuộn ngang danh mục với nút mũi tên điều hướng.
 * - Mobile: vuốt tay bình thường (touch scroll).
 * - Desktop: bấm nút ◀ ▶ để trượt qua lại.
 */
export function useScrollNav() {
    const scrollContainerRef = ref(null)
    const canScrollLeft = ref(false)
    const canScrollRight = ref(false)

    const SCROLL_AMOUNT = 200 // px mỗi lần bấm mũi tên

    const updateScrollState = () => {
        const el = scrollContainerRef.value
        if (!el) return
        canScrollLeft.value = el.scrollLeft > 5
        canScrollRight.value = el.scrollLeft < (el.scrollWidth - el.clientWidth - 5)
    }

    const scrollBy = (direction) => {
        const el = scrollContainerRef.value
        if (!el) return
        el.scrollBy({ left: direction * SCROLL_AMOUNT, behavior: 'smooth' })
    }

    let resizeObserver = null

    onMounted(() => {
        nextTick(() => {
            const el = scrollContainerRef.value
            if (!el) return
            el.addEventListener('scroll', updateScrollState, { passive: true })
            
            // Theo dõi khi kích thước thay đổi (ví dụ: resize cửa sổ)
            resizeObserver = new ResizeObserver(() => updateScrollState())
            resizeObserver.observe(el)

            updateScrollState()
        })
    })

    onBeforeUnmount(() => {
        const el = scrollContainerRef.value
        if (el) el.removeEventListener('scroll', updateScrollState)
        if (resizeObserver) resizeObserver.disconnect()
    })

    return {
        scrollContainerRef,
        canScrollLeft,
        canScrollRight,
        scrollBy,
        updateScrollState
    }
}
