<script setup>
import { useI18n } from 'vue-i18n'
import { ShieldCheckIcon, ChatBubbleLeftRightIcon, LightBulbIcon, BriefcaseIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()

// Images for Magazine Feel - High quality, architectural/business
const quoteBg = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop" // Suit texture or dark office

const values = [
    { icon: ShieldCheckIcon, title: 'about_view.val_trust', desc: 'about_view.val_trust_desc' },
    { icon: ChatBubbleLeftRightIcon, title: 'about_view.val_understand', desc: 'about_view.val_understand_desc' },
    { icon: LightBulbIcon, title: 'about_view.val_distinct', desc: 'about_view.val_distinct_desc' },
    { icon: BriefcaseIcon, title: 'about_view.val_pro', desc: 'about_view.val_pro_desc' }
]
</script>

<template>
    <div class="bg-white min-h-screen text-dark font-sans selection:bg-primary selection:text-white">
        
        <!-- 1. HERO SECTION: Building Image & Minimalist Label -->
        <section class="relative h-[80vh] w-full overflow-hidden">
            <!-- Background Image: Modern Building / Skyscraper -->
            <div class="absolute inset-0 z-0">
                <img srcset="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=480&auto=format&fm=webp&fit=crop 480w,
                             https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1024&auto=format&fm=webp&fit=crop 1024w,
                             https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fm=webp&fit=crop 2070w"
                     sizes="100vw"
                     src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fm=webp&fit=crop" 
                     alt="Corporate Building" 
                     class="w-full h-full object-cover object-center brightness-[0.85]" fetchpriority="high" width="2070" height="1380">
            </div>
            
            <!-- Content: Bottom Left, Minimalist -->
            <div class="absolute bottom-12 left-0 z-10 container mx-auto px-6">
                <div class="border-l-4 border-primary pl-6">
                    <h1 class="text-4xl md:text-5xl font-serif text-white tracking-wide shadow-black drop-shadow-md">
                        {{ t('about_view.hero_title') }}
                    </h1>
                </div>
            </div>
        </section>

        <!-- 2. STORY SECTION: Letter from PATVN -->
        <section class="py-24 bg-white container mx-auto px-6">
            <div class="max-w-4xl mx-auto relative">
                <!-- Watermark/Decoration -->
                <div class="absolute -top-10 -left-10 text-9xl text-gray-100 font-serif leading-none select-none -z-0">
                    &rdquo;
                </div>

                <div class="relative z-10 text-center md:text-left">
                    <span class="text-secondary font-bold tracking-[0.2em] uppercase text-sm mb-6 block border-b border-gray-200 pb-4 inline-block">
                        {{ t('about_view.story_headline') }}
                    </span>
                    
                    <div class="prose prose-lg text-neutral-brown text-justify mx-auto md:mx-0">
                        <p class="leading-loose text-xl whitespace-pre-line font-serif">
                            <span class="float-left text-6xl font-bold text-primary mr-3 mt-[-5px] font-serif">
                                {{ t('about_view.story_dropcap') }}
                            </span>
                            {{ t('about_view.story_p1') }}
                        </p>
                    </div>

                    <!-- Signature (Hidden per request) -->
                    <!-- <div class="mt-12 flex flex-col md:flex-row items-center md:items-start md:justify-end gap-4">
                         <div class="text-right">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png" 
                                  class="h-12 w-auto grayscale opacity-60 ml-auto" alt="Signature">
                             <p class="text-sm mt-2 text-gray-500 font-bold uppercase tracking-widest">{{ t('about_view.signature') }}</p>
                         </div>
                    </div> -->
                </div>
            </div>
        </section>

        <!-- 3. QUOTE SECTION: High Contrast (Kept as requested) -->
        <section class="relative py-32 bg-fixed bg-cover bg-center" :style="{ backgroundImage: `url(${quoteBg})` }">
            <div class="absolute inset-0 bg-secondary/90 mix-blend-multiply"></div>
            <div class="relative container mx-auto px-6 text-center z-10">
                <blockquote class="text-3xl md:text-4xl font-serif text-white leading-relaxed italic opacity-95 max-w-4xl mx-auto">
                    {{ t('about_view.quote') }}
                </blockquote>
            </div>
        </section>

        <!-- 4. VALUES & MISSION: Storytelling Content -->
        <section class="py-24 bg-neutral-50 px-6">
            <div class="container mx-auto">
                
                <!-- Expanded Mission Narrative -->
                <div class="mb-20 max-w-4xl mx-auto text-center">
                    <h2 class="text-3xl md:text-4xl font-bold text-dark mb-8 font-serif">
                        {{ t('about_view.mission_title') }}
                    </h2>
                    <p class="text-neutral-brown text-lg leading-loose font-serif text-justify md:text-center">
                        {{ t('about_view.mission_desc') }}
                    </p>
                </div>

                <div class="w-full h-[1px] bg-gray-200 mb-20"></div>

                <!-- Bento Grid / Magazine Layout (Redesigned for Prominence & Solemnity) -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div v-for="(item, index) in values" :key="index"
                         class="group relative bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 overflow-hidden">

                        <!-- Prominent Static Icon Container -->
                        <div class="mb-8 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <component :is="item.icon" class="w-8 h-8" />
                        </div>
                        
                        <!-- Content -->
                        <h3 class="relative z-10 text-2xl font-bold text-dark mb-4 transition-colors font-serif">
                            {{ t(item.title) }}
                        </h3>
                        
                        <p class="relative z-10 text-gray-600 leading-relaxed text-base text-left">
                            {{ t(item.desc) }}
                        </p>
                    </div>
                </div>

            </div>
        </section>

        <!-- 5. TEAM SECTION REMOVED -->

    </div>
</template>

<style scoped>
/* Scoped styles only for very specific effects not easily doable with Tailwind */
.text-stroke {
    -webkit-text-stroke: 1px rgba(255,255,255,0.3);
}
</style>
