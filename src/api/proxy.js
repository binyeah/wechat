// import fetch  from './index'
import Axios from './index';
const api = {};

// 登录
api.login= params => Axios.get('/login', params);
  
// 搜索用户
api.getUserList= params => Axios.get('/getUserList', params);

// 获取好友列表
api.getFriendList= params => Axios.get('/getFriendList', params);

// 添加好友
api.addFriend= params => Axios.post('/addFriend', params);

// 删除好友
api.deleteFriend= params => Axios.post('/deleteFriend', params);

// 注销
api.writeOff= params => Axios.post('/writeOff', params);

api.ws = `ws://${window.location.hostname}:3000/koa/ws`
export default api;