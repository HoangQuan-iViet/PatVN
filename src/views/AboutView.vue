<script setup>
import { useI18n } from 'vue-i18n'
import { ShieldCheckIcon, ChatBubbleLeftRightIcon, LightBulbIcon, BriefcaseIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()

const bgPattern = "bg-orange-50/30 bg-[url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' viewBox=\\'0 0 20 20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'%239C92AC\\' fill-opacity=\\'0.05\\' fill-rule=\\'evenodd\\'%3E%3Ccircle cx=\\'3\\' cy=\\'3\\' r=\\'3\\'/%3E%3Ccircle cx=\\'13\\' cy=\\'13\\' r=\\'3\\'/%3E%3C/g%3E%3C/svg%3E')]"

const values = [
    {
        icon: ShieldCheckIcon,
        titleKey: 'about_view.val_trust',
        descKey: 'about_view.val_trust_desc'
    },
    {
        icon: ChatBubbleLeftRightIcon,
        titleKey: 'about_view.val_understand',
        descKey: 'about_view.val_understand_desc'
    },
    {
        icon: LightBulbIcon,
        titleKey: 'about_view.val_distinct',
        descKey: 'about_view.val_distinct_desc'
    },
    {
        icon: BriefcaseIcon,
        titleKey: 'about_view.val_pro',
        descKey: 'about_view.val_pro_desc'
    }
]
</script>

<template>
  <div class="font-serif text-dark leading-relaxed">
    
    <!-- 1. Page Hero Banner -->
    <section class="h-[60vh] relative flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop" 
                class="w-full h-full object-cover grayscale opacity-80" alt="Office Still Life">
             <div class="absolute inset-0 bg-black/40"></div>
        </div>
        <div class="relative z-10 text-center text-white p-4" v-animate-on-scroll>
             <h1 class="text-5xl md:text-7xl font-bold tracking-widest uppercase border-b-2 border-primary/50 pb-4 inline-block shadow-black drop-shadow-lg">
                {{ t('about_view.title') }}
             </h1>
        </div>
    </section>

    <!-- 2. Intro (Origin Story) -->
    <section :class="['py-24 md:py-32 px-6', bgPattern]">
        <div class="container mx-auto max-w-3xl text-center" v-animate-on-scroll>
            <div class="mb-8">
                <span class="block text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4">Khởi nguồn</span>
                <h2 class="text-4xl font-serif font-bold text-gray-900">Câu chuyện của chúng tôi</h2>
            </div>
            
            <div class="text-xl text-gray-700 space-y-8 font-serif leading-loose text-justify md:text-center">
                <p>
                    {{ t('about_view.intro_p1') }}
                </p>
                <div class="w-16 h-[1px] bg-primary mx-auto opacity-50"></div>
                <p class="italic text-gray-600">
                    "{{ t('about_view.intro_p2') }}"
                </p>
            </div>
        </div>
    </section>

    <!-- 3. Mission Banner (Text Left) -->
    <section class="h-[400px] relative overflow-hidden flex items-center">
         <div class="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2070&auto=format&fit=crop" 
                  class="w-full h-full object-cover object-right" alt="Mission Context">
             <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
         </div>
         <div class="relative z-10 container mx-auto px-6" v-animate-on-scroll>
             <h2 class="text-5xl md:text-6xl font-bold text-white tracking-wider uppercase drop-shadow-md">
                 {{ t('about_view.mission') }}
             </h2>
         </div>
    </section>

    <!-- 4. Mission Content -->
    <section :class="['py-24 px-6', bgPattern]">
         <div class="container mx-auto max-w-4xl" v-animate-on-scroll>
             <div class="flex flex-col gap-8 text-center md:text-left">
                <div>
                     <span class="block text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3">Người vệ sĩ tận tâm</span>
                     <h3 class="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                         {{ t('about_view.mission_title') }}
                     </h3>
                </div>
                <div class="w-24 h-1 bg-primary mb-2 mx-auto md:mx-0"></div>
                <p class="text-lg md:text-xl text-gray-600 font-serif leading-loose text-justify">
                    {{ t('about_view.mission_desc') }}
                </p>
             </div>
         </div>
    </section>
    
    <!-- 5. Vision Banner (Text Right) -->
    <section class="h-[400px] relative overflow-hidden flex items-center justify-end">
         <div class="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1508253136709-0268bcd7f884?q=80&w=2070&auto=format&fit=crop" 
                  class="w-full h-full object-cover object-left" alt="Vision Context">
             <div class="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent"></div>
         </div>
         <div class="relative z-10 container mx-auto px-6 text-right" v-animate-on-scroll>
             <h2 class="text-5xl md:text-6xl font-bold text-white tracking-wider uppercase drop-shadow-md">
                 {{ t('about_view.vision') }}
             </h2>
         </div>
    </section>

    <!-- 6. Vision Content -->
    <section :class="['py-24 px-6', bgPattern]">
         <div class="container mx-auto max-w-4xl" v-animate-on-scroll>
             <div class="flex flex-col gap-8 text-center md:text-right">
                <div>
                     <span class="block text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3 text-right">Di sản tương lai</span>
                     <h3 class="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                         {{ t('about_view.vision_title') }}
                     </h3>
                </div>
                <div class="w-24 h-1 bg-primary mb-2 mx-auto md:ml-auto md:mr-0"></div>
                <p class="text-lg md:text-xl text-gray-600 font-serif leading-loose text-justify md:text-right">
                    {{ t('about_view.vision_desc') }}
                </p>
             </div>
         </div>
    </section>

    <!-- 7. Core Values Banner (Text Center) -->
    <section class="h-[400px] relative overflow-hidden flex items-center justify-center">
         <div class="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                  class="w-full h-full object-cover grayscale" alt="Structure">
             <div class="absolute inset-0 bg-neutral-900/60"></div>
         </div>
         <div class="relative z-10 container mx-auto px-6 text-center" v-animate-on-scroll>
             <h2 class="text-5xl md:text-6xl font-bold text-white tracking-wider uppercase drop-shadow-md">
                 {{ t('about_view.values_title') }}
             </h2>
         </div>
    </section>

    <!-- 8. Core Values Grid (Icons) -->
    <section :class="['py-24 px-6', bgPattern]">
        <div class="container mx-auto max-w-5xl" v-animate-on-scroll>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                
                <div v-for="(val, idx) in values" :key="idx" 
                     class="group flex flex-col items-start p-8 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                    
                    <div class="mb-6 p-4 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <component :is="val.icon" class="w-10 h-10" />
                    </div>
                    
                    <h3 class="text-2xl font-serif font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                        {{ t(val.titleKey) }}
                    </h3>
                    
                    <p class="text-gray-600 font-serif leading-relaxed text-lg">
                        {{ t(val.descKey) }}
                    </p>
                </div>

            </div>
        </div>
    </section>

  </div>
</template>
