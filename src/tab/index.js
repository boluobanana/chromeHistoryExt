import Vue from 'vue'
import root from './root.vue'
import VCharts from 'v-charts'
Vue.use(VCharts)
Vue.config.productionTip = false
/* eslint-disable no-new */

new Vue({
	el: '#root',
	render: h => h(root)
})
