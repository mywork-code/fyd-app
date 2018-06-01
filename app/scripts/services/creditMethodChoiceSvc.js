
'use strict';

var app=angular.module("gfbApp");

/**
 * 银测页面 services
 */
app.factory("CreditMethodChoiceSvc",function($location,$resource,CommonService,Constant,ngUtils,ZhengxinInfo,UserInfo,MobileVerifyInfo){
	return {
		/**
		 * 初始化征信页面
		 */
		initNetCredit:function(){
			var $me = this;
			var path = Constant.APIRoot + "/credit/unionPay/getAuthPage";
			var resource = $resource(path, {},
			        {
						initNetCredit: {
			                method: 'POST'
			            }
			        });
	        var param = {
	            "token": ZhengxinInfo.token,
	            "customerId": UserInfo.customerId
	        };
	        ngUtils.loadingAlert();
	        resource.initNetCredit(param,
	        function(response) {
	            if (response && response.status == '1') {
	            	ngUtils.loadingAlertClose();
	            	ZhengxinInfo.unionhtml=response.data.result;
	            	ZhengxinInfo.verCodeBase64=response.data.verCodeBase64;
	            	//初始化银测页面--调用VBS接口进行token转换，征信token转化为银联token
	            	$me.initUnionPay();
	            } else if (response && response.data == "report_exist") {
	            	ngUtils.loadingAlertClose();
	            	ngUtils.alertAndTime("您的个人信用信息报告已存在，请直接输入身份验证码进行激活",2000);
	                $location.url("/creditReportSecondLogin");
	            } else if (response && response.data == "credit_blank") {
	            	// 征信空白用户，直接跳转到征信失败页面 TODO
                     ngUtils.loadingAlertClose();
	            }else {
	            	ngUtils.loadingAlertClose();
	            	ngUtils.alertAndTime("网络错误，请稍后重试或联系客服。",1600);
	            }
	        },
	        function(error) {
	        	ngUtils.loadingAlertClose();
	        	ngUtils.alertAndTime("网络错误，请稍后重试或联系客服。",1600);
	        });
		},
		
		/**
		 * 初始化银测页面
		 */
		initUnionPay:function(){
			var $me = this;
			var path = Constant.APIRoot + "/credit/unionPay/initAuthentication";
			var resource = $resource(path, {},
			        {
			            intUnionPay: {
			                method: 'POST'
			            }
			        });
	        var param = {
	            "unionhtml": ZhengxinInfo.unionhtml
	        };
	        ngUtils.loadingAlert();
	        resource.intUnionPay(param,
	        function(response) {
	            if (response && response.status == '1') {
	            	ngUtils.loadingAlertClose();
	            	var result = eval('(' + response.data.result + ')'); 
	            	ZhengxinInfo.unionPayToken = response.data.tokenValue;
	            	ZhengxinInfo.exponent = result.p.exponent;
	            	ZhengxinInfo.modulus = result.p.modulus;
	            	//重新刷新验证码
	            	if(ZhengxinInfo.refresh!=true){
	            		$location.url("/creditMethodBankCard");	            		
	            	}
	            } else {
	            	ngUtils.loadingAlertClose();
	            	ngUtils.alert("网络错误，请稍后重试或联系客服。");
	            }
	        },
	        function(error) {
	        	ngUtils.loadingAlertClose();
	        	ngUtils.alert("网络错误，请稍后重试或联系客服。");
	        });
		},
		
		/**
		 * 获取5个问题
		 */
		redirectFiveQuestion:function(){
			ngUtils.loadingAlert();
			var $me = this;
			var path = Constant.APIRoot + "/credit/getQuestions";
	        var resource = $resource(path, {},
	        {
	        	redirectFiveQuestion: {
	                method: 'post'
	            }
	        });
	        var param = {
	            "token": ZhengxinInfo.token,
	            "customerId": UserInfo.customerId,
	            "operate": ZhengxinInfo.operate
	        };
	        resource.redirectFiveQuestion(param,
	        function(response) {
	            if (response && response.status == '1') {
	                // 获取校验的5个问题
	                ZhengxinInfo.questionList = response.data.questionList;
	                // 保存content内容，提交时作为参数传递过去
	                ZhengxinInfo.content = response.data.content;
	                ngUtils.loadingAlertClose();
	                // 跳转到问题列表页面
	                $location.url("/questionList");
	            } else if (response && response.data == "report_exist") {
	            	ngUtils.loadingAlertClose();
	            	ngUtils.alertAndTime("您的个人信用信息报告已存在，请直接输入身份验证码进行激活",2000);
	            	ZhengxinInfo.vercode = "";
	                $location.url("/creditReportSecondLogin");
	            } else if (response && response.data == "credit_blank") {
	            	// 征信空白用户，直接跳转到征信失败页面 TODO
	            	ngUtils.loadingAlertClose();
	            }else{
	            	$me.getVerifyCode();
	            	ZhengxinInfo.vercode = "";
		        	ngUtils.loadingAlertClose();
		        	ngUtils.alert("网络错误，请稍后重试或联系客服。");
	            }
	        },
	        function(error) {
	        	$me.getVerifyCode();
            	ZhengxinInfo.vercode = "";
	        	ngUtils.loadingAlertClose();
	        	ngUtils.alert("网络错误，请稍后重试或联系客服。");
	        });
		}
	}
});