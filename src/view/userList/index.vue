<template>
  <div class="page">
    <div class="page-menu" @click="goNewFriend">
      <div class="cell">
        <div class="icon">
          <img :src="newFriend" alt="" srcset="">
        </div>
        <div class="title">新朋友</div>
      </div>
      <div class="num" v-if="newFriendNum">+{{newFriendNum}}</div>
    </div>
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh"
    >
      <ul class="user-list">
        <template v-for="(item, index) in userList">
          <van-swipe-cell :key="index" v-if="item.id != loginuser.id">
            <li
              class="item"
              @click="goChatRoom(item)"
            >
              <div class="avator">
                {{ item.username&&item.username.substring(0,1) }}
              </div>
              <div class="msg-content">
                <p class="user-name">{{ item.username }}</p>
              </div>
            </li>
            <template #right>
              <van-button square text="删除" type="danger" class="delete-button" @click="delFriend(item,index)"/>
            </template>
          </van-swipe-cell>
        </template>
      </ul>
    </van-pull-refresh>
  </div>
</template>
<script>
import api from '@/api/proxy.js';
import newFriend from '@/assets/images/newFriend.png'
export default {
  data() {
    return {
      userList: [], //用户列表
      chatList: [], // 聊天记录
      isLoading: false,
      loginuser: '',
      newFriend,
      newFriendNum:0
    }
  },
  mounted() {
    this.loginuser = JSON.parse(localStorage.getItem("user"))
    this.getFriendList()
  },
  methods: {
    async onRefresh () {
      await this.getFriendList()
      this.isLoading = false
    },
    async getFriendList() {
      try {
        const data = {
          id: this.loginuser.id
        }
        const res = await api.getFriendList(data)
        const resData = res.data || []
        this.newFriendNum = resData.filter(v => v.status==0 && v.poster ==1).length
        this.userList = resData.filter(v => v.status == 2)
        this.initChatList()
      } catch (error) {
        console.log(error);
      }
    },
    initChatList () {
      const chatList = localStorage.getItem('chatList')
      if (chatList) {
        this.chatList = JSON.parse(chatList)
      }
    },
    goChatRoom (item) {
			const userIndex = this.chatList.findIndex(v => v.uId == item.id)
      // console.log(item, userIndex);
      if (userIndex !== -1) {
        const newData = {
          ...this.chatList[userIndex],
          isRead:true
        }
        this.chatList.splice(userIndex,1,newData)
      } else {
        const newData = {
          chatList: [],
          uId: item.id,
          username: item.username,
          isRead:true
        }
        this.chatList.push(newData)
      }
			localStorage.setItem('chatList', JSON.stringify(this.chatList))
      // console.log(this.chatList);
      this.$router.push({
				name: 'chatRoom',
				query: {
					id:item.id
				}
			})
		},
    goNewFriend () {
      this.$router.push('/newFriend')
    },
    async delFriend (item,i) {
      console.log(i);
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '是否确认删除？',
        })
        const data = {
          id: this.loginuser.id,
          friendId: item.id
        }
        await api.deleteFriend(data)
        this.$toast.success('删除成功')
        this.getFriendList()
      } catch (error) {
        console.log(error);
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.page {
	width: 100%;
	padding-bottom: 1.2rem;
  .page-menu {
    width: 100%;
    height: 1.2rem;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .1rem;
    border-bottom: 0.01rem solid #eee;
    .cell {
      display: flex;
      align-items: center;
      .icon{
        width: .8rem;
        height: .8rem;
        background-color: greenyellow;
        border-radius: .1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: .6rem;
          height: .6rem;
        }
      }
      .title {
        font-size: .36rem;
        margin-left: .2rem;
      }
    }
    .num {
      background-color: red;  
      height: .4rem;
      border-radius: 50%;
      padding: 0 .1rem;
      line-height: .4rem;
      color: #fff;
    }
  }
  .van-pull-refresh {
    height: calc(100vh - 2.4rem);
  }
	.user-list {
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
					font-size: .36rem;
					overflow:hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}
  .delete-button {
    height: 100%;
  }
}
</style>