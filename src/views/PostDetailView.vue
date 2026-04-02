<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

// Find current post
const post = ref(null)
const isFetching = ref(true)

// Dữ liệu Related Post tạm thời có thể fetch API hoặc ẩn tạm
const relatedPosts = ref([])

const fetchPost = async (slug) => {
    isFetching.value = true
    try {
        const { data } = await axios.get(`/api/posts?slug=${slug}`)
        if (data && data.success) {
            post.value = data.data
            updateTitle()
        } else {
            router.replace('/blog')
        }
    } catch {
        router.replace('/blog')
    } finally {
        isFetching.value = false
    }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Bản Nháp'
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US')
}

const updateTitle = () => {
  if (post.value) {
    document.title = `${post.value.title} | IP Law Firm`
  }
}

onMounted(() => {
  fetchPost(route.params.slug)
})

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) fetchPost(newSlug)
})
</script>

<template>
  <div v-if="isFetching" class="pt-32 pb-32 w-full min-h-[70vh] flex flex-col items-center justify-center">
      <div class="w-12 h-12 border-[3px] border-gray-200 border-t-[#8b6b55] rounded-full animate-spin mb-6"></div>
      <span class="text-sm font-black uppercase tracking-[0.3em] text-[#8b6b55]">{{ t('common.loading', 'Đang tải...') }}</span>
  </div>

  <div v-else-if="post" class="pt-16 animate-fade-in-up">
    <!-- Header Section -->
    <header class="pt-12 pb-10 text-center container mx-auto px-4 max-w-4xl" v-animate-on-scroll>
      <div class="flex items-center justify-center gap-4 mb-4 text-sm">
        <span class="bg-[#8b6b55] text-white px-4 py-1.5 rounded font-bold uppercase tracking-widest text-[11px]">
            {{ post.category }}
        </span>
        <span class="text-gray-500 font-bold tracking-widest uppercase text-xs">{{ formatDate(post.publishedAt || post.date) }}</span>
      </div>

      <!-- Breadcrumb mới -->
      <div class="flex justify-center flex-wrap items-center gap-2 text-xs md:text-sm text-gray-400 mb-8 font-medium">
        <router-link to="/" class="hover:text-primary transition-colors">{{ t('common.home') }}</router-link> 
        <span>/</span> 
        <router-link to="/blog" class="hover:text-primary transition-colors">{{ t('common.blog') }}</router-link>
        <span>/</span> 
        <span class="text-gray-800 line-clamp-1 max-w-[200px] md:max-w-md">{{ post.title }}</span>
      </div>
      
      <h1 class="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
        {{ post.title }}
      </h1>
      
      <p class="text-xl text-gray-600 leading-relaxed font-light">
          {{ post.excerpt }}
      </p>
    </header>
    
    <!-- Feature Image -->
    <div class="container mx-auto px-4 max-w-5xl mb-16" v-animate-on-scroll>
        <img :src="post.image" :alt="post.title" :style="{ objectPosition: post.imagePosition || 'center' }" class="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-lg" fetchpriority="high" width="1000" height="500">
    </div>

    <!-- Content Body -->
    <article class="container mx-auto px-4 max-w-3xl prose prose-lg prose-blue text-gray-800 mb-20 relative" v-animate-on-scroll v-html="post.content">
    </article>

    <!-- Related Posts -->
    <section v-if="relatedPosts.length > 0" class="bg-gray-50 py-16 border-t border-gray-200">
        <div class="container mx-auto px-4 max-w-5xl">
            <h2 class="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-primary pl-4">{{ t('post_detail.related_posts') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div v-for="related in relatedPosts" :key="related._id" class="bg-white rounded-lg shadow p-6 flex gap-4 hover:shadow-md transition">
                    <img :src="related.image" :style="{ objectPosition: related.imagePosition || 'center' }" class="w-24 h-24 object-cover rounded shrink-0" :alt="related.title">
                    <div>
                         <span class="text-xs text-blue-600 font-bold uppercase mb-1 block">{{ related.category }}</span>
                         <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">
                             <router-link :to="`/blog/${related.slug}`" class="hover:text-primary">{{ related.title }}</router-link>
                         </h3>
                         <span class="text-xs text-gray-500">{{ formatDate(related.publishedAt || related.date) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>
