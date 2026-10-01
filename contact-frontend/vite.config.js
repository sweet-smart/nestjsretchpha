import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'

const frontendDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const rootEnv = loadEnv(mode, resolve(frontendDir, '..'), '')

  return {
    plugins: [react()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    define: {
      'import.meta.env.VITE_RECAPTCHA_SITE_KEY': JSON.stringify(
        rootEnv.RECAPTCHA_SITE_KEY || '',
      ),
    },
  }
})
