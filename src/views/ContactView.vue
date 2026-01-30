<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { MapPinIcon, EnvelopeIcon, PhoneIcon, ClockIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()

// --- Form State ---
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const isSuccess = ref(false)

// --- Methods ---
const handleSubmit = () => {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isSuccess.value = true
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }, 2000)
}

const resetForm = () => {
    isSuccess.value = false
}
</script>

<template>
  <div class="bg-white min-h-screen">
    
    <!-- 1. Hero Section (Increased Height 60vh) -->
    <section class="relative h-[60vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div class="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop" 
                 class="w-full h-full object-cover opacity-50" alt="Contact Hero">
             <div class="absolute inset-0 bg-black/40"></div>
        </div>
        <div class="relative z-10 text-center px-4">
             <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 font-serif tracking-tight">
                {{ t('contact_view.title') }}
             </h1>
             <p class="text-white/80 text-xl font-light font-sans tracking-widest uppercase">
                {{ t('contact_view.subtitle') }}
             </p>
        </div>
    </section>

    <!-- 2. Asymmetrical Main Container -->
    <div class="container mx-auto px-4 relative z-20 -mt-32 mb-24">
        <div class="bg-white shadow-2xl shadow-black/5 grid grid-cols-1 lg:grid-cols-12 min-h-[800px]">
            
            <!-- LEFT COLUMN: Info Sidebar (Col-span-4) -->
            <div class="lg:col-span-4 bg-neutral-50 p-12 border-r border-gray-100 flex flex-col justify-between">
                <div class="space-y-12">
                     <div>
                        <h3 class="font-serif text-2xl text-dark mb-6 flex items-center gap-3">
                            <MapPinIcon class="w-6 h-6 text-primary" />
                            {{ t('contact_view.address') }}
                        </h3>
                        <p class="text-gray-500 leading-relaxed font-light">
                            {{ t('contact_view.address_line1') }}<br>
                            {{ t('contact_view.address_line2') }}<br>
                            {{ t('contact_view.address_line3') }}
                        </p>
                    </div>

                    <div>
                        <h3 class="font-serif text-2xl text-dark mb-6 flex items-center gap-3">
                             <EnvelopeIcon class="w-6 h-6 text-primary" />
                            {{ t('contact_view.email') }}
                        </h3>
                        <a href="mailto:sangchevanhanhieu.patvn@gmail.com" class="text-gray-500 hover:text-black transition border-b border-transparent hover:border-black inline-block pb-0.5">
                            sangchevanhanhieu.patvn@gmail.com
                        </a>
                    </div>

                    <div>
                        <h3 class="font-serif text-2xl text-dark mb-6 flex items-center gap-3">
                             <PhoneIcon class="w-6 h-6 text-primary" />
                             {{ t('contact_view.hotline') }}
                        </h3>
                        <p class="text-3xl font-serif text-dark">02437621788</p>
                        <p class="text-sm text-gray-400 mt-2">{{ t('contact_view.quick_consult') }}</p>
                    </div>
                </div>

                <!-- Work Hours at Bottom of Left Col -->
                <div class="mt-12 pt-12 border-t border-gray-200">
                    <h3 class="font-serif text-xl text-dark mb-4 flex items-center gap-2">
                        <ClockIcon class="w-5 h-5 text-gray-400" />
                        {{ t('contact_view.working_hours') }}
                    </h3>
                     <ul class="space-y-2 text-sm text-gray-500 font-mono">
                        <li class="flex justify-between">
                            <span>{{ t('contact_view.days.weekdays') }}</span>
                            <span class="text-dark">8:00 - 17:30</span>
                        </li>
                        <li class="flex justify-between">
                            <span>{{ t('contact_view.days.saturday') }}</span>
                            <span class="text-dark">8:00 - 12:00</span>
                        </li>
                         <li class="flex justify-between text-red-400">
                            <span>{{ t('contact_view.days.sunday') }}</span>
                            <span>{{ t('contact_view.days.closed') }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- RIGHT COLUMN: Form Area (Col-span-8) -->
            <div class="lg:col-span-8 p-12 lg:p-20 bg-white relative">
                
                <!-- Success State -->
                <div v-if="isSuccess" class="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center p-12 animate-fade-in text-center">
                    <CheckCircleIcon class="w-20 h-20 text-green-500 mb-6" />
                    <h2 class="text-4xl font-serif text-dark mb-4">{{ t('contact_view.success_title') }}</h2>
                    <p class="text-gray-500 text-lg mb-8">{{ t('contact_view.success_desc') }}</p>
                    <button @click="resetForm" class="bg-black text-white uppercase tracking-widest px-8 py-4 hover:bg-primary transition duration-500 text-sm font-bold">
                        {{ t('contact_view.success_btn') }}
                    </button>
                </div>

                <!-- Form Inputs -->
                <div v-else>
                    <h2 class="text-4xl font-serif text-dark mb-12">{{ t('contact_view.form_title') }}</h2>
                    
                    <form @submit.prevent="handleSubmit" class="space-y-12">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div class="group relative">
                                <input v-model="form.name" type="text" required placeholder=" "
                                    class="peer w-full border-b border-gray-300 py-4 focus:border-black outline-none transition-all duration-300 bg-transparent text-dark placeholder-transparent">
                                <label class="absolute left-0 top-4 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-black peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-black pointer-events-none">
                                    {{ t('contact_view.form.name') }}
                                </label>
                            </div>
                            <div class="group relative">
                                <input v-model="form.email" type="email" required placeholder=" "
                                    class="peer w-full border-b border-gray-300 py-4 focus:border-black outline-none transition-all duration-300 bg-transparent text-dark placeholder-transparent">
                                <label class="absolute left-0 top-4 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-black peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-black pointer-events-none">
                                    {{ t('contact_view.form.email') }}
                                </label>
                            </div>
                        </div>

                        <div class="group relative">
                            <input v-model="form.subject" type="text" placeholder=" "
                                class="peer w-full border-b border-gray-300 py-4 focus:border-black outline-none transition-all duration-300 bg-transparent text-dark placeholder-transparent">
                             <label class="absolute left-0 top-4 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-black peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-black pointer-events-none">
                                {{ t('contact_view.form.subject') }}
                            </label>
                        </div>
                        
                        <div class="group relative">
                            <textarea v-model="form.message" rows="4" required placeholder=" "
                                class="peer w-full border-b border-gray-300 py-4 focus:border-black outline-none transition-all duration-300 bg-transparent text-dark placeholder-transparent resize-none"></textarea>
                            <label class="absolute left-0 top-4 text-gray-400 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-black peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-black pointer-events-none">
                                {{ t('contact_view.form.message') }}
                            </label>
                        </div>

                        <div class="pt-6">
                            <button type="submit" :disabled="isSubmitting"
                                class="bg-black text-white uppercase tracking-widest px-10 py-5 hover:bg-primary transition duration-500 text-sm font-bold w-full md:w-auto disabled:opacity-50 flex items-center justify-center gap-3">
                                <span v-if="isSubmitting" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                                {{ isSubmitting ? t('contact_view.form.submitting') : t('contact_view.form.submit') }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- 3. Architectural Map Section (Split Layout) -->
    <section class="w-full h-auto lg:h-[500px] flex flex-col lg:flex-row mb-0">
        <!-- Left: Building Image -->
        <div class="w-full lg:w-1/2 h-80 lg:h-full relative overflow-hidden">
             <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                 class="w-full h-full object-cover grayscale-[50%]" 
                 :alt="t('contact_view.map_alt')">
             <div class="absolute inset-0 bg-black/10"></div>
        </div>

        <!-- Right: Map -->
        <div class="w-full lg:w-1/2 h-80 lg:h-full grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0969459558376!2d105.82499957489095!3d21.02877848062789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab7f6f8a2e23%3A0x9c9fdb0a1a97e0c1!2s38%20P.%20Kim%20M%C3%A3%2C%20Kim%20M%C3%A3%2C%20Ba%20%C4%90%C3%ACnh%2C%20H%C3%A0%20N%E1%BB%99i%2C%20Vietnam!5e0!3m2!1sen!2s!4v1706633175000!5m2!1sen!2s" 
                class="w-full h-full border-0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
    </section>

  </div>
</template>
