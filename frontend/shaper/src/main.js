import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'
import components from './components'
//import jQuery from 'jquery'
//import { FeatherIcon } from 'feather-icons'
//import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import "../public/css/app.css"
import "../public/js/app"

// import "https://code.jquery.com/jquery-3.6.4.min.js"
// import "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-treeview/1.2.0/bootstrap-treeview.min.js"

window.$ = window.jQuery = require('jquery');

const app = createApp(App)

components.components.forEach(component => {
    app.component(component.name, component)
});

app.config.globalProperties.$axios = axios;

app.use(router).mount('#app')
