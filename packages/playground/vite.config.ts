  
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import execa from 'execa'
import path from 'path'

const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

export default defineConfig({
  base: '/vdes-template/playground/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  define: {
    __COMMIT__: JSON.stringify(commit)
  },
})