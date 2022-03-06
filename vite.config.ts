import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import WindiCSS from 'vite-plugin-windicss'

import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
	mode: process.env.NODE_ENV,
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		},
	},
	publicDir: 'src/public',
	plugins: [
		vue(),
		WindiCSS(),
		Pages({
			exclude: ['**/components/*.vue']
		}),
		Layouts({
			layoutsDirs: 'src/layouts',
			defaultLayout: 'default'
		}),
		pluginRewriteAll() // allows '.' inside url params
	],
	optimizeDeps: {
		exclude: ['node-sdk-js'] // <= The libraries that need shimming should be excluded from dependency optimization.
	},
	define: { VITE_LOCAL_API: !!process.env.VITE_LOCAL_API },
	server: {
		open: '/?beta=true',
	}
})
