const viteConfig = `// Vite configuration for Auth0 ACUL projects
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Configure plugins to handle JSX in both .js and .jsx files
  plugins: [
    react({
      // This enables JSX in both .js and .jsx files
      include: '**/*.{jsx,js}',
      // Ensure JSX works as expected
      jsxRuntime: 'automatic'
    })
  ],
  
  // Configure builds specifically for Auth0 ACUL
  build: {
    rollupOptions: {
      input: {
        // Input entries for all ACUL screens
        // These will match what Auth0 is looking for
        'index': resolve(__dirname, 'index.html'),
        'login-id': resolve(__dirname, 'login-id.html'),
        'signup-id': resolve(__dirname, 'signup-id.html'),
        'password-reset': resolve(__dirname, 'password-reset.html'),
        'passkey-enrollment': resolve(__dirname, 'passkey-enrollment.html')
      },
      output: {
        // Critical: Export format that Auth0 ACUL requires
        format: 'umd',
        entryFileNames: '[name].js',
        // Auth0 ACUL requires this specific export name
        name: 'default',
        exports: 'default'
      }
    },
    // Extract CSS to separate files for better performance
    cssCodeSplit: true,
    sourcemap: true
  },
  
  // Development server configuration
  server: {
    port: 8080,
    open: true,
    // Add CORS headers for Auth0 integration during local development
    cors: true
  },
  
  // Resolve configuration for proper module imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  // Define environment variables to be replaced in the code
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});
`;

module.exports = {
  viteConfig
};
