'use strict';
var app = angular.module('gfbApp');

/**
 * 查看合同
 */
app.controller('ViewAllContractCtrl', function ($rootScope,$scope,$location,$timeout,CommonService,$routeParams,$window,ngUtils,OrderInfo,UserInfo,ContractInfo,ViewAllContractService,ContractCardsList,ContractCardList) {			
	CommonService.appBack(function(){
	       $location.url("/fydOrder?mobile="+UserInfo.mobile+"&token="+UserInfo.xAuthToken).replace();//返回到我的账单
	})
    // ViewAllContractService.queryVbsContract(ContractInfo.sltAccountId, contractNameValue);
	document.title='房易贷合同';
	//接收两个参数sltId和cardNum
	var cardNum=$routeParams.cardNum;
	//	var cardNum=1;
	$scope.UserInfo = UserInfo;
	$scope.ContractInfo = ContractInfo;
	!ContractInfo.sltAccountId&&($scope.ContractInfo.sltAccountId = $routeParams.sltId);
	//	UserInfo.mobile=15618371835;
	// if(cardNum==2){
	// 	ContractInfo.contractNameList = ContractCardsList;
	// }else if(cardNum==1){
	// 	ContractInfo.contractNameList =ContractCardList;
	// }
	ContractInfo.contractNameList =ContractCardsList;
	//初始化页面和对象域
	$scope.ContractInfo = ContractInfo;

	// 回退到订单页面
	$scope.gotoOrder = function() {
		$location.url("/order");

	}
	//返回
	$scope.goBackHome=function(){
		var platform = window.Android || window;
		platform.goBackHome();
	}

	// 清贷查询页面跳转
	$scope.viewVbsContractDetail = function(contractName, contractNameValue) {
	    try {
			if(appModel.isConnected()=='0') {
		        ngUtils.alert("网络连接失败，请检查您的网络后再试");
		    	return;			
			}
		} catch(e) {
	        if(window.navigator.onLine==false){
			    ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    return;
		    }				
		}
		$rootScope.titleContractName = contractName;
		ViewAllContractService
			.queryVbsContract(ContractInfo.sltAccountId, contractNameValue);
	}
});
'use strict';
var app = angular.module('gfbApp');

/**
 * 查看合同 2
 */
app.controller('ViewAllContract2Ctrl', function ($rootScope,$scope,$location,CommonService,$timeout,ContractCardsList,ContractCardList,UserInfo,ContractInfo) {
	CommonService.appBack(function(){
		$location.url('/viewAllContract')

	})
	document.title='房易贷合同';
	$scope.UserInfo = UserInfo;
	$scope.ContractInfo = ContractInfo;
	console.log(ContractInfo.vbsContractInfoList)

});
