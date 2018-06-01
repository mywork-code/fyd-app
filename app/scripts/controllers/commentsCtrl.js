'use strict';
var app = angular.module('gfbApp');

/**
 * 吐槽页面
 */
app.controller('CustomerCommentCtrl', function ($scope,$resource, Constant,UserInfo,ngUtils) {
//	 $scope.UserInfo = UserInfo; 
//
//	 $scope.saveCustomerComments = function(){ // 点击‘下一步’，将数据保存到后台
//		 
//		 var customerComments = $scope.customerComments;
//		 var flag = $scope.checkCustomerImpl(customerComments);
//	     if(flag){
//				  var path = Constant.APIRoot + "/customer/save/customerComments";			  
//				  var param = {
//						"mobile" : UserInfo.mobile,
//						"customerComments" : $scope.customerComments
//					};
//				  var resource = $resource(path,{},{saveCustomerComments:{method:'post'}}); 
//				  resource.saveCustomerComments(param,function(response){
//					  if(response && response.status == '1'){
//						  $scope.customerComments = '';
//						  ngUtils.alert("吐槽成功,欢迎继续!");
//					  }else{
//						  ngUtils.alert(response.msg);
//					  }  
//				  },function(error){
//					  ngUtils.alert("网络异常，请重试.");
//				  });
//		     }
//	  };
//	  
//	  $scope.checkCustomerImpl = function(fieldName){
//			if(fieldName == undefined || fieldName=='' ) {
//				ngUtils.alert("请输入要吐槽内容！");
//				return false;
//		    }
//			
//			return true;
//		};
});