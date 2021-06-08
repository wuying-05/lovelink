import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import 'bootstrap-material-design/dist/css/bootstrap-material-design.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import http from './http'
import axios from 'axios'
import VueCropper from 'vue-cropper'
import './main.css'

import request from './request'

// import Vconsole from 'vconsole';
// new Vconsole();
// Vue.use(VueCropper)
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$axios = http
Vue.prototype.$http = axios
Vue.config.performance = true
Vue.prototype.$request = request

Vue.component('remote-script', {

    render: function(createElement) {
        var self = this;
        return createElement('script', {
            attrs: {
                type: 'text/javascript',
                src: this.src
            },
            on: {
                load: function(event) {
                    self.$emit('load', event);
                },
                error: function(event) {
                    self.$emit('error', event);
                },
                readystatechange: function(event) {
                    if (this.readyState == 'complete') {
                        self.$emit('load', event);
                    }
                }
            }
        });
    },

    props: {
        src: {
            type: String,
            required: true
        }
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

document.title = '爱联网'

router.beforeEach((to, from, next) => {
    // 路由发生变化修改页面title
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})
