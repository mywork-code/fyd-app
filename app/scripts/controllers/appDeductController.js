'use strict';
var app = angular.module('gfbApp');
/**
 * app端改卡扣款授权书
 */
app.controller('AppDeductController',function($scope,$routeParams,$location,$window,UserInfo,ContractInfo,RepaceBindCardObject,BindBankService){
	$scope.ContractInfo = ContractInfo;
	$scope.UserInfo = UserInfo;
	$scope.RepaceBindCardObject = RepaceBindCardObject;
	$scope.isWeex = $routeParams.flag == 'weex' ? true : false;
	if($scope.isWeex){//从weex进来，重新赋值
		UserInfo.mobile=$routeParams.mobile;
		UserInfo.isNewApp=$routeParams.isNewApp;
		UserInfo.customerId=$routeParams.customerId;
		UserInfo.sltAccountId=$routeParams.sltAccountId;
		UserInfo.changeCardFlag=$routeParams.changeCardFlag;
		RepaceBindCardObject.cardBank=$routeParams.cardBank;
		RepaceBindCardObject.cardNo=$routeParams.cardNo;
		var token=$routeParams.xAuthToken;
		$window.localStorage.setItem("x-auth-token", token);

		//app调用换卡合同的时候先初始化数据
		BindBankService.prepareRepaceBindDataForApp();
	}





	//初始化签署换卡合同的日期
	var d = new Date();
	$scope.yearStr = d.getFullYear();
	$scope.monthStr = (d.getMonth()+1);
	$scope.dayStr = d.getDate();
	
	$scope.agree=function(){
		//检验是否网络中断    如果中断弹出提示
		if(window.navigator.onLine==false){
			ngUtils.alert("网络连接错误，请检查网络连接");
			 return;
		}
		UserInfo.deductAuth=true;
		
		if(UserInfo.isNewApp == 1){//新app
			var callSina = {
					'realName':ContractInfo.realName,
					'desc':'changeCard',
					'customerId':UserInfo.customerId,
					'sltAccountId':UserInfo.sltAccountId,
					'signatureType':'1'
			};
			callSina = JSON.stringify(callSina);
			var platform = window.Android || window;
			platform.startSignature(callSina);
		}else {
			//同意的话直接跳转到签字
			$location.url('/commonSingature?type=changeCard');
		}
		
		
		
//		$location.url('/changedBankCard');
//		history.go(-1);
	}
	$scope.cancel=function(){
		UserInfo.deductAuth=false;
		//第二个合同取消时返回到app
		var platform = window.Android || window;
		platform.gotoChangeBankCard("","");
	}
	
	//返回到app页面
	$scope.goBackToChangeCard=function(){
		UserInfo.changeCardFlag=1;
		var platform = window.Android || window;
		platform.gotoChangeBankCard("","");
	}
});

/**
 * app端改卡补充协议
 */
app.controller('AppPSController',function($scope,$routeParams,DdappService,ngUtils,ContractInfo){
	var customerId = $routeParams.customerId;
	var sltAccountId = $routeParams.sltAccountId;
	ContractInfo.newcardBank = $routeParams.newcardBank; // 新卡所在银行
	ContractInfo.newcardNo = $routeParams.newcardNo; //新卡卡号
	$scope.ContractInfo = ContractInfo;
	if(customerId == "" || customerId == null){
		ngUtils.alert("客户号不能为空");
		return;
	}
	if(sltAccountId == "" || sltAccountId == null){
		ngUtils.alert("订单号不能为空");
		return;
	}
	DdappService.supplement(customerId,sltAccountId);
});

/**
 * 转介绍-服务协议
 */
app.controller('AppAgentController',function($scope,UserInfo,ngUtils,ContractInfo,DimensionInfo){
	
	$scope.UserInfo=UserInfo;
	$scope.ContractInfo = ContractInfo;
	$scope.DimensionInfo = DimensionInfo;
	
	//当前日期
	var date = new Date();
	ContractInfo.nowyear = date.getFullYear(); 
	ContractInfo.nowMonth = date.getMonth()+1;
	ContractInfo.nowDay = date.getDate();

});
/**
 * 转介绍-居间服务协议
 */
app.controller('AppIntermediaryController',function($scope,$routeParams,$location,DdappService,UserInfo,ngUtils,ContractInfo,DimensionInfo){
	
	$scope.ContractInfo = ContractInfo;
	$scope.UserInfo = UserInfo;
	$scope.DimensionInfo = DimensionInfo;
	DimensionInfo.intermediaryFlag = 1;//判断是否进入过居间服务协议合同
	
	$scope.agree=function(){
		UserInfo.intermediaryService=true;
		$location.url("/agentRegister");
	}
	
	$scope.cancel=function(){
		UserInfo.intermediaryService=false;
		$location.url("/agentRegister");
	}
});



