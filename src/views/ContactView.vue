<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-neutral-900 py-16 text-center text-white">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-primary">{{ t('contact_view.title') }}</h1>
        <p class="text-lg text-gray-300 mt-2">{{ t('contact_view.subtitle') }}</p>
      </div>
    </section>

    <div class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- Left Column: Info & Map -->
        <div v-animate-on-scroll>
          <div class="space-y-6 mb-8">
            <div class="flex items-start gap-4">
              <div class="text-2xl mt-1">📍</div>
              <div>
                <h3 class="font-bold text-dark text-lg">{{ t('contact_view.address') }}</h3>
                <p class="text-gray-600">NV01, KĐT Mễ Trì Hạ, Nam Từ Liêm, Hà Nội, Việt Nam</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="text-2xl mt-1">📧</div>
              <div>
                <h3 class="font-bold text-dark text-lg">{{ t('contact_view.email') }}</h3>
                <p class="text-gray-600">contact@iplawfirm.vn</p>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <div class="text-2xl mt-1">📞</div>
              <div>
                <h3 class="font-bold text-dark text-lg">{{ t('contact_view.hotline') }}</h3>
                <p class="text-gray-600 font-bold text-primary text-xl">1900 1234</p>
              </div>
            </div>
          </div>
          
          <!-- Google Map -->
          <div class="w-full h-80 rounded-xl overflow-hidden shadow-md border border-gray-200">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.388836262967!2d105.77666277601977!3d21.017118388177573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454ab43c0c4db%3A0x7d28741361c471c!2zS0cHUQ!5e0!3m2!1svi!2s!4v1711680000000!5m2!1svi!2s" 
                    width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>

        <!-- Right Column: Contact Form -->
        <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100" v-animate-on-scroll>
          <form class="space-y-6" @submit.prevent>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('contact_view.form.name') }}</label>
              <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" placeholder="Nguyen Van A">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('contact_view.form.email') }}</label>
              <input type="email" class="w-full px-4 py-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" placeholder="email@example.com">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('contact_view.form.subject') }}</label>
              <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition" placeholder="...">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">{{ t('contact_view.form.message') }}</label>
              <textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"></textarea>
            </div>
            <button class="w-full bg-secondary text-white font-bold py-3 rounded hover:bg-red-900 transition duration-300 shadow-md transform hover:-translate-y-1">
              {{ t('contact_view.form.submit') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
