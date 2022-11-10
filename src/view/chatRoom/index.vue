<template>
  <div class="room">
    <div class="msglist" ref="msglist">
      <ul class="ul">
        <li v-for="(item, index) in msgs" :key="index" class="item">
          <div v-if="item.u" class="left chatCell">
            <div class="left-content">
              <div class="name">{{ userObj.username }}</div>
              <div class="avator">
                {{ userObj.username.substring(0, 1) }}
              </div>
            </div>

            <div>
              <pre class="left-msg">{{ item.u }}</pre>
            </div>
          </div>
          <div v-else class="right chatCell">
            <pre class="right-msg">{{ item.m }}</pre>
            <div class="avator">我</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <textarea
        type="text"
        v-model="msg"
        class="input"
        @keyup.enter="send(msg)"
      ></textarea>
      <div @click="send(msg)" class="btn">发送</div>
    </div>
  </div>
</template>
<script>
import api from '@/api/proxy.js';
export default {
  data () {
    return {
      socket: "",
      msgs: [],
      msg: "",
      loginuser: "",
      receiver: "",
      chatList: [],
      userIndex: null,
      userObj: null
    };
  },
  created () {
    // console.log(this.$route)
    this.initChatUser()
    this.initws();
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.msglist.scrollTop = this.$refs.msglist.scrollHeight
    })
  },
  methods: {
    initChatUser () {
      this.receiver = (this.$route.query || {}).id;
      const chatList = localStorage.getItem('chatList')
      if (chatList) {
        this.chatList = JSON.parse(chatList)
      } else {
        this.chatList = []
      }
      this.userIndex = this.chatList.findIndex(v => v.uId == this.receiver)
      // console.log(this.userIndex);
      // console.log(this.chatList);
      if (this.userIndex !== -1) {
        this.userObj = this.chatList[this.userIndex]
        document.title = this.userObj.username;
      }
      this.msgs = this.chatList[this.userIndex].chatList
      // console.log(this.chatList[this.userIndex]);
      this.loginuser = JSON.parse(localStorage.getItem("user"));
      this.$nextTick(() => {
        this.$refs.msglist.scrollTop = this.$refs.msglist.scrollHeight
      })
    },
    initws() {
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
    openchat() {
      // console.log("socket连接成功")
    },
    error() {
      console.log("连接错误");
    },
    getMessage(e) {
      const resData = JSON.parse(e.data)
      this.msgs.push({ u: resData.content})
      this.updateMsgList()
    },
    send(content) {
      if (content) {
        var data = {
            mName: this.loginuser.username,
            mId: this.loginuser.id,
            uId: this.userObj.uId,
            content,
        }
        this.socket.send(JSON.stringify(data))
        this.msgs.push({ m: content});
        this.msg = "";
        this.updateMsgList()
      }
    },
    updateMsgList () {
      const newData = {
        ...this.chatList[this.userIndex],
        chatList: this.msgs
      }
      this.chatList.splice(this.userIndex,1,newData)
      // console.log(this.chatList);
      localStorage.setItem('chatList', JSON.stringify(this.chatList))
		},
  },
  beforeDestroy () {
    // 销毁监听
    if (this.socket) {
      this.socket = null;
    }
  },
};
</script>
<style lang="scss" scoped>
.room {
  width: 100%;
  height: 100vh;
  // overflow: hidden;
  // position: absolute;
  // background-color: pink;
  // margin: 20px auto;
  display: flex;
  flex-direction: column;
  .msglist {
    width: 100%;
    height: 100%;
    // margin-bottom: 1.2rem;
    padding: 0.2rem 0;
    background-color: #f5f5f5;
    // background-color: greenyellow;
    // border: 1px solid #ccc;
    overflow-y: scroll;
    // border-radius: .1rem;
    // padding: .1rem;
    .item {
      display: block;
      padding: 0.1rem 0.2rem;
      height: auto;
      width: 100%;
      overflow: hidden;
      font-size: 0.3rem;
      // background-color: red;
      position: relative;
      margin-bottom: 0.2rem;
      .right {
        justify-content: flex-end;
      }
      .chatCell {
        display: flex;
        width: 100%;
        height: auto;
        // background-color: blue;
        .left-content {
          position: relative;
          height: 1.2rem;
          .name {
            // position: absolute;
            // left: 0.2rem;
            // top: -0.2rem;
            text-align: center;
            line-height: 0.3rem;
            font-size: 0.18rem;
          }
        }
        .avator {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 0.1rem;
          background-color: gray;
          font-size: 0.5rem;
          text-align: center;
          line-height: 0.8rem;
          color: #fff;
        }
        .left-msg {
          margin-left: 0.25rem;
          position: relative;
          white-space: normal;
          max-width: 4.5rem;
          float: left;
          padding: 0.2rem;
          border-radius: 0.1rem;
          // text-align: left;
          background-color: #fff;
          word-wrap: break-word;
          // word-break: normal;
          word-break: break-all;
          margin-top: .3rem;
          // white-space: pre-wrap;       /* css-3 */
          // white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
          // white-space: -pre-wrap;      /* Opera 4-6 */
          // white-space: -o-pre-wrap;    /* Opera 7 */
          // word-wrap: break-word;
          // overflow: hidden;
        }
        .left-msg::before {
          content: "";
          border-top: 0.14rem solid transparent;
          border-bottom: 0.14rem solid transparent;
          border-right: 0.18rem solid #fff;
          position: absolute;
          // background-color: #999;
          top: 0.2rem;
          left: -0.16rem;
        }
        .right-msg {
          position: relative;
          white-space: normal;
          max-width: 4.5rem;
          // text-align: right;
          float: right;
          padding: 0.2rem;
          border-radius: 0.1rem;
          margin-right: 0.25rem;
          background-color: greenyellow;
          word-wrap: break-word;
          // word-break: normal;
          word-break: break-all;
          // overflow: hidden;
        }
        .right-msg::after {
          content: "";
          border-left: 0.18rem solid greenyellow;
          border-top: 0.14rem solid transparent;
          border-bottom: 0.14rem solid transparent;
          // border-right: 9px solid #999;
          position: absolute;
          // background-color: #999;
          top: 0.2rem;
          right: -0.16rem;
        }
      }
    }
  }
  .bottom {
    flex: 1;
    width: 100%;
    // height: 1.2rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: .2rem 0.1rem;
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // z-index: 99;
    .input {
      border: 1px solid #999;
      width: calc(100% - 1.8rem);
      height: 0.8rem;
      // margin: .1rem;
      border-radius: 0.05rem;
      padding: 0.1rem;
      outline: none;
      font-size: 0.28rem;
      line-height: 0.28rem;
    }
    .btn {
      width: 1.5rem;
      height: 0.8rem;
      // margin: .1rem;
      cursor: pointer;
      background-color: #67c23a;
      color: #fff;
      border-radius: 0.05rem;
      font-size: 0.4rem;
      text-align: center;
      line-height: 0.8rem;
    }
  }
}
</style>