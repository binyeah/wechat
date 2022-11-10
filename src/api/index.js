import axios from 'axios'
import Vue from 'vue';
import { Toast } from 'vant';
Vue.use(Toast);

const hostname = window.location.hostname
// 环境的切换
if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = `http://${hostname}:3000`
} else if (process.env.NODE_ENV === 'debug') {
    axios.defaults.baseURL = `http://${hostname}:3000`
} else if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = `http://${hostname}:3000`
}
// http超时
axios.defaults.timeout = 10000;

function request(url,params,method,headers,options){
//   console.log('method',method)
    return new Promise((resolve,reject)=>{
        let data = {}
        // get请求使用params字段
        if(method ==='get')data = {params}
        // post请求使用data字段
        if(method ==='post')data = {data:params}
        axios({
            url,
            method,
            headers,
            ...data,
            ...options,
        }).then((res)=>{
            // 此处作用很大，可以扩展很多功能。
            // 比如对接多个后台，数据结构不一致，可做接口适配器
            // 也可对返回日期/金额/数字等统一做集中处理
            if(res.data.code === 200){
                resolve(res.data);
            }else{
                // 通过配置可关闭错误提示
                // if(options.error)Message.error(res.message);
                Toast(res.data.message)
                reject(res);
            }
        }).catch((error)=>{
          Toast('网络错误，请重试！')
          reject(error);
            // Message.error(error.message)
        }).finally(()=>{
            // loadingInstance.close();
        })
    })
};
export default {
    post(url, data){
        return request(url, data,'post',{
            'Content-Type': 'application/json; charset=UTF-8'
        })
    },
    get(url, data){
        return request(url, data,'get',{
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        })
    },
    postFormData(url, data){
        return request(url, data,'post',{
            'Content-Type': 'multipart/form-data'
        })
    }
}