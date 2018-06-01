'use strict';
var app = angular.module('gfbApp');

/**
  * 芝麻提额回调显示页面
  */
app.controller('zmAdvanceSuccessCtrl', function($scope, $routeParams, $rootScope, ngUtils) {
	$scope.isSuccess = $routeParams.isSuccess;
	$scope.name = decodeURI($routeParams.name);
	$scope.zmScore = $routeParams.zmScore;
	$scope.identityNo = $routeParams.identityNo;
	$scope.advanceAmt = $routeParams.advanceAmt;
 	// 提额回调接口提示操作成功，等待处理...
	if("true" == $scope.isSuccess){
		$scope.showAdvanceFailFlag = false;
		ngUtils.alert("提额操作成功,请等待处理结果...");
	}else{
		// ngUtils.alert("提额操作失败,请稍后再试.");
		$scope.showAdvanceFailFlag = true;
	}
});