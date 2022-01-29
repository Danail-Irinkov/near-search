import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// @ts-ignore
import WindiCSS from 'vite-plugin-windicss'

// @ts-ignore
console.log('import.meta.env.LOCAL_API', process.env.LOCAL_API)
let VITE_ENV: any = {}
VITE_ENV["API_URL"] = JSON.stringify("https://us-central1-near-search-3807d.cloudfunctions.net")
// @ts-ignore
if (process.env.LOCAL_API) {
	VITE_ENV["API_URL"] = JSON.stringify("http://localhost:5001/near-search-3807d/us-central1")
}

console.log('VITE_ENV', VITE_ENV)

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve()
		},
	},
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
