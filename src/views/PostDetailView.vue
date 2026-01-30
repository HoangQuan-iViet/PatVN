<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { posts } from '../data/posts'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

// Find current post
const post = computed(() => {
  return posts.find(p => p.slug === route.params.slug)
})

// Find related posts (exclude current, take 2)
const relatedPosts = computed(() => {
  if (!post.value) return []
  return posts.filter(p => p.id !== post.value.id).slice(0, 2)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US')
}

const updateTitle = () => {
  if (post.value) {
    document.title = `${post.value.title} | IP Law Firm`
  }
}

const checkAndRedirect = () => {
  if (!post.value) {
    router.replace('/blog')
  } else {
    updateTitle()
  }
}

onMounted(() => {
  checkAndRedirect()
})

watch(() => route.params.slug, () => {
  checkAndRedirect()
})
</script>

<template>
  <div v-if="post" class="pt-14">
    <!-- Breadcrumb -->
    <div class="bg-gray-100 py-4">
      <div class="container mx-auto px-4 text-sm text-gray-600">
        <router-link to="/" class="hover:text-primary">{{ t('common.home') }}</router-link> 
        <span class="mx-2">/</span> 
        <router-link to="/blog" class="hover:text-primary">{{ t('common.blog') }}</router-link>
        <span class="mx-2">/</span> 
        <span class="font-bold text-dark">{{ post.title }}</span>
      </div>
    </div>

    <!-- Header Section -->
    <header class="pt-20 pb-10 text-center container mx-auto px-4 max-w-4xl" v-animate-on-scroll>
      <div class="flex items-center justify-center gap-4 mb-6 text-sm">
        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold uppercase tracking-wide">
            {{ post.category }}
        </span>
        <span class="text-gray-500">{{ formatDate(post.date) }}</span>
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
        <img :src="post.image" :alt="post.title" class="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-lg">
    </div>

    <!-- Content Body -->
    <article class="container mx-auto px-4 max-w-3xl prose prose-lg prose-blue text-gray-800 mb-20" v-animate-on-scroll>
        <!-- Dummy Content -->
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        
        <h2>{{ t('post_detail.content_title') }}</h2>
        <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        
        <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
        
        <blockquote>
            "Đây là một trích dẫn quan trọng liên quan đến vấn đề pháp lý được đề cập trong bài viết này."
        </blockquote>
        
        <h3>{{ t('post_detail.conclusion') }}</h3>
        <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos 
            qui ratione voluptatem sequi nesciunt.
        </p>
    </article>

    <!-- Related Posts -->
    <section class="bg-gray-50 py-16 border-t border-gray-200">
        <div class="container mx-auto px-4 max-w-5xl">
            <h2 class="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-primary pl-4">{{ t('post_detail.related_posts') }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div v-for="related in relatedPosts" :key="related.id" class="bg-white rounded-lg shadow p-6 flex gap-4 hover:shadow-md transition">
                    <img :src="related.image" class="w-24 h-24 object-cover rounded" :alt="related.title">
                    <div>
                         <span class="text-xs text-blue-600 font-bold uppercase mb-1 block">{{ related.category }}</span>
                         <h3 class="font-bold text-gray-900 mb-2 line-clamp-2">
                             <router-link :to="`/blog/${related.slug}`" class="hover:text-primary">{{ related.title }}</router-link>
                         </h3>
                         <span class="text-xs text-gray-500">{{ formatDate(related.date) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>
