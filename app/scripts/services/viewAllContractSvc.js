
'use strict';

var app=angular.module("gfbApp");
/**
 *订单初始化数据
 */
app.factory("ViewAllContractService",function($http,$resource,$location,ngUtils,UserInfo,Constant,ContractInfo) {
	return {

		queryVbsContract : function(sltId,contractNameValue){
			var path = Constant.APIRoot + "/contract/show";
			var params = {
					mobile : UserInfo.mobile,
					sltAccountId : sltId,
					contractName : contractNameValue,
					"x-auth-token":UserInfo.xAuthToken
				};
			console.log('params==',params);
			ngUtils.loadingAlert();
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				console.log('response==',response);
				if (response && response.status == "1") {
					ContractInfo.vbsContractInfoList = response.data;
					$location.url("/queryVbsContract");
				}else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络连接失败，请检查您的网络后再试");
			});	
		}
	
	
	}
});

