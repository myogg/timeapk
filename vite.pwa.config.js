import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: '智能工作记录系统',
        short_name: '工作记录',
        description: '现代化工业管理平台，记录和统计工件工时',
        theme_color: '#3B82F6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        categories: ['business', 'productivity'],
        lang: 'zh-CN',
        icons: [
          {
            src: 'https://s3plus.meituan.net/nocode-external/nocode_image/default/68747470733a2f2f67772e616c697061796f626a656374732e636f6d2f7a6f732f6b2f74302f34332e706e67',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://s3plus.meituan.net/nocode-external/nocode_image/default/68747470733a2f2f67772e616c697061796f626a656374732e636f6d2f7a6f732f6b2f74302f34332e706e67',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'https://s3plus.meituan.net/nocode-external/nocode_image/default/68747470733a2f2f67772e616c697061796f626a656374732e636f6d2f7a6f732f6b2f74302f34332e706e67',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshot1.png',
            sizes: '1080x1920',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/nocode\.meituan\.com\/photo\/search/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30天
              }
            }
          }
        ]
      }
    })
  ]
});
