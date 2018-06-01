'use strict';
var app = angular.module('gfbApp');

// 征信报告获取后，处理手机详单尚未获取
app.controller('CreditMobileCtrl', function ($scope,$location,Constant,UserInfo,ZhengxinInfo,CreditService,CommonService,ngUtils) {
	$scope.UserInfo=UserInfo;
	/**
	 * 页面刷新，获取客户最新状态，并根据结果判断跳转
	 */
	$scope.reflesh = function(){
		// 查询用户手机详单状态
		CreditService.queryMobileInfo();
	}
	
	/**
	 * 继续做决策
	 */
	$scope.gotoDecition = function(){
		// 将征信激活码及验证码 设置为特殊值
		ZhengxinInfo.activeCode = "special";
		ZhengxinInfo.vercode = "special";
		ZhengxinInfo.token = "special";
		// 调用决策接口
		CreditService.submitActiveCode();
	}
	
	/**
	 * 手机认证失败，重新获取额度
	 */	
	$scope.repeatApplyAmt = function(){
		CommonService.reApplyAmt();
	}	
});
