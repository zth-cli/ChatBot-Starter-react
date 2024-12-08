import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Inspect(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.md$/ // .md
      ],
      imports: ['react', 'react-router', 'ahooks'],
      eslintrc: {
        enabled: true, // 若没此json文件，先开启，生成后在关闭
        filepath: './.eslintrc-auto-import.json', // 默认
        globalsPropValue: true
      },
      dts: './auto-imports.d.ts',
      dirs: ['src/hooks'],
      vueTemplate: true
    })
  ],
  server: {
    port: 3334,
    host: '0.0.0.0',
    open: true,
    proxy: {
      '/api': {
        target: 'http://10.172.246.206:5002',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
