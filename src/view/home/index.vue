<template>
  <div class="home" ref="page">
		<ul class="chat-list">
			<van-swipe-cell v-for="(item, index) in chatList" :key="index">
				<li class="item" @click="goChatRoom(item)">
					<div class="avator">
						<div class="point" v-if="!item.isRead"></div>
						{{ item.username.substring(0,1) }}
					</div>
					<div class="msg-content">
						<p class="user-name">{{ item.username }}</p>
						<p class="msg">{{ formatMsg(item.chatList) }}</p>
					</div>
				</li>
				<template #right>
					<van-button square text="删除" type="danger" class="delete-button" @click="delChat(index)"/>
				</template>
			</van-swipe-cell>
    </ul>
	</div>
</template>
<script>
import { mapMutations } from 'vuex'
import api from '@/api/proxy.js';
export default {
  data () {
    return {
      socket: "",
			chatList: []
    };
  },
	computed: {
		unReadMsg () {
			const chatList = this.chatList.filter(v => !v.isRead)
			// console.log(chatList);
			return chatList.length
		}
	},
	watch: {
		unReadMsg: {
			handler (val) {
				this.setUnReadMsg(val)
			},
			deep:true
		}
	},
  created () {
		const chatList = localStorage.getItem('chatList')
		if (chatList) {
			this.chatList = JSON.parse(chatList)
		}
    this.initws();
  },
  methods: {
		...mapMutations(['setUnReadMsg']),
    initws () {
      if (typeof WebSocket === "undefined") {
        this.$toast("您的浏览器不支持socket");
        // alert("您的浏览器不支持socket")
      } else {
        // 实例化socket
        const user = JSON.parse(localStorage.getItem('user'))
        const { id = '' } = user
        this.socket = new WebSocket(`${api.ws}?id=${id}`);
        // console.log(this.socket)
        // 监听socket连接
        this.socket.onopen = this.openchat;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    openchat () {
      console.log("socket连接成功")
      // this.socket.send('socket连接成功');
    },
    error () {
      console.log("连接错误");
    },
    getMessage (e) {
      const { data } = e
      // console.log(JSON.parse(data))
			const newMsg = JSON.parse(data)
			this.updateMsgList(newMsg)
    },
		updateMsgList (item) {
			const isOrdUser = this.chatList.find(v => v.uId == item.uId)
			if (isOrdUser) {
				const userIndex = this.chatList.findIndex(v => v.uId == item.uId)
				const { chatList = [] } = isOrdUser
				chatList.push({u:item.content})
				const newData = {
					...isOrdUser,
					isRead:false
				}
				this.chatList.splice(userIndex,1,newData)
				localStorage.setItem('chatList', JSON.stringify(this.chatList))
				return
			}
			const newData = {
				username: item.uName,
				uId: item.uId,
				chatList:[{u:item.content}],
				isRead: false
			}
			this.chatList.unshift(newData)
			localStorage.setItem('chatList', JSON.stringify(this.chatList))
		},
		goChatRoom (item) {
			const userIndex = this.chatList.findIndex(v => v.uId == item.uId)
			const newData = {
				...this.chatList[userIndex],
				isRead:true
			}
			this.chatList.splice(userIndex,1,newData)
			localStorage.setItem('chatList', JSON.stringify(this.chatList))
			this.$router.push({
				name: 'chatRoom',
				query: {
					id:item.uId
				}
			})
		},
		formatMsg (msg) {
			if (!msg || !msg.length) return ''
			const lastMsg =  msg[msg.length-1]
			return lastMsg.u || lastMsg.m
		},
		delChat (i) {
			this.chatList.splice(i,1)
			localStorage.setItem('chatList', JSON.stringify(this.chatList))
		}
  },
  beforeDestroy () {
    // 销毁监听
    if (this.socket) {
      this.socket = null
    }
  },
};
</script>
<style lang="scss" scoped>
.home {
	width: 100%;
	padding-bottom: 1.2rem;
	.chat-list {
		width: 100%;
		background-color: #fff;
		.item{
			width: 100%;
			height: 1.2rem;
			border-bottom: .01rem solid #eee;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: .1rem;
			.avator {
				width: .8rem;
				height: .8rem;
				background-color: #eee;
				line-height: .8rem;
				text-align: center;
				color: #fff;
				border-radius: .1rem;
				font-size: .36rem;
				position: relative;
				.point {
					width: .15rem;
					height: .15rem;
					border-radius: 50%;
					background-color: red;
					position: absolute;
					right: -.03rem;
					top: -.03rem;
				}
			}
			.msg-content {
				width: calc(100% - 1rem);
				// height: 100%;
				.user-name {
					width: 100%;
					font-size: .28rem;
					overflow:hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.msg {
					font-size: .24rem;
					width: 100%;
					overflow:hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #666;
				}
			}
		}
	}
	.delete-button {
    height: 100%;
  }
}
</style>