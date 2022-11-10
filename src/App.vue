<template>
  <div id="app">
    <!-- <keep-alive>
      
    </keep-alive> -->
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
    <van-tabbar route safe-area-inset-bottom v-if="isShowTabbar">
      <van-tabbar-item replace to="/" icon="chat-o" :badge="badge">首页</van-tabbar-item>
      <van-tabbar-item replace to="/userList" icon="friends-o">通讯录</van-tabbar-item>
      <van-tabbar-item replace to="/setting" icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  components: {

  },
  data() {
    return {
      
    }
  },
  computed:{
    ...mapGetters(['unReadMsgs']),
    badge () {
      // console.log(this.unReadMsgs);
      return this.unReadMsgs ? this.unReadMsgs : ''
    },
    isShowTabbar(){
      const pathList = ["/", "/setting", "/userList"];
      return pathList.includes(this.$route.path)
    }
  },
  mounted() {
    
  },
  methods: {
    
  },
}
</script>