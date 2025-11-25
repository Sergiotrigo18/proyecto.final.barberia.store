import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    server: {
      port: 5177,
      proxy: {
        '/xano-store': {
          target: env.VITE_XANO_STORE_BASE,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/xano-store/, ''),
        },
        '/xano-auth': {
          target: env.VITE_XANO_AUTH_BASE,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/xano-auth/, ''),
        },
      },
    },
  }
})
