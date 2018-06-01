'use strict';
var app = angular.module('gfbApp');

/**
 * 密码管理-主页面 controller
 */
app.controller('PasswordManageCtrl', function($routeParams,$rootScope,$scope, $location, ngUtils, Constant,CountdownObj,TransactionGestureService,
		UserInfo,RegisterInfo,BindCardObject) {
	$scope.UserInfo = UserInfo;
	$scope.CountdownObj = CountdownObj;
	$scope.RegisterInfo = RegisterInfo;
	$scope.BindCardObject=BindCardObject;
	
	$scope.UserInfo.identityNoText="";
	$scope.UserInfo.cardNoText="";
	UserInfo.tranPassword="";
	UserInfo.newtranPassword="";
	UserInfo.reconfirmPassword="";
	RegisterInfo.verifyCode="";
	RegisterInfo.tranPassword="";
	RegisterInfo.reconfirmPassword="";
	RegisterInfo.newPassword="";
	
	$scope.goTo = function(){
		$location.url("/myCenter");
	}
	//app设置成功手势密码
	if($routeParams.GestureOpenFlag){
		RegisterInfo.checkeMess = true;
	}
	//手势密码开关初始化   密码开关状态
	//TransactionGestureService.ifGesturePasswords();
	/*if(RegisterInfo.checkeMess == true){
		RegisterInfo.checkeMess = true;
	}else{
		RegisterInfo.checkeMess = false;
	}*/
	
	//手势密码开关事件
	$scope.GesturePasswordCloseClick = function() {
		//关闭手势密码 清空密码 
		TransactionGestureService.jumpOvers();
	}
	
	$scope.GesturePasswordOpenClick = function() {
		//打开手势密码 重新设置密码
		//打开app手势
		RegisterInfo.checkeMess = true;
		var platform = window.Android || window;
		platform.set_Gesture();
	}
	
	

	//$scope.checkeMess = true;
	$scope.checkGestures = function(){
		RegisterInfo.checkeMess = !RegisterInfo.checkeMess;
		if(RegisterInfo.checkeMess==false){
			$scope.GesturePasswordCloseClick();
		}else{
			$scope.GesturePasswordOpenClick();
		}
	}
	
	//跳转到吐槽页面
	$scope.toModifyPassword = function() {
		//清空原密码缓存数据
		RegisterInfo.password='';
		RegisterInfo.newPassword='';
		RegisterInfo.reconfirmPassword='';
		$location.url("/modifyPassword");
	}
	//修改交易密码或者新增交易密码
	$scope.toTransactionPassword = function() {
		TransactionGestureService.ifTranPassword();
		
	}
	//新增交易密码
	$scope.addTranPass=function(){
		var str=ngUtils.validatePasswordLength(RegisterInfo.tranPassword);
		if(str!=''){
			ngUtils.alert("请输入6位数字交易密码");
			return ;
		}
		if(RegisterInfo.tranPassword.length>6){
			ngUtils.alert("交易密码不允许大于6位");
			RegisterInfo.tranPassword = "";
			RegisterInfo.reconfirmPassword = "";
			return ;
		}
		if(RegisterInfo.tranPassword!=RegisterInfo.reconfirmPassword){
			ngUtils.alert("两次输入不一致，请重新输入");
			$scope.RegisterInfo.tranPassword = "";
			RegisterInfo.reconfirmPassword = "";
			return ;
		}
		if(!/^\d+$/.test(RegisterInfo.tranPassword)){ 
			ngUtils.alert("交易密码只允许数字！");
			RegisterInfo.tranPassword = "";
			RegisterInfo.reconfirmPassword = "";
			return ;
		}
		TransactionGestureService.savetransaction('0');
	}
	//找回交易密码页面
	$scope.updateTran=function(){
		var smsType="reset";
		TransactionGestureService.sendCodeToMobile(smsType);
		$location.url("/updateTransactionPassword1");
	}
	
	//发送验证码
	$scope.resendSendCode=function(){
		var smsType="reset";
		//发送短信前现将用户的验证码和新密码置为空字符串
		$scope.RegisterInfo.verifyCode="";
		$scope.RegisterInfo.newPassword="";
		TransactionGestureService.sendCodeToMobile(smsType);
	}
	//校验手机验证码并重置交易密码
	$scope.transactionPasswordInfo=function(){
		//重置密码的时候验证密码的长度
		var str=ngUtils.validatePasswordLength(RegisterInfo.newPassword);
		if(str!=''){
			ngUtils.alert("请输入6位数字交易密码");
			RegisterInfo.newPassword = "";
			return ;
		}
		if(RegisterInfo.newPassword.length>6){
			ngUtils.alert("交易密码不允许大于6位");
			RegisterInfo.newPassword = "";
			return ;
		}
		if(RegisterInfo.verifyCode==''){
			ngUtils.alert("请输入验证码");
			return ;
		}
		if(!/^\d+$/.test(RegisterInfo.newPassword)){ 
			ngUtils.alert("交易密码只允许数字！");
			RegisterInfo.newPassword = "";
			return ;
		}
		//修改交易密码
		var smsType="reset";
		TransactionGestureService.updatetransaction(RegisterInfo.newPassword,RegisterInfo.verifyCode);
	}

	//检测验证码是否输入内容
	$scope.$watch('RegisterInfo.verifyCode',function(newValue, oldValue){
		if(ngUtils.isBlank(newValue)){
			$scope.transactionInfoVerifyCodeFlag = true;
		}else{
			$scope.transactionInfoVerifyCodeFlag = false;
		}
	});
	//检测新密码是否输入内容
	$scope.$watch('RegisterInfo.newPassword',function(newValue, oldValue){
		if(ngUtils.isBlank(newValue)){
			$scope.transactionInfoPasswordFlag = true;
		}else{
			$scope.transactionInfoPasswordFlag = false;
		}
	});
	$scope.$watch('UserInfo.tranPassword',function(newValue, oldValue){
		if(ngUtils.isBlank(newValue)){
			$scope.transactionUserPasswordFlag = true;
		}else{
			$scope.transactionUserPasswordFlag = false;
		}
	});
	$scope.$watch('UserInfo.newtranPassword',function(newValue, oldValue){
		if(ngUtils.isBlank(newValue)){
			$scope.transactionNewUserPasswordFlag = true;
		}else{
			$scope.transactionNewUserPasswordFlag = false;
		}
	});
	$scope.$watch('RegisterInfo.tranPassword',function(newValue, oldValue){
		if(ngUtils.isBlank(newValue)){
			$scope.transactionInfoFlagxz = true;
		}else{
			$scope.transactionInfoFlagxz = false;
		}
	});
	$scope.$watch('RegisterInfo.reconfirmPassword',function(newValue, oldValue){
		if(ngUtils.isBlank(newValue)){
			$scope.transactionInfoPasswordFlagxzx = true;
		}else{
			$scope.transactionInfoPasswordFlagxzx = false;
		}
	});
	$scope.$watch('UserInfo.identityNoText',function(newValue, oldValue){
		if(ngUtils.isBlank(newValue)){
			$scope.transactionInfoidentityNoFlag = true;
		}else{
			$scope.transactionInfoidentityNoFlag = false;
		}
	});
	$scope.$watch('UserInfo.cardNoText',function(newValue, oldValue){
		if(ngUtils.isBlank(newValue)){
			$scope.transactionInfocardNoFlag = true;
		}else{
			$scope.transactionInfocardNoFlag = false;
		}
	});
	$scope.toGesturePassword = function() {
		//判断是否有手势密码
		//打开app手势
		var platform = window.Android || window;
		platform.set_Gesture();
	}
	//忘记交易密码
	$scope.forgetTranPassword = function() {
		//身份证银行卡流程
		$location.url("/backTransactionPassword");
		//短信验证流程
		//$location.url("/updateTransactionPassword");
	}
	//身份证银行卡流程
	$scope.backTransactionInfo=function(){
		if(UserInfo.identityNoText!=UserInfo.identityNo){
			ngUtils.alert("身份证有误！");
			return;
		}
		if(UserInfo.cardNoText!=BindCardObject.cardNo){
			ngUtils.alert("银行卡有误！");
			return;
		}
		//设置交易密码
		$location.url("/addTransactionPassword");
	}
	//更改交易密码
	$scope.changeTranInfo=function(){
		
		if(null==UserInfo.tranPassword||''==UserInfo.tranPassword){
			ngUtils.alert("请填写原始密码");
			return;
		}
		if(null==UserInfo.newtranPassword||''==UserInfo.newtranPassword){
			ngUtils.alert("请先填写新密码");
			return;
		}
		if(null==UserInfo.reconfirmPassword||''==UserInfo.reconfirmPassword){
			ngUtils.alert("请先填写确认密码");
			return;
		}
		if(UserInfo.newtranPassword!=UserInfo.reconfirmPassword){
			ngUtils.alert("新密码和确认密码必须一致");
			UserInfo.newtranPassword = "";
			UserInfo.reconfirmPassword = "";
			return;
		}
		var str=ngUtils.validatePasswordLength(UserInfo.newtranPassword);
		if(str!=''){
			ngUtils.alert("请输入6位数字交易密码");
			UserInfo.newtranPassword = "";
			UserInfo.reconfirmPassword = "";
			return ;
		}
		if(UserInfo.newtranPassword.length>6){
			ngUtils.alert("交易密码不允许大于6位");
			UserInfo.newtranPassword = "";
			UserInfo.reconfirmPassword = "";
			return ;
		}
		if(str!=''){
			ngUtils.alert(str);
			return ;
		}
		if(!/^\d+$/.test(UserInfo.tranPassword)){ 
			ngUtils.alert("交易密码只允许数字！");
			UserInfo.tranPassword = "";
			return ;
		}
		if(!/^\d+$/.test(UserInfo.newtranPassword)){ 
			ngUtils.alert("交易密码只允许数字！");
			UserInfo.newtranPassword = "";
			UserInfo.reconfirmPassword = "";
			return ;
		}

		
		TransactionGestureService.changeTranInfo(UserInfo.tranPassword,UserInfo.newtranPassword);
	}
	
	
});