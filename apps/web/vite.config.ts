import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    // Replace Node.js globals with browser-safe values
    // This prevents "process is not defined" errors in browser
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {},
    'global': 'globalThis',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/App.tsx'),
      name: 'MarketplaceApp',
      fileName: 'app',
      formats: ['es']
    },
    rollupOptions: {
      // Mark React, ReactDOM, and Convex as external (provided by host)
      // This prevents React instance mismatch errors with hooks
      // and ensures tenant apps use the host's ConvexProvider context
      external: ['react', 'react-dom', 'react/jsx-runtime', 'convex/react'],
      output: {
        inlineDynamicImports: true,  // Bundle dynamic imports
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          'convex/react': 'ConvexReact'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@/convex': path.resolve(__dirname, '../../packages/convex'),
      '@': path.resolve(__dirname, './src'),
    }
  }
})
