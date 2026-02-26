<script setup>
import { useI18n } from 'vue-i18n'
import { services } from '../data/services'
import { posts } from '../data/posts'
import partnersBanner from '../assets/partners_banner.png'


const { t } = useI18n()

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
            <img src="https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?q=80&w=2070&auto=format&fit=crop" class="w-full h-full object-cover opacity-30 blur-[2px]" alt="Court Architecture">
            <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
        </div>
        
        <div class="container mx-auto px-4 relative z-10 w-full">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                <!-- Left: Main Headline & CTA -->
                <div class="lg:col-span-7 text-left">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
                        <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        <span class="text-xs font-bold text-white uppercase tracking-wider">{{ t('home.hero.subtitle') }}</span>
                    </div>
                    
                    <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white mb-8 leading-tight drop-shadow-lg">
                        {{ t('home.hero.title') }}
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
                    <router-link to="/services" class="sm:col-span-2 group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 lg:p-8 hover:bg-primary/80 transition duration-300 overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div class="relative z-10 flex justify-between items-start">
                            <div>
                                <h3 class="text-2xl font-bold text-white font-serif mb-2">{{ t('home.hero.box1_title') }}</h3>
                                <p class="text-gray-400 text-sm group-hover:text-white/80 transition leading-relaxed">{{ t('home.hero.box1_desc') }}</p>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                            </div>
                        </div>
                    </router-link>

                    <!-- Box 2: Profile -->
                    <router-link to="/about" class="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition duration-300">
                        <div class="flex flex-col h-full justify-between gap-6">
                            <div class="text-secondary group-hover:scale-110 transition origin-left">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-white mb-1">{{ t('home.hero.box2_title') }}</h3>
                                <p class="text-gray-400 text-xs">{{ t('home.hero.box2_desc') }}</p>
                            </div>
                        </div>
                    </router-link>

                    <!-- Box 3: Insights -->
                    <router-link to="/blog" class="group relative bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition duration-300">
                        <div class="flex flex-col h-full justify-between gap-6">
                            <div class="text-secondary group-hover:scale-110 transition origin-left">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-bold text-white mb-1">{{ t('home.hero.box3_title') }}</h3>
                                <p class="text-gray-400 text-xs">{{ t('home.hero.box3_desc') }}</p>
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
                 <h2 class="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 text-left">{{ t('home.services.label') }}</h2>
                 <h3 class="text-4xl lg:text-5xl font-bold font-serif text-dark mb-6 text-left">{{ t('home.services.headline') }}</h3>
                 <div class="w-24 h-1 bg-primary"></div>
            </div>
            <router-link to="/services" class="hidden md:inline-flex items-center gap-2 text-gray-500 hover:text-primary transition font-bold text-lg group">
                {{ t('common.view_all') }}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
            </router-link>
        </div>
        
        <!-- Minimalist Grid (4 Items) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <router-link v-for="service in services.slice(0, 4)" :key="service.id" 
                :to="`/services/${service.slug}`"
                class="group flex flex-col justify-between bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 min-h-[220px]">
                
                <div>
                    <!-- Icon placeholder (can be dynamic if added to data) -->
                    <div class="w-12 h-12 rounded-full bg-gray-50 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                    </div>
                    <h3 class="text-xl font-bold font-serif text-dark mb-3 group-hover:text-primary transition leading-tight">
                        {{ t(service.titleKey, service.fallbackTitle) }}
                    </h3>
                    <p class="text-gray-500 line-clamp-2 text-sm">
                        {{ t(service.descKey, service.fallbackDesc) }}
                    </p>
                </div>
                
                <div class="mt-6 flex justify-end">
                    <div class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
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


    <!-- 5. Content Hub (Full Width) -->
    <section class="py-32 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-end mb-16">
                <div>
                    <h2 class="text-4xl font-bold font-serif text-dark mb-4">{{ t('common.latest_news') }}</h2>
                    <div class="w-20 h-1 bg-primary"></div>
                </div>
                <router-link to="/blog" class="hidden md:inline-block text-gray-500 hover:text-primary transition font-medium text-lg">
                    {{ t('common.view_all') }} &rarr;
                </router-link>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div v-for="post in posts.slice(0, 3)" :key="post.id" 
                     class="group cursor-pointer bg-white rounded-none p-0 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div class="h-60 overflow-hidden mb-6 relative">
                        <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                        <div class="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-1 text-xs font-bold uppercase tracking-wider text-secondary shadow-sm">
                            {{ post.category }}
                        </div>
                    </div>
                    <div class="px-6 pb-6">
                        <h3 class="text-xl font-bold font-serif text-dark mb-4 group-hover:text-primary transition line-clamp-2 leading-snug">
                            <router-link :to="`/blog/${post.slug}`">{{ post.title }}</router-link>
                        </h3>
                        <p class="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed text-left font-serif">{{ post.excerpt }}</p>
                        <router-link :to="`/blog/${post.slug}`" class="text-sm font-bold text-secondary hover:text-primary transition flex items-center gap-1 uppercase tracking-wide">
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



    <!-- 7. Partners (Full Width Banner) -->
    <section class="pt-24 pb-0 bg-neutral-50">
      <div class="container mx-auto px-4 mb-12">
        <h2 class="text-center text-dark font-serif text-3xl lg:text-4xl font-bold mb-4">
            {{ t('home.partners.title') }}
        </h2>
        <div class="w-24 h-1 bg-primary mx-auto"></div>
      </div>
      <div class="w-full px-4 lg:px-0">
        <img :src="partnersBanner" alt="Partners" class="w-full h-auto object-contain">
      </div>
    </section>

  </div>
</template>
