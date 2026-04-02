<template>
  <div class="min-h-screen w-full bg-gray-100 flex items-center justify-center font-sans selection:bg-black selection:text-white">
    <!-- Vùng chứa âm bản (Chỉ làm phông nền, phần LoginView sẽ tự do hiển thị bảng Form góc cạnh) -->
    <router-view />
  </div>
</template>

<script setup>
// Không có Navbar hay Root nào làm rò rỉ CSS ở Layout Login này
</script>

<style scoped>
/* Khóa bảo mật CSS */
</style>
