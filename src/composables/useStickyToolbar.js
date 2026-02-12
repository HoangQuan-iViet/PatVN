import { ref, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * Composable for sticky toolbar auto-hide behavior.
 * 
 * Rules:
 * 1. Toolbar only hides when user scrolls UP while it is in STICKY (fixed) position.
 * 2. If toolbar is at its natural (non-sticky) position, scrolling up does nothing.
 * 3. Once hidden, scrolling DOWN reveals it again.
 * 4. When user scrolls back to the original position, toolbar shows immediately (no blank space).
 */
export function useStickyToolbar(toolbarRef) {
    const isHidden = ref(false)
    let lastScrollY = 0
    let toolbarNaturalOffsetTop = 0 // The toolbar's real position in the document

    const onScroll = () => {
        const currentScrollY = window.scrollY
        const stickyTop = toolbarRef.value
            ? (parseFloat(getComputedStyle(toolbarRef.value).top) || 0)
            : 0

        // The toolbar becomes sticky when window.scrollY >= (naturalOffset - stickyTop)
        const stickyThreshold = toolbarNaturalOffsetTop - stickyTop

        // Is toolbar currently in sticky mode?
        const isSticky = currentScrollY >= stickyThreshold

        if (!isSticky) {
            // Toolbar is at its natural position → always show, no hiding
            isHidden.value = false
        } else if (currentScrollY < lastScrollY) {
            // Scrolling UP while sticky → hide
            isHidden.value = true
        } else if (currentScrollY > lastScrollY) {
            // Scrolling DOWN → show
            isHidden.value = false
        }

        lastScrollY = currentScrollY
    }

    onMounted(() => {
        nextTick(() => {
            // Capture the toolbar's natural position in the document on mount
            if (toolbarRef.value) {
                toolbarNaturalOffsetTop = toolbarRef.value.offsetTop
            }
            lastScrollY = window.scrollY
            window.addEventListener('scroll', onScroll, { passive: true })
        })
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', onScroll)
    })

    return { isHidden }
}
