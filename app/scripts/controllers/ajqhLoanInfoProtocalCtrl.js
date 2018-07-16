app.controller('ajqhLoanInfoProtocalCtrl',function($rootScope,$routeParams,$window,$scope,$location,PageControllerObject,
	UserInfo,ngUtils,BindBankService,ContractInfo,BindCardObject,RepaceBindCardObject,
	WithdrawRecordObject,BindMortgageBank,Constant,WithdrawService){
	//判断网络是否异常
	//检验是否网络中断    如果中断弹出提示
	if(window.navigator.onLine==false){
		ngUtils.alert("网络连接错误，请检查网络连接");
		//$scope.goBackWithdraw();
		return;
	}

    $scope.isSign = $routeParams.isSign;
	$scope.bindCard=BindCardObject;			//还款银行
	$scope.ContractInfo = ContractInfo;		
	$scope.WithdrawRecordObject=WithdrawRecordObject;
	$scope.Constant=Constant;
	$scope.UserInfo = UserInfo;
	$scope.RepaceBindCardObject = RepaceBindCardObject;
	
	UserInfo.mobile=$routeParams.mobile;
	ContractInfo.withdrawMoney=$routeParams.withdrawMoney;	    //提现金额
	ContractInfo.loanPeriods  =$routeParams.loanPeriods;		//还款期数
	$window.localStorage.setItem("x-auth-token", $routeParams.token);
	ContractInfo.contractNO=$routeParams.agreementId;			//合同编号
	ContractInfo.productType=$routeParams.productType;			//产品类型
	
	
	WithdrawService.initWithdrawContractInfo();
	
	$scope.loanAmtBig =ngUtils.convertToChinese(ContractInfo.loanAmt);
	
	$scope.singature=function(){
		$location.url('/noticeInfoProtocal');
	}
	$scope.cancel=function(){
		if(window.__wxjs_environment === 'miniprogram') {
			wx.miniProgram.navigateBack();
		} else {
	        var platform = window.Android || window;
		    platform.finishSelf();			
		}
	}
    // 同意
	$scope.agree=function(){
		//检验是否网络中断    如果中断弹出提示
		if(window.navigator.onLine==false){
			ngUtils.alert("网络连接错误，请检查网络连接");
			 return;
		}
	    $location.url("/weixingSingature?mobile="+$routeParams.mobile+"&name="+ContractInfo.realName+"&token="+$routeParams.token);

		// UserInfo.repaceSupplemental=true;
		// RepaceBindCardObject.agreeContractFlag=true;
		// UserInfo.deductAuth=true;
		// var callSina = {
		// 	'realName':UserInfo.realName,
		// 	'desc':'changeCard',
		// 	'customerId':UserInfo.customerId,
		// 	'sltAccountId':UserInfo.sltAccountId,
		// 	'signatureType':'3'
		// };
		// callSina = JSON.stringify(callSina);
		// var platform = window.Android || window;
		// platform.startSignature(callSina);
	}

	//返回
	$scope.goBackWithdraw=function(){
		var platform = window.Android || window;
		platform.goBackHome();
	}
});