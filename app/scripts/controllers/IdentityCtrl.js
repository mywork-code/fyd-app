/**
 * Created by wanglei07 on 2016/9/14.
 */
var app = angular.module('gfbApp');


/**
 * 安家趣花个人信息授权书
 */
app.controller('ajqhpersonalInfoProtocalCtrl', function ($routeParams,$rootScope,$scope,$location,UserInfo,ContractInfo,Constant,PageControllerObject,WithdrawRecordObject,CommonService,ngUtils,$resource) {
	var token=$routeParams.token;
	var userName=$routeParams.name;
	$scope.sltAccountId= '';
	try {
		$scope.sltAccountId =$routeParams.sltAccountId
	} catch(e) {
		// statements
		console.log(e);
	}
	
	$rootScope.setTitle('相关合同');
	$scope.isSign = $routeParams.isSign;
	
	PageControllerObject.contractPage=$routeParams.contractPage;//合同是否重签标记位（1为重签，0为正常签名）
	$scope.isWeex=$routeParams.isWeex == '1' ? true : false ;//合同是否来自weex（1为是，0为否）  是的话就隐藏签字按钮
	//协议重签的时候将订单号重置
	WithdrawRecordObject.sltAccountId= !!$routeParams.sltAccountId ? $routeParams.sltAccountId : '';//需要重签的订单号
	UserInfo.realName=$routeParams.name;
	UserInfo.personInfoSignature=$routeParams.isSign;//合同是否已经签署  1 已签署 0 未签署
	UserInfo.mobile=$routeParams.mobile;
	
	$scope.signName = UserInfo.personInfoSignature == '1' ? '' : UserInfo.realName;
	if($routeParams.identityNo==null||$routeParams.identityNo==undefined){//ios
		try {
			var platform = window.Android || window;
			var json=platform.getIdentityInfo();
			json = eval("(" + json + ")");
			ContractInfo.identityNo=json.identityNo;
		}catch (e) {
			
		}
	}else{//android
		ContractInfo.identityNo=$routeParams.identityNo;
	}
	if($routeParams.personInfoSignature==null||$routeParams.personInfoSignature==undefined){//ios
		try {
			var platform = window.Android || window;
			var json=platform.getIdentityInfo();
			json = eval("(" + json + ")");
			ContractInfo.personInfoSignature=json.personInfoSignature;
		}catch (e) {
			
		}
	}else{//android
		ContractInfo.personInfoSignature=$routeParams.personInfoSignature;
	}
	if($routeParams.customerId==null||$routeParams.customerId==undefined){//ios
		try {
			var platform = window.Android || window;
			var json=platform.getIdentityInfo();
			json = eval("(" + json + ")");
			ContractInfo.customerId=json.customerId;
		}catch (e) {
			
		}
	}else{//android
		ContractInfo.customerId=$routeParams.customerId; // 客户号
	}
	UserInfo.signatureType=1;


	
	$scope.Constant=Constant;
	//得到当前时间
	CommonService.getCurrentDate();
	$scope.UserInfo = UserInfo;
	$scope.ContractInfo = ContractInfo;
	$scope.ContractInfo.realName=userName;//客户签字姓名
	$scope.singature=function(){
		//检验是否网络中断    如果中断弹出提示
		if(window.navigator.onLine==false){
			ngUtils.constraintAlerts("网络连接错误，请检查网络连接","确定");
			 return;
		}
		/*var platform = window.Android || window;
		var isNetConnection=platform.tipCustemrNetError();
		if(isNetConnection=='1'){//断网
			return;
		}*/
			// var desc = '';
			// if(PageControllerObject.contractPage==1){
			// 	desc = 'txht';
			// }else {
			// 	desc = 'xieyi';
			// }
			// var callSina = {
			// 		'realName':userName,
			// 		'desc':desc,
			// 		'customerId':UserInfo.customerId,
			// 		'sltAccountId':WithdrawRecordObject.sltAccountId,
			// 		'signatureType':'1'
			// };
			// callSina = JSON.stringify(callSina);
			// var platform = window.Android || window;
			// platform.startSignature(callSina);
			$location.url("/identitySingature?mobile="+$routeParams.mobile+"&name="+$routeParams.name+"&token="+$routeParams.token+"&sltAccountId="+$scope.sltAccountId);
		
		
	}
	
	$scope.cancel=function(){
		if(window.__wxjs_environment === 'miniprogram') {
			wx.miniProgram.navigateBack();
		} else {
	        var platform = window.Android || window;
		    platform.finishSelf();			
		}
	}
	
	$scope.gotoEtakeForIdentity=function(){
		$rootScope.goBackHome();
	}
});
