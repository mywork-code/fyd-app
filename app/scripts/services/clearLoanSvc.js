
'use strict';

var app=angular.module("gfbApp");

/**
 * 一次还清service
 */
app.factory("ClearLoanService",function($resource,$location,$window,Constant,UserInfo,ClearInfo,ngUtils,CommonService,ContractInfo,$timeout){
	return {
		/**
		 * 清贷数据查询
		 */
		clearInit : function(){
			var path  = Constant.APIRoot + "/advance/query";
			var params = {
				mobile: UserInfo.mobile,
				sltAccountId:ClearInfo.sltAccountId,
				"x-auth-token":UserInfo.xAuthToken
			};
			console.log("clearInit==",params)
			var service = $resource(path,{},{
				connect:{method:'POST'}
			});
			ngUtils.loadingAlert();
			service.connect(params,
			function(response){
				console.log("clearInit==",response)
				if(response && response.status == "1"){
					ClearInfo.bankCode = response.data.bankCode;
					ClearInfo.cardBank = response.data.cardBank;
					ClearInfo.cardNo = response.data.cardNo;
					ClearInfo.cardNoStr = response.data.cardNoStr;
					// ClearInfo.sltAccountId = response.data.sltAccountId;
					ClearInfo.clearLoanAmount = response.data.clearLoanAmount;
					ClearInfo.clearLoanCapitalAmt = response.data.clearLoanCapitalAmt;
				}else{
					ngUtils.alert(response.msg);
				}
				ngUtils.loadingAlertClose();
			},
			function(error){
				ngUtils.loadingAlert();
				ngUtils.alert("网络连接失败，请检查您的网络后再试");
			});
		},
		
		/**
		 * 申请清贷
		 */
		clearLoanApply : function ($scope){
			ngUtils.loadingAlert();
			var path  = Constant.APIRoot + "/advance/settleLoan";
			var params = {
				sltAccountId : ClearInfo.sltAccountId,
				clearLoanAmount : ClearInfo.clearLoanAmount,//清贷总金额
				clearLoanCapitalAmt : ClearInfo.clearLoanCapitalAmt,//清贷本金
				"x-auth-token":UserInfo.xAuthToken
			};
			console.log('clearLoanApply===',params);
			var service = $resource(path,{},{
				connect:{method:'POST'}
			});
			service.connect(params,
			function(response){
				// console.log('response==',response)
				ngUtils.loadingAlertClose();
				if(response && response.status == "1"){
					// $scope.isCleanSuc=true;
					ClearInfo.time=response.msg;
					CommonService.getCurrentDate();
					var _now = ContractInfo.nowyear +'年'+ContractInfo.nowMonth +'月'+ContractInfo.nowDay +'日'+ContractInfo.nowHours +':'+ContractInfo.nowMinutes +':'+ContractInfo.nowSeconds +'';

//					您于_now\n提交了请贷申请，我们会尽快处理
					ngUtils.ConfirmBack1miss('您于'+_now+'\n提交了清贷申请，我们会尽快处理',function(){
						$timeout(function(){
							$location.url("/fydOrder?mobile="+UserInfo.mobile+"&token="+UserInfo.xAuthToken);
						},2)
					})

				}else{
					ngUtils.alertAndTime(response.msg,2000);
					//if(response.data&&response.data.resubmitFlag){
					//	var resubmitFlag =response.data.resubmitFlag;
					//	if(resubmitFlag&&resubmitFlag=="1"){
					//		$location.url("/order");
					//	}else{
					//		ngUtils.alertAndTime(response.msg,2000);
					//	}
					//}else{
					//	ngUtils.alertAndTime(response.msg,2000);
					//}
				}
			},
			function(error){
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络连接失败，请检查您的网络后再试");
			});
		}
	}
});