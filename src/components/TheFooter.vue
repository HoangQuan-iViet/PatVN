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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
        <!-- Column 1: Business Info -->
        <div>
          <h3 class="text-2xl font-bold font-serif mb-4">PATVN</h3>
          <p class="text-gray-300 text-sm leading-relaxed mb-6">
            {{ t('home.intro.content') }}
          </p>
          <p class="text-gray-400 text-xs">
            {{ t('common.copyright', { year: currentYear }) }}
          </p>
        </div>

        <!-- Column 2: Navigation -->
        <div>
          <h4 class="font-bold mb-6 uppercase tracking-widest text-sm">Điều hướng</h4>
          <ul class="space-y-3 text-sm text-gray-300">
            <li><router-link to="/" class="hover:text-white transition">{{ t('common.home') }}</router-link></li>
            <li><router-link to="/services" class="hover:text-white transition">{{ t('common.services') }}</router-link></li>
            <li><router-link to="/blog" class="hover:text-white transition">Tin tức</router-link></li>
            <li><router-link to="/about" class="hover:text-white transition">{{ t('common.about') }}</router-link></li>
            <li><router-link to="/contact" class="hover:text-white transition">{{ t('contact_view.title') }}</router-link></li>
          </ul>
        </div>

        <!-- Column 3: Contact & Social -->
        <div>
          <h4 class="font-bold mb-6 uppercase tracking-widest text-sm">Liên hệ</h4>
          <ul class="space-y-3 text-sm text-gray-300">
            <li class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-primary">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>02437621788</span>
            </li>
            <li class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-primary">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>sangchevanhanhieu.patvn@gmail.com</span>
            </li>
            <li class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-primary mt-0.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>Hanoi, Vietnam</span>
            </li>
          </ul>

          <!-- Social Links -->
          <div class="mt-8">
            <h5 class="text-sm font-bold mb-4 text-gray-400">Kết nối với chúng tôi</h5>
            <div class="flex items-center gap-4">
              <!-- Facebook -->
              <a href="https://facebook.com" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-300 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <!-- Zalo (Z letter) -->
              <a href="https://zalo.me" target="_blank" rel="noopener" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors group">
                <span class="text-lg font-bold text-gray-300 group-hover:text-white">Z</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center pt-8 border-t border-white/20 text-white/60 text-sm">
        <p>{{ t('common.copyright', { year: currentYear }) }}</p>
      </div>
    </div>
  </footer>
</template>
