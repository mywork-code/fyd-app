
'use strict';

var app=angular.module("gfbApp");

/**
 * 首页初始化
 */
app.factory("IndexService", function($location, $resource, UserInfo, Constant, HomeIndexInfo, ngUtils){
	return {
		/**
		 * 首页初始化
		 */
		initIndex:function(type){
			var path = Constant.APIRoot + "/home/index";
			var params = {
				mobile:UserInfo.mobile,
			};
			var service = $resource(path,{},{
				connect:{method:'POST'}
			});
			service.connect(params,
				function(response){
		            if (response && response.status == '1') {
		            	HomeIndexInfo.page = response.data.page;
		            	HomeIndexInfo.faceScore = response.data.faceScore==null?0:response.data.faceScore;
		            	HomeIndexInfo.totalAmount = response.data.totalAmount==null?0:response.data.totalAmount;
		            	HomeIndexInfo.availableAmount = response.data.availableAmount==null?0:response.data.availableAmount;
		            	HomeIndexInfo.expireDate = response.data.expireDate==null?0:response.data.expireDate;
		            	
		            	UserInfo.customerId = response.data.customerId==null?"":response.data.customerId;
		            	UserInfo.customerStatus = response.data.customerStatus==null?"":response.data.customerStatus;
		    			UserInfo.identityNo = response.data.identityNo==null?"":response.data.identityNo;
		    			UserInfo.identityExpires = response.data.identityExpires==null?"":response.data.identityExpires;
		    			UserInfo.realName = response.data.realName==null?"":response.data.realName;
		    			UserInfo.mobile = response.data.mobile==null?"":response.data.mobile;
		    			UserInfo.creditLimit = response.data.totalAmount==null?0:response.data.totalAmount;
		    			UserInfo.avalidLimit = response.data.availableAmount==null?0:response.data.availableAmount;
		    			UserInfo.supportAdvanceFlag = response.data.supportAdvanceFlag==null?0:response.data.supportAdvanceFlag;
		            	
		            	if(HomeIndexInfo.page == "2"){ //2：激活钱包 
		            		$location.url("/activateWallet");
		            	}else if(HomeIndexInfo.page == "3"){ //3:有额度，提现
		            		$location.url("/withdrawals");
		            	}else if(HomeIndexInfo.page == "4"){ //4:未登录
		            		$location.url("/activateWallet");
		            	}else if(HomeIndexInfo.page == "5"){ //5:未注册
		            		$location.url("/register");
		            	}else { //1：测颜值 
		            		$location.url("/activateWallet");
		            	}
		            	
		            } else if (response && response.status == '-1') { // token认证失败,请先登录
		            	$location.url("/login");
		            } else {
		            	ngUtils.alert(response.msg);
		            }
				},
				function(error){
					ngUtils.alert("网络异常,请稍后重试.");
				});
			},
	}
});