
'use strict';

var app=angular.module("gfbApp");

/**
 * 首页初始化
 */
app.factory("yibaoService", function($location, $rootScope,$resource, $q,UserInfo, Constant, HomeIndexInfo, ngUtils,$window,YibaoPay,CommonService,CountdownObj){
	return {
		/**
		 * 首页初始化
		 */
		repay:function(){
			ngUtils.loadingAlert();
			var path = Constant.APIRoot + "/activePay/query/amtInfo";

			var params = {
				mobile:UserInfo.mobile,
				sltAcctId:YibaoPay.sltAcctId,
				"x-auth-token":UserInfo.xAuthToken
			};
			console.log('repay===',params);
			var service = $resource(path,{},{
				connect:{method:'POST'}
			});
			service.connect(params,
				function(response){
					console.log('bindrepay====',response)
					ngUtils.loadingAlertClose();
		            if (response && response.status == '1') {
		           		$('.yibaoRepayPage').show();
		           		if(response.data.nextBillDate) {
		           			YibaoPay.nextBillMonth = response.data.nextBillDate.substring(5, 7);
		           		    YibaoPay.nextBillDay = response.data.nextBillDate.substring(8, 10);
		           		}
		           		var dueAmt=Number(response.data.dueAmt).toFixed(2);//逾期金额
		           		var nextBillAmt=response.data.nextBillAmt;//下一个账单金额
		           		var cardBank=response.data.cardBank;
		          		var cardNo=response.data.cardNo;
		           		var userBankCardInfoList=response.data.userBankCardInfoList;//客户的易宝绑定银行卡列表
		           		// userBankCardInfoList.cardNo=cardNo.slice(-4);
		           		var bankCardNumber = Object.keys(userBankCardInfoList).length;//银行卡列表个数
		           		YibaoPay.bankCardNumber=bankCardNumber;
		           		YibaoPay.userBankCardInfoList=userBankCardInfoList;
		           		YibaoPay.dueAmt = dueAmt;
		           		YibaoPay.totalAmt = Number(response.data.totalAmt).toFixed(2);//逾期总金额
		           		YibaoPay.nextBillAmt = Number(nextBillAmt).toFixed(2);
		           		console.log('aaaaaaaa',YibaoPay.bankCardNumber);
		           		// dueAmt=-1;
		           		if(dueAmt>0) { //判断是否逾期
		           			$('.contain-overdue').show();
		           			$('.no-overdue').hide();
		           			$('.no-overdue-tip').hide();
		           		} else{
                            $('.contain-overdue').hide();
		           			$('.no-overdue').show();
		           			$('.no-overdue-tip').show();	           			
		           		}
		           		$('.cardbank').html(cardBank);
		           		$('.cardnumber').html(cardNo.slice(-4));
		           		// $('.nextBillAmt-sum').html(nextBillAmt);
		           		$('.dueAmt-sum').html(dueAmt);
		           		if(dueAmt=='0'&&nextBillAmt=='0') {
		           			$('.immediate-repayment').hide();
		           		} else {
		           			$('.immediate-repayment').show();
		           		}

		            } else {
		         		$('.yibaoRepayPage').hide();
		            	ngUtils.alert(response.msg);
		            }
				},
				function(error){
					ngUtils.loadingAlertClose();
					ngUtils.alert("网络连接失败，请检查您的网络后再试");
				});
			},
            InitBindBank:function(){//初始化绑卡页面
			    var path = Constant.APIRoot + "/activePay/init/bindCardData";
				var params = {
					mobile:UserInfo.mobile,
					"x-auth-token":UserInfo.xAuthToken
				};
				console.log('InitBindBank', params)
				var service = $resource(path,{},{
					connect:{method:'POST'}
				});
				service.connect(params,
					function(response){
			            if (response && response.status == '1') {
			            	UserInfo.realName = response.data.realName;
			            	UserInfo.identityNo = response.data.identityNo;

			           		console.log(response);

			            } else {
			            	ngUtils.alert(response.msg);
			            }
					},
					function(error){
						ngUtils.alert("网络连接失败，请检查您的网络后再试");
					});
			},
            getSmsReg:function(){//绑卡发送验证码  1
            	console.log('绑卡发送验证码  1')
            	ngUtils.loadingAlert();
            	var deferred = $q.defer();
			    var path = Constant.APIRoot + "/activePay/send/validateSms";
				var params = {
					mobile:UserInfo.mobile,
					bindMobile:ngUtils.trimA($('.yibao-bindphoneno').val()),
					cardNo:ngUtils.trimA($('.yibao-bindcardno').val()),
					bankCode:YibaoPay.bankCode,
					"x-auth-token":UserInfo.xAuthToken
				};
							console.log('params==',params)
				var service = $resource(path,{},{
					connect:{method:'POST'}
				});
				service.connect(params,
					function(response){
						ngUtils.loadingAlertClose();
			            if (response && response.status == '1') {
			            	CommonService.beginInterval(120);
			            	YibaoPay.requestNo=response.data.requestNo;
			            } else {
			            	 ngUtils.alertLong(response.msg);
			            }
			            deferred.resolve(response);
					},
					function(error){
						ngUtils.loadingAlertClose();
						ngUtils.alert("网络连接失败，请检查您的网络后再试");
					});
					return deferred.promise;
			},
            AgainGetSmsReg:function(yibaoService){//绑卡短验验证码重发 2
            	console.log('绑卡短验验证码重发 2')
            	ngUtils.loadingAlert();
            	var deferred = $q.defer();
			    var path = Constant.APIRoot + "/activePay/resend/validateSms";
				var params = {
					mobile:ngUtils.trimA($('.yibao-bindphoneno').val()),
					requestNo:YibaoPay.requestNo,//绑卡请求号
					"x-auth-token":UserInfo.xAuthToken
				};
				var service = $resource(path,{},{
					connect:{method:'POST'}
				});
				service.connect(params,
					function(response){
						ngUtils.loadingAlertClose();
			            if (response && response.status == '1') {

			           		console.log(response);
			           		ngUtils.alertLong(response.msg);
			            } else {
			            	yibaoService.getSmsReg()
			            }
			            deferred.resolve(response);
					},
					function(error){
						ngUtils.loadingAlertClose();
						ngUtils.alert("网络连接失败，请检查您的网络后再试");
					});
					return deferred.promise;
			},			
            yibaoMsgCheck:function($scope){//提交信息校验
            	ngUtils.loadingAlert();
			    var path = Constant.APIRoot + "/activePay/submit/validateSms";
				var params = {
					mobile:UserInfo.mobile,
					validateCode:$scope.str,//短信验证码
					requestNo:YibaoPay.requestNo,//绑卡请求号
					"x-auth-token":UserInfo.xAuthToken
				};
				console.log('params==',params);
				var service = $resource(path,{},{
					connect:{method:'POST'}
				});
				service.connect(params,
					function(response){
					ngUtils.loadingAlertClose();
			            if (response && response.status == '1') {
			           		YibaoPay.userBankCardInfoList = response.data.userBankCardInfoList;
		           		    YibaoPay.bankCardNumber=YibaoPay.userBankCardInfoList.length;
		           		    YibaoPay.isFormBank = true;
			           		$location.url(YibaoPay.repayURL);	           		

			            } else {
	 						$scope.keyMsg = '';
	 						YibaoPay.MsgCode = '';
					        $scope.isShowKeyboard = false;//关闭键盘
					        $("#inputBoxContainer span").html('');			            	
			            	ngUtils.alert(response.msg);
			            }
					},
					function(error){
						ngUtils.loadingAlertClose();
	 						$scope.keyMsg = '';
					        $scope.isShowKeyboard = false;//关闭键盘
					        $("#inputBoxContainer span").html('');						
							ngUtils.loadingAlertClose();
							ngUtils.alert("网络连接失败，请检查您的网络后再试");
					});
			},
            yibaoRepayResult:function($scope){//还款反馈页面
            	 ngUtils.loadingAlert();
			    var path = Constant.APIRoot + "/activePay/pay/feedbackPage";
				// var requestNo = $('.yibao-bindphoneno').attr('yibaoRequestNo');
				var params = {
					mobile:UserInfo.mobile,
					vbsBid:YibaoPay.vbsBid,//bid
					sltAcctId:YibaoPay.sltAcctId,//订单号
					"x-auth-token":UserInfo.xAuthToken
				};
				console.log('params=',params);
				var service = $resource(path,{},{
					connect:{method:'POST'}
				});
				service.connect(params,
					function(response){
						console.log('response=',response);
						ngUtils.loadingAlertClose();
			            if (response && response.status == '1') {
			            	$scope.YibaoPay.payAmount = Number(response.data.payAmount).toFixed(2);
			            	$scope.result = '';
			           		if(response.data.payStatus == '1'){
			           			$scope.YibaoPay.isPayResult = '0';
			           			$rootScope.setTitle('还款成功');
			           			$scope.result = 'suc';//fail  wait  suc
			           		}else if(response.data.payStatus == '-1'){
			           			$scope.YibaoPay.isPayResult = '0';
			           			$rootScope.setTitle('还款失败');
			           			$scope.result = 'fail';//fail  wait  suc
			           		}else{
			           			$scope.YibaoPay.isPayResult = '1';
			           			$rootScope.setTitle('还款中');
			           			$scope.result = 'wait';//fail  wait  suc
			           		}
			           		
			            } else {
			            	ngUtils.alert(response.msg);
			            }
					},
					function(error){
						ngUtils.loadingAlertClose();
						ngUtils.alert("网络连接失败，请检查您的网络后再试");
					});
			},
            yibaoShowSmsReg:function($scope){//选择银行卡发送验证码
            	ngUtils.loadingAlert();
            	// $scope.isShowSmsReg=true;
            	var deferred = $q.defer();
			    var path = Constant.APIRoot + "/activePay/confirmPay/request";
				var params = {
					mobile:UserInfo.mobile,
					cardNo:YibaoPay.reCardNo,
					bankCode:YibaoPay.reBankCode,//银行简称
					amount:YibaoPay.Reamount,
					activePayType: YibaoPay.reActivePayType,
					sltAcctId:YibaoPay.sltAcctId,
					vbsBid:YibaoPay.vbsBid,
					"x-auth-token":UserInfo.xAuthToken
				};
				console.log('选择银行卡发送验证码===',params)
				var service = $resource(path,{},{
					connect:{method:'POST'}
				});
				service.connect(params,
					function(response){
						ngUtils.loadingAlertClose();
			           
			           
			            deferred.resolve(response);
					},
					function(error){
						ngUtils.loadingAlertClose();
						ngUtils.alert("网络连接失败，请检查您的网络后再试");
					});
					return deferred.promise;

			},
            yibaoMsgPay:function($scope){//选择银行卡短信确认支付
            	ngUtils.loadingAlert();
			    var path = Constant.APIRoot + "/activePay/pay/validateCode";
				var deferred = $q.defer();
				// var requestNo = $('.yibao-bindphoneno').attr('yibaoRequestNo');
				var params = {
					mobile:UserInfo.mobile,
					validateCode:$scope.str,//短信验证码
					requestNo:YibaoPay.requestNo,//绑卡请求号
					"x-auth-token":UserInfo.xAuthToken
				};
				console.log(params)
				var service = $resource(path,{},{
					connect:{method:'POST'}
				});
				service.connect(params,
					function(response){
						ngUtils.loadingAlertClose();
			            
			            deferred.resolve(response);
					},
					function(error){
                            $scope.keyMsg = '';
					        $scope.isShowKeyboard = false;//关闭键盘
					        $("#inputBoxContainer span").html('');							
						ngUtils.loadingAlertClose();
						ngUtils.alert("网络连接失败，请检查您的网络后再试");
					});
					return deferred.promise;
			},
            yibaoReGetMsg:function(yibaoService){//支付验证码重发
            	// console.log(YibaoPay.requestNo);
            	ngUtils.loadingAlert();
			    var path = Constant.APIRoot + "/activePay/resendPay/validateCodeSms";
				// var requestNo = $('.yibao-bindphoneno').attr('yibaoRequestNo');
				console.log(YibaoPay.requestNo)
				var params = {
					mobile:UserInfo.mobile,
					requestNo:YibaoPay.requestNo,//绑卡请求号
					"x-auth-token":UserInfo.xAuthToken
				};
				var service = $resource(path,{},{
					connect:{method:'POST'}
				});
				service.connect(params,
					function(response){
						ngUtils.loadingAlertClose();
			            if (response && response.status == '1') {
			            	 CommonService.beginInterval(120);
			           		console.log(response);

			            } else {
			            	ngUtils.alert(response.msg);

			            }

					},
					function(error){
						ngUtils.loadingAlertClose();
						ngUtils.alert("网络连接失败，请检查您的网络后再试");
					});
			},
            deleteBankCard:function($scope){//删除银行卡
            	// console.log($scope.cardNo);
            	ngUtils.loadingAlert();
            	var deferred = $q.defer();
			    var path = Constant.APIRoot + "/activePay/unlockBankCard";
				console.log(YibaoPay.requestNo)
				var params = {
					mobile:UserInfo.mobile,
					cardNo:$scope.delCardNo,
					"x-auth-token":UserInfo.xAuthToken
				};
				console.log('params=',params);
				var service = $resource(path,{},{
					connect:{method:'POST'}
				});
				service.connect(params,
					function(response){
						ngUtils.loadingAlertClose();
			            if (response && response.status == '1') {
			           		console.log(response);
			           		YibaoPay.userBankCardInfoList = response.data.userBankCardInfoList;
			           		YibaoPay.bankCardNumber=YibaoPay.userBankCardInfoList.length;	           			
			           		// window.location.reload();
			           			           		
			            } else {
			            	ngUtils.alert(response.msg);
			            }
			            deferred.resolve(response);
					},
					function(error){
						ngUtils.loadingAlertClose();
						ngUtils.alert("网络连接失败，请检查您的网络后再试");
					});
					return deferred.promise;
			},
            InitBankList:function(){//获取银行卡列表
            	ngUtils.loadingAlert();
			    var path = Constant.APIRoot + "/activePay/get/bankCardList";
				var params = {
					mobile:UserInfo.mobile,
					"x-auth-token":UserInfo.xAuthToken
				};
				var service = $resource(path,{},{
					connect:{method:'POST'}
				});
				service.connect(params,
					function(response){
						ngUtils.loadingAlertClose();
			            if (response && response.status == '1') {
			           		console.log(response);
			           		YibaoPay.BankCardList = response.data.bankCardList;
 
			            } else {
			            	ngUtils.alert(response.msg);
			            }
					},
					function(error){
						ngUtils.loadingAlertClose();
						ngUtils.alert("网络连接失败，请检查您的网络后再试");
					});
			}									




	}
});