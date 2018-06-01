/**
 * Created by wanglei07 on 2016/9/14.
 */
var app = angular.module('gfbApp');

app.controller('ResultCtrl',function($scope,$location,UserInfo,CommonService,Constant,ngUtils){
	$scope.UserInfo = UserInfo;
	
	//征信失败锁单30天
	CommonService.getLockedDate();
	
	/**
	 * 重新申请额度
	 */
	$scope.repeatApplyAmt = function(){
		CommonService.reApplyAmt();
	}
	
	/**
	 * 重新申请征信报告
	 */
	$scope.reCreditApply = function(){
		CommonService.reCreditApply();
	}
	
	/**
	 * 返回到我要额度页面
	 */
	$scope.reGet = function(){
		CommonService.reApplyAmt();
	}
});
