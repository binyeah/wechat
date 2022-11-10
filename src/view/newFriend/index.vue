<template>
  <div class="page">
    <div>
      <van-search
      v-model="value"
      show-action
      shape="round"
      background="#4fc08d"
      placeholder="请输入好友姓名"
      @search="onSearch"
    >
    <template #action>
      <div @click="onSearch" class="search">搜索</div>
    </template>
    </van-search>
  </div>
  <ul class="user-list" v-if="searchList.length">
      <div class="title">搜索结果</div>
      <template v-for="(item, index) in searchList">
        <li
          :key="index"
          class="item"
        >
          <div class="avator">
            {{ item.username&&item.username.substring(0,1) }}
          </div>
          <div class="msg-content">
            <p class="user-name">{{ item.username }}</p>
            <div class="btn add" @click="addFriend(item,0)">添加</div>
          </div>
        </li>
      </template>
    </ul>
    <ul class="user-list" v-if="userList.length">
      <div class="title">最近申请</div>
      <template v-for="(item, index) in userList">
        <li
          :key="index"
          class="item"
        >
          <div class="avator">
            {{ item.username&&item.username.substring(0,1) }}
          </div>
          <div class="msg-content">
            <p class="user-name">{{ item.username }}</p>
            <div class="btn refuse" @click="addFriend(item,1)" v-if="item.status==0 && item.poster ==1">拒绝</div>
            <div class="btn add" @click="addFriend(item,2)" v-if="item.status==0 && item.poster ==1">同意</div>
            <div class="btn wait" v-if="item.status==0  && item.poster ==0">已申请</div>
            <div class="btn warn" v-if="item.status==1">已拒绝</div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
import api from '@/api/proxy.js';
export default {
  data() {
    return {
      searchList: [],
      userList: [],
      value: '',
      loginuser: ''
    }
  },
  mounted() {
    this.loginuser = JSON.parse(localStorage.getItem("user"))
    this.getFriendList()
  },
  methods: {
    async onSearch () {
      try {
        const data = {
          username: this.value
        }
        const res = await api.getUserList(data)
        this.searchList = res.data || []
      } catch (error) {
        console.log(error);
      }
    },
    async getFriendList() {
      try {
        const data = {
          id: this.loginuser.id
        }
        const res = await api.getFriendList(data)
        const resData = res.data || []
        this.userList = resData.filter(v => v.status != 2)
      } catch (error) {
        console.log(error);
      }
    },
    async addFriend (item,i) {
      try {
        const data = {
          id: this.loginuser.id,
          friendId:item.id,
          status:i
        }
        await api.addFriend(data)
        this.searchList = []
        this.value = ''
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
  .search {
    color: #fff;
  }
  .user-list {
		width: 100%;
		background-color: #fff;
    .title {
      padding-top: .2rem;
      margin: .1rem 0 0 .1rem;
    }
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
        display: flex;
        justify-content: space-between;
        align-items: center;
				// height: 100%;
				.user-name {
					width: 100%;
					font-size: .36rem;
					overflow:hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
        .btn {
          width: 1.2rem;
          height: .5rem;
          border-radius: .1rem;
          color: #fff;
          text-align: center;
          line-height: .5rem;
          font-size: .24rem;
          margin-left: .1rem;
        }
        .add {
          background-color: green;
        }
        .wait {
          background-color: #666;
        }
        .warn {
          background-color: #f56c6c;
        }
        .refuse {
          background-color: #e6a23c;
        }
			}
		}
	}
}
</style>