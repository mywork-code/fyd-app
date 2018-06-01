
'use strict';

var app=angular.module("gfbApp");

/**
 * 银测页面(用户信息输入) services
 */
app.factory("CreditUnionPaySvc",function($rootScope,$location,$resource,Constant,CommonService,ngUtils,ZhengxinInfo,UserInfo,phoneValidateService){
	return {
		/**
		 * 获取用户银测卡信息
		 */
		getCardInfo:function(){
			var $me = this;
			var path = Constant.APIRoot + "/credit/getBankCodeInfo";
			var resource = $resource(path, {},
			        {
						getCardInfo: {
			                method: 'POST'
			            }
			        });
	        var param = {
	            "token": ZhengxinInfo.unionPayToken,
	            "creditcardNo": ZhengxinInfo.cardNo
	        };
	        ngUtils.loadingAlert();
	        resource.getCardInfo(param,
	        function(response) {
	            if (response && response.status == '1') {
	            	ngUtils.loadingAlertClose();
	            	ZhengxinInfo.smscode = '';
	            	ZhengxinInfo.cardRule = $me.retrieveCardRule(response);
	            	ZhengxinInfo.cardNumber = $me.retrieveRespCardNumber(response);
	            	//根据是否为信用卡，清空expire date
	            	if(ZhengxinInfo.cardRule.expire == false){
	            		ZhengxinInfo.expireMonth = '';
	            		ZhengxinInfo.expireYear = '';
	            	}else{
	            		ZhengxinInfo.expireMonth = '01';
	            		ZhengxinInfo.expireYear = '15';
	            	}
	            	ZhengxinInfo.cardTypeConfirmed = '1';
	            	if(ZhengxinInfo.cardRule.expire == false){
	            		//非信用卡跳转到正常的页面
	            		$location.url("/creditMethodBankCard2");
	            	}else{
	            		$location.url("/creditMethodBankCard3");
	            	}
	            } else {
	            	ngUtils.loadingAlertClose();
	            	ngUtils.alert(response.msg);
	            }
	        },
	        function(error) {
	        	ngUtils.loadingAlertClose();
	        	ngUtils.alert("网络错误，请稍后重试或联系客服。");
	        });
		},
		
		/**
		 * 发送短信获取验证码
		 */
		sendSms : function(){
			var $me = this;
			var path = Constant.APIRoot + "/credit/getVcode";
			var resource = $resource(path, {},
			        {
						sendSms: {
			                method: 'POST'
			            }
			        });
	        var param = {
	            "token": ZhengxinInfo.unionPayToken,
	            "mobile": ZhengxinInfo.mobile
	        };
	        ngUtils.loadingAlert();
	        resource.sendSms(param,
	        function(response) {
	            if (response && response.status == '1') {
	            	ngUtils.loadingAlertClose();
	            	ngUtils.alert("短信发送成功。");
	            	//CommonService.beginInterval(60);
	            	//启动定时器
	            	phoneValidateService.beginInterval(60);
	            } else {
	            	ngUtils.loadingAlertClose();
	            	ngUtils.alert(response.msg);
	            }
	        },
	        function(error) {
	        	ngUtils.loadingAlertClose();
	        	ngUtils.alert("网络错误，请稍后重试或联系客服。");
	        });
		},
		
		/**
		 * 提交银测信息
		 */
		submitUnionPay: function(){
			var $me = this;
			var path = Constant.APIRoot + "/credit/submitBankInfo";
			var resource = $resource(path, {},
			        {
						submitUnionPay: {
			                method: 'POST'
			            }
			        });
			var modulus = ZhengxinInfo.modulus, exponent = ZhengxinInfo.exponent;
			//var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
	        var param = {
	            "token": 			ZhengxinInfo.unionPayToken,
	            "creditcardNo": 	ZhengxinInfo.cardNo,
	            "mobile": 			ZhengxinInfo.mobile,
	            "customerId":       UserInfo.customerId,
	            "cvn2": 			ZhengxinInfo.cvn2,
//	            "expire": 			ZhengxinInfo.expireMonth+ZhengxinInfo.expireYear,
	            "expire": 			ZhengxinInfo.expireMonthAndYear,
	            "smsCode": 			ZhengxinInfo.smscode,
	            "credentialType": 	'01',
	            "credential": 		ZhengxinInfo.certNo,
	            "name": 			ZhengxinInfo.realName,
	            //"password":			ZhengxinInfo.cardPassword==""?"":BASE64.encoder(DES3.encrypt(ZhengxinInfo.cardPassword))
	            //"password":			ZhengxinInfo.cardPassword==""?"":RSAUtils.encryptedString(publicKey, ZhengxinInfo.cardPassword)
	            "password":			ZhengxinInfo.cardPassword==""?"":formatToHex(ZhengxinInfo.cardPassword,ZhengxinInfo.cardNumber,modulus,exponent)
	        };
	        ngUtils.loadingAlert();
	        resource.submitUnionPay(param,
	        function(response) {
	        	ZhengxinInfo.smscode = '';
	            if (response && response.status == '1') {
	            	ngUtils.loadingAlertClose();
	            	ZhengxinInfo.unionPayCode = response.data.result;
	            	$rootScope.unionPayCodeShowFlag=true;
	            } else {
	            	//如果输入的信息与在互联网个人信用信息服务平台上注册时填写的信息不一致，允许用户修改姓名
	            	if(response.msg.indexOf("不一致") >= 0)
	            		document.getElementById("customerRealName").readOnly=false;
	            	ngUtils.loadingAlertClose();
	            	ngUtils.alert(response.msg);
	            }
	        },
	        function(error) {
	        	ZhengxinInfo.smscode = '';
	        	ngUtils.loadingAlertClose();
	        	ngUtils.alert("网络错误，请稍后重试或联系客服。");
	        });
		},
		
		/**
		 * 确认提交银测信息
		 */
		submitUnionPayConfirm:function(){
			var $me = this;
			var path = Constant.APIRoot + "/credit/verifyAuthInfo";
			var resource = $resource(path, {},
			        {
						submitUnionPay: {
			                method: 'POST'
			            }
			        });
	        var param = {
	            "token": 			ZhengxinInfo.token,
	            "vercode": 			ZhengxinInfo.verCode,
	            "unionpaycode":  	ZhengxinInfo.unionPayCode,
	            "customerId": 		UserInfo.customerId
	        };
	        ngUtils.loadingAlert();
	        resource.submitUnionPay(param,
	        function(response) {
	            if (response && response.status == '1') {
	            	ngUtils.loadingAlertClose();
	            	$rootScope.unionPayCodeShowFlag=false;
	            	$location.url("/creditReportSecondLogin");
	            } else {
	            	ngUtils.loadingAlertClose();
	            	// edit by lc 2016-07-25
	            	/*$("#unionPayCode").removeClass("show");*/
	            	// add by lc 2016-07-25   图片验证码提交失败后，自动刷新，重新获取
	            	/*	先注释掉  由于暂时无法测试  下一个版本再改  bug 143
	            	if(ZhengxinInfo.refresh!=true){
	            		ZhengxinInfo.refresh = true;
	            	}
	            	CreditMethodChoiceSvc.initNetCredit();
	            	*/
	            	ngUtils.alert(response.msg);
	            }
	        },
	        function(error) {
	        	ngUtils.loadingAlertClose();
	        	/*$("#unionPayCode").removeClass("show");*/
	        	ngUtils.alert("网络错误，请稍后重试或联系客服。");
	        });
		},
		
		/**
		 * 校验手机号-11位
		 */
		validatePhone:function(){
			if(ZhengxinInfo.cardRule.mobile == false)
				return 'success';
			if(ZhengxinInfo.mobile.length !== 11){
				ngUtils.alert("请输入11位手机号");
				return 'failed';
			}
			else
				return 'success';
		},
		
		/**
		 * 校验卡背面末三位
		 */
		validateCvn2: function(){
			//如果校验卡背面末三位不需要显示则认为不是必填项，不进行校验
			if(ZhengxinInfo.cardRule.cvn2 == false)
				return 'success';
			if(ZhengxinInfo.cvn2.length !== 3){
				ngUtils.alert("请输入3位CVN码");
				return 'failed';
			}
			else
				return 'success';
		},
		
		/**
		 * 校验短信验证码-6位
		 */
		validateSmsCode: function(){
			//如果sms不需要显示则认为不是必填项，不进行校验
			if(ZhengxinInfo.cardRule.smsCode == false)
				return 'success';
			if(ZhengxinInfo.smscode.length !== 6){
				ngUtils.alert("请输入6位手机短信验证码");
				return 'failed';
			}
			else
				return 'success';
		},
		
		/**
		 * 验证银行卡密码-6位
		 */
		validatePassword:function(){
			//如果银行卡密码不需要显示则认为不是必填项，不进行校验
			if(ZhengxinInfo.cardRule.password == false)
				return 'success';
			if(ZhengxinInfo.cardPassword.length !== 6){
				ngUtils.alert("请输入6位银行卡密码");
				return 'failed';
			}else{
				return 'success';
			}
		},
		
		
		/**
		 * 获取卡种页面显示规则
		 */
		retrieveCardRule : function(response){
			var rules = {
					cardNo: true,
		            mobile: false,
		            smsCode: false,
		            expire: false,
		            cvn2: false,
		            credential: false,
		            name: false,
		            password: false	
			};
			var detail;
			var ruleDetail;
			if(response && typeof(response)!=="undefined" && response!==0 &&
					response.data && typeof(response.data)!=="undefined" && response.data!==0 &&
					response.data.result && typeof(response.data.result)!=="undefined" && response.data.result!==0)
				detail=JSON.parse(response.data.result);
			if(detail && typeof(detail)!=="undefined" && detail!==0 &&
					detail.p && typeof(detail.p)!=="undefined" && detail.p!==0 &&
					detail.p.displayCardInfo && typeof(detail.p.displayCardInfo)!=="undefined" && detail.p.displayCardInfo!==0 &&
					detail.p.displayCardInfo.rules && typeof(detail.p.displayCardInfo.rules)!=="undefined" && detail.p.displayCardInfo.rules!==0)
				ruleDetail=detail.p.displayCardInfo.rules;
			if(ruleDetail && typeof(ruleDetail)!=="undefined" && ruleDetail!==0)
				rules=ruleDetail;
			return rules;
		},

		retrieveRespCardNumber : function(response) {
            if (!response.data || !response.data.result) {
                return '';
            }
            var detail = JSON.parse(response.data.result);
            if (!detail || !detail.p || !detail.p.displayCardInfo) {
                return '';
            }
            return detail.p.displayCardInfo.cardNumber;
        }
		
	}
});