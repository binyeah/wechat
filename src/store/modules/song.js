const state={
    playingSongId:null,  //正在播放的歌曲id
};
const getters={
  renderId(state){ 
    return state.playingSongId;
  },
};
const mutations={
     setId(state,id){ 
        state.playingSongId = id
     },
 };
const actions={
    setNewId(context,id){ 
        context.commit('setId',id);
    },
};
export default {
     namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
     state,
     getters,
     mutations,
     actions
}