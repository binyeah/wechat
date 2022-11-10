import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
	routes: [
		{
			path: '/login',
			name: 'login',
			component: () => import('@/view/login'),
			meta: {
				title: '登录'
			}
		},
		{
			path: '/',
			name: 'home',
			component: () => import('@/view/home'),
			meta: {
				title: '首页'
			}
		},
		{
			path: '/userList',
			name: 'userList',
			component: () => import('@/view/userList'),
			meta: {
				title: '通讯录'
			}
		},
		{
			path: '/chatRoom',
			name: 'chatRoom',
			component: () => import('@/view/chatRoom'),
			meta: {
				title: '聊天室'
			}
		},
		{
			path: '/setting',
			name: 'setting',
			component: () => import('@/view/setting'),
			meta: {
				title: '设置'
			}
		},
		{
			path: '/newFriend',
			name: 'newFriend',
			component: () => import('@/view/newFriend'),
			meta: {
				title: '新朋友'
			}
		},
	]
})
router.beforeEach((to, from, next) => {
	// console.log(to,from)
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
		document.title = to.meta.title
	}
	const user = localStorage.getItem('user')
	if (!user && to.path!=='/login') {
		next({
			path: '/login'
		})
		return
	}
	next()
})

export default router