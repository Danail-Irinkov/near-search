import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import WindiCSS from 'vite-plugin-windicss'

console.log('import.meta.env.LOCAL_API', process.env.LOCAL_API)
let VITE_ENV: any = {}
VITE_ENV["API_URL"] = JSON.stringify("https://europe-west3-near-search-3807d.cloudfunctions.net") // prod

if (process.env.LOCAL_API) {
	VITE_ENV["API_URL"] = JSON.stringify("http://localhost:5001/near-search-3807d/europe-west3") // dev
}

console.log('VITE_ENV', VITE_ENV)
console.log('process.env.NODE_ENV', process.env.NODE_ENV)

// https://vitejs.dev/config/
export default defineConfig({
	mode: process.env.NODE_ENV,
	resolve: {
		// alias: {
		// 	'@': path.resolve()
		// },
	},
	publicDir: 'src/public',
	plugins: [
		vue(),
		WindiCSS()
	],
	optimizeDeps: {
		exclude: ['node-sdk-js'] // <= The libraries that need shimming should be excluded from dependency optimization.
	},
	define: VITE_ENV,
	server: {
		open: '/',
	}
})
