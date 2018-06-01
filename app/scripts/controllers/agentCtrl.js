'use strict';
var app = angular.module('gfbApp');

/**
 * 有奖-主页面 controller
 */
app.controller('AgentCtrl', function($scope, $location, ngUtils,UserInfo,CountdownObj,ContractInfo,AgentService,DimensionInfo) {
	$scope.UserInfo=UserInfo;
	$scope.CountdownObj = CountdownObj;
	$scope.ContractInfo = ContractInfo;
	$scope.DimensionInfo=DimensionInfo;
	UserInfo.agentService=true;
	
	//手机号码只能输入数字，否则就会被清空
	$scope.checkMobileIsNumber=function(){
		if(!/^[0-9]*$/.test($scope.DimensionInfo.mobile)){
			$scope.DimensionInfo.mobile="";
		}
	}  
	//(2)手机获取验证码
	$scope.sendCodeToMobile = function(){
		//用户手机号码验证 判断手机号码是否正确
		if($scope.DimensionInfo.mobile=='' || $scope.DimensionInfo.mobile==undefined){
			ngUtils.alert('请先输入手机号!');
			return ;
		}
    	var mobileFlag = AgentService.isMobile(DimensionInfo.mobile);
		if(mobileFlag == 0){
			ngUtils.alert("手机号码有误，请重新填写。");
			return ;
		}else if(mobileFlag != 0){
			$scope.DimensionInfo.MobileCodeStatus=true;
			AgentService.sendCodeToMobile();
		};
	}
	
	/**
	 * 点击查看关于转介绍-服务协议和居间服务协议
	 */
	$scope.goToContract= function(){
		//手机号码不为空
		if(!$scope.DimensionInfo.mobile){
			ngUtils.alert("请填写手机号!");
			return false;
		}
		var codeflag = false;
    	//校验征信验证码
		codeflag = ngUtils.checkIdCardImpl(DimensionInfo.vercode, "验证码不能为空", "");
    	if(!codeflag){
    		return false;
    	} 
    	
    	var identityFlag = false;
    	//校验身份号码
    	identityFlag = AgentService.identityCodeValid(DimensionInfo.identityNo);
		if(!$scope.DimensionInfo.identityNo){
			ngUtils.alert("请填写身份证号!");
			return false;
		}else if(!identityFlag){
			ngUtils.alert("身份证输入有误，请重新填写。");
			return false;
		}else if(AgentService.getAget(DimensionInfo.identityNo)<18){
			ngUtils.alert("抱歉，您的年龄未满18周岁，不能成为帮帮经纪人");
			return false;
		}; 

		//跳转到服务协议
		$location.url('/agentAgreement');
	}
	
	
	/**
     * 提交信息，用户注册帮帮代理人
     */
    $scope.confrimLogin = function(){
    	
    	var flag = $scope.validAgentRegister();
		if(!flag){
			return;
		};
		//提示框
		$(".submitSure").dialog("show");
		
		//确认
    	$scope.submitSure=function(){
			//提交信息，注册帮帮经纪人
    		AgentService.submit(AgentService);
    		$(".submitSure").dialog("hide");
    		return ;
    	}
    	//取消
    	$scope.cancleSubmit=function(){
    		$(".submitSure").dialog("hide");
    		return ;
    	}
    };
    
    /**
	 * 注册前 - 校验注册信息
	 */
    $scope.validAgentRegister = function(){
    	var codeflag = false;
    	
        //用户手机号码验证 判断手机号码是否正确
		if($scope.DimensionInfo.mobile=='' || $scope.DimensionInfo.mobile==undefined){
			ngUtils.alert('请先输入手机号!');
			return false;
		}
    	var mobileFlag = AgentService.isMobile(DimensionInfo.mobile);
		if(mobileFlag == 0){
			ngUtils.alert("手机号码有误，请重新填写。");
			return false;
		}
    	//校验征信验证码
		var codeflag = ngUtils.checkIdCardImpl(DimensionInfo.vercode, "验证码不能为空", "");
    	if(!codeflag){
    		return false;
    	} 
    	
    	var identityFlag = AgentService.identityCodeValid(DimensionInfo.identityNo);
		if(!$scope.DimensionInfo.identityNo){
			ngUtils.alert("请填写身份证号!");
			return false;
		}else if(!identityFlag){
			ngUtils.alert("身份证输入有误，请重新填写。");
			return false;
		}else if(AgentService.getAget(DimensionInfo.identityNo)<18){
			ngUtils.alert("抱歉，您的年龄未满18周岁，不能成为帮帮经纪人");
			return false;
		}; 
    	
    	//平台服务协议
        if(UserInfo.agentService!=true){
			ngUtils.alert("请签署服务协议!");
			return false;
		}
    	return true;	
    };

});
