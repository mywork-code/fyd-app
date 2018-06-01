'use strict';
var app = angular.module('gfbApp');

/**
 * 个人中心-初始化页面 services
 */
app.factory("MyCenterService", function($resource, $location, $window,ngUtils, Constant, UserInfo,
		BindCardObject, PageControllerObject,
		WithdrawRecordObject, WithdrawDetailInfo,
		WithdrawService, TransactionGestureService) {
	return {

		/**
		 * 个人中心页面初始化数据
		 */
		initMyCenterData : function() {
			var path = Constant.APIRoot + "/myCenter/init/data";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				mobile : UserInfo.mobile
			};

			service.connect(params, function(response) {
				if (response && response.status == 1) {
					UserInfo.realName = response.data.realName;//客户姓名
					UserInfo.mobileStr = response.data.mobileStr;//中间是*的手机号
					UserInfo.identityNoStr = response.data.identityNoStr;//中间是*的身份账号
					UserInfo.identityNo = response.data.identityNo;//身份账号
					UserInfo.qrCodeUrl = response.data.qrCodeUrl==null?"":response.data.qrCodeUrl;//二维码url
					BindCardObject.isChangeBankCard = response.data.isChangeBankCard;//是否可以换卡的逻辑
					BindCardObject.bindCardFlag = response.data.bindCardFlag;//绑卡状态
					BindCardObject.cardNoStr       = response.data.cardNoStr;//卡号后四位
					BindCardObject.cardNo       = response.data.cardNo;//卡号
					BindCardObject.bankCode     = response.data.bankCode;//银行code
					BindCardObject.cardBank     = response.data.cardBank;//银行名称
					
					$location.url("/myCenter");
					
					//手势密码开关初始化   密码开关状态
					TransactionGestureService.ifGesturePasswords();
				} else {
					ngUtils.alert("网络错误，请稍后重试或联系客服。");
				}
			}, function(error) {
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		
	    /**
	     * 重签查看合同时数据准备
	     */
		preLoadLoanContract : function(){
			ngUtils.loadingAlert();
			var path = Constant.APIRoot + "/agreement/preLoadLoanContract";
			var cardService = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var cardParams = {
					mobile : UserInfo.mobile//手机号
				};
			
			cardService.connect(cardParams,function(response){
				ngUtils.loadingAlertClose();
				if (response && response.status == 1) {	
//					ContractInfo.mobile 				  = UserInfo.mobile;
//					UserInfo.realName                     =response.data.realName;//客户手填的姓名
//					ContractInfo.realName				  =response.data.realName;
//					UserInfo.identityNoStr                =response.data.identityNoStr;//用户的身份证编码
//					UserInfo.authAccountName              =response.data.authAccountName;//用户表保存的客户真实姓名
//					ContractInfo.liveAddress			  =response.data.liveAddress;//用户现居住地址
//					BindCardObject.cardNo                 =response.data.cardNo;//银行卡号
//					BindCardObject.cardNoStr              =response.data.cardNoStr;//处理过的银行卡号
//					BindCardObject.bankCode               =response.data.bankCode;//银行code
//					BindCardObject.cardType               =response.data.cardType;//银行卡类型
//					BindCardObject.cardBank               =response.data.cardBank;//银行名称
//					
//					BindMortgageBank.cardNo               =response.data.mortCardNo;//按揭银行卡号
//					BindMortgageBank.cardNoStr            =response.data.mortCardNoStr;//处理过的按揭银行卡号
//					BindMortgageBank.bankCode             =response.data.mortBankCode;//按揭银行code
//					BindMortgageBank.cardType             =response.data.mortCardType;//按揭银行卡类型
//					BindMortgageBank.cardBank             =response.data.mortCardBank;//按揭银行名称
					
//					WithdrawRecordObject.monthlyPaymentDate     =response.data.monthlyPaymentDate;//加贷的情境下每月还款日
//					WithdrawRecordObject.bindCardFlag           =response.data.bindCardFlag;//绑定银行卡的状态
//					WithdrawRecordObject.formalitiesRate        =response.data.formalitiesRate;//手续费率
//					WithdrawRecordObject.cardFlag         =response.data.cardFlag;	// 0 没有绑卡，请先绑卡 	1  加贷且已经绑卡，显示绑卡信息	2再贷且绑卡有效，可以换卡，且显示绑卡信息		3绑卡已经失效，请更换银行卡
//					WithdrawRecordObject.totalAmount      =response.data.totalAmount;//总额度
//					WithdrawRecordObject.availableAmount  =response.data.availableAmount;//有效额度
//					WithdrawRecordObject.loanType         =response.data.loanType//贷款类型（0:第一次体现\1:加贷\2:再贷）
					
					WithdrawRecordObject.sltAccountId	  =response.data.sltAccountId;	//订单id	
//					WithdrawRecordObject.paymentType	  =response.data.paymentType;//借款期限
//					WithdrawRecordObject.withdrawMoney	  =response.data.withdrawMoney;//借款金额
//					ContractInfo.loanAmt=response.data.withdrawMoney;
//					ContractInfo.loanPeriods = WithdrawRecordObject.paymentType;
//					
//					ContractInfo.bankCode = BindCardObject.cardNo;
//					ContractInfo.bankName = BindCardObject.cardBank;
//					ContractInfo.handFee = WithdrawRecordObject.feeAmount;
//					ContractInfo.cardNo = BindCardObject.cardNo;
					
//					WithdrawService.showInstallmentInfo();
    				if(PageControllerObject.contractPage==1){
//    					$location.url("/loanInfoProtcal");
    					$location.url('/personalInfoProtocal');
    				}

				} else {
					ngUtils.loadingAlertClose();
					ngUtils.alert(response.msg);
				}
			  },function(error){
				  	ngUtils.loadingAlertClose();
				    ngUtils.alert("网络异常！请稍后再试。");
			 });
		},		
		// 单笔提现详情
//		getWithdrawDetails : function (mobile, sltAccountId){
//			var path = Constant.APIRoot + "/myCenter/search/singleWithDrawInfo";
//		    var service = $resource(path, {}, {
//		        connect : {
//		            method : 'POST'
//		        }
//		    });
//		    var cardParams = {
//		            "mobile"       : mobile, // 手机号
//		            "sltAccountId" : sltAccountId//清算层账户号
//		    };
//		    service.connect(cardParams,function(response){
//		        if(!response || response.status != '1'){
//		            ngUtils.alert("网络错误，请稍后重试或联系客服。");
//		            return false;
//		        }
//		        WithdrawDetailInfo.applyDate=response.data.createdDate;//提现申请时间(yyyy-MM-dd HH:mm)
//		        WithdrawDetailInfo.loanDate=response.data.loanDate;
//		        WithdrawDetailInfo.tranStatus=response.data.transStatus;
//		        WithdrawDetailInfo.reviewDate=response.data.reviewDate;//审核通过时间
//		        WithdrawDetailInfo.orderClosedDate=response.data.orderClosedDate;//订单结清时间
//		        WithdrawDetailInfo.surrenderDate=response.data.surrenderDate;//解约时间
//		        WithdrawDetailInfo.terminateDate=response.data.terminateDate;
//		        WithdrawDetailInfo.loanAmount=response.data.loanAmount;
//		        WithdrawDetailInfo.cardNo=response.data.cardNo;//银行卡号
//		        WithdrawDetailInfo.cardNoStr=response.data.cardNoStr;//银行卡尾号
//		        WithdrawDetailInfo.cardBank=response.data.cardBank;//银行名称
//		        WithdrawDetailInfo.bankCode=response.data.bankCode;//银行Code
//		        // 黑名单,签约再途,可交单校验判断是否可重新申请
//		        if(response.data.repeatFlag!=undefined){
//		            //不能再次申请
//		            WithdrawDetailInfo.repeatFlag=true;
//		        }
//		        if(WithdrawDetailInfo.tranStatus=="5" || WithdrawDetailInfo.tranStatus=="-3"){
//		            WithdrawDetailInfo.flag="0";    //解约或财务退回
//		        }else if(WithdrawDetailInfo.tranStatus=="-2"||WithdrawDetailInfo.tranStatus=="0"){
//		            WithdrawDetailInfo.flag="1";//提现审核中
//		        }else if(WithdrawDetailInfo.tranStatus=="4"){
//		            WithdrawDetailInfo.flag="3";//已经结清
//		        }else if(WithdrawDetailInfo.tranStatus=="-4"){
//		            WithdrawDetailInfo.flag="-4";//退回重新签名
//		        }else if(WithdrawDetailInfo.tranStatus=="-1"){
//		            WithdrawDetailInfo.flag="4";    //管理平台拒绝
//		            WithdrawDetailInfo.unlockDays=response.data.days;//锁单剩余天数   0表示可以重新提现
//		        }else {
//		            WithdrawDetailInfo.flag="2";//已放款未结清
//		        }
//		        $location.url("/showWithdrawInfo"); 
//		    },function(error){
//		        ngUtils.alert("网络错误，请稍后重试或联系客服。");
//				var token = $window.localStorage.getItem("x-auth-token");
//				$location.url("/eGet?xAuthToken="+token);
//		    });
//		},		
		// 单笔提现详情页面初始化数据
		getWithdrawDetailsInit : function (mobile, sltAccountId){
			var path = Constant.APIRoot + "/myCenter/search/singleWithDrawInfo";
		    var service = $resource(path, {}, {
		        connect : {
		            method : 'POST'
		        }
		    });
		    var cardParams = {
		            "mobile"       : mobile, // 手机号
		            "sltAccountId" : sltAccountId//清算层账户号
		    };
    		//显示加载动画之前先清除所有的alert弹框
    		/*ngUtils.loadingAlertClose();
		    ngUtils.loadingAlert();*/
		    service.connect(cardParams,function(response){
		    	//ngUtils.loadingAlertClose();
		        if(!response || response.status != '1'){
		            ngUtils.alert("网络错误，请稍后重试或联系客服。");
		            return false;
		        }
		        WithdrawDetailInfo.applyDate=response.data.createdDate;//提现申请时间(yyyy-MM-dd HH:mm)
		        WithdrawDetailInfo.loanDate=response.data.loanDate;
		        WithdrawDetailInfo.tranStatus=response.data.transStatus;
		        WithdrawDetailInfo.reviewDate=response.data.reviewDate;//审核通过时间
		        WithdrawDetailInfo.orderClosedDate=response.data.orderClosedDate;//订单结清时间
		        WithdrawDetailInfo.surrenderDate=response.data.surrenderDate;//解约时间
		        WithdrawDetailInfo.terminateDate=response.data.terminateDate;
		        WithdrawDetailInfo.loanAmount=response.data.loanAmount;
		        WithdrawDetailInfo.cardNo=response.data.cardNo;//银行卡号
		        WithdrawDetailInfo.cardNoStr=response.data.cardNoStr;//银行卡尾号
		        WithdrawDetailInfo.cardBank=response.data.cardBank;//银行名称
		        WithdrawDetailInfo.bankCode=response.data.bankCode;//银行Code
		        // 黑名单,签约再途,可交单校验判断是否可重新申请
		        if(response.data.repeatFlag!=undefined){
		            //不能再次申请
		            WithdrawDetailInfo.repeatFlag=true;
		        }
		        if(WithdrawDetailInfo.tranStatus=="5"){
		            WithdrawDetailInfo.flag="0";    //解约
		        }else if(WithdrawDetailInfo.tranStatus=="-2" || WithdrawDetailInfo.tranStatus=="0" || WithdrawDetailInfo.tranStatus=="-3"){
		            WithdrawDetailInfo.flag="1";//提现审核中、放款中、财务退回(待管理平台操作拒绝)
		        }else if(WithdrawDetailInfo.tranStatus=="4"){
		            WithdrawDetailInfo.flag="3";//已经结清
		        }else if(WithdrawDetailInfo.tranStatus=="-4"){
		            WithdrawDetailInfo.flag="-4";//退回重新签名
		        }else if(WithdrawDetailInfo.tranStatus=="-1"){
		            WithdrawDetailInfo.flag="4";    //管理平台拒绝
		            WithdrawDetailInfo.unlockDays=response.data.days;//锁单剩余天数   0表示可以重新提现
		        }else {
		            WithdrawDetailInfo.flag="2";//已放款未结清
		        }
		    },function(error){
		    	//ngUtils.loadingAlertClose();
		        ngUtils.alert("初始化数据失败。");
		    });
		}
	}
});