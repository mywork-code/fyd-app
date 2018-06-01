'use strict';
var app = angular.module('gfbApp');

/**
  * 芝麻分查询
  */
app.controller('zmScoreQueryLoginCtrl', function($scope, Constant, ngUtils) {
	
	$scope.queryZMScore = function(){
		var name = $scope.name;
		var identityNo = $scope.identityNo;
		
		// 验证姓名信息
        var nameReg = /^[\u4E00-\u9FA5]{0,5}$/;
        var identityNoReg = /^(\d{15})$|^(\d{17}(?:\d|x|X))$/;
        var flag = ngUtils.checkIdCardImpl(name, "姓名填写不正确", nameReg);
        if (flag) {
        	// 验证身份证信息
        	flag = ngUtils.checkIdCardImpl(identityNo, "身份证号码填写不正确", identityNoReg);
        	if(flag){
        		var prefix = Constant.Root + "/zm/queryZmScore";
         		window.location.href = prefix + "?name=" + encodeURI(encodeURI(name)) + "&identityNo=" + identityNo;
        	}
        }
	}
});

/**
 * 芝麻分查询回调结果
 */
app.controller('zmScoreQuerySuccessCtrl', function($scope, $routeParams, $rootScope, ngUtils) {
	$scope.isSuccess = $routeParams.isSuccess;
	$scope.name = decodeURI($routeParams.name);
	$scope.zmScore = $routeParams.zmScore;
	$scope.identityNo = $routeParams.identityNo;
 	// 提额回调接口提示操作成功，等待处理...
	if("true" == $scope.isSuccess){
		
	}else{
		ngUtils.alert("芝麻信用分查询失败,请稍后再试.");
	}
});