import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import axios from 'axios'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    async includedRoutes(paths, routes) {
      // 1. Chỉ giữ lại các trang công khai (Bỏ qua admin, login và các đường dẫn động chưa gán slug)
      let staticPaths = paths.filter(path => 
        !path.startsWith('/admin') && 
        !path.startsWith('/login') && 
        !path.includes('/:slug')
      )

      try {
        // 2. Kéo danh sách Bài viết từ server Live
        const { data: postsRes } = await axios.get('https://pat-vn.vercel.app/api/posts?status=live')
        if (postsRes.success && postsRes.data) {
           postsRes.data.forEach(item => staticPaths.push(`/blog/${item.slug}`))
        }

        // 3. Kéo danh sách Dịch vụ từ server Live
        const { data: servicesRes } = await axios.get('https://pat-vn.vercel.app/api/services?status=live')
        if (servicesRes.success && servicesRes.data) {
           servicesRes.data.forEach(item => staticPaths.push(`/services/${item.slug}`))
        }
      } catch (err) {
        console.error("Lỗi khi kéo URL động để build Web tĩnh:", err.message)
      }

      return staticPaths
    }
  }
})
