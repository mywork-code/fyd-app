'use strict';
var app = angular.module('gfbApp');

/**
 * 订单
 */
app.controller('OrderCtrl', function($routeParams, $window, $resource, $rootScope, $scope,
		$location, OrderInfo, ClearInfo, OrderService, UserInfo, ngUtils,
		ContractInfo, ContractCardsList, ContractCardList, $timeout,CommonService) {
	try{
		appModel.handlerBack();//调用此方法，通知App返回按键由H5控制
	}catch (e){

	}
	$scope.UserInfo = UserInfo;
	$(document).on("back",function(){
		$timeout(function(){
			console.log($scope.isSwiper)
			if($scope.isSwiper){
				$scope.isSwiper = false

			}else {
				var curOrigin = window.location.origin,abssUrl = '';
				if($routeParams.test == 'uat'){//uat环境 安家派账单没有uat环境，当bss是uat时，返回到bss sit
					abssUrl = 'http://bss.uat.apass.cn/bss/system/bill?userId='+UserInfo.ajqhUserId
				}else {
					abssUrl = curOrigin+'/bss/system/bill?userId='+UserInfo.ajqhUserId
					//abssUrl = 'http://192.168.191.1:9090/bss/system/bill?userId=8008986'
				}

				window.location.href =abssUrl;
			}
		},2);
	});
	$rootScope.setTitle('账单');
	$routeParams.ajqhUserId&&(UserInfo.ajqhUserId=$routeParams.ajqhUserId);
	//初始化页面和对象域
	$scope.OrderInfo = OrderInfo;
	UserInfo.isBillH5 = true;
	$scope.isLoad = true;
	if(UserInfo.app == 'newAjp'){//来自安家派App 隐藏返回按钮
		try{
			appModel.isShowLeftBtn('0')
		}catch(e){
			console.log('隐藏')
		}
	}else {

	}
	try{
		var userInfo = JSON.parse(appModel.getUserInfo());
		if(userInfo["mobile"] === undefined || userInfo["mobile"] == 'undefined'){
			UserInfo.mobile = userInfo["mobile,"];
		}else {
			UserInfo.mobile = userInfo.mobile;
		}
		UserInfo.xAuthToken = userInfo.token;
	}catch(e){
		UserInfo.mobile = $routeParams.mobile;
		UserInfo.xAuthToken = $routeParams.token;
//		UserInfo.mobile = "13554878559";
//		UserInfo.xAuthToken = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsaXN0ZW5pbmcuand0Lmlzc3Vlcj86bGlzdGVuaW5nLWp3dC1pc3N1ZXIiLCJhdWQiOiJsaXN0ZW5pbmcuand0LmF1ZGllbmNlPzpsaXN0ZW5pbmctand0LWF1ZGllbmNlIiwiaWF0IjoxNTE1NjU4MTY5LCJleHAiOjE1MTYyNjI5NjksImluZm8iOnsidXNlcklkIjoiMiIsIm1vYmlsZSI6IjE1NjE4MzcxODM1In19.HG08lQxr_8drhqyZAg6V2a9Kukffn0yg9vjiPRbvDDg";
	}


	//点击展开效果
	$scope.openDetail=function(row){
		$scope.selectedIndex == row ? $scope.selectedIndex = -1 : $scope.selectedIndex = row;
	}

	$scope.isSwiper = false;//控制显示还款详情 左移效果,返回按键
	$scope.orderList = [];
	$scope.transStatus = 0;

	//if(UserInfo.xAuthToken && UserInfo.mobile && UserInfo.xAuthToken != ''&&UserInfo.mobile!=''){
	//	$window.localStorage.setItem("x-auth-token", UserInfo.xAuthToken);
	//}

	OrderService.initOrderData().then(function(){
		$scope.isLoad = false;
	})


	$scope.checkOrder = function (list) {
		if(list.transStatus==0 || list.transStatus==-4 || list.transStatus==-3 || list.transStatus==-2){
			$scope.orderList = [];
			$scope.isSwiper = false;

			return
		}else {
			$scope.transStatus = list.transStatus;
			$scope.orderList = list;
			$scope.isSwiper = true;
		}
	}


	//我要还款
	$scope.toRepay = function(sltAccountId){  //sltAcctId
		console.log(sltAccountId)
		ClearInfo.sltAccountId = sltAccountId;
		OrderService.toRepay().then(function(res){
			$location.url("/repayment").search({
				"sltAcctId":sltAccountId,
				"vbsBid":$scope.orderList.vbsBid,
				"mobile":UserInfo.mobile,
				"token":UserInfo.xAuthToken,
			})
		})
	}

	//清贷查询页面跳转
	$scope.toCleanLoan=function(sltAccountId, cleanLoanFlag){
		ClearInfo.sltAccountId = sltAccountId;
		ClearInfo.isExemption = cleanLoanFlag;
		$location.url("/clearLoan");
	}
	
	//清贷查询页面跳转
	$scope.viewContract=function(sltAccountId,cardNum){
		//还款银行和按揭银行不是同一张卡
		if(cardNum==2){
			ContractInfo.contractNameList = ContractCardsList;
		}else if(cardNum==1){
			ContractInfo.contractNameList =ContractCardList;
		}
		$location.url("/viewAllContract?sltId="+sltAccountId+"&cardNum="+cardNum);
	}
});