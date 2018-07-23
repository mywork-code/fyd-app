'use strict';

/**
 * @ngdoc overview
 * @name gfbApp
 * @description gfbApp
 * 
 * Main module of the application.
 */
angular.module('gfbApp', [ 'ngResource', 'ngRoute' ])

.config(function($routeProvider, $httpProvider) {
	$routeProvider


    // home
	.when('/home', {
		templateUrl : 'views/home/home.html',
		controller : 'homeCtrl'
	})
	// 登录
	.when('/login', {
		templateUrl : 'views/login/login.html',
		controller : 'loginCtrl'
	})
	// 账单 - route
	.when('/order', {
		templateUrl : 'views/order/order.html',
		controller : 'OrderCtrl'
	})
	// 清贷页面
	.when('/clearLoan', {
		templateUrl : 'views/order/clearLoan.html',
		controller : 'ClearLoanCtrl'
	})
	// 查看订单的所有合同页面
	.when('/viewAllContract', {
		templateUrl : 'views/viewcontract/viewAllVbsContract.html',
		controller : 'ViewAllContractCtrl'
	})
	// 获得vbs端生成的合同
	.when('/queryVbsContract', {
		templateUrl : 'views/contracts/vbsBorrowContract.html',
		controller : 'ViewAllContract2Ctrl'
	})
	.when('/bindBank', {
		templateUrl: 'views/yibao/bindBank.html',
		controller: 'ybBindBankCtrl'
	})
	.when('/repayment', {//用原生的
		templateUrl: 'views/yibao/repay.html',
		controller: 'ybRepaymentCtrl'
	})
	.when('/repayResult', {
		templateUrl: 'views/yibao/repayResult.html',
		controller: 'repayResultCtrl'
	})
    .when('/chooseBank', {
		templateUrl: 'views/yibao/yibaoChooseBank.html',
		controller: 'yibaoChooseBankCtrl'
	})
	//房易贷 一次还清
    .when('/sureSettle', {
		templateUrl: 'views/order/sureSettle.html',
		controller: 'ClearLoanCtrl'
	})
    //房易贷 账单 - route
	.when('/fydOrder', {
		templateUrl : 'views/order/fydOrder.html',
		controller : 'fydOrderCtrl'
	})	
    //房易贷 意见反馈
	.when('/fydFeedback', {
		templateUrl : 'views/order/fydFeedback.html',
		controller : 'fydFeedbackCtrl'
	})				
    // 小程序-签名页
	.when('/weixingSingature', {
		templateUrl : 'views/contracts/weixingSingature.html',
		controller : 'weixingSingatureCtrl'
	})
    // 一键解读房易贷
	.when('/ajqExplain', {
		templateUrl : 'views/contracts/ajqExplain.html',
		controller : ''
	})
    //查看教程
	.when('/viewTutorial', {
		templateUrl : 'views/contracts/viewTutorial.html',
		controller : ''
	})	
    //小程序-下载趣花app
	.when('/downloadAjqhApp', {
		templateUrl : 'views/contracts/downloadAjqhApp.html',
		controller : 'downloadAppCtrl'
	})
    //报表-运营分析首页
	.when('/operationAnalysis', {
		templateUrl : 'views/contracts/operationAnalysis.html',
		controller : 'operationAnalysisCtrl'
	})
	//短信注册页
	.when('/downloadRegApp', {
		templateUrl : 'views/contracts/downloadRegApp.html',
		controller : 'downloadRegAppCtrl'
	})




//*******************************房易贷合同*****************	
    //注册协议
    .when('/registerProtocal', {
        templateUrl : 'views/contracts/serviceProtocol.html',
        controller : ''
    })
    //提现页面-合同
    .when('/Ajqhwithdrawstages', {
        templateUrl: 'views/contracts/Ajqhwithdrawstages.html',
        controller: 'ajqhLoanInfoProtocalCtrl'
    })
    //身份认证页-信息授权书-合同
	.when('/ajqhpersonalInfoProtocal', {
		templateUrl : 'views/foreigntrade/ajqhpersonalInfoProtocal.html',
		controller : "ajqhpersonalInfoProtocalCtrl"
	})  
    //换卡合同-房易贷
    .when('/repaceSupplementalContract', {
        templateUrl: 'views/contracts/Ajqhchangebankcard.html',
        controller: 'ajqhchangecardcontCtrl'
    })	
    //绑卡合同-房易贷
    .when('/Ajqhbankbinging', {
        templateUrl: 'views/contracts/Ajqhbankbinging.html',
        controller: 'bankbingingCtrl'
    })    


//*******************************start*****************
	
	
.otherwise({
		redirectTo : '/home'
	});

	$httpProvider.interceptors.push('httpInteceptor');
})

.run(function($rootScope,UserInfo) {
	$rootScope.servicePhonse = "tel:4001017700";
	$rootScope.showMask = true;

	$rootScope.$on('$routeChangeStart', function(evt, next, current) {
		window.scrollTo(0, 0);
		var fromPath;
		if (current && current.$$route) {
			fromPath = current.$$route.originalPath;
		}
		var toPath;
		if (next.$$route) {
			toPath = next.$$route.originalPath;
		}
	});

	/**
	 * 跳转到原生app的登录页面
	 */
	$rootScope.gotoLogin = function() {
		// alert("跳转到原生app的登录页面");
		var platform = window.Android || window;
		platform.gotoLogin();
	};
	
	/**
	 * 返回app首页
	 */
	$rootScope.goBackHome = function() {
		var platform = window.Android || window;
		platform.goBackHome();
	};
	
	/**
	 * 返回app身份认证页
	 */
	$rootScope.gotoEtakeForIdentity = function(content) {
		var platform = window.Android || window;
		var returnJson={signFailureNum:UserInfo.signFailureNum,signatureAuditStatus:UserInfo.signatureAuditStatus};
		platform.gotoEtakeForIdentity(JSON.stringify(returnJson));
	};
	
	$rootScope.setTitle = function(title){
		try{
			// var platform = window.Android || window;
			// platform.setTitle(title);
			appModel.title(title);
		}catch (e){

		}

	}

	$rootScope.$on('$routeChangeStart',function(evt, next, current){
		$(document).off("back");
	});

});