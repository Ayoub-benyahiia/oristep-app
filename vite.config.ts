import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Keep preview working
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true'
    },
    build: {
      // Raise the warning threshold — Android WebView handles this well
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          // Function form is required to intercept React internals by file path
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            // Animation library — heaviest dep, split first
            if (id.includes('motion')) return 'vendor-motion';
            // Lucide icons — large static set
            if (id.includes('lucide')) return 'vendor-icons';
            // Router (includes @remix-run internals)
            if (id.includes('react-router') || id.includes('@remix-run')) return 'vendor-router';
            // React core + react-dom — must come after specifics
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('react/jsx')) return 'vendor-react';
            // All other node_modules (scheduler, clsx, etc.)
            return 'vendor-misc';
          },
        },
      },
    },
  };
});
