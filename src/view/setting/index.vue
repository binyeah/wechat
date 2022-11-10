<template>
  <div class="page">
    <div class="my-info">
      <div class="avator">
        <img :src="avator" v-if="avator">
        <van-uploader :after-read="afterRead" class="uploader" />
      </div>
      <div class="right" @click="showModel">
        <div>
          <div class="name">{{loginuser.username}}</div>
          <div>ID：{{loginuser.id}}</div>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
    />
  </div>
</template>
<script>
import api from '@/api/proxy.js';
export default {
  data() {
    return {
      avator: '',
      loginuser: '',
      show: false,
      actions: [{type:'logout', name: '退出登录',color: '#0cc160' }, {type:'writeOff', name: '注销账号', color: '#ee0c24' }, {type:'clear', name: '清除缓存' }],
    }
  },
  mounted() {
    this.loginuser = JSON.parse(localStorage.getItem("user"))
  },
  methods: {
    async afterRead (file) {
      this.avator = file.content
    },
    showModel () {
      this.show = true
    },
    async onSelect (item) {
      await this[item.type]()
      this.show = false
    },
    async logout () {
      try {
        setTimeout(() => {
          this.$router.push('/login')
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    },
    async writeOff () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '注销账号后数据将全部清空，是否确认？',
        })
        const user = JSON.parse(localStorage.getItem('user'))
        const params = {
          id:user.id
        }
        await api.writeOff(params)
        this.$toast.success('操作成功')
        localStorage.removeItem('user')
        localStorage.removeItem('chatList')
        setTimeout(() => {
          this.$router.push('/login')
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    },
    async clear () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '是否确认清除？',
        })
        localStorage.removeItem('user')
        localStorage.removeItem('chatList')
        setTimeout(() => {
          this.$router.push('/login')
        }, 1000);
      } catch (error) {
        console.log(error);
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.page {
  .my-info {
    width: 100%;
    height: 2rem;
    background-color: #fff;
    padding: .2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .avator {
      width: 1.5rem;
      height: 1.5rem;
      background-color: #eee;
      border-radius: .2rem;
      position: relative;
      overflow: hidden;
      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .uploader {
        width: 100%;
        height: 100%;
        position: absolute;
        opacity: 0;
      }
    }
    .right {
      width: calc(100% - 1.9rem);
      height: 1.5rem;
      padding: .2rem 0;
      display: flex;
      // align-items: center;
      justify-content: space-between;
      .name{
        font-size: .36rem;
        margin-bottom: .1rem;
      }
    }
  }
}
</style>