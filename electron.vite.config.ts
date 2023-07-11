import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// prettier-ignore
export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()]
	},
	preload: {
		plugins: [externalizeDepsPlugin()]
	},
	renderer: {
		resolve: {
			alias: {
				'@renderer': path.resolve('src/renderer/src'),
				'@': path.resolve('/src/renderer/src')
			}
		},
		plugins: [react()]
	}
})
