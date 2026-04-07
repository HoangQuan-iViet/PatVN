<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useStickyToolbar } from '../composables/useStickyToolbar'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import ctaImg from '../assets/CTA.webp'

const { t, locale } = useI18n()
const services = ref([])
const isLoading = ref(true)

const fetchData = async () => {
    isLoading.value = true
    try {
        const [catRes, serviceRes] = await Promise.all([
            axios.get(`/api/categories?type=service&locale=${locale.value}`),
            axios.get(`/api/services?status=live&locale=${locale.value}`)
        ])
        
        categories.value = [{ id: 'all', label: t('services_view.categories.all') }]
        if (catRes.data.success) {
            catRes.data.data.forEach(c => {
                categories.value.push({ id: c.slug, label: c.name })
            })
        }

        if (serviceRes.data.success) {
            services.value = serviceRes.data.data
        }
    } catch(e) { 
        console.error('Lỗi khi tải dịch vụ từ DB:', e) 
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchData()
})

watch(locale, () => {
    fetchData()
})

// --- Sticky Toolbar Auto-Hide ---
const toolbarRef = ref(null)
const { isHidden } = useStickyToolbar(toolbarRef)

// Filters
const activeCategory = ref('all')
const searchQuery = ref('')

const categories = ref([
    { id: 'all', label: t('services_view.categories.all') }
])

// Computed
const filteredServices = computed(() => {
    return services.value.filter(service => {
        // Filter by Category
        const matchCategory = activeCategory.value === 'all' || service.category === activeCategory.value
        
        // Filter by Search
        const query = searchQuery.value.toLowerCase()
        const textToSearch = [
            service.title, 
            service.excerpt
        ].join(' ').toLowerCase()
        const matchSearch = textToSearch.includes(query)

        return matchCategory && matchSearch
    })
})

const getTitle = (service) => {
    return service.title || ''
}

const getDesc = (service) => {
    return service.excerpt || ''
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 1. Hero Section -->
    <div class="relative h-[400px] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div class="absolute inset-0 z-0">
             <img srcset="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=480&auto=format&fm=webp&fit=crop 480w,
                          https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1024&auto=format&fm=webp&fit=crop 1024w,
                          https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fm=webp&fit=crop 2070w"
                  sizes="100vw"
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fm=webp&fit=crop" 
                 class="w-full h-full object-cover opacity-40" alt="Office Background" fetchpriority="high" width="2070" height="1380">
             <!-- Enhanced Overlay Gradient for Better Text Contrast -->
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div class="relative z-10 container mx-auto px-4 text-center">
             <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
                {{ t('common.services') }}
             </h1>
             <!-- Breadcrumb -->
             <nav class="flex justify-center items-center gap-2 text-sm text-gray-300">
                <router-link to="/" class="hover:text-white transition">{{ t('common.home') }}</router-link>
                <span>/</span>
                <span class="text-primary font-bold">{{ t('common.services') }}</span>
             </nav>
        </div>
    </div>

    <!-- 2. Filter & Search Bar -->
    <div ref="toolbarRef"
        class="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-4"
        :class="isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'"
        style="transition: transform 0.3s ease, opacity 0.3s ease">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <!-- Filter Tabs -->
                <div class="relative w-full md:flex-1 overflow-hidden pr-2">
                    <div class="flex flex-nowrap overflow-x-auto gap-2 pb-4 -mb-4 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth">
                        <button v-for="cat in categories" :key="cat.id"
                            @click="activeCategory = cat.id"
                            class="shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border"
                            :class="activeCategory === cat.id 
                                ? 'bg-neutral-brown text-white border-neutral-brown' 
                                : 'bg-transparent text-gray-500 border-gray-200 hover:border-primary hover:text-primary'">
                            {{ cat.label }}
                        </button>
                        <!-- Extra space at the end to allow fully scrolling past the fade -->
                        <div class="shrink-0 w-12 md:w-16"></div>
                    </div>
                    <!-- Right edge fade indicator -->
                    <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/95 to-transparent pointer-events-none z-10"></div>
                </div>
                
                <!-- Search Input -->
                <div class="relative w-full md:w-72 shrink-0">
                    <input v-model="searchQuery" type="text" 
                        :placeholder="t('services_view.search_placeholder')"
                        class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm bg-white/50 focus:bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- 3. Service Grid -->
    <div class="container mx-auto px-4 py-16 min-h-[500px]">
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
            <div class="w-12 h-12 border-[3px] border-gray-200 border-t-primary rounded-full animate-spin mb-6"></div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{{ t('common.loading', 'Đang tải dữ liệu...') }}</p>
        </div>

        <template v-else>
            <transition-group name="fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <template v-if="filteredServices.length > 0">
                    <router-link v-for="service in filteredServices" :key="service.slug" :to="`/services/${service.slug}`"
                        class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary flex flex-col h-full hover:-translate-y-1">
                        
                        <!-- New: Image Thumbnail -->
                        <div class="w-full h-48 overflow-hidden rounded-t-2xl relative shrink-0">
                            <img 
                                :src="service.image || 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fm=webp&fit=crop'" 
                                :alt="getTitle(service)"
                                :style="{ objectPosition: service.imagePosition || '50% 50%' }"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                            >
                            <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>

                        <div class="p-8 flex-grow flex flex-col">
                            <div class="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                                {{ categories.find(c => c.id === service.category)?.label }}
                            </div>
                            
                            <h2 class="text-xl font-bold text-dark mb-3 group-hover:text-primary transition line-clamp-2 min-h-[3.5rem] text-left">
                                {{ getTitle(service) }}
                            </h2>
                            <p class="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow min-h-[4.5rem] text-left">
                                {{ getDesc(service) }}
                            </p>
                            <div class="flex items-center text-sm font-bold text-gray-400 group-hover:text-secondary transition mt-auto">
                                {{ t('common.view_details') }}
                                <span class="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </div>
                        </div>
                    </router-link>
                </template>
            </transition-group>

            <!-- Empty State -->
            <div v-if="filteredServices.length === 0" class="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm mt-8">
                 <div class="inline-block rounded-full bg-gray-50 p-6 mb-6">
                     <MagnifyingGlassIcon class="w-16 h-16 text-gray-300" />
                 </div>
                 <h3 class="text-2xl font-serif font-bold text-neutral-900 mb-2">
                     {{ t('services_view.empty_title') }}
                 </h3>
                 <p class="text-gray-500 font-sans max-w-md mx-auto mb-6">
                     {{ t('services_view.empty_desc') }}
                 </p>
                 <button @click="() => { activeCategory = 'all'; searchQuery = '' }" 
                     class="inline-flex items-center gap-2 text-primary font-bold hover:underline transition-all">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                         <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                     {{ t('services_view.clear_filter') }}
                 </button>
            </div>
        </template>
    </div>

    <!-- 4. CTA Section -->
    <section class="py-24 bg-gray-50 flex justify-center">
        <div class="container mx-auto px-4 max-w-6xl">
            <div class="bg-neutral-brown rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-stretch">
                <!-- Content (2/5) -->
                <div class="w-full md:w-2/5 p-10 md:p-14 relative z-10 flex flex-col justify-center bg-neutral-brown">
                    <!-- Decor -->
                    <div class="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                    
                    <h2 class="relative z-10 text-3xl font-bold font-serif text-white mb-6 leading-tight">
                        {{ t('services_view.cta.title') }}
                    </h2>
                    
                    <p class="relative z-10 text-white/80 mb-8 text-base leading-relaxed hidden sm:block">
                        {{ t('services_view.cta.desc') }}
                    </p>

                    <ul class="relative z-10 space-y-4 mb-10 text-white/90">
                        <li class="flex items-start gap-4">
                            <span class="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                            </span>
                            <span class="font-medium text-sm md:text-base">{{ t('services_view.cta.point1') }}</span>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                            </span>
                            <span class="font-medium text-sm md:text-base">{{ t('services_view.cta.point2') }}</span>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="mt-1 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                            </span>
                            <span class="font-medium text-sm md:text-base">{{ t('services_view.cta.point3') }}</span>
                        </li>
                    </ul>

                    <div class="relative z-10">
                        <router-link to="/contact" class="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-yellow-600 transition duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 uppercase tracking-wide text-sm">
                            {{ t('services_view.cta.btn') }}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        </router-link>
                    </div>
                </div>
                
                <!-- Image (3/5) -->
                <div class="w-full md:w-3/5 relative min-h-[300px] md:min-h-full">
                    <img :src="ctaImg" alt="Legal Consultation" class="absolute inset-0 w-full h-full object-cover" loading="lazy">
                    <!-- Gradient overlay to melt the image smoothly into the content on the left -->
                    <div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-brown via-neutral-brown/40 to-transparent"></div>
                </div>
            </div>
        </div>
    </section>

  </div>
</template>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.fade-leave-active {
  position: absolute;
}
</style>
