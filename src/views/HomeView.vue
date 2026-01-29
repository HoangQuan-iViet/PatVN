<script setup>
import { useI18n } from 'vue-i18n'
import { services } from '../data/services'
import { posts } from '../data/posts'

const { t } = useI18n()

const partners = [1, 2, 3, 4, 5, 6] 

const uspItems = [
    { 
        iconPath: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A47.654 47.654 0 0112 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z', 
        title: 'home_view.intro.usp1_title', 
        fallbackTitle: 'Chuyên môn sâu rộng',
        desc: 'home_view.intro.usp1_desc',
        fallbackDesc: 'Chúng tôi sở hữu đội ngũ luật sư với hơn 20 năm kinh nghiệm xử lý các vụ kiện phức tạp, mang lại lợi thế chiến lược cho khách hàng.'
    },
    { 
        iconPath: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', 
        title: 'home_view.intro.usp2_title', 
        fallbackTitle: 'Quy trình tối ưu',
        desc: 'home_view.intro.usp2_desc',
        fallbackDesc: 'Áp dụng công nghệ pháp lý tiên tiến giúp rút ngắn 40% thời gian xử lý hồ sơ, đảm bảo khách hàng luôn đi trước đối thủ một bước.'
    }
]
</script>

<template>
  <div class="font-sans">
    <!-- 1. Hero Section (Fullscreen) -->
    <section class="relative h-screen flex items-center justify-center text-center text-white bg-neutral-900 overflow-hidden" v-animate-on-scroll>
        <div class="absolute inset-0 z-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?q=80&w=2070&auto=format&fit=crop" class="w-full h-full object-cover" alt="Court Architecture">
            <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80"></div>
        </div>
        <div class="container mx-auto px-4 relative z-10 pt-20">
            <h1 class="text-5xl md:text-7xl font-bold text-primary mb-8 leading-tight drop-shadow-2xl">
            {{ t('home_view.hero.title') }}
            </h1>
            <p class="text-xl md:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto font-light drop-shadow-md tracking-wide leading-relaxed">
            {{ t('home_view.hero.subtitle') }}
            </p>
            <router-link to="/contact" class="bg-secondary text-white px-12 py-5 rounded-full font-bold hover:bg-red-800 transition duration-300 uppercase tracking-widest border-2 border-secondary shadow-2xl hover:scale-105 transform">
            {{ t('home_view.hero.cta') }}
            </router-link>
        </div>
    </section>

    <!-- 2. Intro Section (Overlay Style: 1/3 Image - 2/3 Content Overlay) -->
    <section class="" v-animate-on-scroll>
      <div class="grid grid-cols-1 lg:grid-cols-3 min-h-[700px]">
        <!-- Col 1: High Quality Portrait/Office - CHANGED to Law Books Vertical -->
        <div class="relative h-96 lg:h-auto overflow-hidden">
             <img src="https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=1000&auto=format&fit=crop" 
                 class="w-full h-full object-cover" alt="Legal Books">
        </div>
        
        <!-- Col 2 & 3: Overlay Content -->
        <div class="lg:col-span-2 relative flex items-center">
             <!-- Background Image + Overlay -->
             <div class="absolute inset-0 z-0">
                  <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop" class="w-full h-full object-cover" alt="Background">
                  <div class="absolute inset-0 bg-neutral-brown/95 mix-blend-multiply"></div>
             </div>
             
             <!-- Content -->
             <div class="relative z-10 p-12 lg:p-24 text-white">
                <h2 class="text-xs font-bold uppercase tracking-[0.3em] text-primary mb-4">Về chúng tôi</h2>
                <h3 class="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                    Kiến tạo chuẩn mực pháp lý <br>với sự tận tâm tuyệt đối.
                </h3>
                <div class="h-1 w-20 bg-white/30 mb-10"></div>
                
                <div class="space-y-6 text-gray-200 text-lg leading-relaxed text-justify">
                    <p>
                        {{ t('home_view.intro.content') }}
                    </p>
                    <p>
                        Với hơn 15 năm hoạt động trong lĩnh vực Luật Sở hữu trí tuệ và Tư vấn Doanh nghiệp, chúng tôi không chỉ là luật sư, mà là đối tác chiến lược giúp doanh nghiệp bạn vượt qua mọi rào cản pháp lý. Chúng tôi tin rằng, sự minh bạch và chính trực là nền tảng của mọi mối quan hệ bền vững.
                    </p>
                </div>

                <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-white/10 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-primary">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                        </div>
                        <div>
                            <h4 class="font-bold text-white mb-1">500+ Khách hàng</h4>
                            <p class="text-sm text-gray-400">Tin tưởng và đồng hành.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="p-2 bg-white/10 rounded-full">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-primary">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                            </svg>
                        </div>
                        <div>
                            <h4 class="font-bold text-white mb-1">98% Tỷ lệ thắng</h4>
                            <p class="text-sm text-gray-400">Trong các vụ tranh chấp.</p>
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
    <section class="py-32 bg-gray-50" v-animate-on-scroll>
      <div class="container mx-auto px-4">
        <div class="text-center mb-20">
            <h2 class="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-4">Dịch vụ của chúng tôi</h2>
            <h3 class="text-4xl lg:text-5xl font-bold text-dark mb-6">Giải pháp pháp lý toàn diện</h3>
            <div class="w-24 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <router-link v-for="service in services" :key="service.id" 
                :to="`/services/${service.slug}`"
                class="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 relative overflow-hidden text-center">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10"></div>
                
                <!-- Image Thumbnail -->
                <div class="overflow-hidden h-48 w-full">
                    <img :src="service.image" :alt="t(service.titleKey, service.fallbackTitle)" 
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
                
                <!-- Content -->
                <div class="p-8 flex flex-col flex-grow">
                    <h3 class="text-2xl font-bold text-dark mb-4 group-hover:text-primary transition">
                        {{ t(service.titleKey, service.fallbackTitle) }}
                    </h3>
                    <p class="text-gray-500 line-clamp-4 leading-relaxed mb-8">
                        {{ t(service.descKey, service.fallbackDesc) }}
                    </p>
                    
                    <span class="text-sm font-bold text-dark uppercase tracking-wider group-hover:text-secondary transition flex items-center justify-center gap-2 mt-auto">
                        Chi tiết <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </span>
                </div>
            </router-link>
        </div>
      </div>
    </section>

    <!-- 4. Why Us (Overlay Style: 1/2 Overlay Left - 1/2 Image Right) -->
    <section class="" v-animate-on-scroll>
      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-[800px]">
        <!-- Col 1: Overlay Content -->
         <div class="relative flex items-center order-2 lg:order-1">
             <!-- BG + Overlay -->
             <div class="absolute inset-0 z-0">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" class="w-full h-full object-cover grayscale" alt="Why Us BG">
                  <div class="absolute inset-0 bg-gray-900/95 mix-blend-multiply"></div>
             </div>

             <div class="relative z-10 p-12 lg:p-32 w-full">
                <h2 class="text-4xl lg:text-5xl font-bold text-white mb-12 leading-tight">
                    {{ t('home_view.why_us.title', 'Tại sao chọn chúng tôi?') }}
                </h2>
                
                <div class="space-y-12">
                    <div v-for="(item, index) in uspItems" :key="index" class="group">
                        <div class="flex items-start gap-6">
                            <div class="shrink-0 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-primary">
                                    <path stroke-linecap="round" stroke-linejoin="round" :d="item.iconPath" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-white mb-3 group-hover:text-primary transition">{{ t(item.title, item.fallbackTitle) }}</h3>
                                <p class="text-gray-400 leading-relaxed text-justify">{{ t(item.desc, item.fallbackDesc) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
         </div>

        <!-- Col 2: Image -->
        <div class="h-96 lg:h-auto overflow-hidden order-1 lg:order-2">
             <img src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?q=80&w=2070&auto=format&fit=crop" 
                 class="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt="Meeting Detail">
        </div>
      </div>
    </section>

    <!-- 5. Content Hub (Full Width) -->
    <section class="py-32 bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]" v-animate-on-scroll>
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row justify-between items-end mb-16">
                <div>
                    <h2 class="text-4xl font-bold text-dark mb-4">{{ t('common.latest_news') }}</h2>
                    <div class="w-20 h-1 bg-primary"></div>
                </div>
                <router-link to="/blog" class="hidden md:inline-block text-gray-500 hover:text-primary transition font-medium text-lg">
                    {{ t('common.view_all') }} &rarr;
                </router-link>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div v-for="post in posts.slice(0, 3)" :key="post.id" 
                     class="group cursor-pointer bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div class="h-60 overflow-hidden rounded-xl mb-6 relative">
                        <img :src="post.image" :alt="post.title" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                        <div class="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-1 text-xs font-bold uppercase tracking-wider text-secondary rounded shadow-sm">
                            {{ post.category }}
                        </div>
                    </div>
                    <div class="px-2">
                        <h3 class="text-xl font-bold text-dark mb-4 group-hover:text-primary transition line-clamp-2 leading-snug">
                            <router-link :to="`/blog/${post.slug}`">{{ post.title }}</router-link>
                        </h3>
                        <p class="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed text-justify">{{ post.excerpt }}</p>
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

    <!-- 6. Trust/Vision (Overlay Style: 1/3 Image Left - 2/3 Overlay Right) -->
    <section class="" v-animate-on-scroll>
        <div class="grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
            <!-- Col 1: Leader Image - CHANGED to Classical Architecture Vertical -->
            <div class="relative h-96 lg:h-auto overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=1000&auto=format&fit=crop" 
                     class="w-full h-full object-cover" alt="Architecture Columns">
            </div>
            <!-- Col 2 & 3: Gold Overlay -->
            <div class="lg:col-span-2 relative flex items-center">
                 <div class="absolute inset-0 z-0">
                     <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" class="w-full h-full object-cover grayscale" alt="Office BG">
                     <div class="absolute inset-0 bg-primary/95 mix-blend-multiply"></div>
                 </div>
                 
                 <div class="relative z-10 p-12 lg:p-32 text-center text-white w-full">
                    <div class="text-7xl text-white/40 mb-8 font-serif">❝</div>
                    <p class="text-3xl md:text-5xl font-bold italic leading-tight mb-12">
                        {{ t('about_view.mission') }}
                    </p>
                    <div class="w-32 h-[2px] bg-white/50 mx-auto mb-8"></div>
                    <p class="uppercase tracking-[0.3em] text-sm font-bold opacity-90">Tầm nhìn & Sứ mệnh</p>
                 </div>
            </div>
        </div>
    </section>

    <!-- 7. Partners (White Background & Gray Logos) -->
    <section class="py-32 bg-white" v-animate-on-scroll>
      <div class="container mx-auto px-4">
        <h2 class="text-center text-gray-300 mb-16 uppercase tracking-[0.3em] text-xs font-bold">
            {{ t('home_view.partners.title') }}
        </h2>
        <div class="flex flex-wrap justify-center gap-16 md:gap-24 items-center">
            <div v-for="i in partners" :key="i" 
                 class="group w-32 h-12 flex items-center justify-center text-gray-300 font-bold cursor-pointer hover:text-primary transition duration-500">
                <span class="text-xl tracking-widest">LOGO {{ i }}</span>
            </div>
        </div>
      </div>
    </section>

  </div>
</template>
