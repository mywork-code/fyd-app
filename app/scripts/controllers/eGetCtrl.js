'use strict';
var app = angular.module('gfbApp');

/**
 * E取
 */
app.controller('eGetCtrl', function($routeParams,$rootScope,$scope, $location, $window, $resource,
		UserInfo,Constant, MobileVerifyInfo, IdentityService, ngUtils) {
	
	
	ngUtils.constraintAlert("亲，您的版本过老，请升级您的app哦.", "确认", function(){
		$rootScope.goBackHome();
	});

    /**
     * E取初始化
     */
	/*
	var token=$routeParams.xAuthToken;
	if(token && UserInfo.mobile && token != ''&&UserInfo.mobile!=''){
		$window.localStorage.setItem("x-auth-token", token);
		//初始化UserInfo
	    IdentityService.initIdentityInfo($scope);
	}else if(token && token != ''&&UserInfo.mobile==''){
		$window.localStorage.setItem("x-auth-token", token);
		var path = Constant.APIRoot + "/operation/getAccountByToken";
		var params = {
			"x-auth-token": token,
		};
		var service = $resource(path,{},{
			connect:{method:'POST'}
		});
		service.connect(params,
			function(response){
	            if (response && response.status == '1') {
	            	UserInfo.mobile = response.data.mobile;
	            	//初始化UserInfo
	                IdentityService.initIdentityInfo($scope);
	            } else {
	            	$window.localStorage.removeItem("x-auth-token");
					$rootScope.gotoLogin();
	            }
			},
			function(error){
				$window.localStorage.removeItem("x-auth-token");
				ngUtils.alert("网络异常,请稍后重试.");
				$rootScope.gotoLogin();
			});
	}else{
		$rootScope.gotoLogin();
	}   */
});
