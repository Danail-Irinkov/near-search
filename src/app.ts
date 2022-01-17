import {createApp} from "vue";
import {router} from "./router";
import {store} from "./store";

import App from "./App.vue";
import {createHead} from "@egoist/vue-head";
// import { Buffer } from 'buffer'
const head = createHead();
import axios from 'axios'
import VueAxios from 'vue-axios'
// import stream from 'vite-compatible-readable-stream'

// if (window) {
// 	window.global = {}
// 	window.Buffer = Buffer
// }

createApp(App)
  .use(router)
  .use(store)
  .use(head)
	.use(VueAxios, axios)
  .mount("#app");
