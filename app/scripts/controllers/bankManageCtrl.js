'use strict';
var app = angular.module('gfbApp');

/**
 * 银行卡管理
 */
app.controller('BankManageCtrl', function ($scope,$location,$routeParams,$resource,ngUtils,$timeout,Constant,BindCardObject,RepaceBindCardObject,UserInfo,BindBankService) {
	// 初始化对象信息
	$scope.BindCardObject = BindCardObject;
	$scope.UserInfo = UserInfo;
	$scope.RepaceBindCardObject=RepaceBindCardObject;
	
	//判断是否重新签名
	var singatureOnce=$routeParams.flag;
	//跳转连接
	$scope.goTo = function(){
		$location.url("/myCenter");
	}
	//点击跳转到绑卡页面
    $scope.myBindCard = function(){
    	UserInfo.bindlinkFlag = 1;
    	$location.url("/withdraw/bindcard");
    }
	//银行卡号只能输入数字，否则就会被清空
	$scope.checkRepayNoIsNumber=function(){
		//添加银行卡为空不进行校验的判断
		if(RepaceBindCardObject.cardNo==""){
			return false;
		}
		if(!/^\d+(,*\d*)*(\.?\d*)$/.test($scope.RepaceBindCardObject.cardNo)){
			ngUtils.alert("银行卡号只能输入数字!");
			$scope.RepaceBindCardObject.cardNo="";
		}
		if($scope.RepaceBindCardObject.cardNo==BindCardObject.cardNo){
			ngUtils.alert("卡号与原有卡号相同!");
			$scope.RepaceBindCardObject.cardNo="";
		}
	}
	
	//点击选择银行
	$scope.selectBank=function(){
		//允许多次换卡 注释掉此处
		/*if(UserInfo.changeCardFlag==1)
			return;
		if(UserInfo.deductAuth || UserInfo.repaceSupplemental){
			return;
		}*/
		
		RepaceBindCardObject.changeBankFlag = "1";
		
		$location.url("/banklist");
	}
	
	/**
	 * 点击查看关于变更卡号的补充协议合同或扣款授权书
	 */
	$scope.goToContractForChangeCard= function(){
		
		if(!$scope.RepaceBindCardObject.cardBank){
			ngUtils.alert("请选择银行!");
			return false;
		}
		if(!$scope.RepaceBindCardObject.cardNo){
			ngUtils.alert("请先填写新卡号!");
			return false;
		}
		if($scope.RepaceBindCardObject.cardNo == ""){
			ngUtils.alert("请先填写新卡号!");
			return;
		}
		var resu = BindBankService.validBankCardLastNO($scope.RepaceBindCardObject.cardNo);
		if(!resu){
			ngUtils.alert("银行卡号格式不正确!");
			return false;
		}
		
		$location.url('/repaceSupplementalContract');
//		if(type=='change'){
//			$location.url('/repaceSupplementalContract');
//		}
//		if(type=='debit'){
//			$location.url('/app/changecard/deductAuth');
//		}
	}
	
	// 换卡 不需签名   	edit by lc 2016-08-25
	//验证如果变更借记卡卡号和扣款授权书都同意,自动跳转到签名页
	$scope.$watch('UserInfo.repaceSupplemental',function(newValue, oldValue){
		if(newValue==true && UserInfo.deductAuth==true){
			$timeout(function(){
				$scope.agreement=true;
			},500);
		}
		
	});
	$scope.$watch('UserInfo.deductAuth',function(newValue, oldValue){
		if(newValue==true && UserInfo.repaceSupplemental==true){
			$timeout(function(){
				$scope.agreement=true;
			},500);
		}
	});
	$scope.$watch('agreement',function(newValue, oldValue){
		//只允许签名一次
		if(newValue==true && singatureOnce!='once' && !UserInfo.signature64){
			//提现合同(提现合同)
			$location.url('/commonSingature?type=changeCard');
		}
	});
	
	$scope.submitRepaceBindBank=function(){
		if(!$scope.RepaceBindCardObject.cardBank){
			ngUtils.alert("请选择银行!");
			return false;
		}
		if(!$scope.RepaceBindCardObject.cardNo){
			ngUtils.alert("请填写银行卡号!");
			return false;
		}
		if(!UserInfo.deductAuth){
			ngUtils.alert("请先阅读并接受扣款授权书");
			return false;
		}
		if(!UserInfo.repaceSupplemental){
			ngUtils.alert("请先阅读并接受变更借记卡卡号协议");
			return false;
		}
		
		if(UserInfo.changeCardFlag != 1){
			ngUtils.alert("请先签名!");
			return false;
		}
		
		BindBankService.repaceBindBank();
		
	}
	// 跳转更换银行卡页面
	$scope.replaceBankCard = function() {
		//更换银行卡数据准备
		//清除更换银行卡页面缓存银行卡卡数据
		RepaceBindCardObject.cardBank='';//银行
		RepaceBindCardObject.cardNo='';//银行卡号
		BindBankService.prepareRepaceBindData();
		$location.url("/changedBankCard");
	}
	
});

