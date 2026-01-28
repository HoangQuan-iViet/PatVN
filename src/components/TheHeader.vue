<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <header class="bg-white shadow">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <!-- Logo -->
      <div class="text-xl font-bold text-gray-800">
        IP Law Firm
      </div>

      <!-- Navigation & Language Switcher -->
      <div class="flex items-center gap-6">
        <nav class="flex gap-4">
          <router-link to="/" class="text-gray-600 hover:text-blue-600 font-medium" active-class="text-blue-600 font-bold">
            {{ t('home_view.title') }}
          </router-link>
          <router-link to="/about" class="text-gray-600 hover:text-blue-600 font-medium" active-class="text-blue-600 font-bold">
            {{ t('about_view.title') }}
          </router-link>
        </nav>

        <div class="flex gap-2">
            <button class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm" 
                    :class="{ 'bg-blue-500 text-white hover:bg-blue-600': $i18n.locale === 'vi' }"
                    @click="$i18n.locale = 'vi'">VI</button>
            <button class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm"
                    :class="{ 'bg-blue-500 text-white hover:bg-blue-600': $i18n.locale === 'en' }"
                    @click="$i18n.locale = 'en'">EN</button>
        </div>
      </div>
    </div>
  </header>
</template>
