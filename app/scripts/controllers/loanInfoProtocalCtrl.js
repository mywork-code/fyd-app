'use strict';
var app = angular.module('gfbApp');

/**
 * 贷款合同及相关套件
 */
app.controller('LoanInfoProtocalCtrl',function($rootScope,$routeParams,$scope,$location,PageControllerObject,
	UserInfo,ngUtils,BindBankService,ContractInfo,BindCardObject,RepaceBindCardObject,
	WithdrawRecordObject,BindMortgageBank,Constant,WithdrawService){
	//判断网络是否异常
	//检验是否网络中断    如果中断弹出提示
	if(window.navigator.onLine==false){
		ngUtils.alert("网络连接错误，请检查网络连接");
		//$scope.goBackWithdraw();
		return;
	}
	
	ContractInfo.isWeex = $routeParams.flag == 'weex' ? true : false;
	if(ContractInfo.isWeex){//从weex进来
		var nowDate = new Date();
		ContractInfo.nowyear=nowDate.getFullYear();
		ContractInfo.nowMonth=nowDate.getMonth()+1;
		ContractInfo.nowDay=nowDate.getDate();

		ContractInfo.realName=$routeParams.realName;
		ContractInfo.identityNo=$routeParams.identityNo;
		ContractInfo.mobile=$routeParams.mobile;
		ContractInfo.cardNo=$routeParams.cardNo;//卡号
		ContractInfo.cardBank=$routeParams.cardBank;//银行

		ContractInfo.contractNO=$routeParams.contractNO;

		ContractInfo.liveAddress=$routeParams.liveAddress;
		ContractInfo.loanAmt=$routeParams.loanAmt;//贷款合同
		ContractInfo.withdrawMoney=$routeParams.loanAmt;	    //提现金额
		ContractInfo.monthlyPrincipalInterestAmt=$routeParams.monthlyPrincipalInterestAmt;//每月本息还款额
		ContractInfo.monthInterest=$routeParams.monthInterest;//贷款利率
		ContractInfo.loanPeriods  =$routeParams.loanPeriods;//还款期数
		ContractInfo.everyMonthServiceMoney  =$routeParams.everyMonthServiceMoney;//手续费


//	ContractInfo.everyMonthMoneyForFT=$routeParams.monthlyPrincipalInterestAmt;         //每月还款金额
		ContractInfo.handFee=$routeParams.everyMonthServiceMoney;	    //手续费
		ContractInfo.everyMonthServiceAmtForFT=$routeParams.everyMonthServiceAmtForFT;	    //每月应付服务费金额

		ContractInfo.monthGuananteeAmt=$routeParams.monthGuananteeAmt;	    //每月应付担保费
		ContractInfo.kouShiFei=$routeParams.kouShiFei;	    //扣失费
	}else {
		var platform = window.Android || window;
		var json=platform.getWithdrawCashInfo();
		json = eval("(" + json + ")");
		ContractInfo.contractNO=json.contractNO;
		ContractInfo.nowyear=json.nowYear;
		ContractInfo.nowMonth=json.nowMonth;
		ContractInfo.nowDay=json.nowDay;
		ContractInfo.realName=json.realName;
		ContractInfo.identityNo=json.identityNo;
		ContractInfo.mobile=json.mobile;
		ContractInfo.liveAddress=json.liveAddress;
		ContractInfo.loanAmt=json.loanAmt;//贷款合同
		ContractInfo.monthlyPrincipalInterestAmt=json.monthlyPrincipalInterestAmt;//每月本兮还款额
		ContractInfo.monthInterest=json.monthInterest;//贷款利率
		ContractInfo.loanPeriods  =json.loanPeriods;//还款期数
		ContractInfo.everyMonthServiceMoney  =json.everyMonthServiceMoney;//手续费
		ContractInfo.cardNo=json.cardNo;//卡号
		ContractInfo.cardBank=json.cardBank;//银行
		ContractInfo.everyMonthMoneyForFT=json.monthlyPrincipalInterestAmt;         //每月还款金额
		ContractInfo.handFee=json.everyMonthServiceMoney;	    //手续费
		ContractInfo.everyMonthServiceAmtForFT=json.everyMonthServiceAmtForFT;	    //每月应付服务费金额
		ContractInfo.withdrawMoney=json.withdrawMoney;	    //提现金额
		ContractInfo.monthGuananteeAmt=json.monthGuananteeAmt;	    //每月应付担保费
		ContractInfo.kouShiFei=json.kouShiFei;	    //扣失费
	}
	
	
	
	
/*	$scope.PageControllerObject=PageControllerObject;
	$scope.BindMortgageBank=BindMortgageBank;//放款银行
*/	$scope.bindCard=BindCardObject;//还款银行
	$scope.ContractInfo = ContractInfo;
	$scope.WithdrawRecordObject=WithdrawRecordObject;
	$scope.Constant=Constant;
	$scope.UserInfo = UserInfo;
	$scope.RepaceBindCardObject = RepaceBindCardObject;
	$scope.loanAmtBig =ngUtils.convertToChinese(ContractInfo.loanAmt);
	if("0" == ContractInfo.sltAccountInfo1.serviceSideType){
		ContractInfo.serviceName = '上海维信智荟互联网金融信息服务有限公司';//老服务方名称
		ContractInfo.serviceStamp = 'ui-weixin-service-contract-img';//老服务方用的章的css样式
	}else if("1" == ContractInfo.sltAccountInfo1.serviceSideType){
		ContractInfo.serviceName = '上海维信荟智金融科技有限公司';//新服务方名称
		ContractInfo.serviceStamp = 'ui-weixin-new-service-contract-img';//新服务方用的章的css样式
	}
	
	$scope.singature=function(){
//		//如果为退回客户签名
//		if(PageControllerObject.contractPage==1){
//			$location.url("/noticeInfoProtocal");
//			return ;
//		}
//		UserInfo.loanInfoContract=true;
		//直接跳转到下个合同
		$location.url('/noticeInfoProtocal');
//		$location.url("/withdraw");
	}
	$scope.cancel=function(){
		UserInfo.loanInfoContract=false;
		//$location.url("/withdraw");
		$scope.goBackWithdraw();
	}
	//返回
	$scope.goBackWithdraw=function(){
		$rootScope.goBackHome();
	}
});