<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import bannerImg from '../assets/Banner.webp'

const { t, locale } = useI18n()
const services = ref([])
const postsDB = ref([])
const isLoading = ref(true)

const fetchData = async () => {
    isLoading.value = true
    try {
        const [resServices, resPosts] = await Promise.all([
            axios.get(`/api/services?status=live&locale=${locale.value}`),
            axios.get(`/api/posts?status=live&locale=${locale.value}`)
        ])
        if (resServices.data.success) {
            services.value = resServices.data.data
        }
        if (resPosts.data.success) {
            postsDB.value = resPosts.data.data
        }
    } catch(e) { 
        console.error('Lỗi khi tải dữ liệu từ DB:', e) 
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

const partners = [1, 2, 3, 4, 5, 6] 

const uspItems = [
    { 
        iconPath: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A47.654 47.654 0 0112 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z', 
        title: 'home.intro.usp1_title', 
        desc: 'home.intro.usp1_desc',
    },
    { 
        iconPath: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', 
        title: 'home.intro.usp2_title', 
        desc: 'home.intro.usp2_desc',
    },
    { 
        iconPath: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 
        title: 'home.intro.usp3_title', 
        desc: 'home.intro.usp3_desc',
    },
    { 
        iconPath: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418', 
        title: 'home.intro.usp4_title', 
        desc: 'home.intro.usp4_desc',
    }
]
</script>

<template>
  <div class="font-sans">
    <!-- 1. Interactive Navigation Hub (Bento Grid Hero) -->
    <section class="relative min-h-screen flex items-center justify-center pt-20 pb-12 lg:py-0 bg-neutral-900 overflow-hidden">
        <!-- Background Image -->
        <div class="absolute inset-0 z-0">
            <img :src="bannerImg"
                 class="w-full h-full object-cover opacity-100" alt="Court Architecture" fetchpriority="high">
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/60"></div>
        </div>
        
        <div class="container mx-auto px-4 relative z-10 w-full">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                <!-- Left: Main Headline & CTA -->
                <div class="lg:col-span-7 text-left">

                    
                    <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white mb-8 leading-tight drop-shadow-lg flex flex-col gap-2">
                        <span>{{ t('home.hero.title_line1') }}</span>
                        <span>{{ t('home.hero.title_line2') }}</span>
                    </h1>
                    
                    <router-link to="/contact" class="inline-flex items-center justify-center gap-3 bg-secondary text-white px-8 py-4 font-bold hover:bg-neutral-brown transition duration-300 uppercase tracking-widest shadow-2xl hover:gap-5 group">
                        {{ t('home.hero.cta') }}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 transition-transform group-hover:translate-x-1">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </router-link>
                </div>

                <!-- Right: Bento Grid Quick Links -->
                <div class="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 lg:mt-0">
                    
                    <!-- Box 1: Core Services (Takes 2 columns on SM) -->
                    <router-link to="/services" class="sm:col-span-2 group relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl p-6 lg:p-8 shadow-lg hover:bg-primary hover:border-primary hover:shadow-2xl transition-all duration-300 overflow-hidden">
                        <div class="relative z-10 flex justify-between items-start">
                            <div>
                                <h3 class="text-2xl font-bold text-gray-900 font-serif mb-2 group-hover:text-white transition-colors">{{ t('home.hero.box1_title') }}</h3>
                                <p class="text-gray-600 text-sm leading-relaxed group-hover:text-white/90 transition-colors">{{ t('home.hero.box1_desc') }}</p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary transition-all shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                            </div>
                        </div>
                    </router-link>

                    <!-- Box 2: Profile -->
                    <router-link to="/about" class="group relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl p-6 shadow-lg hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div class="flex flex-col h-full justify-between gap-5">
                            <div class="text-primary group-hover:scale-110 transition origin-left">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-gray-900 mb-1.5">{{ t('home.hero.box2_title') }}</h3>
                                <p class="text-gray-500 text-sm leading-relaxed">{{ t('home.hero.box2_desc') }}</p>
                            </div>
                        </div>
                    </router-link>

                    <!-- Box 3: Insights -->
                    <router-link to="/blog" class="group relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl p-6 shadow-lg hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div class="flex flex-col h-full justify-between gap-5">
                            <div class="text-primary group-hover:scale-110 transition origin-left">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-gray-900 mb-1.5">{{ t('home.hero.box3_title') }}</h3>
                                <p class="text-gray-500 text-sm leading-relaxed">{{ t('home.hero.box3_desc') }}</p>
                            </div>
                        </div>
                    </router-link>

                </div>
            </div>
        </div>
    </section>

    <!-- 2. Core Expertise (Condensed Services) -->
    <section class="py-24 bg-gray-50">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
                 <p class="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 text-left">{{ t('home.services.label') }}</p>
                 <h2 class="text-4xl lg:text-5xl font-bold font-serif text-dark mb-6 text-left">{{ t('home.services.headline') }}</h2>
                 <div class="w-24 h-1 bg-primary"></div>
            </div>
            <router-link to="/services" class="hidden md:inline-flex items-center gap-2 text-gray-500 hover:text-primary transition font-bold text-lg group">
                {{ t('common.view_all') }}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </router-link>
        </div>
        
        <!-- Loading State for Services -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 min-h-[300px]">
             <div class="w-10 h-10 border-[3px] border-gray-200 border-t-[#8b6b55] rounded-full animate-spin mb-4"></div>
             <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b6b55]">{{ t('common.loading', 'Đang tải...') }}</span>
        </div>

        <!-- Grid with images (4 Items) -->
        <div v-else-if="services.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <router-link v-for="service in services.slice(0, 4)" :key="service.slug" 
                :to="`/services/${service.slug}`"
                class="group flex flex-col bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-primary transition-all duration-300 overflow-hidden">
                
                <div class="h-48 overflow-hidden relative shrink-0">
                    <img :src="service.image" :alt="service.title" :style="{ objectPosition: service.imagePosition || '50% 50%' }" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy">
                </div>

                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold font-serif text-dark mb-3 group-hover:text-primary transition leading-tight min-h-[3.5rem] text-left">
                        {{ service.title || '' }}
                    </h3>
                    <p class="text-gray-500 line-clamp-2 text-sm mb-6 min-h-[3rem] text-left">
                        {{ service.excerpt || service.overview || '' }}
                    </p>
                    
                    <div class="mt-auto flex justify-end">
                        <div class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>

        <div class="text-center mt-12 md:hidden">
             <router-link to="/services" class="text-primary font-bold text-lg">
                {{ t('common.view_all') }} &rarr;
            </router-link>
        </div>
      </div>
    </section>


    <!-- 4. Content Hub (Blog) -->
    <section class="py-24 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 text-left">{{ t('common.latest_news') }}</p>
                    <h2 class="text-4xl lg:text-5xl font-bold font-serif text-dark mb-6 text-left">{{ t('blog_view.title') }}</h2>
                    <div class="w-20 h-1 bg-primary"></div>
                </div>
                <router-link to="/blog" class="hidden md:inline-flex items-center gap-2 text-gray-500 hover:text-primary transition font-bold text-lg group">
                    {{ t('common.view_all') }}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:translate-x-1 transition-transform">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                </router-link>
            </div>

            <!-- Loading State for Blog -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white min-h-[250px] border border-gray-100 shadow-sm">
                 <div class="w-10 h-10 border-[3px] border-gray-200 border-t-[#8b6b55] rounded-full animate-spin mb-4"></div>
                 <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8b6b55]">{{ t('common.loading', 'Đang tải...') }}</span>
            </div>

            <!-- Compact Blog Array (Max 2 items) -->
            <div v-else-if="postsDB.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div v-for="post in postsDB.slice(0, 2)" :key="post.slug" 
                     class="group cursor-pointer flex flex-col sm:flex-row bg-white rounded-none p-0 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden min-h-[200px]">
                    <!-- Image -->
                    <div class="sm:w-2/5 h-48 sm:h-auto overflow-hidden relative shrink-0">
                        <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy">
                    </div>
                    <!-- Content -->
                    <div class="p-6 sm:p-8 flex flex-col justify-center w-full">
                        <div class="text-xs font-bold uppercase tracking-wider text-secondary mb-3">
                            {{ post.category }}
                        </div>
                        <h3 class="text-xl font-bold font-serif text-dark mb-4 group-hover:text-primary transition line-clamp-2 leading-snug min-h-[3.5rem] text-left">
                            <router-link :to="`/blog/${post.slug}`">{{ post.title }}</router-link>
                        </h3>
                        <router-link :to="`/blog/${post.slug}`" class="mt-auto text-sm font-bold text-dark hover:text-primary transition flex items-center gap-2 uppercase tracking-wide">
                            {{ t('blog_view.read_more') }}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </router-link>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-12 md:hidden">
                 <router-link to="/blog" class="text-primary font-bold text-lg">
                    {{ t('common.view_all') }} &rarr;
                </router-link>
            </div>
        </div>
    </section>



  </div>
</template>
