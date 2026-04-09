<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useStickyToolbar } from '../composables/useStickyToolbar'
import { MagnifyingGlassIcon, ArrowLongRightIcon, EnvelopeIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()

// --- Sticky Toolbar Auto-Hide ---
const toolbarRef = ref(null)
const { isHidden } = useStickyToolbar(toolbarRef)

// --- State ---
const dbPosts = ref([])
const isFetching = ref(true)
const searchQuery = ref('')
const activeCategory = ref('all')
const visibleCount = ref(8)

const categories = ref([
    { id: 'all', labelKey: 'blog_view.filter_all' }
])

// --- Category Panel Toggle ---
const showCategoryPanel = ref(false)

// Lấy tên danh mục đang được chọn (trừ "Tất cả")
const activeCatLabel = computed(() => {
    if (activeCategory.value === 'all') return null
    const found = categories.value.find(c => c.id === activeCategory.value)
    return found ? (found.labelKey ? t(found.labelKey) : found.name) : null
})

// Lọc danh mục client-side (không reload trang)
const selectCategory = (catId) => {
    activeCategory.value = catId
    if (catId !== 'all') showCategoryPanel.value = false
}

const downloads = [
    { titleKey: "blog_view.downloads.form_tm", size: "DOCX - 2.5MB" },
    { titleKey: "blog_view.downloads.guide_patent", size: "PDF - 1.2MB" },
    { titleKey: "blog_view.downloads.fee_schedule", size: "PDF - 800KB" }
]

// --- Computed Logic ---

// 1. Base Filter (Search + Category)
// Used to generate the list of *candidates* for display in the grid
const allFilteredPosts = computed(() => {
    let result = dbPosts.value

    // Filter by Category
    if (activeCategory.value !== 'all') {
        result = result.filter(p => p.category === activeCategory.value)
    }

    // Filter by Search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(p => p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query))
    }
    
    // Always sort by date desc for the general list
    return result.sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date))
})

// 2. Featured Post - SELECTION LOGIC
const displayFeaturePost = computed(() => {
    // Priority 1: SEARCH MODE
    if (searchQuery.value) {
        return allFilteredPosts.value.length > 0 ? allFilteredPosts.value[0] : null
    }

    // Priority 2: FILTER MODE (Category is NOT 'all')
    if (activeCategory.value !== 'all') {
        // Look for pinned post within the filtered list
        const pinnedInCat = allFilteredPosts.value.filter(p => p.isPinned)
        
        if (pinnedInCat.length > 0) {
            // "Last Pinned Wins": Sort by date DESC
            pinnedInCat.sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date))
            return pinnedInCat[0]
        }
        // Fallback: Latest in category
        return allFilteredPosts.value.length > 0 ? allFilteredPosts.value[0] : null
    }

    // Priority 3: DEFAULT MODE (No search, Category 'all')
    // Find absolute pinned posts from source
    const allPinned = dbPosts.value.filter(p => p.isPinned)
    
    if (allPinned.length > 0) {
        // "Last Pinned Wins" global
        allPinned.sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date))
        return allPinned[0]
    }
    
    // Fallback: Absolute latest global
    return allFilteredPosts.value.length > 0 ? allFilteredPosts.value[0] : null
})

// 3. Featured Post - BADGE LOGIC
const featureBadge = computed(() => {
    if (!displayFeaturePost.value) return ''

    // Case 1: Search OR Filter Mode
    if (searchQuery.value || activeCategory.value !== 'all') {
        return t('blog_view.most_relevant')
    }

    // Case 2: Default Mode (Check if the displayed post is actually pinned)
    if (displayFeaturePost.value.isPinned) {
        return t('blog_view.featured')
    }

    // Case 3: Default Mode (Latest)
    return t('blog_view.latest')
})

// 4. Featured Post - SUB-LABEL LOGIC
const featureSubLabel = computed(() => {
    if (!displayFeaturePost.value) return null

    // Case 1: Search
    if (searchQuery.value) {
        return t('blog_view.result_for_search', { query: searchQuery.value })
    }

    // Case 2: Filter
    if (activeCategory.value !== 'all') {
        const catLabel = categories.value.find(c => c.id === activeCategory.value)?.labelKey || categories.value.find(c => c.id === activeCategory.value)?.name
        // If labelKey is a translation key, use display t(), else use literal
        const displayCat = catLabel && catLabel.includes('.') ? t(catLabel) : catLabel
        return t('blog_view.result_for_category', { category: displayCat })
    }

    // Case 3: Default
    return null
})

// 5. Grid Posts (Exclude Featured)
const paginatedPosts = computed(() => {
    if (!displayFeaturePost.value) return [] 
    
    const featuredId = displayFeaturePost.value._id || displayFeaturePost.value.id
    // Filter out the featured post from the main list
    const remaining = allFilteredPosts.value.filter(p => (p._id || p.id) !== featuredId)
    
    // Slice for pagination
    return remaining.slice(0, visibleCount.value)
})

const hasMore = computed(() => {
    if (!displayFeaturePost.value) return false
    const featuredId = displayFeaturePost.value._id || displayFeaturePost.value.id
    const remainingCount = allFilteredPosts.value.filter(p => (p._id || p.id) !== featuredId).length
    return visibleCount.value < remainingCount
})

// 6. Sidebar Posts (Latest 5 items global)
const sidebarPosts = computed(() => {
    return [...dbPosts.value].sort((a, b) => new Date(b.publishedAt || b.date) - new Date(a.publishedAt || a.date)).slice(0, 5)
})

const fetchData = async () => {
    isFetching.value = true
    try {
        const [catRes, postRes] = await Promise.all([
            axios.get(`/api/categories?type=post&locale=${locale.value}`),
            axios.get(`/api/posts?status=live&locale=${locale.value}`)
        ])
        
        if (catRes.data.success) {
            const apiCats = catRes.data.data.map(c => ({ id: c.slug, name: c.name }))
            categories.value = [{ id: 'all', labelKey: 'blog_view.filter_all' }, ...apiCats]
        }

        if (postRes.data && postRes.data.success) {
            dbPosts.value = postRes.data.data
        }
    } catch(e) {
        console.error("Failed to load news", e)
    } finally {
        isFetching.value = false
    }
}

onMounted(() => {
    fetchData()
})

watch(locale, () => {
    fetchData()
})

// --- Watchers ---
watch([searchQuery, activeCategory], () => {
    visibleCount.value = 8 // Reset pagination on filter change
})

// --- Methods ---
const loadMore = () => {
    visibleCount.value += 8
}


const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>

<template>
    <div class="bg-gray-50 min-h-screen pb-16">
        
        <!-- 1. HERO SECTION -->
        <div class="relative h-[450px] flex items-center justify-center bg-gray-900 overflow-hidden">
            <div class="absolute inset-0 z-0">
                <img srcset="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=480&auto=format&fm=webp&fit=crop 480w,
                             https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1024&auto=format&fm=webp&fit=crop 1024w,
                             https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fm=webp&fit=crop 2070w"
                     sizes="100vw"
                     src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fm=webp&fit=crop" 
                     class="w-full h-full object-cover opacity-30" alt="Library Background" fetchpriority="high" width="2070" height="1380">
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            </div>
            <div class="relative z-10 container mx-auto px-4 text-center">
                <span class="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">{{ t('blog_view.subtitle_label') }}</span>
                <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
                    {{ t('blog_view.title') }}
                </h1>
                <p class="text-gray-300 text-lg max-w-2xl mx-auto font-serif italic">
                    {{ t('blog_view.subtitle') }}
                </p>
            </div>
        </div>

        <!-- 2. STICKY FILTER BAR -->
        <div ref="toolbarRef" 
            class="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
            :class="isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'"
            style="transition: transform 0.3s ease, opacity 0.3s ease">
            
            <!-- Main Toolbar Row -->
            <div class="container mx-auto px-4 py-3">
                <div class="flex items-center justify-between gap-3">
                    <!-- Left: Tất cả + Danh mục -->
                    <div class="flex items-center gap-2">
                        <!-- Nút Tất cả -->
                        <button @click="selectCategory('all')"
                            class="shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border"
                            :class="activeCategory === 'all' 
                                ? 'bg-neutral-brown text-white border-neutral-brown' 
                                : 'bg-transparent text-gray-500 border-gray-200 hover:border-primary hover:text-primary'">
                            {{ t('blog_view.filter_all') }}
                        </button>

                        <!-- Nút Danh mục -->
                        <button @click="showCategoryPanel = !showCategoryPanel"
                            class="shrink-0 flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border"
                            :class="showCategoryPanel || (activeCategory !== 'all')
                                ? 'bg-neutral-brown text-white border-neutral-brown' 
                                : 'bg-transparent text-gray-500 border-gray-200 hover:border-primary hover:text-primary'">
                            <span>{{ activeCatLabel || t('blog_view.filter_category', 'Danh mục') }}</span>
                            <ChevronDownIcon v-if="!showCategoryPanel" class="w-3.5 h-3.5" />
                            <ChevronUpIcon v-else class="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <!-- Right: Search -->
                    <div class="relative w-full md:w-64 shrink-0">
                        <input v-model="searchQuery" type="text" 
                            :placeholder="t('blog_view.search_label')"
                            class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm bg-white/50 focus:bg-white">
                        <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
            </div>

            <!-- Category Panel (Full-width dropdown) -->
            <div v-if="showCategoryPanel" class="border-t border-gray-100 bg-white/95 backdrop-blur-md animate-fade-in-up">
                <div class="container mx-auto px-4 py-5">
                    <div class="flex flex-wrap gap-2 mb-4">
                        <button v-for="cat in categories.slice(1)" :key="cat.id"
                            @click="selectCategory(cat.id)"
                            class="px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border"
                            :class="activeCategory === cat.id 
                                ? 'bg-neutral-brown text-white border-neutral-brown shadow-sm' 
                                : 'bg-transparent text-gray-500 border-gray-200 hover:border-primary hover:text-primary hover:bg-gray-50'">
                            {{ cat.labelKey ? t(cat.labelKey) : cat.name }}
                        </button>
                    </div>
                    <div class="flex justify-end">
                        <button @click="showCategoryPanel = false" 
                            class="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
                            <ChevronUpIcon class="w-3.5 h-3.5" />
                            {{ t('blog_view.filter_collapse', 'Ẩn bớt') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- LOADING STATE (Nằm gọn dưới Hero & Toolbar) -->
        <div v-if="isFetching" class="w-full min-h-[50vh] flex flex-col items-center justify-center">
            <div class="w-12 h-12 border-[3px] border-gray-200 border-t-[#8b6b55] rounded-full animate-spin mb-6"></div>
            <span class="text-sm font-black uppercase tracking-[0.3em] text-[#8b6b55]">Đang tải báo...</span>
        </div>

        <template v-else>
            <!-- 3. FEATURED POST (Moved Below Filter) -->
            <div class="container mx-auto px-4 pt-12 pb-6 animate-fade-in-up">
                <transition name="fade">
                <router-link v-if="displayFeaturePost" :to="`/blog/${displayFeaturePost.slug}`" class="block bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group transition-all duration-300 hover:shadow-2xl">
                    <div class="flex flex-col lg:flex-row min-h-[400px]">
                        <!-- Cố định chiều cao trên mobile/tablet, để auto trên desktop chờ flex match -->
                        <div class="w-full lg:w-1/2 h-64 md:h-80 lg:h-auto font-serif relative overflow-hidden bg-gray-100 shrink-0">
                             <!-- Lazy Loading Image -->
                            <img :src="displayFeaturePost.image" :alt="displayFeaturePost.title" loading="lazy"
                                 :style="{ objectPosition: displayFeaturePost.imagePosition || 'center' }"
                                 class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                            
                             <!-- Dynamic Label -->
                             <div class="absolute top-6 left-6 bg-primary text-white text-xs font-bold px-3 py-1 rounded shadow-md uppercase tracking-wide">
                                 {{ featureBadge }}
                             </div>
                        </div>
                        <div class="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                            
                            <!-- Search/Filter Context -->
                            <div v-if="featureSubLabel" class="text-primary/80 font-semibold tracking-wider text-sm mb-2">
                                {{ featureSubLabel }}
                            </div>

                            <div class="flex items-center gap-3 text-sm text-gray-400 mb-4 font-bold uppercase tracking-wider">
                                <span class="text-secondary">{{ displayFeaturePost.category }}</span> 
                                <span>&bull;</span>
                                <span>{{ formatDate(displayFeaturePost.publishedAt || displayFeaturePost.date) }}</span>
                            </div>
                            <h2 class="text-3xl lg:text-4xl font-bold text-dark mb-6 font-serif leading-tight hover:text-primary transition-colors">
                                {{ displayFeaturePost.title }}
                            </h2>
                            <p class="text-gray-600 text-lg mb-8 line-clamp-3 leading-relaxed">
                                {{ displayFeaturePost.excerpt }}
                            </p>
                            <div>
                                <div class="inline-flex items-center gap-2 text-dark font-bold border-b-2 border-primary pb-1 group-hover:text-primary transition-colors">
                                    {{ t('blog_view.read_more') }} <ArrowLongRightIcon class="w-5 h-5"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </transition>
        </div>

        <!-- 4. MAIN CONTENT AREA (FULL WIDTH GRID) -->
        <div class="container mx-auto px-4 py-12">
                
                <!-- CONTENT: Post List -->
                <main class="w-full">
                    <div v-if="paginatedPosts.length > 0" class="flex flex-col gap-10">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            <router-link v-for="post in paginatedPosts" :key="post.id" 
                                :to="`/blog/${post.slug}`"
                                class="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                                
                                <div class="h-56 overflow-hidden relative bg-gray-100">
                                    <img :src="post.image" :alt="post.title" loading="lazy"
                                        :style="{ objectPosition: post.imagePosition || 'center' }"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                </div>

                                <div class="p-6 flex-grow flex flex-col">
                                    <div class="text-xs text-gray-400 mb-3 font-bold">{{ formatDate(post.publishedAt || post.date) }}</div>
                                    <h3 class="text-xl font-bold text-dark mb-3 font-serif line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[3.5rem] text-left">
                                        {{ post.title }}
                                    </h3>
                                    <p class="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow min-h-[4.5rem] text-left leading-relaxed">
                                        {{ post.excerpt }}
                                    </p>
                                    <div class="text-secondary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all mt-auto group-hover:text-primary">
                                        {{ t('blog_view.read_more') }} &rarr;
                                    </div>
                                </div>
                            </router-link>
                        </div>

                        <!-- LOAD MORE BUTTON -->
                        <div v-if="hasMore" class="text-center pt-8">
                            <button @click="loadMore" class="px-8 py-3 bg-white border border-gray-300 rounded-full text-dark font-bold hover:bg-neutral-brown hover:text-white hover:border-neutral-brown transition-all duration-300 shadow-sm">
                                {{ t('blog_view.load_more') }}
                            </button>
                        </div>
                    </div>
                    
                    <!-- NEW MAGAZINE STYLE: EMPTY STATE -->
                    <div v-else class="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
                         <div class="inline-block rounded-full bg-gray-50 p-6 mb-6">
                             <MagnifyingGlassIcon class="w-16 h-16 text-gray-300" />
                         </div>
                         <h3 class="text-2xl font-serif font-bold text-neutral-900 mb-2">
                             {{ t('blog_view.empty_title') }}
                         </h3>
                         <p class="text-gray-500 font-sans max-w-md mx-auto mb-6">
                             {{ t('blog_view.empty_subtitle') }}
                         </p>
                         <button @click="() => { activeCategory = 'all'; searchQuery = '' }" 
                             class="inline-flex items-center gap-2 text-primary font-bold hover:underline transition-all">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                 <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                             </svg>
                             {{ t('blog_view.clear_filter') }}
                         </button>
                    </div>
                </main>

            </div>
        </template>

    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
