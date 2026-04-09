<script setup>
import { useI18n } from 'vue-i18n'
import footerBg from '../assets/Footer.webp'
const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="relative bg-gray-900 text-white pt-16 pb-2 font-light">
    <!-- Background Layer -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <img
        :src="footerBg"
        alt="Office Background"
        class="w-full h-full object-cover opacity-40"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a0f08]/95 via-[#2c1a0e]/85 to-[#1a0f08]/80"></div>
    </div>

    <!-- Content Layer -->
    <div class="relative z-10 container mx-auto px-4">
      
      <!-- Company Name (Full Width) -->
      <div class="mb-12 border-b border-white/20 pb-8">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold font-serif leading-snug tracking-wide">{{ t('common.company_name_full') }}</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-10 gap-12 mb-8">
        <!-- Column 1: Business Info (4/10) -->
        <div class="md:col-span-4">
          <h4 class="font-bold mb-6 uppercase tracking-widest text-base">{{ t('footer.about') }}</h4>
          <p class="text-gray-300 text-base leading-relaxed mb-6">
            {{ t('home.intro.content') }}
          </p>
        </div>

        <!-- Column 2: Navigation (2/10) -->
        <div class="md:col-span-2">
          <h4 class="font-bold mb-6 uppercase tracking-widest text-base">{{ t('footer.navigation') }}</h4>
          <ul class="space-y-4 text-base text-gray-200">
            <li><router-link to="/" class="hover:text-white transition">{{ t('common.home') }}</router-link></li>
            <li><router-link to="/services" class="hover:text-white transition">{{ t('common.services') }}</router-link></li>
            <li><router-link to="/blog" class="hover:text-white transition">{{ t('common.blog') }}</router-link></li>
            <li><router-link to="/about" class="hover:text-white transition">{{ t('common.about') }}</router-link></li>
            <li><router-link to="/contact" class="hover:text-white transition">{{ t('contact_view.title') }}</router-link></li>
          </ul>
        </div>

        <!-- Column 3: Contact & Social (4/10) -->
        <div class="md:col-span-4">
          <h4 class="font-bold mb-6 uppercase tracking-widest text-base">{{ t('footer.contact') }}</h4>
          <ul class="space-y-4 text-base text-gray-200">
            <li class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-primary">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span>02437621788</span>
            </li>
            <li class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-primary shrink-0 mt-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span class="break-all leading-relaxed">sangchevanhanhieu.patvn@gmail.com</span>
            </li>
            <li class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-primary mt-0.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span class="leading-relaxed">
                {{ t('contact_view.address_full') }}
              </span>
            </li>
          </ul>

          <!-- Social Links -->
          <div class="mt-8">
            <h5 class="font-bold mb-6 uppercase tracking-widest text-base text-white">{{ t('footer.connect') }}</h5>
            <div class="flex items-center gap-4">
              <!-- Facebook -->
              <a href="https://www.facebook.com/sangchevanhanhieu.vn" target="_blank" rel="noopener" class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors group" aria-label="Facebook PATVN">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-200 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <!-- Zalo (Z letter) -->
              <a href="https://zalo.me/0967059898" target="_blank" rel="noopener" class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors group" aria-label="Zalo PATVN">
                <span class="text-base font-bold text-gray-300 group-hover:text-white">Zalo</span>
              </a>
              <!-- Messenger -->
              <a href="https://www.messenger.com/t/sangchevanhanhieu.vn" target="_blank" rel="noopener" class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors group" aria-label="Messenger PATVN">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-200 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.145 2 11.26c0 2.918 1.43 5.49 3.655 7.152.19.14.305.363.305.6v1.988c0 .246.216.442.458.398l2.235-.41c.196-.036.398.01.562.115C10.153 21.683 11.06 22 12 22c5.523 0 10-4.145 10-9.26S17.523 2 12 2zm.8 11.696L10.32 10.94 7.2 13.696l3.414-3.636 2.48 2.756 3.12-2.756-3.414 3.636z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center pt-2 border-t border-white/20 text-white/70 text-xs">
        <p>{{ t('common.copyright', { year: currentYear }) }}</p>
      </div>
    </div>
  </footer>
</template>
