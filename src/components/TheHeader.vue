<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const isScrolled = ref(false)
const isLangOpen = ref(false)

const languages = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleLang = () => {
  isLangOpen.value = !isLangOpen.value
}

const changeLang = (code) => {
  locale.value = code
  isLangOpen.value = false
}

// Close dropdown when clicking outside
const closeDropdown = (e) => {
  if (!e.target.closest('.lang-dropdown')) {
    isLangOpen.value = false
  }
}

const textColorClass = computed(() => {
  return isScrolled.value ? 'text-gray-800' : 'text-white'
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', closeDropdown)
})
</script>

<template>
  <header :class="[
    'fixed top-0 left-0 w-full z-50 transition-all duration-300',
    isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
  ]">
    <div class="container mx-auto px-4 flex justify-between items-center">
      <!-- Logo -->
      <router-link to="/" :class="['text-xl font-bold transition-colors hover:text-primary', textColorClass]">
        IP Law Firm
      </router-link>

      <!-- Navigation & Language Switcher -->
      <div class="flex items-center gap-6">
        <nav class="flex gap-4">
          <router-link to="/" 
            :class="['font-medium transition-colors hover:text-primary', textColorClass]" 
            :active-class="isScrolled ? 'text-primary font-bold' : 'text-primary font-bold'">
            {{ t('common.home') }}
          </router-link>
          <router-link to="/about" 
            :class="['font-medium transition-colors hover:text-primary', textColorClass]" 
            :active-class="isScrolled ? 'text-primary font-bold' : 'text-primary font-bold'">
            {{ t('about_view.title') }}
          </router-link>
          <router-link to="/services" 
            :class="['font-medium transition-colors hover:text-primary', textColorClass]" 
            :active-class="isScrolled ? 'text-primary font-bold' : 'text-primary font-bold'">
            {{ t('common.services') }}
          </router-link>
          <router-link to="/blog" 
            :class="['font-medium transition-colors hover:text-primary', textColorClass]" 
            :active-class="isScrolled ? 'text-primary font-bold' : 'text-primary font-bold'">
            {{ t('common.blog') }}
          </router-link>
          <router-link to="/contact" 
            :class="['font-medium transition-colors hover:text-primary', textColorClass]" 
            :active-class="isScrolled ? 'text-primary font-bold' : 'text-primary font-bold'">
            {{ t('contact_view.title') }}
          </router-link>
        </nav>

        <!-- Language Dropdown -->
        <div class="relative lang-dropdown">
            <button @click.stop="toggleLang" 
                    :class="['flex items-center gap-1 px-3 py-2 rounded transition-colors focus:outline-none', isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20', textColorClass]">
                <!-- Globe Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                
                <span class="uppercase font-bold text-sm mx-1">{{ locale }}</span>

                <!-- Chevron Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isLangOpen }">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div v-if="isLangOpen" class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-2 overflow-hidden animate-fade-in-up">
                <button v-for="lang in languages" :key="lang.code"
                        @click="changeLang(lang.code)"
                        class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors">
                    <span class="text-lg">{{ lang.flag }}</span>
                    <span class="text-sm font-medium" :class="{ 'text-primary font-bold': locale === lang.code }">{{ lang.label }}</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  </header>
</template>
