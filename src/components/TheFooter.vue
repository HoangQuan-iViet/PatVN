<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="relative bg-gray-900 text-white pt-16 pb-8 font-light">
    <!-- Background Layer -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3"
        alt="Office Background"
        class="w-full h-full object-cover filter grayscale contrast-75"
      />
      <div class="absolute inset-0 bg-neutral-brown/90 mix-blend-multiply"></div>
    </div>

    <!-- Content Layer -->
    <div class="relative z-10 container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div>
          <h3 class="text-xl font-bold mb-4">IP Law Firm</h3>
          <p class="text-gray-300 text-sm">
            {{ t('home_view.hero.subtitle') }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-bold mb-4">Liên kết nhanh</h4>
          <ul class="space-y-2 text-sm text-gray-300">
            <li><router-link to="/" class="hover:text-white transition">{{ t('common.home') }}</router-link></li>
            <li><router-link to="/services" class="hover:text-white transition">{{ t('common.services') }}</router-link></li>
            <li><router-link to="/blog" class="hover:text-white transition">Tin tức</router-link></li>
            <li><router-link to="/about" class="hover:text-white transition">{{ t('about_view.title') }}</router-link></li>
            <li><router-link to="/contact" class="hover:text-white transition">{{ t('contact_view.title') }}</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-bold mb-4">{{ t('contact_view.title') }}</h4>
          <ul class="space-y-2 text-sm text-gray-300">
            <li>Hotline: 1900 1234</li>
            <li>Email: contact@iplawfirm.vn</li>
            <li>{{ t('contact_view.address') }}: Hanoi, Vietnam</li>
          </ul>
        </div>
      </div>

      <div class="text-center pt-8 border-t border-white/20 text-white/60 text-sm">
        <p>{{ t('common.copyright', { year: currentYear }) }}</p>
      </div>
    </div>
  </footer>
</template>
