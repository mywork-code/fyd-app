'use strict';
var app = angular.module('gfbApp');

/**
 * 提现页面控制器
 */
app.controller("WithdrawCtrl", function($scope, $routeParams, $location, $filter, $resource, $timeout, $interval,$window,
        ngUtils, UserInfo, WithdrawRecordObject, BindCardObject,BindBankService,TransactionGestureService, WithdrawService, Constant, ContractInfo,
        UserContacterInfo) {
    // 初始化页面和对象域
    $scope.UserInfo = UserInfo;
    //合同不需要签字，直接置为true
    UserInfo.noticeInfoContract=true;
    UserInfo.loanInfoContract=true;
    //是否展示分期详情的标志位
//    $scope.showDeatil = false;
    
    $scope.withdraw = WithdrawRecordObject;
    $scope.bindCard = BindCardObject;
    var flagt=false;
    //清空提现页面缓存数据
    if(!$scope.withdraw.showtype&&$scope.withdraw.firstbindCard==false){
	 $scope.withdraw.withdrawMoney='1,000.00';
	 $scope.withdraw.paymentType='';
	 $scope.withdraw.showDeatil = false;
	 $scope.withdraw.feeAmount='20';
    }
    //提现合同
    WithdrawService.saveContract("txht",'');
    
    /* 解决 bug 027 同时出现两个弹窗的问题 add by lc */
    $scope.globalFlag = false;

    // 判断是否重新签名
//    var singatureOnce = $routeParams.flag;
    // 提现页面初始化
    WithdrawService.prepareDataForWithdraw();
    $scope.withdraw.showtype=false;//默认false
    $scope.withdraw.firstbindCard==false;//默认false
    // 查询用户的决策报告
    $scope.strToInteger = function() {
    	if($scope.withdraw.cardFlag=='0' || $scope.withdraw.cardFlag=='3'){
    		ngUtils.alert("请您先完成银行卡绑定");
    		return;
    	}
        $scope.withdraw.withdrawMoney = $scope.withdraw.withdrawMoney.toString().replace(",", "").split(".")[0];
        $scope.withdraw.withdrawMoney = Number($scope.withdraw.withdrawMoney);
    }
    //去绑卡
    $scope.goToBindCard = function(){
    	UserInfo.bindlinkFlag = 2;
    	$location.url("/bindBandCard");
    }
    //返回链接
    $scope.goTo = function(){
		var token = $window.localStorage.getItem("x-auth-token");
		$location.url("/eGet?xAuthToken="+token);
    }
    if (UserInfo.withDrawSignature == '1') {
        $("#loanAmountMoney").attr("readonly", "readonly");
    }

    // 只能输入数字，否则就会被清空
    $scope.checkIsMoney = function() {
        if (!/^\d+(,*\d*)*(\.?\d*)$/.test($scope.withdraw.withdrawMoney)) {
            $scope.withdraw.withdrawMoney = "";
        }
    }
    $scope.checkIsMoney();

    $scope.showAllMoney=function(){
    	if($scope.withdraw.cardFlag=='0' || $scope.withdraw.cardFlag=='3'){
    		ngUtils.alert("请您先完成银行卡绑定");
    		return;
    	}
        $scope.withdraw.withdrawMoney=$scope.withdraw.availableAmount.toString();
        //格式化数据
        $scope.checkIsMoney();
        $scope.strToInteger();
        $scope.showMoney();
        $scope.withdraw.paymentType="";
        $scope.showLoanLife = true;//全部取出的显示bug
        $scope.withdraw.showDeatil = false;
    };

//    // 验证如果贷款合同和特别提示函都同意,自动跳转到签名页
//    $scope.$watch('UserInfo.noticeInfoContract', function(newValue, oldValue) {
//        if (newValue == true && UserInfo.loanInfoContract == true) {
//            $timeout(function() {
//                $scope.agreement = true;
//            }, 1200);
//        }
//
//    });
//    $scope.$watch('UserInfo.loanInfoContract', function(newValue, oldValue) {
//        if (newValue == true && UserInfo.noticeInfoContract == true) {
//            $timeout(function() {
//                $scope.agreement = true;
//            }, 1200);
//        }
//    });
    
//    $scope.$watch('agreement', function(newValue, oldValue) {
//        // 只允许签名一次
//        if (newValue == true && singatureOnce != 'once' && !UserInfo.signature64) {
//            // 提现合同(提现合同)
//            $location.url('/commonSingature?type=txht');
//        }
//    });

//    // 只有用户签名已生成,单选框才能被选中
//    if (UserInfo.signature64 == "") {
//        $scope.withdraw.agreeFlag0 = false;
//    }

    $scope.loan24=function(){
    	 //var withdrawMoney = $scope.withdraw.withdrawMoney.toString().replace(/,/g, "");
    	  $scope.loanRepaymentFlag24 = $scope.withdraw.withdrawMoney.toString().replace(/,/g, "") > 10000 ? true : false;
    }
     
    // 格式化输入的钱数
    $scope.showMoney = function() {
        $scope.globalFlag = true;
        if ($scope.withdraw.withdrawMoney>0) {
        	/*$scope.withdraw.paymentType="";//重置借款期限select
            WithdrawRecordObject.feeAmount = "0";//放款手续费
            ContractInfo.handFee = "0";//
            $scope.withdraw.scheduleAmount="0";//每月应还
            $scope.withdraw.totalRepayAmount="0";//总还款额度
            $scope.showLoanLife = true;
            $scope.globalFlag = false;*/
        	$scope.showLoanLife = true;
    		$scope.withdraw.showDeatil = false;
    		//清空借款期限
    		$scope.withdraw.paymentType="";
    	/*	$scope.checkIsMoney();
    		$scope.strToInteger();
    		$scope.showMoney();*/
    		$scope.loan24();
        }
        $scope.loanRepaymentFlag24 = $scope.withdraw.withdrawMoney > 10000 ? true : false;
        // 手续费率
        var formalitiesRate = $scope.withdraw.formalitiesRate;
        // 將格式化后的数据转化数字格式：2,500 -> 2500

        // edit by lc 2016-06-30
        var withdrawMoney = $scope.withdraw.withdrawMoney.toString().replace(/,/g, "");
        var avalidLimit = WithdrawRecordObject.availableAmount;
        // 当贷款金额大于剩余额度自动将体现额度变为剩余额度
        if (withdrawMoney > avalidLimit) {
            ngUtils.alert("您的剩余可用额度为" + avalidLimit + "元。");
            if (avalidLimit >= 1000) {
                // 取100的整数倍
                var avalid = parseInt((avalidLimit / 100)) * 100;
                $scope.withdraw.withdrawMoney = $filter('number')(avalid, 2);
                var newWithdrawMoney = $scope.withdraw.withdrawMoney.replace(",", "");
                WithdrawRecordObject.feeAmount = newWithdrawMoney * formalitiesRate;
                ContractInfo.handFee = newWithdrawMoney * formalitiesRate;
            } else {
                withdrawMoney = "";
                WithdrawRecordObject.withdrawMoney = '';
                WithdrawRecordObject.feeAmount = "0";
                ContractInfo.handFee = "0";
            }
            $scope.selectedPaymentType();
            $scope.globalFlag = false;
            $scope.loanRepaymentFlag24 = parseInt($scope.withdraw.withdrawMoney.toString().replace(/,/g, "")) > 10000 ? true : false;
            return;
        }
        if (withdrawMoney < 1000) {
            ngUtils.alert("最低借款额为1000元哦!");
            WithdrawRecordObject.withdrawMoney = '1,000.00';
            WithdrawRecordObject.feeAmount = "0";
            ContractInfo.handFee = "0";
            WithdrawRecordObject.typeFlag = false;
            WithdrawRecordObject.paymentType = "";
            WithdrawRecordObject.scheduleAmount = "";
            WithdrawRecordObject.totalRepayAmount = "";
            return;
        }

        if (withdrawMoney % 100 > 0) {
        	ngUtils.alertAndTime("请输入100的整数倍",3000);
            WithdrawRecordObject.withdrawMoney = $filter('number')(Math.floor(withdrawMoney / 100) * 100, 2);
            withdrawMoney = WithdrawRecordObject.withdrawMoney.replace(",", "");
        }
        if (withdrawMoney != "" && withdrawMoney != "0.00") {
            WithdrawRecordObject.feeAmount = withdrawMoney * formalitiesRate;
            ContractInfo.handFee = withdrawMoney * formalitiesRate;
        } else {
            WithdrawRecordObject.feeAmount = "0";
            ContractInfo.handFee = "0";
        }
        $scope.withdraw.withdrawMoney = $filter('number')($scope.withdraw.withdrawMoney.toString().replace(",", ""), 2);
        $scope.selectedPaymentType();
        $scope.globalFlag = false;
    }

    // 跳转至协议页面
    $scope.goToContractForDraw = function() {
    	//检验是否网络中断    如果中断弹出提示
		if(window.navigator.onLine==false){
			ngUtils.alert("网络连接错误，请检查网络连接");
			return;
		}
    	$scope.withdraw.showtype=true;
        // 首次贷款合同，加贷合同，再贷合同（同首次）
        // loanType =0 首次体现； =1 加贷 ； =2 再贷
        if (!BindCardObject.bankCode) {
            ngUtils.alert("请先绑卡");
            return;
        }
        if (!WithdrawRecordObject.withdrawMoney) {
            ngUtils.alert("请先填写借款金额！");
            return;
        }
        if (!WithdrawRecordObject.paymentType) {
            ngUtils.alert("请先选择借款期限！");
            return;
        }
        // ContractInfo.contractNO ="";//模拟合同编号初始时应为空
        ContractInfo.signature64 = "";// 模拟合同个人签名初始时应为空
        ContractInfo.realName = UserInfo.authAccountName;
        if (UserInfo.identityNo != null && UserInfo.identityNo != "" && UserInfo.identityNo != undefined) {
            ContractInfo.identityNo = UserInfo.identityNo;
        }
        ContractInfo.mobile = UserInfo.mobile;
        ContractInfo.openId = UserInfo.openId;
        ContractInfo.loanAmt = WithdrawRecordObject.withdrawMoney;
        ContractInfo.loanPeriods = WithdrawRecordObject.paymentType;
        ContractInfo.bankCode = BindCardObject.cardNo;
        ContractInfo.bankName = BindCardObject.cardBank;
        ContractInfo.handFee = WithdrawRecordObject.feeAmount;
        ContractInfo.cardNo = BindCardObject.cardNo;

        $location.url('/loanInfoProtcal');
//        if (type == 'loanContract') {
//            $location.url('/loanInfoProtcal');
//        } else if (type == 'noticeInfo') {
//            $location.url('/noticeInfoProtocal');
//        }
    }

    // 跳转到绑卡页面
    $scope.gotoBindCardPage = function() {
        $location.url("/bindBandCard");
    }
    // 跳转到绑卡页面
    $scope.gotoRepayPlanPage = function() {
        $location.url("/viewRepayPlan");
    }
    $scope.gotoQuick = function() {
        $("#isSubmitOrder").dialog("hide");
    }
    
    //解决ios 金额为空的时候 闪现的bug 
   /* $scope.resetSelect = function() {
       $("#loanSelect").removeAttr("disabled");  
       if(null == WithdrawRecordObject.withdrawMoney || '' == WithdrawRecordObject.withdrawMoney){
    	   $("#loanSelect").attr('disabled',true);  
       }
    }*/
    
    // 展示可选择的分期的期数
    $scope.shouwAllPaymentType = function() {
        if ($scope.globalFlag) {
            $scope.globalFlag = false;
            return;
        }

       /* if (null == WithdrawRecordObject.withdrawMoney || '' == WithdrawRecordObject.withdrawMoney) {
         ngUtils.alert("请先填写提现金额!")
         return;
         }*/

        /*if (UserInfo.withDrawSignature == '1') {
        	//不能继续修改借款期限  select disabled
        	//$("#loanSelect").attr("disabled",true);
            //ngUtils.alert('合同已签署,请勿修改借款期限!');
            return;
        }*/
        WithdrawRecordObject.paymentTypeFlag = true;
    }

    // 选择第几期后，展示分期详情
    $scope.selectedPaymentType = function() {
        // WithdrawRecordObject.paymentType=value;
    	$scope.setValue();
        if (null == WithdrawRecordObject.withdrawMoney || '' == WithdrawRecordObject.withdrawMoney) {
            ngUtils.alert("请先填写借款金额!")
            return;
        }
        if (WithdrawRecordObject.paymentType == '') {
            return false;
        }
        WithdrawRecordObject.paymentTypeFlag = false;
        WithdrawRecordObject.typeFlag = true;
        //选择具体分期后，显示具体几个月
        $scope.showLoanLife = false;
        // 展示分期详情
        WithdrawService.showInstallmentInfo();
        $scope.withdraw.showDeatil = true;
    }

    // 真正提现的功能
    $scope.goToWithDraw = function() {
        var withdrawMoney = WithdrawRecordObject.withdrawMoney;
        var scheduleAmount = WithdrawRecordObject.scheduleAmount;
        var paymentType = WithdrawRecordObject.paymentType;

        var bindCardNo = $scope.bindCard.cardNoStr;

        if (null == bindCardNo || '' == bindCardNo) {
            ngUtils.alert("请您先完成银行卡绑定!")
            return;
        }

        if (null == withdrawMoney || '' == withdrawMoney) {
            ngUtils.alert("请填写提现金额。")
            return;
        }
        if (withdrawMoney < 1000) {
            ngUtils.alert("提现金额必须大于1000")
            WithdrawRecordObject.withdrawMoney = "";
            return;
        }
        if (withdrawMoney > 30000) {
            ngUtils.alert("提现金额不能大于30000")
            WithdrawRecordObject.withdrawMoney = "";
            return;
        }
        if (withdrawMoney % 100 > 0) {
            ngUtils.alert("请输入100的整数倍");
            WithdrawRecordObject.withdrawMoney = "";
            return;
        }
        if (withdrawMoney > WithdrawRecordObject.availableAmount) {
            ngUtils.alert("您的剩余可用额度为" + avalidLimit + "元。提现额度不能大于可提现额度！");
            if (avalidLimit >= 1000) {
                $scope.withdraw.withdrawMoney = $filter('number')(avalidLimit, 2);
            } else {
                withdrawMoney = "";
                WithdrawRecordObject.withdrawMoney = '';
                WithdrawRecordObject.feeAmount = "0";
            }
            return;
        }

        if (null == paymentType || '' == paymentType) {
            ngUtils.alert("请选择贷款期限。")
            return;
        }

        if (null == scheduleAmount || '' == scheduleAmount || '0' == scheduleAmount || '0.00' == scheduleAmount) {
            ngUtils.alert("每月还款金额不能为0！")
            WithdrawRecordObject.paymentType = "";
            WithdrawRecordObject.paymentTypeFlag = true;
            WithdrawRecordObject.typeFlag = false;
            return;
        }

        // 判断是否同意并签署《贷款合同》及相关文件
        if (null == UserInfo.loanInfoContract || UserInfo.loanInfoContract == ""
                || UserInfo.loanInfoContract == undefined) {
            ngUtils.alert("请先同意并签署《贷款合同》及相关文件！");
            return;
        }
        // 判断是否同意并签署《特别提示函》
        if (null == UserInfo.noticeInfoContract || UserInfo.noticeInfoContract == ""
                || UserInfo.noticeInfoContract == undefined) {
            ngUtils.alert("请先同意并签署《特别提示函》！");
            return;
        }
//        // 判断是否签名
//        if (null == UserInfo.signature64 || UserInfo.signature64 == "" || UserInfo.signature64 == undefined) {
//            ngUtils.alert("请先签名！")
//            return;
//        }
        flagt=true;
    }

    // 点击弹出层的取消
    $scope.doLayerClose = function() {
        $interval.cancel(InterValObj);
        ngUtils.hide("#withdrawMsg");
    }
    // 点击展示手续费用详情
    $scope.showTakeCashFeeInfo = function() {
        var withdrawMoney = $scope.withdraw.withdrawMoney;
        if (null != withdrawMoney && '' != withdrawMoney) {
            var feeAmount = $scope.withdraw.feeAmount;
            var actualAmount = withdrawMoney - feeAmount;
            ngUtils.alert("实际到账金额" + actualAmount + "元（提现金额-手续费）");
        }
    }
    // 发送短信
    $scope.sendMsg = function() {
        // 发送短信前，先检查数据完整性
        if ($scope.dynamicCodeIsError) {
            return;
        }
        var withdrawMoney = WithdrawRecordObject.withdrawMoney;

        if (null == withdrawMoney || '' == withdrawMoney) {
            ngUtils.alert("请填写提现金额。")
            return;
        }
        if (withdrawMoney <= 0) {
            ngUtils.alert("提现金额必须大于0")
            WithdrawRecordObject.withdrawMoney = "";
            return;
        }
        if (withdrawMoney > 1000) {
            ngUtils.alert("提现额度不能大于可提现额度！")
            WithdrawRecordObject.withdrawMoney = "";
            return;
        }
        if (withdrawMoney % 100 > 0) {
            ngUtils.alert("请输入100的整数倍");
            WithdrawRecordObject.withdrawMoney = "";
            return;
        }
        if (withdrawMoney > WithdrawRecordObject.usableLimit) {
            ngUtils.alert("提现额度不能大于可提现额度！")
            return;
        }

        // 先弹出loading页面
        ngUtils.addLoading();
        // 发送短信
        var service = WithdrawService.sendSms("withdrawMsg", UserInfo.phoneNo);
        $scope.dynamicCode = "";
        service.get(function(response) {
            // 关闭loading页面
            ngUtils.closeLoading();
            if (response && response.status == '1') {
                // 先弹出短信验证窗口
                $('#withdrawMsg').css("display", "-webkit-box");
                Constant.curCount = count;
                // $("#second2").attr("disabled", "true");
                $scope.sendFlag = true;
                $("#second2").text(Constant.curCount + "秒");
                $interval.cancel(InterValObj);
                InterValObj = $interval($scope.SetRemainTime, 1000);
            } else {
                ngUtils.alert("网络错误，请稍后重试或联系客服。");
            }
        }, function(error) {
            // 关闭loading页面
            ngUtils.closeLoading();
            ngUtils.alert("服务器繁忙，请稍后再试");
        });
    }

    /**
     * 绘制用户签名
     */
//    $scope.getSignature = function() {
//        if (UserInfo.signature64 == "") {
//            // 生成签名的逻辑
//            $location.url("/drawSignature");
//        } else {
//            console.log("签名不为空" + UserInfo.signature64);
//            $scope.agree();
//        }
//    }

//    /**
//     * 提现页面 直接点击同意	
//     */
//    $scope.agree = function() {
//        // 勾选同意框，并且合同页面没有点击同意，则保存同意时间
//        if (WithdrawRecordObject.agreeFlag0) {
//            var type;
//            if (WithdrawRecordObject.loanType == "0" || WithdrawRecordObject.loanType == "2") {
//                type = "LOAN_FIRST";
//            } else {
//                type = "LOAN_ADD";
//            }
//            WithdrawService.agreeContract(type, "check");
//        }
//    }

    /**
     * 加贷黑名单, 点击同意跳转到我的额度页面
     */
    $scope.gotoHome = function() {
        $("#isblackUserForJiaDai").dialog("hide");
        $location.url("/homePage");
    }
    /** UI-btn showkeyboardMask 
     * 软键盘
     */
    $(".showkeyboardMask").tap(function(){
    	if($scope.withdraw.cardFlag=='0' || $scope.withdraw.cardFlag=='3'){
    		return;
    	}
    	//如果每月还款金额超过银行卡额度限制
    	if($scope.bindCard.limitAmount<$scope.withdraw.scheduleAmount){
    		//提示
    		ngUtils.alertAndTime("您的月还款额超过该行限额请换张银行卡重试或选择更长还款期限 ",5000);
    		return;
    	}
    	
    	flagt=false;
    	$scope.goToWithDraw();
    	if(flagt){
        	//查询该账号交易密码是否锁定
    		BindBankService.ifTranPasswordLock();
    	}else{
    		return;
    	}
        
    });
    
    $scope.closeMask = function(){
    	 $(".set-dealPass .com-wraning").html("为了您的资金安全，请设置交易密码。");
    	 $("#setPass-wraning").html("为了您的资金安全，请设置交易密码。");
    	 $("#reward-wd-dealPass").trigger("tapClaer");
    	 $('.UI-mask').removeClass('show');
    	 $("#reward-wd-dealPass").off();
    }
    
    var setGestur = {
            Num:0,
            passOne:0,
            passTwo:0
        };
    $scope.transactionPasswordBack = function(){
    	ngUtils.Confirm("是否找回密码?",function(){
    		//找回密码
			window.location.href="#/backTransactionPassword";
			});
    }

	$scope.reduceAmount = function(){
    	if($scope.withdraw.cardFlag=='0' || $scope.withdraw.cardFlag=='3'){
    		ngUtils.alert("请您先完成银行卡绑定");
    		return;
    	}
		$scope.showLoanLife = true;
		$scope.withdraw.showDeatil = false;
		//清空借款期限
		$scope.withdraw.paymentType="";
		$scope.checkIsMoney();
		$scope.strToInteger();
		$scope.withdraw.withdrawMoney -=100;
		$scope.withdraw.withdrawMoney = $scope.withdraw.withdrawMoney > 1000 ? $scope.withdraw.withdrawMoney : 1000;
		$scope.showMoney();
	};
	$scope.addAmount = function(){
    	if($scope.withdraw.cardFlag=='0' || $scope.withdraw.cardFlag=='3'){
    		ngUtils.alert("请您先完成银行卡绑定");
    		return;
    	}
		$scope.showLoanLife = true;
		$scope.withdraw.showDeatil = false;
		//清空借款期限
		$scope.withdraw.paymentType="";
		$scope.checkIsMoney();
		$scope.strToInteger();
		$scope.withdraw.withdrawMoney +=100;
		$scope.showMoney();
	};
	/*借款期限弹框*/
	$scope.showLoanLife = true;
	if($scope.withdraw.paymentType>0){
		$scope.showLoanLife = false;
		$scope.borrowData = $scope.withdraw.paymentType;
		
	}
	$scope.showData = false;
	$scope.showDataMask = function(){
    	if($scope.withdraw.cardFlag=='0' || $scope.withdraw.cardFlag=='3'){
    		ngUtils.alert("请您先完成银行卡绑定");
    		return;
    	}
	    $scope.showData = true;
	    event.stopPropagation();
	};
	$scope.hideDataMack = function(){
	    $scope.showData = false;
	};
	$scope.setValue = function(){
	    $scope.borrowData = $scope.withdraw.paymentType;
	    $timeout(function(){
	        $scope.showData = false;
	    },20);
	};
    
});