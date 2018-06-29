'use strict';
var app = angular.module('gfbApp');

/**
 * 订单
 */
app.controller('fydOrderCtrl', function($routeParams, $window, $resource, $rootScope, $scope,
		$location, OrderInfo, ClearInfo, fydorderService, UserInfo, ngUtils,
		ContractInfo, ContractCardsList, ContractCardList, $timeout,CommonService,YibaoPay) {
	// document.title = "账单";
	$rootScope.setTitle('账单');
	$scope.UserInfo = UserInfo;
    try{
		appModel.handlerBack();//调用此方法，通知App返回按键由H5控制
	}catch (e){

	}
    $(document).on("back",function(){
	    $('.wbillLIstWrap').show();
		$timeout(function(){
			console.log($scope.isSwiper)
			if($scope.isSwiper==true){
				$scope.isSwiper = false

			}else {
				if($routeParams.ajqhUserId) {
                    window.history.go(-1);
				} else {
 	                var platform = window.Android || window;
				    platform.finishSelf();
				}
				
				// var curOrigin = window.location.origin,abssUrl = '';
				// if($routeParams.test == 'uat'){//uat环境 安家派账单没有uat环境，当bss是uat时，返回到bss sit
				// 	abssUrl = 'http://bss.uat.apass.cn/bss/system/bill?userId='+UserInfo.ajqhUserId
				// }else {
				// 	abssUrl = curOrigin+'/bss/system/bill?userId='+UserInfo.ajqhUserId
				// 	//abssUrl = 'http://192.168.191.1:9090/bss/system/bill?userId=8008986'
				// }

				// window.location.href =abssUrl;
			}
		},2);
	});	
    //断网页面刷新
	$scope.refreshPage = function(sltAccountId){
		$scope.isNetworkOutage = false;
		// try {
		// 	if(appModel.isConnected()=='0') {
		//         $scope.isNetworkOutage = true;
  //               ngUtils.alert("网络连接失败，请检查您的网络后再试");
		//     	return;			
		// 	} else if(appModel.isConnected()=='1') {
	 //         	$scope.isNetworkOutage = false;
		// 		window.location.reload();					
		// 	}
		// } catch(e) {
	      						
		// }
    //     if(window.__wxjs_environment === 'miniprogram') {
	   //      if(window.navigator.onLine==false){
	   //      	$scope.isNetworkOutage = true;
    //             ngUtils.alert("网络连接失败，请检查您的网络后再试");
		  //   	return;	
		  //   } else {
    //            	$scope.isNetworkOutage = false;
				// window.location.reload();				    	
		  //   }	        	
	   //  } 


        if(window.__wxjs_environment === 'miniprogram') {
	        if(window.navigator.onLine==false){
	        	$scope.isNetworkOutage = true;
                ngUtils.alert("网络连接失败，请检查您的网络后再试");
		    	return;	
		    } else {
               	$scope.isNetworkOutage = false;
				window.location.reload();				    	
		    }	        	
	    } else {
		    try {
				if(appModel.isConnected()=='0') {
			        $scope.isNetworkOutage = true;
	                ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    	return;			
				} else if(appModel.isConnected()=='1') {
		         	$scope.isNetworkOutage = false;
					window.location.reload();					
				}
			} catch(e) {
		      						
			}

	    }	    






	    // $location.url('/fydOrder?mobile='+UserInfo.mobile+"&token="+UserInfo.xAuthToken);
	}	
	// try {
	// 	if(appModel.isConnected()=='0') {
	//         $scope.isNetworkOutage = true;
	//     	return;			
	// 	}
	// } catch(e) {
	//     if(window.navigator.onLine==false){
	// 	    ngUtils.alert("网络连接失败，请检查您的网络后再试");
	// 	    return;
	//     }		
	// }
    if(window.__wxjs_environment === 'miniprogram') {
        if(window.navigator.onLine==false){
		    ngUtils.alert("网络连接失败，请检查您的网络后再试");
		    return;
	    }	

	    
	} else {
		try {
			if(appModel.isConnected()=='0') {
		        $scope.isNetworkOutage = true;
		    	return;			
			}
		} catch(e) {
		    if(window.navigator.onLine==false){
			    ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    return;
		    }		
		}
	}
    $scope.showOrderFlag1 = false;
    $scope.showOrderFlag2 = false;
    $scope.showOrderFlag3 = true;
    $scope.isNetworkOutage = false;//是否断网显示
	// $routeParams.ajqhUserId&&(UserInfo.ajqhUserId=$routeParams.ajqhUserId);
	//初始化页面和对象域
	$scope.OrderInfo = OrderInfo;
	UserInfo.isBillH5 = true;
	$scope.isLoad = true;
	if(UserInfo.app == 'newAjp'){//来自安家派App 隐藏返回按钮
		try{
			appModel.isShowLeftBtn('0')
		}catch(e){
			console.log('隐藏')
		}
	}else {

	}
		
	try{
		var userInfo = JSON.parse(appModel.getUserInfo());
		if(userInfo["mobile"] === undefined || userInfo["mobile"] == 'undefined'){
			UserInfo.mobile = userInfo["mobile,"];
		}else {
			UserInfo.mobile = userInfo.mobile;
		}
		UserInfo.xAuthToken = userInfo.token;
	}catch(e){
		UserInfo.mobile = $routeParams.mobile;
		UserInfo.xAuthToken = $routeParams.token;
//		UserInfo.mobile = "13554878559";
//		UserInfo.xAuthToken = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsaXN0ZW5pbmcuand0Lmlzc3Vlcj86bGlzdGVuaW5nLWp3dC1pc3N1ZXIiLCJhdWQiOiJsaXN0ZW5pbmcuand0LmF1ZGllbmNlPzpsaXN0ZW5pbmctand0LWF1ZGllbmNlIiwiaWF0IjoxNTE1NjU4MTY5LCJleHAiOjE1MTYyNjI5NjksImluZm8iOnsidXNlcklkIjoiMiIsIm1vYmlsZSI6IjE1NjE4MzcxODM1In19.HG08lQxr_8drhqyZAg6V2a9Kukffn0yg9vjiPRbvDDg";
	}
    // UserInfo.mobile = "15802164365";
    // UserInfo.xAuthToken	= "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqd3Rfd2l0aG91dF9zcHJpbmdfc2VjdXJpdHkiLCJhdXRoIjoieydtb2JpbGUnOicxMzEyMjI1ODgzNid9IiwiZXhwIjoxNTI0NDY4MDI2fQ.d2jzVqsmfdSQ3rFj5HxAOc3iYQLverXIRhC2gnftm3qf8xYhivbauOmBioZvyoa1PnFOTunSP-xsLrLDN6OAuw";

	//点击展开效果
	$scope.openDetail=function(row){
		$scope.selectedIndex == row ? $scope.selectedIndex = -1 : $scope.selectedIndex = row;
	}

	$scope.isSwiper = false;//控制显示还款详情 左移效果,返回按键
	$scope.orderList = [];
	$scope.transStatus = 0;

	//if(UserInfo.xAuthToken && UserInfo.mobile && UserInfo.xAuthToken != ''&&UserInfo.mobile!=''){
	//	$window.localStorage.setItem("x-auth-token", UserInfo.xAuthToken);
	//}

	fydorderService.initOrderData($scope).then(function(res){
		console.log("res==",res);
		if(res.status=='1') {
	        $scope.cardBank = res.data.cardBank;
		    $scope.cardNoStr = res.data.cardNoStr;
	        $scope.bankCode = res.data.bankCode;
	        $scope.dueAmount = Number(res.data.totalDueAmount).toFixed(2);		
		} else {
            $scope.cardBank = res.data.cardBank;
		    $scope.cardNoStr = res.data.cardNoStr;
	        $scope.bankCode = res.data.bankCode;
	        $scope.dueAmount = Number(res.data.totalDueAmount).toFixed(2);					
		}
		$scope.isLoad = false;
		
	})


	$scope.checkOrder = function (list) {	
		if(window.__wxjs_environment === 'miniprogram') {
          if(window.navigator.onLine==false){
			    ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    return;
		   }	
		 //    var isNetwork = true;
		 //    wx.getNetworkType({
			//   success: function(res) {
			//   	alert("断网1111111")
	  //           isNetwork = true;
			//   },
			//   fail: function(res) {
			//   	 alert("断网1111111")
			//   	 isNetwork = false;
			//   }

			// })	
			// if(isNetwork==false) {
			// 	alert("断网")
			// 	return;
			// } else {
			// 	alert("有网")
			// }


		} else {
			try {
				if(appModel.isConnected()=='0') {
			        ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    	return;			
				}
			} catch(e) {
	           				
			}		
		}
	   


	    try{
			appModel.handlerBack();//调用此方法，通知App返回按键由H5控制
		}catch (e){

		}
		$(document).on("back",function(){
		    $('.wbillLIstWrap').show();
			$timeout(function(){
				console.log($scope.isSwiper)
				if($scope.isSwiper==true){
					$scope.isSwiper = false

				}else {
					if($routeParams.ajqhUserId) {
	                    window.history.go(-1);
					} else {
	 	                var platform = window.Android || window;
					    platform.finishSelf();
					}
				}
			},2);
		});				
		$('.wbillLIstWrap').hide();
		$scope.FydAdvClearLoan = '0';
		if(list.transStatus==0 || list.transStatus==-4 || list.transStatus==-3 || list.transStatus==-2){
			$scope.orderList = [];
			$scope.isSwiper = false;

			return
		}else {
			// $scope.paymentType=list.paymentType; 
			// $scope.loanAmount=list.loanAmount;
	  //       $scope.loanDate=list.loanDate;
			// $scope.transStatus = list.transStatus;
			// $scope.orderList = list;
			$scope.isSwiper = true;
	        fydorderService.orderDetailInfo(list).then(function(res){
	        	if(res.status=='1') {
	                $scope.orderList =  res.data;
		        	$scope.installmentInfoList = res.data.installmentList;
		        	$scope.transStatus = res.data.transStatus;
		        	$scope.loanDate = res.data.loanDate;
		        	$scope.paymentType = res.data.paymentType;
		        	$scope.loanAmount = res.data.loanAmount;
		        	for(var i=0;i<$scope.installmentInfoList.length;i++) {
		        		if($scope.installmentInfoList[i].advClearLoan=='1') {
		        			$scope.FydAdvClearLoan = '1';
		        		}
		        		console.log($scope.installmentInfoList[i].advClearLoan)
		        	}
                    if((res.data.canActivePay == 'true'&&($scope.FydAdvClearLoan!='1')) ||(res.data.isActivePaying== 'true') ) {
	        			$('.fyd-activity').css('height','88%')
	        		} else {
	        			$('.fyd-activity').css('height','100%')
	        		}		        	
	        	}

				console.log("response====",res)

			})			
		}
	}


	//我要还款
	$scope.toRepay = function(sltAccountId){  //sltAcctId
        if(window.__wxjs_environment === 'miniprogram') {
            if(window.navigator.onLine==false){
			    ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    return;
		    }			
		    
		} else {
			try {
				if(appModel.isConnected()=='0') {
			        ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    	return;			
				}
			} catch(e) {
	           				
			}		
		}
		console.log(sltAccountId)
		ClearInfo.sltAccountId = sltAccountId;
		$location.url("/repayment");

        $location.url("/repayment").search({
			"sltAcctId":sltAccountId,
			"vbsBid":$scope.orderList.vbsBid,
			"mobile":UserInfo.mobile,
			"token":UserInfo.xAuthToken,
		})		
		// fydorderService.toRepay().then(function(res){
		// 	$location.url("/repayment").search({
		// 		"sltAcctId":sltAccountId,
		// 		"vbsBid":$scope.orderList.vbsBid,
		// 		"mobile":UserInfo.mobile,
		// 		"token":UserInfo.xAuthToken,
		// 	})

		// })
	}
	
	//查看还款进度
    $scope.checkSchedule = function(orderList){
    	if(window.__wxjs_environment === 'miniprogram') {
            if(window.navigator.onLine==false){
			    ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    return;
		    }			
		    
		} else {
			try {
				if(appModel.isConnected()=='0') {
			        ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    	return;			
				}
			} catch(e) {
	           				
			}		
		}    	
    	console.log("orderList===",orderList);
    	YibaoPay.vbsBid = orderList.vbsBid;
    	YibaoPay.sltAcctId = orderList.sltAccountId;
        $location.url('/repayResult');
    }
	//清贷查询页面跳转
	$scope.toCleanLoan=function(sltAccountId, cleanLoanFlag){
		if(window.__wxjs_environment === 'miniprogram') {
            if(window.navigator.onLine==false){
			    ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    return;
		    }			
		    
		} else {
			try {
				if(appModel.isConnected()=='0') {
			        ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    	return;			
				}
			} catch(e) {
	           				
			}		
		}
		ClearInfo.sltAccountId = sltAccountId;
		ClearInfo.isExemption = cleanLoanFlag;
		$location.url("/sureSettle?mobile="+UserInfo.mobile+"&token="+UserInfo.xAuthToken);

		console.log('sltAccountId==',sltAccountId);
		console.log('cleanLoanFlag==',cleanLoanFlag);
	}
	
	//清贷查询页面跳转
	$scope.viewContract=function(sltAccountId,cardNum){
	    if(window.__wxjs_environment === 'miniprogram') {
            if(window.navigator.onLine==false){
			    ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    return;
		    }			
		    
		} else {
			try {
				if(appModel.isConnected()=='0') {
			        ngUtils.alert("网络连接失败，请检查您的网络后再试");
			    	return;			
				}
			} catch(e) {
	           				
			}		
		}
		//还款银行和按揭银行不是同一张卡
		if(cardNum==2){
			ContractInfo.contractNameList = ContractCardsList;
		}else if(cardNum==1){
			ContractInfo.contractNameList =ContractCardList;
		}
		$location.url("/viewAllContract?sltId="+sltAccountId+"&cardNum="+cardNum);
	}
});