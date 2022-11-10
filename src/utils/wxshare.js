import axios from'axios'
import { wxshare } from '@/api/proxy.js'
import wx from 'weixin-js-sdk';

		//要用到微信API								
function getJSSDK(shareUrl,dataForWeixin) {
  axios.post(wxshare,{shareUrl}).then(res => {
    console.log(res);
    //console.log(typeof(res));
    // let response=JSON.parse(res.data);
    // console.log(response)
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: res.data.appId, // 必填，公众号的唯一标识
      timestamp: res.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.data.noncestr, // 必填，生成签名的随机串
      signature: res.data.signature, // 必填，签名
      jsApiList:[
        'onMenuShareTimeline', 
        'onMenuShareAppMessage'
      ] // 必填，需要使用的JS接口列表
    })
    wx.ready(function () {
        //分享给微信朋友
      wx.onMenuShareAppMessage({
        title: dataForWeixin.title,
        desc: dataForWeixin.des,
        link: dataForWeixin.linkurl,
        imgUrl: dataForWeixin.img,
        success: function success(res) {
          console.log('已分享');
        },
        cancel: function cancel(res) {
          console.log('已取消');
        },
        fail: function fail(res) {
          alert(JSON.stringify(res));
        }
      });
      // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
      wx.onMenuShareTimeline({
        title: dataForWeixin.title,
        link: dataForWeixin.linkurl,
        imgUrl: dataForWeixin.img,
        success: function success(res) {
          //alert('已分享');
        },
        cancel: function cancel(res) {
          //alert('已取消');
        },
        fail: function fail(res) {
          alert(JSON.stringify(res));
        }
      });
	// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
    //   wx.onMenuShareQQ({
    //     title: dataForWeixin.title,
    //     desc: dataForWeixin.desc,
    //     link: dataForWeixin.linkurl,
    //     imgUrl: dataForWeixin.img,
    //     trigger: function trigger(res) {
    //       //alert('用户点击分享到QQ');
    //     },
    //     complete: function complete(res) {
    //       alert(JSON.stringify(res));
    //     },
    //     success: function success(res) {
    //       //alert('已分享');
    //     },
    //     cancel: function cancel(res) {
    //       //alert('已取消');
    //     },
    //     fail: function fail(res) {
    //       //alert(JSON.stringify(res));
    //     }
    //   });
      // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
    //   wx.onMenuShareWeibo({
    //     title: dataForWeixin.title,
    //     desc: dataForWeixin.desc,
    //     link: dataForWeixin.linkurl,
    //     imgUrl: dataForWeixin.img,
    //     trigger: function trigger(res) {
    //       //alert('用户点击分享到微博');
    //     },
    //     complete: function complete(res) {
    //       // alert(JSON.stringify(res));
    //     },
    //     success: function success(res) {
    //       //alert('已分享');
    //     },
    //     cancel: function cancel(res) {
    //       // alert('已取消');
    //     },
    //     fail: function fail(res) {
    //     // alert(JSON.stringify(res));
    //     }
    //   });
    })
    wx.error(function (res) {
      alert("微信验证失败");
    });
  })
}
export default {
  // 获取JSSDK
  getJSSDK
}