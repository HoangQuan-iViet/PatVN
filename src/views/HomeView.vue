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
    <!-- 1. Hero Section (Fullscreen) -->
    <section class="relative h-screen flex items-center justify-center text-center text-white bg-neutral-900 overflow-hidden">
        <div class="absolute inset-0 z-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?q=80&w=2070&auto=format&fit=crop" class="w-full h-full object-cover" alt="Court Architecture">
            <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80"></div>
        </div>
        <div class="container mx-auto px-4 relative z-10 pt-20">
            <h1 class="text-5xl md:text-7xl font-bold font-serif text-white mb-8 leading-tight drop-shadow-2xl">
            {{ t('home.hero.title') }}
            </h1>
            <p class="text-sm md:text-base text-white/80 mb-12 max-w-4xl mx-auto font-sans uppercase tracking-widest drop-shadow-md leading-relaxed">
            {{ t('home.hero.subtitle') }}
            </p>
            <router-link to="/contact" class="bg-secondary text-white px-12 py-5 font-bold hover:bg-neutral-brown transition duration-300 uppercase tracking-widest border border-secondary shadow-2xl hover:scale-105 transform rounded-none">
            {{ t('home.hero.cta') }}
            </router-link>
        </div>
    </section>

    <!-- 2. Intro Section (Overlay Style: 1/3 Image - 2/3 Content Overlay) -->
    <section class="min-h-screen flex items-center">
      <div class="grid grid-cols-1 lg:grid-cols-5 w-full h-full">
        <!-- Col 1: High Quality Portrait/Office - Law Books Vertical -->
        <div class="relative h-96 lg:h-auto lg:col-span-2 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=2000&auto=format&fit=crop" 
                 class="w-full h-full object-cover" alt="Architecture">
        </div>
        
        <!-- Col 2 & 3: Content with Textured Watermark -->
        <div class="lg:col-span-3 relative flex items-center h-full overflow-hidden isolate">
             <!-- Textured BG -->
             <div class="absolute inset-0 -z-20">
                 <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop" class="w-full h-full object-cover opacity-20" alt="Texture">
             </div>
             <!-- White Overlay -->
             <div class="absolute inset-0 bg-white/50 -z-10"></div>
             
             <!-- Content -->
             <div class="relative z-10 p-12 lg:p-24 text-dark w-full">
                <h2 class="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4">{{ t('home.intro.label') }}</h2>
                <h3 class="text-4xl lg:text-5xl font-bold font-serif mb-8 leading-tight text-dark">
                    {{ t('home.intro.headline') }}
                </h3>
                <div class="h-1 w-20 bg-primary mb-10"></div>
                
                <div class="space-y-6 text-gray-600 text-lg leading-relaxed text-left font-serif">
                    <p>
                        {{ t('home.intro.content') }}
                    </p>
                    <p>
                        {{ t('home.intro.desc') }}
                    </p>
                </div>

                <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-white/50 rounded-none border border-neutral-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-primary">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                        </div>
                        <div>
                            <h4 class="font-bold font-serif text-dark mb-1">{{ t('home.stats.clients') }}</h4>
                            <p class="text-sm text-gray-500 font-sans">{{ t('home.stats.clients_desc') }}</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-white/50 rounded-none border border-neutral-200">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-primary">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                            </svg>
                        </div>
                        <div>
                            <h4 class="font-bold font-serif text-dark mb-1">{{ t('home.stats.success_rate') }}</h4>
                            <p class="text-sm text-gray-500 font-sans">{{ t('home.stats.success_desc') }}</p>
                        </div>
                    </div>
                </div>

                <div class="mt-12">
                    <router-link to="/about" class="text-primary font-bold border-b border-primary hover:text-white hover:border-white transition pb-1">
                        {{ t('common.view_all') }} &rarr;
                    </router-link>
                </div>
             </div>
        </div>
      </div>
    </section>

    <!-- 3. Services (Full Width) -->
    <section class="py-32 bg-gray-50">
      <div class="container mx-auto px-4">
        <!-- Header similar to Content Hub -->
        <div class="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
                 <h2 class="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 text-left">{{ t('home.services.label') }}</h2>
                 <h3 class="text-4xl lg:text-5xl font-bold font-serif text-dark mb-6 text-left">{{ t('home.services.headline') }}</h3>
                 <div class="w-24 h-1 bg-primary"></div>
            </div>
            <router-link to="/services" class="hidden md:inline-block text-gray-500 hover:text-primary transition font-medium text-lg">
                {{ t('common.view_all') }} &rarr;
            </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <router-link v-for="service in services.slice(0, 3)" :key="service.id" 
                :to="`/services/${service.slug}`"
                class="group flex flex-col bg-white rounded-none shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 relative overflow-hidden text-center">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10"></div>
                
                <!-- Image Thumbnail -->
                <div class="overflow-hidden h-48 w-full">
                    <img :src="service.image" :alt="t(service.titleKey, service.fallbackTitle)" 
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
                
                <!-- Content -->
                <div class="p-8 flex flex-col flex-grow">
                    <h3 class="text-2xl font-bold font-serif text-dark mb-4 group-hover:text-primary transition">
                        {{ t(service.titleKey, service.fallbackTitle) }}
                    </h3>
                    <p class="text-gray-500 line-clamp-4 leading-relaxed mb-8 text-left font-serif">
                        {{ t(service.descKey, service.fallbackDesc) }}
                    </p>
                    
                    <span class="text-sm font-bold text-dark uppercase tracking-wider group-hover:text-secondary transition flex items-center justify-center gap-2 mt-auto">
                        {{ t('common.details') }} <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </span>
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

    <!-- 4. Why Us (The 4 Pillars Layout) -->
    <section class="py-24 bg-neutral-50">
      <div class="container mx-auto px-4">
         <div class="text-center max-w-2xl mx-auto">
             <h2 class="text-4xl lg:text-5xl font-bold font-serif text-dark mb-6">{{ t('home.why_us.title') }}</h2>
             <div class="w-24 h-1 bg-primary mx-auto"></div>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-16">
            <div v-for="(item, index) in uspItems" :key="index" class="relative group">
                <!-- Big Number BG -->
                <div class="absolute -top-10 -left-6 text-8xl font-serif text-primary/10 -z-10 select-none group-hover:text-primary/20 transition-colors">
                    0{{ index + 1 }}
                </div>
                
                <div class="relative z-10 pt-4">
                    <h3 class="text-xl font-bold font-serif text-gray-900 mb-4">{{ t(item.title) }}</h3>
                    <div class="w-12 border-t border-primary/50 my-6"></div>
                    <p class="font-sans text-gray-600 leading-relaxed">{{ t(item.desc) }}</p>
                </div>
            </div>
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

    <!-- 6. Trust/Vision (Split Layout 2:3) -->
    <section class="min-h-screen flex items-center bg-white">
        <div class="grid grid-cols-1 lg:grid-cols-5 w-full h-full">
            <!-- Left (2 parts): Portrait Image -->
            <div class="relative h-96 lg:h-auto lg:col-span-2 overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop" 
                     class="w-full h-full object-cover grayscale" 
                     alt="Signing">
            </div>

            <!-- Right (3 parts): Content -->
            <div class="lg:col-span-3 flex items-center justify-center p-12 lg:p-32 bg-neutral-50">
                 <div class="max-w-3xl">
                    <div class="text-7xl text-primary/20 mb-8 font-serif">❝</div>
                    <blockquote class="text-3xl md:text-5xl font-bold font-serif italic text-dark leading-tight mb-12">
                        {{ t('about_view.mission') }}
                    </blockquote>
                    
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-[1px] bg-primary"></div>
                        <div>
                            <h4 class="text-lg font-bold uppercase tracking-widest text-primary">
                                {{ t('home.attorney.name') }}
                            </h4>
                            <p class="text-sm text-gray-400 font-serif italic mt-1">
                                {{ t('home.trust.author') }}
                            </p>
                        </div>
                    </div>
                 </div>
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
