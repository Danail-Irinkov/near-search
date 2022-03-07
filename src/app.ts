import {createApp} from "vue"
import {router} from "./router"
import { createPinia } from "pinia";

import App from "./App.vue"
import {createHead} from "@egoist/vue-head"
// import { Buffer } from 'buffer'
const head = createHead()
import axios from 'axios'
import VueAxios from 'vue-axios'

import { Buffer } from 'buffer'
import moment from 'moment'
import globals from './globals'

if (window) {
	// @ts-ignore
	window.Buffer = Buffer

	// @ts-ignore
	if (import.meta.env.VITE_LOCAL_API){
		// @ts-ignore
		window.API_URL = 'http://localhost:5001/near-search-3807d/europe-west3'
	} else {
		// @ts-ignore
		window.API_URL = 'https://europe-west3-near-search-3807d.cloudfunctions.net'
	}
}
import TextAreaAutosize from './components/Inputs/TextAreaAutosize.vue'
import ExpandHeightTransition from './components/Transitions/ExpandHeightTransition.vue'
import AutoLinker from 'autolinker'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch, faTimes, faSpinner, faChevronRight, faChevronDown,
	faCircleNotch, faPlay, faListUl, faHandHoldingUsd, faClipboardList,
	faFunnelDollar,	faReply,
	faReceipt, faStopwatch, faCog } from '@fortawesome/free-solid-svg-icons'

library.add(faSearch, faTimes, faSpinner, faChevronRight, faChevronDown,
	faCircleNotch, faPlay, faListUl, faHandHoldingUsd, faClipboardList,
	faFunnelDollar,	faReply,
	faReceipt, faStopwatch, faCog )

// @ts-ignore
import tooltipDirective from "./directives/tooltip";
import {useStore} from '@/store'


let app = createApp(App)
  .use(router)
  .use(createPinia())
  .use(head)
	.use(VueAxios, axios)
	.component('fa-icon', FontAwesomeIcon)
	.component('textarea-auto', TextAreaAutosize)
	.component('expand-height-transition', ExpandHeightTransition)

tooltipDirective(app)

const state = useStore()
globals.install(app, state)
// @ts-ignore
// app.config.productionTip = false

app.config.globalProperties.$moment = moment
app.config.globalProperties.abbreviateNumber = function(number:number): string {
	let num = Math.round(number)
	let str = String(num)
	if (str.length < 4) {
		return str
	} else if (str.length < 7) {
		return Math.floor(num/1000) + 'K'
	} else {
		return Math.floor(num/1000000) + 'M'
	}
}
app.mount("#app")
