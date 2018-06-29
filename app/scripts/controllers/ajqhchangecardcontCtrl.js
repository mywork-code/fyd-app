'use strict';
var app = angular.module('gfbApp');

/**
 * 《关于变更还款卡号的补充协议》、《关于变更放款卡号的补充协议》、《个人客户扣款授权书》
 */
app.controller('ajqhchangecardcontCtrl',function($routeParams,$scope,$window,$location,Constant,UserInfo,ngUtils,BindBankService,ContractInfo,BindCardObject,RepaceBindCardObject){
	ngUtils.loadingAlert();
	$scope.flag = true;
	UserInfo.mobile=$routeParams.mobile;
	$scope.isSign = $routeParams.isSign;
//	UserInfo.customerId=$routeParams.customerId;
	// UserInfo.changeCardFlag=$routeParams.changeCardFlag;
	// $scope.isAgreeFinish=$routeParams.isAgreeFinish;//是否需要签字，控制显示电子签名 false true
//	UserInfo.sltAccountId=$routeParams.sltAccountId;
	RepaceBindCardObject.cardBank=$routeParams.cardBank;
	RepaceBindCardObject.cardNo=$routeParams.cardNo;
	$('#signaturePage').hide();
	
	if($routeParams.customerId==null||$routeParams.customerId==undefined){//ios
		try {
			var platform = window.Android || window;
			var json=platform.getIdentityInfo();
			json = eval("(" + json + ")");
			UserInfo.customerId=json.customerId;
			UserInfo.sltAccountId=json.sltAccountId;
		}catch (e) {
		}
	}else{//android
		UserInfo.customerId=$routeParams.customerId;
		UserInfo.sltAccountId=$routeParams.sltAccountId;
	}
	
	//判断是否是新版本app
	if($routeParams.isNewApp==null||$routeParams.isNewApp==undefined){//ios
		try {
			var platform = window.Android || window;
			var json=platform.getIdentityInfo();
			json = eval("(" + json + ")");
			$scope.isNewApp=json.isNewApp;
		}catch (e) {
		}
	}else{//android
		$scope.isNewApp = $routeParams.isNewApp;
	}
	
	//临时银行信息
	UserInfo.tempCardNo=$routeParams.cardNo;
	UserInfo.tempCardBank=$routeParams.cardBank;
	var token=$routeParams.token;
	$window.localStorage.setItem("x-auth-token", token);
	
	//获取签字判断相关字段
	// UserInfo.signFailureNum=$routeParams.signFailureNum;				//签字失败次数
	// UserInfo.signatureAuditStatus=$routeParams.signatureAuditStatus;	// 授信阶段有效签字人工审核的状态
	// UserInfo.signatureType=3;	
	//if($scope.isNewApp != '1'){//旧app
	//	if( UserInfo.signatureAuditStatus==null||UserInfo.signatureAuditStatus==undefined || UserInfo.signFailureNum==null ||  UserInfo.signFailureNum==undefined  ){//ios
	//		try {
	//			var platform = window.Android || window;
	//			var json=platform.getSginature();
	//			json = eval("(" + json + ")");
	//			UserInfo.signFailureNum=json.signFailureNum;
	//			UserInfo.signatureAuditStatus=json.signatureAuditStatus;
	//		}catch(e){
	//
	//		}
	//
	//	}
	//
	//	//签字审核中跳转至等待页
	//	if(UserInfo.signatureAuditStatus=='0'){
	//		if(UserInfo.signatureType==3){
	//			var platform = window.Android || window;
	//			platform.setTitle("");
	//		}
	//		$location.url("/signatureAuditWaiting");
	//	}
	//}
	
	
	
	
	//换卡合同初始化数据
	$scope.flag = false; //是否显示新老合同，true新，false老
	BindBankService.getChangeCardContInfo($scope);
	
	$scope.ContractInfo = ContractInfo;
	$scope.UserInfo = UserInfo;
	$scope.RepaceBindCardObject = RepaceBindCardObject;
	
	//初始化签署换卡合同的日期
	var now = new Date();
	$scope.contractSignData = now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate()+'日 ';
	// 同意
	$scope.agree=function(){
		//检验是否网络中断    如果中断弹出提示
		if(window.navigator.onLine==false){
			ngUtils.alert("网络连接错误，请检查网络连接");
			 return;
		}
	    $location.url("/weixingSingature?mobile="+$routeParams.mobile+"&name="+$routeParams.name+"&token="+$routeParams.token);

		// UserInfo.repaceSupplemental=true;
		// RepaceBindCardObject.agreeContractFlag=true;
		// UserInfo.deductAuth=true;
		// var callSina = {
		// 	'realName':UserInfo.realName,
		// 	'desc':'changeCard',
		// 	'customerId':UserInfo.customerId,
		// 	'sltAccountId':UserInfo.sltAccountId,
		// 	'signatureType':'3'
		// };
		// callSina = JSON.stringify(callSina);
		// var platform = window.Android || window;
		// platform.startSignature(callSina);
	}
	
	// 不同意
	$scope.cancel=function(){
		//换卡页面取消签署变更借记卡卡号协议
	   if(window.__wxjs_environment === 'miniprogram') {
			wx.miniProgram.navigateBack();
		} else {
			// statements
			//换卡页面取消签署变更借记卡卡号协议
			UserInfo.repaceSupplemental=false;
			RepaceBindCardObject.agreeContractFlag=false;
			UserInfo.deductAuth=false;
	        var platform = window.Android || window;
		    platform.finishSelf();			
		}		
		// try {
		// 	wx.miniProgram.navigateBack();
		// } catch(e) {
		// 	// statements
		// 	//换卡页面取消签署变更借记卡卡号协议
		// 	UserInfo.repaceSupplemental=false;
		// 	RepaceBindCardObject.agreeContractFlag=false;
		// 	UserInfo.deductAuth=false;
		// 	//第一个合同取消时返回到app
		// 	var platform = window.Android || window;
		// 	platform.gotoChangeBankCard("","","","");
		// }
		
	}
	
	//返回到app页面
	// $scope.goBackToChangeCard=function(){
	// 	UserInfo.changeCardFlag=1;
	// 	var platform = window.Android || window;
	// 	platform.gotoChangeBankCard("","","","");
	// }
});