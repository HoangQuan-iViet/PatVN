<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { services } from '../data/services'

const route = useRoute()
const { t } = useI18n()

// Find current service
const service = computed(() => {
    return services.find(s => s.slug === route.params.slug)
})

// Scroll function for anchor links
const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}
</script>

<template>
  <div v-if="service" class="bg-gray-50 min-h-screen font-sans">
    
    <!-- 1. Hero Banner (Fullwidth) -->
    <section class="relative h-[500px] flex items-center justify-center bg-neutral-900 text-white overflow-hidden pt-20">
        <div class="absolute inset-0 z-0">
             <img :src="service.image || 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop'" 
                 class="w-full h-full object-cover opacity-60" :alt="t(service.titleKey, service.fallbackTitle)">
             <!-- Dark Overlay -->
             <div class="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div class="relative z-10 container mx-auto px-4 text-center">
             <h1 class="text-4xl md:text-6xl font-bold mb-6 font-serif leading-tight">
                {{ t(service.titleKey, service.fallbackTitle) }}
             </h1>
             <!-- Breadcrumb -->
             <nav class="flex justify-center items-center gap-2 text-sm text-gray-300 font-medium">
                <router-link to="/" class="hover:text-white transition">Home</router-link>
                <span>/</span>
                <router-link to="/services" class="hover:text-white transition">Services</router-link>
                <span>/</span>
                <span class="text-primary truncate max-w-[200px]">{{ t(service.titleKey, service.fallbackTitle) }}</span>
             </nav>
        </div>
    </section>

    <!-- 2. Main Layout (2 Cols) -->
    <div class="container mx-auto px-4 py-16">
        <div class="flex flex-col lg:flex-row gap-12">
            
            <!-- LEFT COLUMN: Main Content (2/3) -->
            <div class="w-full lg:w-2/3">
                
                <!-- Section 1: Overview -->
                <section id="overview" class="mb-16 scroll-mt-32">
                    <h2 class="text-3xl font-bold text-dark mb-6 font-serif border-l-4 border-primary pl-4">
                        {{ t('service_detail.overview') }}
                    </h2>
                    <p class="text-lg text-gray-600 leading-loose text-justify">
                        {{ service.overview || t(service.contentKey, service.fallbackDesc) }}
                    </p>
                </section>

                <!-- Section 2: Target Audience (Grid Style) -->
                <section v-if="service.targetAudience" id="audience" class="mb-16 scroll-mt-32">
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
                <section v-if="service.process" id="process" class="mb-16 scroll-mt-32">
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
                <section v-if="service.documents" id="documents" class="mb-16 scroll-mt-32">
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
                <section v-if="service.pricing" id="pricing" class="mb-16 scroll-mt-32">
                    <h2 class="text-3xl font-bold text-dark mb-6 font-serif border-l-4 border-primary pl-4">
                        {{ t('service_detail.pricing') }}
                    </h2>
                    <div class="bg-gray-50 border-l-4 border-secondary p-8 rounded-r-2xl shadow-sm flex items-center gap-6">
                        <div class="shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary border border-secondary/20 shadow-sm">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-bold text-dark text-lg mb-1">{{ t('service_detail.pricing_ref') }}</h3>
                            <p class="text-gray-600">{{ service.pricing }}</p>
                        </div>
                    </div>
                </section>

                <!-- Section 6: FAQ -->
                <section v-if="service.faq" id="faq" class="mb-16 scroll-mt-32">
                    <h2 class="text-3xl font-bold text-dark mb-8 font-serif border-l-4 border-primary pl-4">
                        {{ t('service_detail.faq') }}
                    </h2>
                    <div class="space-y-4">
                        <details v-for="(item, idx) in service.faq" :key="idx" class="group bg-white border border-gray-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:shadow-md">
                            <summary class="flex items-center justify-between p-6 cursor-pointer text-dark font-bold hover:bg-gray-50 transition select-none">
                                <span class="text-lg pr-4">Q: {{ item.question }}</span>
                                <span class="text-gray-400 group-open:rotate-180 transition-transform duration-300 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </span>
                            </summary>
                            <div class="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/30">
                                <span class="font-bold text-primary">A:</span> {{ item.answer }}
                            </div>
                        </details>
                    </div>
                </section>

                <!-- Section 7: Registration Form (Moved from Sidebar) -->
                <section id="register-form" class="mt-20 scroll-mt-32">
                    <div class="bg-neutral-brown p-8 md:p-12 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <!-- Decor -->
                        <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                        
                        <div class="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                            <!-- Left: Text Call to Action -->
                            <div class="w-full lg:w-1/2 text-center lg:text-left">
                                <h3 class="text-3xl font-bold mb-4 font-serif">{{ t('service_detail.cta_title') }}</h3>
                                <p class="text-white/80 text-lg leading-relaxed mb-6">{{ t('service_detail.cta_desc') }}</p>
                                <div class="hidden lg:flex items-center gap-4 text-primary">
                                    <div class="p-3 bg-white/10 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </div>
                                    <span class="text-2xl font-bold text-white">1900 1234</span>
                                </div>
                            </div>

                            <!-- Right: Input Fields -->
                            <form class="w-full lg:w-1/2 space-y-4">
                                <div class="space-y-4">
                                    <input type="text" :placeholder="t('service_detail.form_name')" 
                                        class="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 placeholder-white/50 focus:outline-none focus:bg-white/20 transition text-white">
                                    <input type="text" :placeholder="t('service_detail.form_phone')" 
                                        class="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 placeholder-white/50 focus:outline-none focus:bg-white/20 transition text-white">
                                </div>
                                <button class="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-yellow-600 transition shadow-lg uppercase tracking-wide flex items-center justify-center gap-2">
                                    {{ t('service_detail.form_submit') }}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </button>
                                <p class="text-white/40 text-xs text-center mt-2">* Thông tin được bảo mật tuyệt đối</p>
                            </form>
                        </div>
                    </div>
                </section>
                
            </div>

            <!-- RIGHT COLUMN: Sticky Sidebar (1/3) -->
            <aside class="w-full lg:w-1/3 space-y-8 h-fit lg:sticky lg:top-24">
                
                <!-- Box 1: Table of Contents -->
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 class="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-2">
                        {{ t('service_detail.toc') }}
                    </h3>
                    <nav class="flex flex-col space-y-2 text-sm">
                        <button @click="scrollToSection('overview')" class="text-left text-gray-500 hover:text-primary hover:font-bold transition py-1 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 1. {{ t('service_detail.overview') }}
                        </button>
                        <button v-if="service.targetAudience" @click="scrollToSection('audience')" class="text-left text-gray-500 hover:text-primary hover:font-bold transition py-1 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 2. {{ t('service_detail.target') }}
                        </button>
                        <button v-if="service.process" @click="scrollToSection('process')" class="text-left text-gray-500 hover:text-primary hover:font-bold transition py-1 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 3. {{ t('service_detail.process') }}
                        </button>
                        <button v-if="service.documents" @click="scrollToSection('documents')" class="text-left text-gray-500 hover:text-primary hover:font-bold transition py-1 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 4. {{ t('service_detail.documents') }}
                        </button>
                        <button v-if="service.pricing" @click="scrollToSection('pricing')" class="text-left text-gray-500 hover:text-primary hover:font-bold transition py-1 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 5. {{ t('service_detail.pricing') }}
                        </button>
                        <button v-if="service.faq" @click="scrollToSection('faq')" class="text-left text-gray-500 hover:text-primary hover:font-bold transition py-1 flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span> 6. {{ t('service_detail.faq') }}
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
