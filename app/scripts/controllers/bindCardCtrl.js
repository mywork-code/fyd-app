'use strict';
var app = angular.module('gfbApp');

// 提现 - 绑卡
app.controller('bindCardCtrl', function($scope, $location,$window, BindBankService,ngUtils,UserInfo, BindCardObject,WithdrawRecordObject){
	$scope.UserInfo = UserInfo;
	$scope.BindCardObject = BindCardObject;
	$scope.withdraw = WithdrawRecordObject;
    //跳转到银行列表
	$scope.chooseBank = function() {
		$location.url("/banklist");
	}
    //跳转到提现页面（清空银行卡的数据）
	$scope.goToWithdraw = function() {
		BindCardObject.cardNoWithSpace="";
		$location.url("/withdraw");
	}
    //返回按钮
	$scope.goTo = function(){
		//跳回到前一页
		history.go(-1);
	}
	//连接到银行限额列表
	$scope.showCardLimit = function(){
		$location.url("/cardlimit");
	}
    //格式化输入银行卡的内容(四位数字添加一个空格)
	$scope.formatcardNo = function(){
		if($scope.BindCardObject.cardNoWithSpace!=''&&$scope.BindCardObject.cardNoWithSpace!=undefined){
			//四位数字添加一个空格
			$scope.BindCardObject.cardNoWithSpace=$scope.BindCardObject.cardNoWithSpace.toString().replace(/\D/g,'').replace(/....(?!$)/g,'$& ');
		}
	}
	//判断如果用户信息不全，跳转到获取额度页面
	if(UserInfo.identityNo.length == 0 || UserInfo.realName.length == 0 || UserInfo.mobile.length == 0){
		ngUtils.alert("请先获取额度，再来绑卡");
		//跳转到e取页面
		var token = $window.localStorage.getItem("x-auth-token");
		$location.url("/eGet?xAuthToken="+token);
	}else{
		// 绑卡
		$scope.handleBindCard = function() {
			if($scope.BindCardObject.cardNoWithSpace!=''&&$scope.BindCardObject.cardNoWithSpace!=undefined){
				//去掉显示的银行卡号中的空格
				$scope.BindCardObject.cardNo=$scope.BindCardObject.cardNoWithSpace.toString().replace(/\s/ig,'');
			}else{
				$scope.BindCardObject.cardNo="";
			}
			//银行卡号只能输入数字，否则就会被清空
			if(undefined==$scope.BindCardObject.cardNo||$scope.BindCardObject.cardNo==''){
				ngUtils.alert("银行卡号不能为空!");
				$scope.BindCardObject.cardNo="";
				return;
			}else if(!/^\d+(,*\d*)*(\.?\d*)$/.test($scope.BindCardObject.cardNo)){
				ngUtils.alert("银行卡号只能输入数字!");
				$scope.BindCardObject.cardNo="";
				return;
			}else if(!BindBankService.validBankCardLastNO($scope.BindCardObject.cardNo)){
				ngUtils.alert("银行卡号格式不正确!");
				return;
			}
			//第一次绑卡
			$scope.withdraw.firstbindCard=true;
			//调用方法之前锁定页面
			ngUtils.loadingAlert();
			BindBankService.bindBank();
		}
	}
});
