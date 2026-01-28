<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="about-view">
    <h1>{{ t('about_view.title') }}</h1>
    <p>{{ t('about_view.description') }}</p>
    
    <router-link to="/">{{ t('home_view.title') }}</router-link>
  </div>
</template>

<style scoped>
.about-view {
  text-align: center;
  margin-top: 2rem;
}
</style>
