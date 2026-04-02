<script setup>
import { notificationState } from '../composables/useNotification'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <Teleport to="body">
    <!-- Toasts / Alerts Nổi ở góc trên -->
    <div class="fixed top-6 right-6 z-[10000] flex flex-col gap-3 items-end pointer-events-none">
      <TransitionGroup name="toast">
        <div v-for="alert in notificationState.alerts" :key="alert.id"
             class="pointer-events-auto min-w-[280px] max-w-sm p-4 bg-white border border-gray-200 shadow-xl flex items-start gap-4 relative overflow-hidden group">
          
          <div class="absolute left-0 top-0 bottom-0 w-1.5 transition-all" :class="alert.type === 'error' ? 'bg-red-500' : 'bg-green-500'"></div>
          
          <div class="mt-0.5 pl-1">
            <ExclamationTriangleIcon v-if="alert.type === 'error'" class="w-6 h-6 text-red-500" />
            <CheckCircleIcon v-else class="w-6 h-6 text-green-500" />
          </div>
          <div class="flex-1 pr-6">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
              {{ alert.type === 'error' ? 'Thông báo có lỗi' : 'Thành công' }}
            </h4>
            <p class="text-sm font-bold text-dark leading-tight">{{ alert.message }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Confirm Dialog Box Giữa Màn Hình -->
    <Transition name="fade">
      <div v-if="notificationState.confirmDialog" class="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white max-w-md w-full shadow-2xl overflow-hidden animate-fade-in-up">
          <div class="h-2 w-full bg-red-500"></div>
          <div class="p-8">
            <div class="flex items-center gap-4 mb-4">
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <ExclamationTriangleIcon class="w-6 h-6 text-red-600"/>
                </div>
                <h3 class="text-xl font-black text-dark">Lưu ý thao tác</h3>
            </div>
            
            <p class="text-sm text-gray-600 mb-8 font-medium leading-relaxed">
                {{ notificationState.confirmDialog.message }}
            </p>
            
            <div class="flex gap-3 justify-end">
              <button @click="notificationState.confirmDialog.resolve(false)" class="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 hover:text-black transition-colors rounded">
                HUỶ
              </button>
              <button @click="notificationState.confirmDialog.resolve(true)" class="bg-red-500 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors shadow-sm rounded">
                ĐỒNG Ý
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-enter-from { opacity: 0; transform: translateX(100%) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateY(-20px) scale(0.9); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
