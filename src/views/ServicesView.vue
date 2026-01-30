<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { services } from '../data/services'

const { t } = useI18n()

// Filters
const activeCategory = ref('all')
const searchQuery = ref('')

const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'ip', label: 'Sở hữu trí tuệ' },
  { id: 'corporate', label: 'Doanh nghiệp' },
  { id: 'dispute', label: 'Tranh tụng' },
  { id: 'license', label: 'Giấy phép' }
]

// Workflow Data
const workflowSteps = [
    {
        id: 1,
        iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
        titleKey: 'services_view.workflow.step1_title',
        descKey: 'services_view.workflow.step1_desc',
        fallbackTitle: 'Tư vấn & Thẩm định',
        fallbackDesc: 'Đánh giá hồ sơ và khả năng thành công.'
    },
    {
        id: 2,
        iconPath: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
        titleKey: 'services_view.workflow.step2_title',
        descKey: 'services_view.workflow.step2_desc',
        fallbackTitle: 'Xây dựng giải pháp',
        fallbackDesc: 'Đề xuất phương án tối ưu chi phí & thời gian.'
    },
    {
        id: 3,
        iconPath: 'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z',
        titleKey: 'services_view.workflow.step3_title',
        descKey: 'services_view.workflow.step3_desc',
        fallbackTitle: 'Triển khai pháp lý',
        fallbackDesc: 'Soạn thảo, nộp đơn và làm việc với cơ quan chức năng.'
    },
    {
        id: 4,
        iconPath: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
        titleKey: 'services_view.workflow.step4_title',
        descKey: 'services_view.workflow.step4_desc',
        fallbackTitle: 'Bàn giao kết quả',
        fallbackDesc: 'Nhận văn bằng và tư vấn bảo vệ sau cấp phép.'
    }
]

// Computed
const filteredServices = computed(() => {
    return services.filter(service => {
        // Filter by Category
        const matchCategory = activeCategory.value === 'all' || service.category === activeCategory.value
        
        // Filter by Search
        const query = searchQuery.value.toLowerCase()
        const textToSearch = [
            t(service.titleKey, service.fallbackTitle), 
            t(service.descKey, service.fallbackDesc)
        ].join(' ').toLowerCase()
        const matchSearch = textToSearch.includes(query)

        return matchCategory && matchSearch
    })
})

const getTitle = (service) => {
    return t(service.titleKey, service.fallbackTitle)
}

const getDesc = (service) => {
    return t(service.descKey, service.fallbackDesc)
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- 1. Hero Section -->
    <div class="relative h-[400px] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div class="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop" 
                 class="w-full h-full object-cover opacity-40" alt="Office Background">
             <!-- Enhanced Overlay Gradient for Better Text Contrast -->
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div class="relative z-10 container mx-auto px-4 text-center">
             <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
                {{ t('common.services', 'Dịch vụ Pháp lý') }}
             </h1>
             <!-- Breadcrumb -->
             <nav class="flex justify-center items-center gap-2 text-sm text-gray-300">
                <router-link to="/" class="hover:text-white transition">Home</router-link>
                <span>/</span>
                <span class="text-primary font-bold">Services</span>
             </nav>
        </div>
    </div>

    <!-- 2. Filter & Search Bar -->
    <div class="sticky top-12 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300 py-4">
        <div class="container mx-auto px-4 py-4">
            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                <!-- Filter Tabs -->
                <div class="flex flex-wrap gap-2 justify-center">
                    <button v-for="cat in categories" :key="cat.id"
                        @click="activeCategory = cat.id"
                        class="px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border"
                        :class="activeCategory === cat.id 
                            ? 'bg-neutral-brown text-white border-neutral-brown' 
                            : 'bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary'">
                        {{ cat.label }}
                    </button>
                </div>
                
                <!-- Search Input -->
                <div class="relative w-full md:w-80">
                    <input v-model="searchQuery" type="text" 
                        :placeholder="t('common.search', 'Tìm kiếm dịch vụ...')"
                        class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- 3. Service Grid -->
    <div class="container mx-auto px-4 py-16 min-h-[500px]">
        <transition-group name="fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <template v-if="filteredServices.length > 0">
                <router-link v-for="service in filteredServices" :key="service.id" :to="`/services/${service.slug}`"
                    class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary flex flex-col h-full hover:-translate-y-1">
                    
                    <!-- New: Image Thumbnail -->
                    <div class="w-full h-48 overflow-hidden rounded-t-2xl relative">
                        <img 
                            :src="service.image || 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop'" 
                            :alt="getTitle(service)"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        >
                        <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>

                    <div class="p-8 flex-grow flex flex-col">
                        <div class="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                            {{ categories.find(c => c.id === service.category)?.label }}
                        </div>
                        
                        <h3 class="text-xl font-bold text-dark mb-3 group-hover:text-primary transition">
                            {{ getTitle(service) }}
                        </h3>
                        <p class="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow text-justify">
                            {{ getDesc(service) }}
                        </p>
                        <div class="flex items-center text-sm font-bold text-gray-400 group-hover:text-secondary transition mt-auto">
                            {{ t('common.view_details', 'Xem chi tiết') }}
                            <span class="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </div>
                    </div>
                </router-link>
            </template>
        </transition-group>

        <!-- Empty State -->
        <div v-if="filteredServices.length === 0" class="text-center py-20">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-bold text-gray-700 mb-2">Không tìm thấy dịch vụ</h3>
            <p class="text-gray-500">Vui lòng thử từ khóa khác hoặc danh mục khác.</p>
            <button @click="() => { activeCategory = 'all'; searchQuery = '' }" class="mt-6 text-primary font-bold hover:underline">
                Xóa bộ lọc
            </button>
        </div>
    </div>

    <!-- 4. General Workflow Section (Branding Updated) -->
    <section class="bg-neutral-brown text-white py-24 relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div class="container mx-auto px-4 relative z-10">
            <div class="text-center mb-16">
                 <h2 class="text-3xl md:text-4xl font-bold mb-4 font-serif">
                    {{ t('services_view.workflow.title', 'Quy trình chuẩn mực') }}
                 </h2>
                 <p class="text-white/80">
                    {{ t('services_view.workflow.subtitle', 'Cam kết minh bạch và hiệu quả trong từng bước thực hiện') }}
                 </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div v-for="step in workflowSteps" :key="step.id" class="relative group">
                    <!-- Connector Line (PC only) -->
                    <div v-if="step.id !== 4" 
                        class="hidden md:block absolute top-8 left-1/2 w-full h-[1px] bg-white/20 -z-10 group-hover:bg-primary/50 transition duration-500"></div>
                    
                    <div class="flex flex-col items-center text-center">
                        <div class="w-16 h-16 rounded-full bg-white/10 border-2 border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-white/20 transition-all duration-300 shadow-xl overflow-hidden relative">
                            <!-- TODO: Replace with Real Image/Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                                <path stroke-linecap="round" stroke-linejoin="round" :d="step.iconPath" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-bold mb-2">{{ step.id }}. {{ t(step.titleKey, step.fallbackTitle) }}</h3>
                        <p class="text-sm text-gray-300 leading-relaxed px-4">
                            {{ t(step.descKey, step.fallbackDesc) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. CTA Section -->
    <section class="py-20 bg-white text-center">
        <div class="container mx-auto px-4">
             <h2 class="text-3xl font-bold text-dark mb-6">Bạn cần tư vấn pháp lý chuyên sâu?</h2>
             <p class="text-gray-500 mb-8 max-w-2xl mx-auto">
                 Liên hệ ngay với đội ngũ luật sư của chúng tôi để nhận được giải pháp tối ưu nhất cho vấn đề của doanh nghiệp bạn.
             </p>
             <router-link to="/contact" class="inline-block bg-secondary text-white px-10 py-4 rounded-full font-bold hover:bg-neutral-brown transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                 Liên hệ tư vấn miễn phí
             </router-link>
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
