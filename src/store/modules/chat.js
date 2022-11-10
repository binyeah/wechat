const state={
  unReadMsg: 0,  //未读消息数量
};
const getters={
  unReadMsgs (state) {
    return state.unReadMsg
  } 
  
};
const mutations={
   setUnReadMsg (state,num) { 
      state.unReadMsg = num
   },
};

export default {
  //  namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
   state,
   getters,
   mutations
}