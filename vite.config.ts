import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      dts: './typings/auto-imports.d.ts',
      vueTemplate: true,
      resolvers: [ArcoResolver({ importStyle: false })],
      dirs: ['./src/utils/*.ts', './src/hooks/*.ts', './src/constants/*.ts'],
      imports: ['vue', 'vue-router', 'pinia']
    }),
    Components({
      dts: './typings/components.d.ts',
      dirs: ['./src/components'],
      resolvers: [
        IconsResolver({
          customCollections: ['icons']
        }),
        ArcoResolver({
          importStyle: false,
          sideEffect: true
        })
      ]
    }),
    Icons({
      autoInstall: true,
      compiler: 'vue3',
      jsx: 'react',
      customCollections: {
        icons: FileSystemIconLoader('./src/assets/icons')
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
