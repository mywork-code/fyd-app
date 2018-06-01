
'use strict';

var app=angular.module("gfbApp");

/**
 * 互联网征信 services
 */
app.factory("CreditService",function($location,$rootScope,$resource,$window,CommonService,phoneValidateService,Constant,ngUtils,ZhengxinInfo,UserInfo,MobileVerifyInfo){
	return {
		/**
		 * 获取图片验证码
		 * type - 调用方式：=init，初始化时不显示弹出层；= hand,增加弹出层
		 */
		getLoginVerifyCode:function(type){
			ZhengxinInfo.randomCodeUrl = "";
			var path = Constant.APIRoot + "/credit/init";
			var service = $resource(path, {}, {
				init: {method: 'POST'}
			});
            var params = {};
			
			if(type == "hand"){
//				ngUtils.addLoading();
        	}
        	//页面加载验证码显示加载图片的标志位
			$rootScope.flag=1;
			service.init(params,
				function(response){
					//页面加载验证码显示加载图片的标志位
					$rootScope.flag=2;
					if(type == "hand"){
	//					ngUtils.loadingAlert();
		        	}
		            if (response && response.status == '1') {
		                ZhengxinInfo.token = response.data.tokenValue;
		                ZhengxinInfo.LoginrandomCodeUrl = response.data.randomCodeBase64;
		            } else {
		            	ngUtils.alert(response.msg);
		            }
				},
				function(error){
					if(type == "hand"){
//						ngUtils.loadingAlert();
		        	}
					ngUtils.alert("验证码加载失败，稍后请重试");
				});
		},
		getRegisterVerifyCode:function(type){
			ZhengxinInfo.randomCodeUrl = "";
			var path = Constant.APIRoot + "/credit/init";
			var service = $resource(path, {}, {
				init: {method: 'POST'}
			});
			var params = {};

			if(type == "hand"){
//				ngUtils.addLoading();
			}
			//页面加载验证码显示加载图片的标志位
			$rootScope.flags=1;
			service.init(params,
				function(response){
					//页面加载验证码显示加载图片的标志位
					$rootScope.flags=2;
					if(type == "hand"){
						//					ngUtils.loadingAlert();
					}
					if (response && response.status == '1') {
						ZhengxinInfo.token = response.data.tokenValue;
						ZhengxinInfo.RegisterrandomCodeUrl = response.data.randomCodeBase64;
					} else {
						ngUtils.alert(response.msg);
					}
				},
				function(error){
					if(type == "hand"){
//						ngUtils.loadingAlert();
					}
					ngUtils.alert("验证码加载失败，稍后请重试");
				});
		},
		/**
		 *征信注册 - 校验填写的证件信息是否匹配正确
		 */
		checkCertInfo: function(){
			var $me = this;
			var path = Constant.APIRoot + "/credit/registerOne";
			var resource = $resource(path, {},
			        {
			            checkCert: {
			                method: 'post'
			            }
			        });
	        var param = {
	            "token": ZhengxinInfo.token,
	            "vercode": ZhengxinInfo.vercode,
	            "name": ZhengxinInfo.realName,
	            "certType": ZhengxinInfo.certTypeValue,
	            "certNo": ZhengxinInfo.certNo
	        };
	        ngUtils.loadingAlert();
	        resource.checkCert(param,
	        function(response) {
	            if (response && response.status == '1') {
	            	ngUtils.loadingAlertClose();
	                $location.url("/creditRegUser");
	            } else {
	            	$me.getRegisterVerifyCode();
	            	ZhengxinInfo.vercode = "";
	            	ngUtils.loadingAlertClose();
	            	ngUtils.alert(response.msg);
	            }
	        },
	        function(error) {
	        	$me.getRegisterVerifyCode();
	        	ZhengxinInfo.vercode = "";
				ngUtils.loadingAlertClose();
	        	ngUtils.alert("央行证件检测发生异常，请稍后重试");
	        });
		},
		
		/**
		 * 征信注册第二步 ： 发送短信验证码到手机上
		 */
		sendMsgToMobile: function(){
			ngUtils.loadingAlert();
	        var path = Constant.APIRoot + "/credit/registerTwo";
	        var resource = $resource(path, {},
	        {
	            sendSms: {
	                method: 'post'
	            }
	        });
	        var param = {
	            "token": ZhengxinInfo.token,
	            "mobileTel": ZhengxinInfo.mobile
	        };
	        resource.sendSms(param,
	        function(response) {
	            if (response && response.status == '1') {
	            	ngUtils.loadingAlertClose();
	            	//启动定时器
	            	phoneValidateService.beginInterval(60);
	            } else {
	            	ngUtils.loadingAlertClose();
	            	ngUtils.alert(response.msg);
	            }
	        },
	        function(error) {
	        	ngUtils.loadingAlertClose();
	        	ngUtils.alert("短信发送失败，稍后请重试");
	        });
		},
		
		/**
		 * 征信注册第三步 -- 提交所有注册信息
		 */
		submitRegister: function(){
			ngUtils.loadingAlert();
	        var path = Constant.APIRoot + "/credit/registerThree";
	        var resource = $resource(path, {},
	        {
	            register: {
	                method: 'post'
	            }
	        });
	        var param = {
	            "token": ZhengxinInfo.token,
	            "mobileTel": ZhengxinInfo.mobile,
	            "username": ZhengxinInfo.username,
	            "password": ZhengxinInfo.password,
	            "confirmpassword": ZhengxinInfo.confirmpassword,
	            "email": ZhengxinInfo.email,
	            "smscode": ZhengxinInfo.smscode
	        };
	        resource.register(param,
	        function(response) {
	        	ngUtils.loadingAlertClose();
	            if (response && response.status == '1') {
	                $location.url("/creditRegResult");
	            } else {
	            	/* 修复 bug 80 add by lc 2016-07-27*/
	            	if(response.msg == "Token失效"){
	            		$location.url("/creditRegCert");
		            	CommonService.endInterval();	// 关闭计时器
		            	ZhengxinInfo.smscode = "";
	            	}else{
	            		ngUtils.alert(response.msg);
	            	}
	            }
	        },
	        function(error) {
	        	ngUtils.loadingAlertClose();
	        	ngUtils.alert("注册发生错误，请稍后重试！");
	        });
		},
		
		/**
		 * 征信登录后---配置支持查询码
		 */
		login:function(){
			var $me = this;
			//判断当前系统支持何种征信查询码获取方式：1、只支持五个问题，2、支持五个问题以及银测获取方式
			switch (ZhengxinInfo.supportWay) {
			  case '1': $me.confrimLogin();
			    break;
			  case '2': $me.chooseQueryCodeRetrieveMethod();
			    break;
			  default: $me.chooseQueryCodeRetrieveMethod();
			}
		},
		
		/**
		 * 银测获取查询码 - 跳转银测页面
		 */
		redirectUnionPay : function(){
			//显示银测页面
			$location.url("/creditUnionPayInput");
		},
		
		/**
		 * 征信查询码获取方式选择
		 */
		chooseQueryCodeRetrieveMethod: function(){
			ngUtils.loadingAlert();
			var $me = this;
			//根据登录状态控制跳转
			var path = Constant.APIRoot + "/credit/applyLogin";
			var resource = $resource(path, {},
			{
				login: {
			    	method: 'POST'
			    }
			});
	        var param = {
	        		"tokenid": UserInfo.portalToken,
		            "token": ZhengxinInfo.token,
		            "username": ZhengxinInfo.username,
		            "password": ZhengxinInfo.password,
		            "vercode": ZhengxinInfo.vercode,
		            "customerId": UserInfo.customerId,
		            "mobile": UserInfo.mobile,
		            "operate": ZhengxinInfo.operate
		     };		
	        resource.login(param,
	    	        function(response) {
	        			//登录成功
	    	            if (response && response.status == '1') {
	    	                ngUtils.loadingAlertClose();
	    	                // 跳转到问题列表页面
	    	                $location.url("/creditMethodChoice");
	    	            } else if (response && response.data == "report_exist") {
	    	            	ngUtils.loadingAlertClose();
	    	            	ngUtils.alertAndTime("您的个人信用信息报告已存在，请直接输入身份验证码进行激活",2000);
	    	            	ZhengxinInfo.vercode = "";
	    	                $location.url("/creditReportSecondLogin");
	    	            } else if (response && response.data == "credit_blank") {
	    	            	// 征信空白用户，直接跳转到征信失败页面 TODOng
	    	            	ngUtils.loadingAlertClose();
	    	            }else{
	    	            	$me.getLoginVerifyCode();
	    	            	ZhengxinInfo.vercode = "";
	    		        	ngUtils.loadingAlertClose();
	    		        	ngUtils.alert(response.msg);
							if(response.msg=='请先完成手机实名认证'){
                              //跳转到手机实名认证
                               $location.url("/phoneValidate")
							}
	    	            }
	    	        },
	    	        function(error) {
	    	        	$me.getLoginVerifyCode();
	                	ZhengxinInfo.vercode = "";
	    	        	ngUtils.loadingAlertClose();
	    	        	ngUtils.alert("登陆发生异常，稍后请重试");
	    	        });		
		},
		
		/**
		 * 征信登陆 -- 用户名、密码登陆，获得五个验证问题
		 */
		confrimLogin: function(){
			ngUtils.loadingAlert();
			var $me = this;
			var path = Constant.APIRoot + "/credit/apply/report";
	        var resource = $resource(path, {},
	        {
	            login: {
	                method: 'post'
	            }
	        });
	        var param = {
	        	"tokenid": UserInfo.portalToken,
	            "token": ZhengxinInfo.token,
	            "username": ZhengxinInfo.username,
	            "password": ZhengxinInfo.password,
	            "vercode": ZhengxinInfo.vercode,
	            "customerId": UserInfo.customerId,
	            "mobile": UserInfo.mobile,
	            "operate": ZhengxinInfo.operate
	        };
	        resource.login(param,
	        function(response) {
	            if (response && response.status == '1') {
	                // 用户名密码验证通过后，获取校验的5个问题
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
	            	$me.getLoginVerifyCode();
	            	ZhengxinInfo.vercode = "";
		        	ngUtils.loadingAlertClose();
		        	ngUtils.alert(response.msg);
	            }
	        },
	        function(error) {
	        	$me.getLoginVerifyCode();
            	ZhengxinInfo.vercode = "";
	        	ngUtils.loadingAlertClose();
	        	ngUtils.alert("登陆发生异常，稍后请重试");
	        });	
		},
		
		/**
		 * 征信登陆 -- 五个问题答案提交
		 */
		submitAnswers: function(param){
			ngUtils.loadingAlert();
	        var path = Constant.APIRoot + "/credit/submitAnswer";
	        var resource = $resource(path, {},
	        {
	            submit: {
	                method: 'post'
	            }
	        });
	        // 设置参数
			param["content"] = ZhengxinInfo.content;
			param["token"] = ZhengxinInfo.token;
			param["customerId"] = UserInfo.customerId;
			param["mobile"] = UserInfo.mobile;
			// 提交问题序号及答案
	        resource.submit(param,
	        function(response) {
	        	ngUtils.loadingAlertClose();
	            if (response && response.status == '1') {
	                ngUtils.constraintAlert("您的申请已提交，申请结果将在24小时发送至您的手机，请耐心等待","我知道了",function(){
		            	 $location.url("/creditReportSecondLogin");
	                });
	            } else {
	                // $("#ui-dial常og").show();
	            	ngUtils.alert(response.msg);
	                ZhengxinInfo.vercode = ""; // 清空验证码
	            }
	        },
	        function(error) {
	        	ngUtils.loadingAlertClose();
	        	ngUtils.alert("答案提交发生异常，稍后请重试");
	        });
		},

		/**
		 * 征信登陆 -- 激活码查询征信报告
		 */
		submitActiveCode: function(){
			ngUtils.loadingAlert();
            // 调用征信初初始化接口，获取token
			var $me = this;
            var path = Constant.APIRoot + "/credit/getReport";
            var params = {
            	"activeCode": ZhengxinInfo.activeCode,
            	"vercode": ZhengxinInfo.vercode,
            	"token": ZhengxinInfo.token,
            	"customerId": UserInfo.customerId,
	            "mobile": UserInfo.mobile
            };
            var resource = $resource(path,{},{activeZhengxin:{method:'post'}});
            resource.activeZhengxin(params,
            function(response){
            	ngUtils.loadingAlertClose();
            	if (response && response.status == '1') {
            		//查询码输入正确
                    $location.url("/waittingResult");
            	}else if(response &&( response.data == "fail" || response.data == "noauth" || response.data == "wait")){      
            		// 手机未实名，或者实名失败，需要重新进行手机实名认证
            		if(response.data == "fail"){
                		alert(response.msg);
                		MobileVerifyInfo.repeatFlag = "1";
                		$location.url("/phoneValidate");
            		}else if(response.data == "noauth"){
            			$location.url("/mobileNoAuth");
            		}else{
            			// 获取中，跳转到等待页面
            			$location.url("/creditActiveWait");
            		}
            	}else{
            		if(response.msg==' 身份验证码输入错误，请重新输入。'||response.msg=='验证码输入错误,请重新输入'||response.msg=='token、身份验证码、验证码、手机号以及客户号均不能为空'){
            			$me.getLoginVerifyCode();
                		ZhengxinInfo.vercode = "";
                		ZhengxinInfo.activeCode = "";
                		ngUtils.alertAndTime(response.msg,1500);
            		}else{
	            		$me.getLoginVerifyCode();
	            		ZhengxinInfo.vercode = "";
	            		ngUtils.alertAndTime(response.msg,1500);
            		}
            	}
            },
            function(error){
            	ngUtils.loadingAlertClose();
            	$me.getVerifyCode();
            	ZhengxinInfo.vercode = "";
        		ngUtils.alertAndTime("查询征信报告时发生异常，稍后请重试",1500);
            });
		},
		
		/**
		 * 征信决策等待页面  刷新按钮  查看客户最新状态跳转页面
		 */
		loadCustomer: function(){
			var path = Constant.APIRoot + "/customer/init";
			var service = $resource(path,{},{
				query:{method:'POST'}
			});
			var param = {
					mobile: UserInfo.mobile
			};
			ngUtils.loadingAlert();
			service.query(param,
			function(response){
				ngUtils.loadingAlert();
				if(response && response.status == "1"){
					UserInfo.customerStatus = response.data.status;
					if(UserInfo.customerStatus == "04"){
						// 决策进行中
						$location.url("/waittingResult");
					}else if(UserInfo.customerStatus == "05"){
						// 决策异常
						$location.url("/decisionError");
					}else if(UserInfo.customerStatus == "0501"){
						// 征信姓名 和 手机实名认证姓名不匹配
						$location.url("/identityFail");
					}else if(UserInfo.customerStatus == "06"){
						// 决策完成
						if(response.data.creditAmount && response.data.creditAmount > 0){
							// 申请额度成功
							UserInfo.creditLimit = response.data.creditAmount;  //授信总额度
							UserInfo.topRank = response.data.topRank;
							UserInfo.supportAdvance = response.data.supportAdvance;// 是否缴纳公积金
							UserInfo.advanceFlag = response.data.advanceFlag;// 是否已经提额
							//成功跳转页面有误
//							$location.url("/applySuccess"); 申请额度成功直接跳转到准备提现页面
							$location.url("/withdrawals");
						}else{
							UserInfo.expireDay = 15;  // 重新申请，剩余天数
							$location.url("/applyFail");
						}
					}else{
						ngUtils.alert("网络错误，请稍后重试或联系客服。");
					}
					
				}else{
					ngUtils.alert(response.msg);
				}
			},
			function(error){
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
			
		},
		
		/**
		 * 由征信报告申请页面返回到身份证识别页面
		 */
		backToIndentity: function(){
			var path = Constant.APIRoot + "/navigator/customerFocus";
			var service = $resource(path,{},{
				query:{method:'POST'}
			});
			var param = {
					mobile: UserInfo.mobile,
					customerId: UserInfo.customerId
			};
			ngUtils.loadingAlert();
			service.query(param,
			function(response){
				ngUtils.loadingAlertClose();
				if(response && response.status == "1"){
					UserInfo.identityNo = response.data.identityNo;
					UserInfo.identityExpires = response.data.identityExpires;
					UserInfo.personFlag = response.data.identityPerson;
					UserInfo.realName = response.data.realName;
					UserInfo.degree = response.data.educationDegree;
					UserInfo.degreeText = response.data.educationDegreeName;
					UserInfo.job = response.data.job;
					UserInfo.jobText = response.data.jobName;
					UserInfo.marState = response.data.marryStatus;
					UserInfo.marText = response.data.marryStatusName;
					UserInfo.marState = response.data.marryStatus;
					UserInfo.workProvince = response.data.workProvince;
					UserInfo.workCity = response.data.workCity;
					UserInfo.localRegistry = response.data.localRegistry;
					UserInfo.paidHouseFund = response.data.supportAdvance;
					UserInfo.mobileAuthStatus = response.data.mobileAuthStatus;
					UserInfo.mobileAuthDesc = "认证中";
					var token = $window.localStorage.getItem("x-auth-token");
					$location.url("/eGet?xAuthToken="+token);
					$location.replace();
				}else{
					ngUtils.alert(response.msg);
				}
			},
			function(error){
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		
		/**
		 * 查询客户当前手机详单状态
		 */
		queryMobileInfo: function(){
			var path = Constant.APIRoot + "/customer/init";
			var service = $resource(path,{},{
				query:{method:'POST'}
			});
			var param = {
					mobile: UserInfo.mobile
			};
			ngUtils.loadingAlert();
			service.query(param,
			function(response){
				ngUtils.loadingAlert();
				if(response && response.status == "1"){
					UserInfo.mobileAuthFlag = response.data.mobileAuthFlag;
					switch(UserInfo.mobileAuthFlag){
					case 'wait':
						ngUtils.alert("正在获取中，请稍候。。。");
						break;
					case 'noauth':
						$location.url("/mobileNoAuth");
						break;
					case 'fail':
						ngUtils.alert("手机实名认证失败，请重新认证");
                		MobileVerifyInfo.repeatFlag = "1";
                		$location.url("/phoneValidate");
                		break;
					default:
						$location.url("/mobileSuccess");//手机认证成功
						break;
					}
				}else{
					ngUtils.alert(response.msg);
				}
			},
			function(error){
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		
		init :function(){
			ZhengxinInfo.username = "";
			ZhengxinInfo.password = "";
			ZhengxinInfo.cardNo = "";
			ZhengxinInfo.cardTypeConfirmed = "0";
			ZhengxinInfo.mobile = "";
			ZhengxinInfo.cardPassword = "";
			ZhengxinInfo.cvn2= "";
			ZhengxinInfo.smscode = "";
			ZhengxinInfo.expireMonth = '01';		//	有效期月份
			ZhengxinInfo.expireYear = '15';		//  有效期年份
			ZhengxinInfo.cardRule = {			
				cardNo: true,
	            mobile: false,
	            smsCode: false,
	            expire: false,
	            cvn2: false,
	            credential: false,
	            name: false,
	            password: false	
	        };
			$('#vertify').on('tap',function(){
		    	  $("#ui-dialog1").dialog("show"); 
		     });
		},
		closeDialog :function(){
			$("#ui-dialog").dialog("hide");
			$location.url("/creditLogin");
		}
	}
});