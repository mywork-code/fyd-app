'use strict';
var app = angular.module('gfbApp');

/**
 * 清贷确认 controller
 */
app.controller('ClearLoanCtrl', function ($routeParams,$scope,$rootScope,CommonService,ClearInfo,ClearLoanService,$timeout,$location,UserInfo) {
	CommonService.appBack(function(){
		$location.url('/order');

	})
	UserInfo.xAuthToken = $routeParams.token;
	UserInfo.mobile = $routeParams.mobile;
	$rootScope.setTitle('还款确认');
    $scope.isCleanSuc = false; //是否显示查看详情框
	//页面初始化的时候先清空就的数据，放置影响页面的显示效果
	ClearInfo.bankCode = "";
	ClearInfo.cardBank = "";
	ClearInfo.cardNo = "";
	ClearInfo.cardNoStr = "";
	ClearInfo.clearLoanAmount = "";
	ClearInfo.clearLoanCapitalAmt = "";
	
	$scope.ClearInfo = ClearInfo;
	// UserInfo.customerId = '80140626';
	// ClearInfo.sltAccountId = '1236454';
	//清贷页面初始化数据
	ClearLoanService.clearInit();

	//清贷申请
	$scope.clearLoanApply = function(){
		ClearLoanService.clearLoanApply($scope);
	}
	
});

