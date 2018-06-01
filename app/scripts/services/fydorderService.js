'use strict';

var app=angular.module("gfbApp");

/**
 * 账单
 */
app.factory("fydorderService", function($rootScope, $resource, $location, Constant, UserInfo,
						OrderInfo, ngUtils,ClearInfo,$q,WithdrawRecordObject) {
	return {

		/**
		 * 初始化客户的订单数据
		 */
		initOrderData : function($scope) {
			var path = Constant.APIRoot + "/slt/list";
			// var path = Constant.APIRoot + "/slt/lxxxxxxxxxxist";
			// var path =  "http://app.apass.vcash.cn/appweb/data/ws/rest/order/init/data";
			var orderServiceObj=this;
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});

			var params = {
	            "mobile" : UserInfo.mobile,
				"x-auth-token":UserInfo.xAuthToken				
				// "mobile" : "13036898489",
				// "x-auth-token":"eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsaXN0ZW5pbmcuand0Lmlzc3Vlcj86bGlzdGVuaW5nLWp3dC1pc3N1ZXIiLCJhdWQiOiJsaXN0ZW5pbmcuand0LmF1ZGllbmNlPzpsaXN0ZW5pbmctand0LWF1ZGllbmNlIiwiaWF0IjoxNDkyMDU2MTA5LCJleHAiOjE2MTMwMTYxMDksImluZm8iOnsidXNlcklkIjoiMjMzNCIsIm1vYmlsZSI6IjEzOTEyOTg3NzYwIn19.7oR7vzNHtPkw6Clo-MtbGMoXxFm1W0JaVEj2o4_N9Yc"
			};
			console.log("params===",params)
			ngUtils.loadingAlert();
			var deferred = $q.defer();
			service.connect(params, function(response) {
				$scope.isLoad = false;
				console.log(response)
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					OrderInfo.cardNum                  =response.data.cardNum;
					OrderInfo.loanType                 =response.data.loanType;
					OrderInfo.totalAmount              =response.data.totalAmount;
					OrderInfo.availableAmount          =response.data.availableAmount;
					OrderInfo.withdrawAmount            =response.data.withdrawAmount;
					OrderInfo.totalWithdrawAmount      =response.data.totalWithdrawAmount;
					OrderInfo.totalOverDueAmount       =response.data.totalOverDueAmount;
					OrderInfo.sltDetailList            =response.data.sltDetails;
					//添加用户的id，为app端清贷的时候使用
					UserInfo.customerId				   =response.data.customerId;
					var counts=OrderInfo.availableAmount - OrderInfo.withdrawAmount;
					if(counts<0){
						counts=-counts;
					}
					
					// orderServiceObj.myBillprogressAnimation({ //加载
				 //        totle: OrderInfo.totalAmount,//总数
				 //        count: counts,//当前数
				 //        wrap: $("#myBillCanvasWrap"),
				 //        canvas:"myBillCanvas"
				 //    });
					
					if(OrderInfo.sltDetailList && OrderInfo.sltDetailList.length>0){
						 $scope.showOrderFlag1 = true;
                         $scope.showOrderFlag2 = false;
					}else{
						 $scope.showOrderFlag1 = false;
                         $scope.showOrderFlag2 = true;
					}
				}  else {
					//操作失败
					// ngUtils.alert(response.msg);
					$scope.showOrderFlag1 = false;
                    $scope.showOrderFlag2 = true;
				}
				deferred.resolve(response);
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络连接失败，请检查您的网络后再试");
				$scope.isNetworkOutage = true;
			});
			return deferred.promise;
		},
        pendingInformation : function($scope) {
			var path = Constant.APIRoot + "/identity/pendingInformation";
			// var path = Constant.APIRoot + "/slt/lxxxxxxxxxxist";
			// var path =  "http://app.apass.vcash.cn/appweb/data/ws/rest/order/init/data";
			var orderServiceObj=this;
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});

			var params = {
	            "sltAccountId": WithdrawRecordObject.sltAccountId,
				"type": "1" 
			};
			console.log("params===",params)
			ngUtils.loadingAlert();
			var deferred = $q.defer();
			service.connect(params, function(response) {
				$scope.isLoad = false;
				console.log(response)
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
				
				}  else {
					//操作失败
					ngUtils.alert(response.msg);
				
				}
				deferred.resolve(response);
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络连接失败，请检查您的网络后再试");
				$scope.isNetworkOutage = true;
			});
			return deferred.promise;
		},		
		toRepay:function(){
			var path = Constant.APIRoot + "/order/init/data";
			var orderServiceObj=this;
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				"mobile" : UserInfo.mobile,
				"sltAccountId" : ClearInfo.sltAccountId,
				"x-auth-token":UserInfo.xAuthToken
			};
			ngUtils.loadingAlert();
			console.log(params)
			var deferred = $q.defer();
			service.connect(params, function(response) {
				if(response && response.status == "1"){
					deferred.resolve(response);
				}else {
					ngUtils.alert(response.msg);
				}
				console.log(response)

				ngUtils.loadingAlertClose();
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络连接失败，请检查您的网络后再试");
			});
			return deferred.promise;
		},
		//加载动画
	     /**
		 * 查看订单的还款详情
		 */
        orderDetailInfo:function(list){
        	console.log("list===",list)
			var path = Constant.APIRoot + "/slt/detailInfo";
			var orderServiceObj=this;
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				"sltAccountId" : list.sltAccountId,
				"x-auth-token":UserInfo.xAuthToken
			};
			ngUtils.loadingAlert();
			console.log(params)
			var deferred = $q.defer();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if(response && response.status == "1"){
					deferred.resolve(response);
				}else {
					ngUtils.alert(response.msg);
				}
				console.log(response)
			}, function(error) {
				ngUtils.loadingAlertClose();
				$scope.isNetworkOutage = true;
				ngUtils.alert("网络连接失败，请检查您的网络后再试");
			});
			return deferred.promise;
		},




	}
});

