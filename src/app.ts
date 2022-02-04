import 'virtual:windi.css'
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

if (window) {
	// @ts-ignore
	window.Buffer = Buffer
}
import TextAreaAutosize from './components/Inputs/TextAreaAutosize.vue'
import ExpandHeightTransition from './components/Transitions/ExpandHeightTransition.vue'
import AutoLinker from 'autolinker'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch, faTimes, faSpinner, faChevronRight, faChevronDown,
	faCircleNotch, faPlay, faListUl, faHandHoldingUsd, faClipboardList,
	faReceipt, faStopwatch, faCog } from '@fortawesome/free-solid-svg-icons'

library.add(faSearch, faTimes, faSpinner, faChevronRight, faChevronDown,
	faCircleNotch, faPlay, faListUl, faHandHoldingUsd, faClipboardList,
	faReceipt, faStopwatch, faCog )

// @ts-ignore
import tooltipDirective from "./directives/tooltip";

// Global Methods
const autoLinkText = function (text: string, linkClass = 'descriptionLink') {
	return AutoLinker.link(text, {
		newWindow: true,
		className: linkClass,
		truncate: { length: 36, location: 'smart' }
	});
}
const openLinkNewTab = (URL = null) => {
	if (URL)
		window.open(URL, '_blank')
}

let app = createApp(App)
  .use(router)
  .use(createPinia())
  .use(head)
	.use(VueAxios, axios)
	.provide('$autoLinkText', autoLinkText)
	.provide('openLinkNewTab', openLinkNewTab)
	.component('fa-icon', FontAwesomeIcon)
	.component('textarea-auto', TextAreaAutosize)
	.component('expand-height-transition', ExpandHeightTransition)

tooltipDirective(app)

app.mount("#app")
