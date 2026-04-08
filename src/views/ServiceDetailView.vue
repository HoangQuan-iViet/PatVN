<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const route = useRoute()
const { t, locale } = useI18n()

// Find current service
const service = ref(null)
const isLoading = ref(true)

const loadService = async () => {
    if(!route.params.slug) return;
    isLoading.value = true
    try {
        // Tương tự posts, nhưng lấy record từ Mongo collections Dịch Vụ
        const { data } = await axios.get(`/api/services?slug=${route.params.slug}&locale=${locale.value}`)
        if (data.success && data.data) {
            service.value = data.data
        } else {
            service.value = null
        }
    } catch(e) {
        console.error('Không tìm thấy dịch vụ:', e)
        service.value = null
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadService()
})

watch(() => route.params.slug, () => {
    if (route.name === 'service-detail') {
        loadService()
    }
})

watch(locale, () => {
    if (route.name === 'service-detail') {
        loadService()
    }
})

// Scroll function for anchor links
const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

const availableSections = computed(() => {
    if (!service.value) return []
    const sections = []
    if (service.value.overview || service.value.excerpt) {
        sections.push({ id: 'overview', label: t('service_detail.overview') })
    }
    if (service.value.targetAudience && service.value.targetAudience.length > 0) {
        sections.push({ id: 'audience', label: t('service_detail.target') })
    }
    if (service.value.process && service.value.process.length > 0) {
        sections.push({ id: 'process', label: t('service_detail.process') })
    }
    if (service.value.documents && service.value.documents.length > 0) {
        sections.push({ id: 'documents', label: t('service_detail.documents') })
    }
    if (service.value.pricing) {
        sections.push({ id: 'pricing', label: t('service_detail.pricing') })
    }
    return sections
})
</script>

<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div class="w-12 h-12 border-[3px] border-gray-200 border-t-primary rounded-full animate-spin mb-6"></div>
      <p class="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{{ t('common.loading', 'Đang tải dữ liệu...') }}</p>
  </div>

  <div v-else-if="service" class="bg-gray-50 min-h-screen font-sans">
    
    <!-- 1. Hero Banner (Fullwidth) -->
    <section class="relative h-[500px] flex items-center justify-center bg-neutral-900 text-white overflow-hidden pt-20">
        <div class="absolute inset-0 z-0">
             <img :src="service.image || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fm=webp&fit=crop'" 
                 class="w-full h-full object-cover opacity-60" :alt="service.title" :style="{ objectPosition: service.imagePosition || '50% 50%' }" fetchpriority="high" width="2000" height="1333">
             <!-- Dark Overlay -->
             <div class="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div class="relative z-10 container mx-auto px-4 text-center">
             <h1 class="text-4xl md:text-6xl font-bold mb-6 font-serif leading-tight">
                {{ service.title || 'Đang tải...' }}
             </h1>
             <!-- Breadcrumb -->
             <nav class="flex justify-center items-center gap-2 text-sm text-gray-300 font-medium">
                <router-link to="/" class="hover:text-white transition">{{ t('common.home') }}</router-link>
                <span>/</span>
                <router-link to="/services" class="hover:text-white transition">{{ t('common.services') }}</router-link>
                <span>/</span>
                <span class="text-primary truncate max-w-[200px]">{{ service.title || '...' }}</span>
             </nav>
        </div>
    </section>

    <!-- 2. Main Layout (2 Cols) -->
    <div class="container mx-auto px-4 py-16">
        <div class="flex flex-col lg:flex-row gap-12">
            
            <!-- LEFT COLUMN: Main Content (2/3) -->
            <div class="w-full lg:w-2/3">
                
                <!-- Section 1: Overview -->
                <section v-if="service.overview || service.excerpt" id="overview" class="mb-16 scroll-mt-32">
                    <h2 class="text-3xl font-bold text-dark mb-6 font-serif border-l-4 border-primary pl-4">
                        {{ t('service_detail.overview') }}
                    </h2>
                    <p class="text-lg text-gray-600 leading-loose text-justify whitespace-pre-line">
                        {{ service.overview || service.excerpt }}
                    </p>
                </section>

                <!-- Section 2: Target Audience (Grid Style) -->
                <section v-if="service.targetAudience && service.targetAudience.length > 0" id="audience" class="mb-16 scroll-mt-32">
                    <h2 class="text-3xl font-bold text-dark mb-6 font-serif border-l-4 border-primary pl-4">
                        {{ t('service_detail.target') }}
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="(item, idx) in service.targetAudience" :key="idx" 
                             class="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-primary/30 transition duration-300">
                            <div class="shrink-0 text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                            </div>
                            <span class="text-gray-700 font-medium text-sm">{{ item }}</span>
                        </div>
                    </div>
                </section>

                <!-- Section 3: Process (Vertical Steps with Brand Colors) -->
                <section v-if="service.process && service.process.length > 0" id="process" class="mb-16 scroll-mt-32">
                    <h2 class="text-3xl font-bold text-dark mb-8 font-serif border-l-4 border-primary pl-4">
                        {{ t('service_detail.process') }}
                    </h2>
                    <div class="relative border-l-2 border-gray-200 ml-4 space-y-12">
                        <div v-for="(step, idx) in service.process" :key="idx" class="relative pl-10">
                            <!-- Bullet -->
                            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm ring-1 ring-primary/20"></div>
                            
                            <h3 class="text-xl font-bold text-dark mb-2">{{ step.title }}</h3>
                            <span class="inline-block bg-neutral-brown text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-sm">
                                {{ t('service_detail.time_badge', { time: step.time }) }}
                            </span>
                            <p class="text-gray-500 leading-relaxed text-justify">{{ step.desc }}</p>
                        </div>
                    </div>
                </section>

                <!-- Section 4: Documents (Checklist Style) -->
                <section v-if="service.documents && service.documents.length > 0" id="documents" class="mb-16 scroll-mt-32">
                    <h2 class="text-3xl font-bold text-dark mb-8 font-serif border-l-4 border-primary pl-4">
                        {{ t('service_detail.documents') }}
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="(doc, idx) in service.documents" :key="idx" 
                             class="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
                            <div class="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3.5 h-3.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <span class="text-gray-700 font-medium text-sm leading-snug">{{ doc }}</span>
                        </div>
                    </div>
                </section>

                 <!-- Section 5: Pricing (Quote Box Style) -->
                <section v-if="service.pricing && service.pricing.length > 0 && service.pricing[0].title" id="pricing" class="mb-16 scroll-mt-32">
                    <h2 class="text-3xl font-bold text-dark mb-6 font-serif border-l-4 border-primary pl-4">
                        {{ t('service_detail.pricing') }}
                    </h2>
                    <div class="bg-gray-50 border-l-4 border-secondary p-8 rounded-r-2xl shadow-sm flex flex-col md:flex-row md:items-start gap-6">
                        <div class="shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary border border-secondary/20 shadow-sm md:mt-2">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="space-y-4 flex-1">
                            <div v-for="(item, idx) in service.pricing" :key="idx" class="border-b border-gray-200/60 last:border-0 pb-4 last:pb-0">
                                <h3 class="font-bold text-dark text-lg mb-1">{{ item.title || t('service_detail.pricing_ref') }}</h3>
                                <p class="text-gray-600 font-mono text-sm bg-white inline-block px-3 py-1 rounded-md border border-gray-100 shadow-sm">{{ item.desc }}</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            <!-- RIGHT COLUMN: Sticky Sidebar (1/3) -->
            <aside class="w-full lg:w-1/3 space-y-8 h-fit lg:sticky lg:top-24">
                
                <!-- Box 1: Table of Contents -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 class="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-2">
                        {{ t('service_detail.toc') }}
                    </h2>
                    <nav class="flex flex-col space-y-2 text-sm">
                        <button v-for="(sec, idx) in availableSections" :key="sec.id" @click="scrollToSection(sec.id)" class="text-left text-gray-500 hover:text-primary hover:font-bold transition py-1 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {{ idx + 1 }}. {{ sec.label }}
                        </button>
                    </nav>
                </div>

                <!-- Box 2: Compact Contact Card (New) -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wider font-bold mb-0.5">{{ t('service_detail.quick_consult') }}</p>
                        <a href="tel:19001234" class="text-lg font-bold text-dark hover:text-primary transition">1900 1234</a>
                    </div>
                </div>

            </aside>

        </div>
    </div>
    
  </div>
  
  <!-- Not Found State -->
  <div v-else class="min-h-screen flex flex-col items-center justify-center">
      <h2 class="text-2xl font-bold text-gray-700">{{ t('service_detail.not_found', 'Dịch vụ không tồn tại') }}</h2>
      <router-link to="/services" class="text-primary hover:underline mt-4">{{ t('service_detail.back_list', 'Quay lại danh sách dịch vụ') }}</router-link>
  </div>
</template>
