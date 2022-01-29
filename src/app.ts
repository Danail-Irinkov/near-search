import 'virtual:windi.css'
import {createApp} from "vue"
import {router} from "./router"
import {store} from "./store"

import App from "./App.vue"
import {createHead} from "@egoist/vue-head"
// import { Buffer } from 'buffer'
const head = createHead()
import axios from 'axios'
import VueAxios from 'vue-axios'

import { Buffer } from 'buffer'

if (window) {
	// @ts-ignore
	window.Buffer = Buffer
}


import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSearch, faTimes, faSpinner)


createApp(App)
  .use(router)
  .use(store)
  .use(head)
	.use(VueAxios, axios)
	.component('fa-icon', FontAwesomeIcon)
  .mount("#app")
