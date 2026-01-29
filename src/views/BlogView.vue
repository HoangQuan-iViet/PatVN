<script setup>
import { useI18n } from 'vue-i18n'
import { posts } from '../data/posts'

const { t, locale } = useI18n()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US')
}
</script>

<template>
  <div>
    <!-- Hero Banner -->
    <section class="bg-neutral-900 py-16 text-center text-white" v-animate-on-scroll>
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-primary mb-4">{{ t('blog_view.title') }}</h1>
        <p class="text-xl text-gray-300">{{ t('blog_view.subtitle') }}</p>
      </div>
    </section>

    <!-- Post Grid -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="post in posts" :key="post.id" 
               class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
               v-animate-on-scroll>
            
            <!-- Thumbnail -->
            <div class="h-48 overflow-hidden bg-gray-200">
               <img :src="post.image" :alt="post.title" class="w-full h-full object-cover transform hover:scale-105 transition duration-500">
            </div>

            <!-- Content -->
            <div class="p-6 flex-grow flex flex-col">
              <div class="flex justify-between items-center mb-3">
                <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                  {{ post.category }}
                </span>
                <span class="text-xs text-gray-500">{{ formatDate(post.date) }}</span>
              </div>

              <h3 class="text-xl font-bold text-dark mb-3 line-clamp-2 hover:text-primary transition-colors">
                <router-link :to="`/blog/${post.slug}`">{{ post.title }}</router-link>
              </h3>
              
              <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ post.excerpt }}</p>

              <div class="mt-auto">
                <router-link :to="`/blog/${post.slug}`" class="text-secondary font-bold hover:underline text-sm">
                  {{ t('blog_view.read_more') }} &rarr;
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
