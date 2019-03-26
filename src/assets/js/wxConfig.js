import sha1 from 'js-sha1';
import wx from 'weixin-js-sdk';
import axios from 'axios';
import Store from '@/store/store'

let wxConfig = () => {
	let wechat_id = 100;
	axios.get(`https://${Store.state.systemInfo.postUrl}/wechat/jsapi_ticket?wechat_official_account_id=${wechat_id}`).then((res) => {
		let timestamp = Math.floor(new Date().getTime() / 1000);
		let nonceStr = 'Wm3WZYTPz0wzccnW';
		let appId = 'wxad4d5aeb245c9385'
		let url = location.href.split('#')[0];
		//let url = 'https://dev-live.caizhanfuwu.com/'
		console.log(url);
		let jsapi_ticket = res.data.data.jsapi_ticket;
		let signature = sha1(`jsapi_ticket=${jsapi_ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`);

		wx.config({
			debug: false, // 开启调试模式,
			appId: appId, // 必填，企业号的唯一标识，此处填写企业号corpid
			timestamp: timestamp, // 必填，生成签名的时间戳
			nonceStr: nonceStr, // 必填，生成签名的随机串
			signature: signature, // 必填，签名，见附录1
			jsApiList: ['scanQRCode', 'onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
	})
}

export default wxConfig;
