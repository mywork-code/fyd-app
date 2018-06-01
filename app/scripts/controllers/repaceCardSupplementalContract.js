'use strict';
var app = angular.module('gfbApp');

/**
 * 《变更借记卡卡号协议》Ctrl
 */
app.controller('RepaceCardSupplementalContract',function($routeParams,$scope,$window,$location,Constant,UserInfo,ngUtils,BindBankService,ContractInfo,BindCardObject,RepaceBindCardObject){
	UserInfo.mobile=$routeParams.mobile;
	UserInfo.isNewApp=$routeParams.isNewApp;
	UserInfo.customerId=$routeParams.customerId;
	UserInfo.sltAccountId=$routeParams.sltAccountId;
	UserInfo.changeCardFlag=$routeParams.changeCardFlag;
	RepaceBindCardObject.cardBank=$routeParams.cardBank;
	RepaceBindCardObject.cardNo=$routeParams.cardNo;
	var token=$routeParams.xAuthToken;
	$window.localStorage.setItem("x-auth-token", token);
	
	$scope.isWeex = $routeParams.flag == 'weex' ? true : false;
	
	
	//app调用换卡合同的时候先初始化数据
	BindBankService.prepareRepaceBindDataForApp();
	
	$scope.ContractInfo = ContractInfo;
	var cardNo=ContractInfo.cardNo;
	/*ContractInfo.cardNo=cardNo.replace(" ",""); */
	$scope.UserInfo = UserInfo;
	$scope.RepaceBindCardObject = RepaceBindCardObject;
	/**
	 * 同意
	 */
	$scope.agreeSupplementalContract=function(){
		//检验是否网络中断    如果中断弹出提示
		if(window.navigator.onLine==false){
			ngUtils.alert("网络连接错误，请检查网络连接");
			 return;
		}
		//换卡页面签署变更借记卡卡号协议
		UserInfo.repaceSupplemental=true;
		RepaceBindCardObject.agreeContractFlag=true;
		//直接调转到下个合同页面
		$location.url('/deductAuth');
//		history.go(-1);
	}
	/**
	 * 不同意
	 */
	$scope.cancel=function(){
		//换卡页面取消签署变更借记卡卡号协议
		UserInfo.repaceSupplemental=false;
		RepaceBindCardObject.agreeContractFlag=false;
		//第一个合同取消时返回到app
		var platform = window.Android || window;
		platform.gotoChangeBankCard("","");
	}
	
	/**
	 * 只能查看的情况下，查看下个合同
	 */
	$scope.goToNextContract=function(){
		//直接调转到下个合同页面
		$location.url('/deductAuth');
	}
});