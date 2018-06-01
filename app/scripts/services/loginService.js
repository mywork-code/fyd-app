
'use strict';

var app=angular.module("gfbApp");
/**
 *登录services
 */
app.factory("LoginService",function($window,$resource,$location,$rootScope,Constant,UserInfo,ngUtils,RegisterInfo) {
	return {

		/**
		 * 登录操作
		 */
		loginAction : function() {
			var path = Constant.APIRoot + "/operation/login";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				username : ngUtils.trimA(RegisterInfo.account),
				password : RegisterInfo.password,
				source:"H5"
			};
			console.log(params)
			ngUtils.addLoading();
			service.connect(params, function(response) {
				ngUtils.closeLoading();
				console.log(response)
				if (response && response.status == "1") {
					// 登录成功，token存在localStorage中

					UserInfo.mobile = ngUtils.trimA(RegisterInfo.account);
					UserInfo.xAuthToken = response.data.token;
					// 登录成功 跳转首页
					$location.url("/order").replace();
				} else {
					if(response.data.operationResult==false){
						RegisterInfo.password="";
						ngUtils.alert(response.data.displayInfo);
					}else{
						//登录失败
						ngUtils.alert("登录失败，请重新尝试。");
					}
				}
			}, function(error) {
				ngUtils.closeLoading();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		}
	}
});

