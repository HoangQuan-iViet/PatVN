<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStickyToolbar } from '../composables/useStickyToolbar'
import { posts } from '../data/posts'
import { MagnifyingGlassIcon, ArrowDownTrayIcon, ArrowLongRightIcon } from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()

// --- Sticky Toolbar Auto-Hide ---
const toolbarRef = ref(null)
const { isHidden } = useStickyToolbar(toolbarRef)

// --- State ---
const searchQuery = ref('')
const activeCategory = ref('all')
const visibleCount = ref(4) // Start with 4 posts (excluding featured)

const categories = [
    { id: 'all', labelKey: 'blog_view.filter_all' },
    { id: 'Pháp luật', labelKey: 'blog_view.categories.legal' }, 
    { id: 'Sở hữu trí tuệ', labelKey: 'blog_view.categories.ip' }, 
    { id: 'Hướng dẫn', labelKey: 'blog_view.categories.guide' },
    { id: 'Case Study', labelKey: 'blog_view.categories.case_study' },
    { id: 'Thông báo', labelKey: 'blog_view.categories.news' },
    { id: 'Doanh nghiệp', labelKey: 'blog_view.categories.corporate' }
]

const downloads = [
    { titleKey: "blog_view.downloads.form_tm", size: "DOCX - 2.5MB" },
    { titleKey: "blog_view.downloads.guide_patent", size: "PDF - 1.2MB" },
    { titleKey: "blog_view.downloads.fee_schedule", size: "PDF - 800KB" }
]

// --- Computed Logic ---

// 1. Base Filter (Search + Category)
// Used to generate the list of *candidates* for display in the grid
const allFilteredPosts = computed(() => {
    let result = posts

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
    return result.sort((a, b) => new Date(b.date) - new Date(a.date))
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
            pinnedInCat.sort((a, b) => new Date(b.date) - new Date(a.date))
            return pinnedInCat[0]
        }
        // Fallback: Latest in category
        return allFilteredPosts.value.length > 0 ? allFilteredPosts.value[0] : null
    }

    // Priority 3: DEFAULT MODE (No search, Category 'all')
    // Find absolute pinned posts from source
    const allPinned = posts.filter(p => p.isPinned)
    
    if (allPinned.length > 0) {
        // "Last Pinned Wins" global
        allPinned.sort((a, b) => new Date(b.date) - new Date(a.date))
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
        const catLabel = categories.find(c => c.id === activeCategory.value)?.labelKey
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
    
    const featuredId = displayFeaturePost.value.id
    // Filter out the featured post from the main list
    const remaining = allFilteredPosts.value.filter(p => p.id !== featuredId)
    
    // Slice for pagination
    return remaining.slice(0, visibleCount.value)
})

const hasMore = computed(() => {
    if (!displayFeaturePost.value) return false
    const featuredId = displayFeaturePost.value.id
    const remainingCount = allFilteredPosts.value.filter(p => p.id !== featuredId).length
    return visibleCount.value < remainingCount
})

// 6. Sidebar Posts (Latest 5 items global)
const sidebarPosts = computed(() => {
    // Return top 5 latest posts from global 'posts'
    // We sort a copy to avoid mutating original if not already sorted
    return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
})

// --- Watchers ---
watch([searchQuery, activeCategory], () => {
    visibleCount.value = 4 // Reset pagination on filter change
})

// --- Methods ---
const loadMore = () => {
    visibleCount.value += 4
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
                <img src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop" 
                     class="w-full h-full object-cover opacity-30" alt="Library Background">
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

        <!-- 2. STICKY FILTER BAR (Sticky beneath Header/Hero) -->
        <div ref="toolbarRef" 
            class="sticky top-12 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-4"
            :class="isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'"
            style="transition: transform 0.3s ease, opacity 0.3s ease">
            <div class="container mx-auto px-4">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                    <!-- Categories -->
                    <div class="flex flex-wrap gap-2 justify-center">
                        <button v-for="cat in categories" :key="cat.id"
                            @click="activeCategory = cat.id"
                            class="px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border"
                            :class="activeCategory === cat.id 
                                ? 'bg-neutral-brown text-white border-neutral-brown' 
                                : 'bg-transparent text-gray-500 border-gray-200 hover:border-primary hover:text-primary'">
                            {{ t(cat.labelKey) }}
                        </button>
                    </div>

                    <!-- Search -->
                    <div class="relative w-full md:w-72">
                        <input v-model="searchQuery" type="text" 
                            :placeholder="t('blog_view.search_label')"
                            class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm bg-white/50 focus:bg-white">
                        <MagnifyingGlassIcon class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. FEATURED POST (Moved Below Filter) -->
        <div class="container mx-auto px-4 pt-12 pb-6">
            <transition name="fade">
                <div v-if="displayFeaturePost" class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group">
                    <div class="flex flex-col lg:flex-row min-h-[400px]">
                        <div class="w-full lg:w-1/2 relative overflow-hidden bg-gray-100">
                             <!-- Lazy Loading Image -->
                            <img :src="displayFeaturePost.image" :alt="displayFeaturePost.title" loading="lazy"
                                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                            
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
                                <span>{{ formatDate(displayFeaturePost.date) }}</span>
                            </div>
                            <h2 class="text-3xl lg:text-4xl font-bold text-dark mb-6 font-serif leading-tight">
                                <router-link :to="`/blog/${displayFeaturePost.slug}`" class="hover:text-primary transition-colors">
                                    {{ displayFeaturePost.title }}
                                </router-link>
                            </h2>
                            <p class="text-gray-600 text-lg mb-8 line-clamp-3 leading-relaxed">
                                {{ displayFeaturePost.excerpt }}
                            </p>
                            <div>
                                <router-link :to="`/blog/${displayFeaturePost.slug}`" 
                                    class="inline-flex items-center gap-2 text-dark font-bold border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                                    {{ t('blog_view.read_more') }} <ArrowLongRightIcon class="w-5 h-5"/>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>

        <!-- 4. MAIN CONTENT AREA (70/30 SPLIT) -->
        <div class="container mx-auto px-4 py-12">
            
            <div class="flex flex-col lg:flex-row gap-12">
                
                <!-- LEFT CONTENT: Post List -->
                <main class="w-full lg:w-[70%]">
                    <div v-if="paginatedPosts.length > 0" class="flex flex-col gap-10">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div v-for="post in paginatedPosts" :key="post.id" 
                                class="flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                                
                                <div class="h-56 overflow-hidden relative bg-gray-100">
                                    <img :src="post.image" :alt="post.title" loading="lazy"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                    <span class="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-dark">
                                        {{ post.category }}
                                    </span>
                                </div>

                                <div class="p-6 flex-grow flex flex-col">
                                    <div class="text-xs text-gray-400 mb-3 font-bold">{{ formatDate(post.date) }}</div>
                                    <h3 class="text-xl font-bold text-dark mb-3 font-serif line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                        <router-link :to="`/blog/${post.slug}`">{{ post.title }}</router-link>
                                    </h3>
                                    <p class="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow text-justify leading-relaxed">
                                        {{ post.excerpt }}
                                    </p>
                                    <router-link :to="`/blog/${post.slug}`" class="text-secondary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                                        {{ t('blog_view.read_more') }} &rarr;
                                    </router-link>
                                </div>
                            </div>
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

                <!-- RIGHT SIDEBAR -->
                <aside class="w-full lg:w-[30%] space-y-8 h-fit lg:sticky lg:top-44">
                    
                    <!-- Widget 1: Popular / Latest (Moved Top) -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-2">
                            {{ t('blog_view.sidebar_popular') }}
                        </h3>
                        <ul class="space-y-4">
                            <li v-for="post in sidebarPosts" :key="post.id" class="group">
                                <router-link :to="`/blog/${post.slug}`" class="block">
                                    <span class="text-xs text-primary font-bold mb-1 block">{{ post.category }}</span>
                                    <h4 class="text-sm font-bold text-gray-700 leading-snug group-hover:text-secondary transition">
                                        {{ post.title }}
                                    </h4>
                                </router-link>
                            </li>
                        </ul>
                    </div>

                    <!-- Widget 2: Resources Download (Moved Bottom) -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                             <ArrowDownTrayIcon class="w-5 h-5 text-primary"/>
                             {{ t('blog_view.resources_title') }}
                        </h3>
                        <p class="text-xs text-gray-500 mb-4">{{ t('blog_view.resources_desc') }}</p>
                        
                        <div class="space-y-3">
                            <div v-for="(doc, idx) in downloads" :key="idx" 
                                 class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary/5 cursor-pointer transition group">
                                <div class="w-10 h-10 bg-white rounded flex items-center justify-center shadow-sm text-red-600 font-bold text-xs border border-gray-200">
                                    PDF
                                </div>
                                <div class="flex-grow">
                                    <h4 class="text-sm font-bold text-gray-700 group-hover:text-primary transition line-clamp-1">{{ t(doc.titleKey) }}</h4>
                                    <span class="text-[10px] text-gray-400 uppercase">{{ doc.size }}</span>
                                </div>
                                <ArrowDownTrayIcon class="w-4 h-4 text-gray-400 group-hover:text-primary"/>
                            </div>
                        </div>
                    </div>

                </aside>
            </div>

        </div>

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
