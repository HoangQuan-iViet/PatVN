<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="text-center mt-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">{{ t('home_view.title') }}</h1>
    <p class="text-gray-600 mb-6">{{ t('home_view.description') }}</p>

    <div class="flex justify-center gap-4 mb-6">
        <!-- Language Switcher moved to Header -->
    </div>

    <router-link to="/about" class="text-blue-500 hover:text-blue-700 underline">{{ t('about_view.title') }}</router-link>
  </div>
</template>
