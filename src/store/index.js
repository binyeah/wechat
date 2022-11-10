import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import chat from './modules/chat'
export default new Vuex.Store({
	modules: {
		chat
	}
});