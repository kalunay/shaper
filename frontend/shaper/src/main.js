import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'
//import jQuery from 'jquery'
import { FeatherIcon } from 'feather-icons'
//import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import "../public/css/app.css"
import "../public/js/app"

// import "https://code.jquery.com/jquery-3.6.4.min.js"
// import "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-treeview/1.2.0/bootstrap-treeview.min.js"

window.$ = window.jQuery = require('jquery');

createApp(App).use(router).use(FeatherIcon).mount('#app')
