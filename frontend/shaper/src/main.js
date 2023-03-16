import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'
import jQuery from 'jquery'
import { FeatherIcon } from 'feather-icons'
//import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import "/public/css/app.css"
import "/public/js/app"

const $ = jQuery
window.$ = $

createApp(App).use(router).use(FeatherIcon).mount('#app')
