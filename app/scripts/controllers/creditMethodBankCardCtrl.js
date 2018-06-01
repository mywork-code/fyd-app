'use strict';
var app = angular.module('gfbApp');

/**
 * 征信登陆及查询码激活 controller
 */
app.controller('creditMethodBankCardCtrl', function ($rootScope,$scope,Constant,$location,ZhengxinInfo,UserInfo,CreditUnionPaySvc,ngUtils,MonthList,YearList,CreditMethodChoiceSvc,BindBankService,CountdownObj) {	
	
	//初始化获取验证码按钮
	CountdownObj.content='获取';
	CountdownObj.disFlag=false;
	$scope.CountdownObj = CountdownObj;
	
    /*支持的银行卡列表*/
    $scope.maskShow = {
        bankList:false
    };
    $scope.openBandlistMask = function(){
        $scope.maskShow.bankList = true;
        event.stopPropagation();
    };
    $scope.hideBandlistMask = function(){
        $scope.maskShow.bankList = false;
        event.stopPropagation();
    }
    //银联验证码输入框是是否展示标志位
    $rootScope.unionPayCodeShowFlag=false;
    $scope.closeMASKw=function(){
    	$rootScope.unionPayCodeShowFlag=false;
    }
    $scope.showMaskw=function(){
    	$rootScope.unionPayCodeShowFlag=true;
    	event.stopPropagation();
    }
	//点击删除已填手机号码
	$scope.clearPhoneNum = function(){
		ZhengxinInfo.mobile = "";
	}
	
	$scope.ZhengxinInfo = ZhengxinInfo;
	$scope.MonthList = MonthList;
	$scope.YearList = YearList;
	ZhengxinInfo.certNo = UserInfo.identityNo;
//	ZhengxinInfo.realName = UserInfo.authAccountName;
	ZhengxinInfo.realName = UserInfo.realName;
	$scope.UserInfo=UserInfo;
	/**
	 * 调用VBS获取卡的信息
	 */
	$scope.getCardInfo =function(){
		//去掉显示的银行卡号里面的空格
		ZhengxinInfo.cardNo=ZhengxinInfo.cardNoWithSpace.toString().replace(/\s/ig,'');
		//获取卡信息前，清空一些cvn和密码
		ZhengxinInfo.cvn2 = '';
		ZhengxinInfo.cardPassword = '';
		CreditUnionPaySvc.getCardInfo();
	};
	
	/**
	 * 获取短信验证码
	 */
	$scope.sendSms =function(){
		//校验手机号
		var mobileRegexp = /^1\d{10}$/;
		/*if(ZhengxinInfo.mobile==''){
			alert("请先输入手机号");
			return;
		}*/
		var flag = ngUtils.checkIdCardImpl(ZhengxinInfo.mobile, "手机号码格式不正确", mobileRegexp);
		if(!flag){
			return;
		}
		//发送短信前，验证手机号时候满足条件
		if(CreditUnionPaySvc.validatePhone() == 'success')
			CreditUnionPaySvc.sendSms();
	};
	
	/**
	 * 刷新验证码和ZhengxinInfo.unionPayToken
	 */
	$scope.refalshVerCode=function(){
		ZhengxinInfo.refresh=true;
		CreditMethodChoiceSvc.initNetCredit();
	}
	
	/**
	 * 提交银测信息
	 */
	$scope.submitUnionPay =function(){
		if(!document.getElementById("agreeUPProtocal").checked)
			ngUtils.alert("请先阅读服务条款");
		//验证客户信息是否填写完毕
		else if(CreditUnionPaySvc.validatePhone() == 'success'&&
				CreditUnionPaySvc.validateCvn2() == 'success'&&
				CreditUnionPaySvc.validateSmsCode() == 'success'&&
				CreditUnionPaySvc.validatePassword() == 'success')
		//检验银行卡格式是否正确
		$scope.validateBank();
		CreditUnionPaySvc.submitUnionPay();
	};
	
	  //关闭弹出层
    $scope.closeBankList=function(){
    	$('button[data-role="button"]').on('tap',function(){
    		$('#gfb-dialog-banklst').removeClass('show');
    	})
    }
    
	 //支持的银行卡列表
    $scope.openBankList=function(){
    	$('#gfb-dialog-banklst').addClass('show');
    }
	
	/**
	 * 确认提交银测信息
	 */
	$scope.submitUnionPayConfirm = function(){
		/* edit by lc 2016-07-25 */
		var zxVerCode = ZhengxinInfo.verCode;
		if(zxVerCode.length != 6){
			ngUtils.alert("请输入6位图片验证码");
		}else{
			CreditUnionPaySvc.submitUnionPayConfirm();
		}
	//	CreditUnionPaySvc.submitUnionPayConfirm();
	};
	
	/**
	 * 手机号验证-11位验证
	 */
	$scope.validatePhone =function(){
		CreditUnionPaySvc.validatePhone();
	};
	
	/**
	 * 校验卡背面末三位
	 */
	$scope.validateCvn2 =function(){
		CreditUnionPaySvc.validateCvn2();
	};
	
	/**
	 * 校验银行卡格式是否正确
	 */
	$scope.validateBank =function(){
		//银行卡号只能输入数字，否则就会被清空
		if(undefined==ZhengxinInfo.cardNo||ZhengxinInfo.cardNo==''){
			ngUtils.alert("银行卡号不能为空!");
			ZhengxinInfo.cardNo="";
			return;
		}else if(!/^\d+(,*\d*)*(\.?\d*)$/.test(ZhengxinInfo.cardNo)){
			ngUtils.alert("银行卡号只能输入数字!");
			ZhengxinInfo.cardNo="";
			return;
		}else if(!BindBankService.validBankCardLastNO(ZhengxinInfo.cardNo)){
			ngUtils.alert("银行卡号格式不正确!");
			return;
		}
	};
	
	/**
	 * 校验短信验证码
	 */
	$scope.validateSmsCode =function(){
		CreditUnionPaySvc.validateSmsCode();
	};
	
	/**
	 * 银行卡密码非空校验
	 */
	$scope.validatePassword = function(){
		CreditUnionPaySvc.validatePassword();
	};
	
    //格式化输入银行卡的内容(四位数字添加一个空格)
	$scope.formatcardNo = function(){
		if($scope.ZhengxinInfo.cardNoWithSpace!=''&&$scope.ZhengxinInfo.cardNoWithSpace!=undefined){
			//四位数字添加一个空格
			$scope.ZhengxinInfo.cardNoWithSpace=$scope.ZhengxinInfo.cardNoWithSpace.toString().replace(/\D/g,'').replace(/....(?!$)/g,'$& ');
		}
	};
});