'use strict';
var app = angular.module('gfbApp');
/**
 * 订单详情
 */
app.controller("WithdrawDetailCtrl",function($rootScope,$scope, $resource, $location,$window, UserInfo,
    WithdrawDetailInfo, BindCardObject, PageControllerObject, Constant, ngUtils,MyCenterService,CommonService){
	
	//进入订单详情页面先清空原来的旧数据
	WithdrawDetailInfo.applyDate=""; //提现申请时间
	WithdrawDetailInfo.loanDate=""; //放款时间
	WithdrawDetailInfo.terminateDate=""; //解约时间
	WithdrawDetailInfo.loanAmount=""; //提现金额
	WithdrawDetailInfo.tranStatus=""; //贷款状态
	WithdrawDetailInfo.reviewDate="";//审核通过时间
	WithdrawDetailInfo.orderClosedDate="";//订单结清时间
	WithdrawDetailInfo.surrenderDate="";//解约时间
	WithdrawDetailInfo.flag="";
	WithdrawDetailInfo.cardNo="";//银行卡号
	WithdrawDetailInfo.cardNoStr="";//银行卡尾号
	WithdrawDetailInfo.cardBank="";
	WithdrawDetailInfo.bankCode="";
	WithdrawDetailInfo.repeatFlag="";	//是否允许重新申请   true不允许
	WithdrawDetailInfo.unlockDays="";	//锁单剩余天数
    	
    $scope.withdraw=WithdrawDetailInfo;
    $scope.UserInfo=UserInfo;
    $scope.BindCardObject=BindCardObject;
    //初始化数据
    MyCenterService.getWithdrawDetailsInit(UserInfo.mobile, UserInfo.specialSltAccountId);
    
	/**
	 * 重新申请额度
	 */
	$scope.repeatApplyAmt = function(){
		CommonService.reApplyAmt();
	}
	
	/**
	 * 再次提现
	 */
	$scope.withdrawOnce = function(){
		$location.url("/withdraw");
//		var token = $window.localStorage.getItem("x-auth-token");
//		$location.url("/eGet?xAuthToken="+token);
	}
	
	/**
	 * 跳转到账单
	 */
	$scope.gotoOrder = function(){
		var token = $window.localStorage.getItem("x-auth-token");
		$location.url("/order?xAuthToken="+token);
	}
	
    //重新签署合同
    $scope.signatureAgain=function(){
    	//跳转到合同页面
    	PageControllerObject.contractPage=1;
    	MyCenterService.preLoadLoanContract();
    }
    
	//初始化并跳转到相应页面
    $scope.goToHomePage=function(){
	    UserInfo.reapplyWithDrawFlag="1";//从订单记录里面开始跳转的标记
		var token = $window.localStorage.getItem("x-auth-token");
		$location.url("/eGet?xAuthToken="+token);
    }
});