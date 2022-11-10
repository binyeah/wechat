<template>
  <div class="login">
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import api from '@/api/proxy.js';
export default {
  data() {
    return {
      username: '',
      password: '',
      id: ''
    }
  },
  mounted () {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      const { username = '', password = '', id = '' } = user
      this.username = username
      this.password = password
      this.id = id
    }
  },
  methods: {
    async onSubmit(values) {
      try {
        const user = {
          ...values
        }
        const res = await api.login(user)
        const userData = res.data
        localStorage.setItem('user',JSON.stringify(userData))
        this.$toast.success('登录成功')
        setTimeout(() => {
          this.$router.push('/')
        },1000)
      } catch (error) {
        console.log(error);
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.login {
  max-width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .van-form {
    background-color: #fff;
    border-radius: .2rem;
    padding: .2rem;
  }
}
</style>