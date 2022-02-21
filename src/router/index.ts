import {createRouter, createWebHistory} from "vue-router"
// @ts-ignore
import { setupLayouts } from 'virtual:generated-layouts'
// @ts-ignore
import generatedRoutes from 'virtual:generated-pages'

const routerHistory = createWebHistory()
const routes = setupLayouts(generatedRoutes)
export const router = createRouter({
	history: routerHistory,
	routes
})
