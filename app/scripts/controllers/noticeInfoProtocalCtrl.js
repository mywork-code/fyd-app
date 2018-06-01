





'use strict';
var app = angular.module('gfbApp');

/**
 * 特别提示函
 */
app.controller('NoticeInfoProtocalCtrl',function($routeParams,$scope,$location,UserInfo,ngUtils,BindBankService,ContractInfo,BindCardObject,RepaceBindCardObject,Constant,PageControllerObject){
	$scope.PageControllerObject=PageControllerObject;
	$scope.ContractInfo = ContractInfo;
	$scope.UserInfo = UserInfo;
	$scope.Constant	= Constant;
	ContractInfo.isWeex = $routeParams.flag == 'weex' ? true : false;
	
	
	console.log(ContractInfo.isWeex)
	
	
	
	if(ContractInfo.isWeex){//从weex进来，数据只能重新获取
		
		ContractInfo.contractNO=$routeParams.contractNO;
		ContractInfo.realName=$routeParams.realName;
		ContractInfo.loanAmt=$routeParams.loanAmt;//贷款合同
		ContractInfo.loanPeriods  =$routeParams.loanPeriods;//还款期数
		ContractInfo.monthInterest=$routeParams.monthInterest;//贷款利率
		ContractInfo.everyMonthServiceAmtForFT=$routeParams.everyMonthServiceAmtForFT;	    //每月应付服务费金额
		ContractInfo.monthGuananteeAmt=$routeParams.monthGuananteeAmt;	    //每月应付担保费
		ContractInfo.handFee=$routeParams.everyMonthServiceMoney;	    //手续费
		ContractInfo.everyMonthMoneyForFT=$routeParams.monthlyPrincipalInterestAmt;         //每月还款金额
		
		
	}
	
	
	
	
	
	//公积金协议
	var d=new Date();
	if($routeParams.userName==''||$routeParams.userName==undefined){//如果未进行实名认证
		//ContractInfo.realName='';
	}else{
		ContractInfo.realName=$routeParams.userName;
	}
	ContractInfo.nowyear=d.getFullYear();
	ContractInfo.nowMonth=d.getMonth()+1;
	ContractInfo.nowDay=d.getDate();
    
	$scope.RepaceBindCardObject = RepaceBindCardObject;
	if("0" == ContractInfo.sltAccountInfo1.serviceSideType){
		ContractInfo.serviceName = '上海维信智荟互联网金融信息服务有限公司';//老服务方名称
		ContractInfo.serviceStamp = 'ui-weixin-service-contract-img';//老服务方用的章的css样式
	}else if("1" == ContractInfo.sltAccountInfo1.serviceSideType){
		ContractInfo.serviceName = '上海维信荟智金融科技有限公司';//新服务方名称
		ContractInfo.serviceStamp = 'ui-weixin-new-service-contract-img';//新服务方用的章的css样式
	}
	
	/**
	 * 返回提现页面
	 */
	$scope.singature=function(){
//		//如果为退回客户签名
//		if(PageControllerObject.contractPage==1){
//			$location.url("/commonSingature");
//			return ;
//		}
//		UserInfo.noticeInfoContract=true;
		//$location.url("/withdraw");
		var platform = window.Android || window;
		platform.goBackHome();
	}
	
	/**
	 * 不同意
	 */
	$scope.cancel=function(){
		UserInfo.noticeInfoContract=false;
		$location.url("/withdraw");
//		history.go(-1);
	}
});
