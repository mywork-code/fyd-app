'use strict';
var app = angular.module('gfbApp');

/**
 * 手写签名公共控制器
 */
app.controller('weixingSingatureCtrl', function ($window,fydorderService,$rootScope,$scope,$location,UserInfo,$timeout,WithdrawRecordObject,ngUtils,WithdrawService,$cacheFactory,$routeParams) {	
	var contractType=$routeParams.type;
	$scope.headerShowFlag=true;
    $scope.index = 0;
    $scope.name = '';
    $scope.nameTotal = '';
    $scope.nameLen = '';
    $scope.nameSign = '';
    $scope.status = '0';//0:还有别的字等待验证,1:签字验证最后一个
    $scope.totalSign = '';
    $scope.SignDate = '';
    $scope.SignId = '';
    $scope.isReqing= false;//签字按钮是否可点击,false可点击
    $scope.sltAccountId ="";
    $scope.contractName = $routeParams.contractName;
    //读取app的信息 
	UserInfo.mobile = $routeParams.mobile;
	$scope.name = $routeParams.name;
	if(WithdrawRecordObject.sltAccountId == '' || WithdrawRecordObject.sltAccountId == undefined) {
		if($routeParams.sltAccountId) {
			$scope.sltAccountId = $routeParams.sltAccountId;
		}
	} else {
		$scope.sltAccountId =  WithdrawRecordObject.sltAccountId;
	}
	
    // $scope.token= $routeParams.token;
    var token=$routeParams.token;
	$window.localStorage.setItem("x-auth-token",token);
    //签字初始化提示字
    $scope.nameTotal = $scope.name.split('');
    $scope.nameSign = $scope.nameTotal[$scope.index];

    //如果为提现合同签名不显示头部
	if(contractType == 'changeCard'){
		$scope.headerShowFlag=false;
	}else{
		$scope.headerShowFlag=true;
	}
	//签名页-新增
	var ch = document.documentElement.clientHeight;
	var signaturePage = document.createElement("div");
	signaturePage.id = "signaturePage"; 
	signaturePage.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:10;-webkit-transform:translate3d(0,"+ch+"px,0); overflow:hidden;";
	var $sigdiv = $('#gfd-signaturePlace');
	$sigdiv.jSignature({
		height: "22rem",
		width: "100%"
	});

	//跳转到帮助中心
	// $scope.gotoHelpCenter=function(){
	//   $("#signaturePage").empty().remove();
	//   $sigdiv.jSignature("reset");
	//   var token=window.localStorage.getItem("x-auth-token");
 //      $location.url("/helpCenter?xAuthToken="+token);
	// }
	
	//确定-保存签名
	$scope.confirm = function(obj){
		//检验是否网络中断    如果中断弹出提示
		if(window.navigator.onLine==false){
			ngUtils.alert("网络连接错误，请检查网络连接");
			// return;
		}
		UserInfo.signature64 = $scope.signature64;
		UserInfo.signatureNative = $scope.signatureNative;
		WithdrawService.saveSingature($scope);
	}
	//进行人工审核签字
	 function confirmSignatureAudit(obj){
		UserInfo.signature64 = $scope.signature64;
		UserInfo.signatureNative = $scope.signatureNative;
		WithdrawService.signatureAuditApply(contractType,obj);
	}

	//保存按钮
	$(".gfb-btn-save").on("click",function(){
	    if(window.navigator.onLine==false){
			ngUtils.alert("网络连接错误，请检查网络连接");
			return;
		}
		//控制页面返回按钮的操作事件
		$("#UI-back-normal").hide();
		$("#UI-back-unnormal").show();
        if($sigdiv.jSignature('getSettings').data.length==0){
        	ngUtils.alert("请签名");
			return;
		}else{
            if(window.navigator.onLine==false){
				ngUtils.alert("网络连接错误，请检查网络连接");
				// return;
			}			
		 //    $scope.signatureNative = JSON.stringify($sigdiv.jSignature("getData", "native"));
		 //      var datapair = $sigdiv.jSignature("getData", "image");
		 //      			    var i = new Image();
			//     i.src = "data:" + datapair[0] + "," + datapair[1];
			//     i.style.cssText = "width:inherit";
			//     $scope.signature64 = i.src;
			    
		 //    console.log("签名轨迹",$scope.signatureNative);
		 //    console.log("签名64", $scope.signature64);
			// WithdrawService.saveSingature(contractType,obj);

			document.querySelector(".ui-wrap").appendChild(signaturePage);
	        $("#gfb-signaturePlace").empty();
	            var datapair = $sigdiv.jSignature("getData", "image");
	            $scope.signatureNative = JSON.stringify($sigdiv.jSignature("getData", "native"));
	            var imgBox = document.createElement("div"),
	                rect1 = document.createElement("div"),
	                rect2 = document.createElement("div"),
	                rect3 = document.createElement("div"),
	                rect4 = document.createElement("div"),
	                btnWrap = document.createElement("div"),
	                sureBtn = document.createElement("button"),
	                cancelBtn = document.createElement("button");
	            	imgBox.className = "handWritter";
	                rect1.className = "rect rect1";
	                rect2.className = "rect rect2";
	                rect3.className = "rect rect3";
	                rect4.className = "rect rect4";
	                btnWrap.className = "ajp-btn-wrap ajp-button-flex";
	                btnWrap.style.cssText = "    position: static;    padding-top: 2rem;";
	                cancelBtn.className = "ajp-btn disabled mr-1";
	                sureBtn.className = "ajp-btn";
	                cancelBtn.innerHTML = "取消";
	                sureBtn.innerHTML = "确定";
	                
				imgBox.id="dataimg";
	            imgBox.style.cssText = "position:relative; width:90%; height: 25rem; margin: 50px auto 20px; display: -webkit-box; -webkit-box-align:center; text-align: center;"
				
			    var i = new Image(); 
			    i.src = "data:" + datapair[0] + "," + datapair[1];
			    i.style.cssText = "width:inherit";
			    $scope.signature64 = i.src;
			    

			 //    imgBox.appendChild(i);
				// imgBox.appendChild(rect1);
				// imgBox.appendChild(rect2);
				// imgBox.appendChild(rect3);
				// imgBox.appendChild(rect4); 
				// signaturePage.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;z-index:10;-webkit-transform:translate3d(0,0,0); overflow:hidden;";
				
// 				btnWrap.appendChild(cancelBtn);
// 				btnWrap.appendChild(sureBtn);
				
// 				var spantip = document.createElement("span");
// 			    spantip.innerHTML = "请确认您的签名";
// 			    spantip.style.cssText = "color: rgba(0, 0, 0, 0.81); font-size: 2rem;";
// 			    var divtip = document.createElement("div");
// 			    divtip.appendChild(spantip);
// 			    divtip.style.cssText = "margin-top:8rem; text-align: center;";
// 			    signaturePage.appendChild(divtip);
				
// 			    signaturePage.appendChild(imgBox); 
// 			    signaturePage.appendChild(btnWrap); 		 
			    
// 			    //点击弹出页面         取消按钮
// 			    cancelBtn.addEventListener("click",function(){
// 			    	//控制页面返回按钮的操作事件
// 					$("#UI-back-normal").show();
// 					$("#UI-back-unnormal").hide();
					
// 			        $("#signaturePage").empty().remove();
// 			        $sigdiv.jSignature("reset");
			        
// 			        signaturePage = document.createElement("div");
// 			    	signaturePage.id = "signaturePage"; 
// 			    	signaturePage.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;z-index:10;-webkit-transform:translate3d(0,"+ch+"px,0); overflow:hidden;";
// 			    },false);
			    
// 			    //点击弹出页面   确定按钮
// 			    sureBtn.addEventListener("click",function(){
// 			    	//控制页面返回按钮的操作事件
// //			    	$timeout(function(){
// //			    		$("#UI-back-normal").show();
// //						$("#UI-back-unnormal").hide();
// //			    	},0);
// //				

// 					if(UserInfo.signFailureNum>=10){
// 			    		ngUtils.ConfirmBack("您的签名失败次数过多，是否转客服处理？",
// 			    				function(){confirmSignatureAudit($("#signaturePage"))},
// 			    				function(){
// 			    					$sigdiv.jSignature("reset");
// 						    		$scope.confirm($("#signaturePage"));
// 			    				}
// 			    		);
// 			    	}else{
// 			    		$sigdiv.jSignature("reset");
// 			    		// 保存签名
// 			    		$scope.confirm($("#signaturePage"));
// 			    	}
			      
// 			    },false);

			///

                //检验是否网络中断    如果中断弹出提示
			  	// $scope.name="小王子";
			  	$scope.nameTotal = $scope.name.split('');
			  	$scope.nameLen = ($scope.name.split('')).length;
                // $scope.nameSign = $scope.nameTotal[0];
			  	if(Number($scope.index)<Number($scope.nameLen)) {
				  	  UserInfo.realName = $scope.nameTotal[$scope.index];
				  	  $scope.nameSign = $scope.nameTotal[$scope.index];
				  	  // $scope.index = Number($scope.index)+1;
			  	} else {
			  		return;
			  	}


			  	console.log('index==',$scope.index);
			  	console.log('realName==',UserInfo.realName)

			    // UserInfo.mobile="17621035736";

				if(window.navigator.onLine==false){
					ngUtils.alert("网络连接错误，请检查网络连接");
					// return;
				}
				UserInfo.signature64 = $scope.signature64;
				UserInfo.signatureNative = $scope.signatureNative;
		        if($scope.isReqing){
					return
				}
				$scope.isReqing = true;				
				WithdrawService.saveSingature($scope);

			////
			}
	});
	
	//重置按钮
	$scope.resetSignSuc= function() {
	    $sigdiv.jSignature("reset");
    }
	//最终签字弹出预览按钮
	$scope.signSuc= function() {
		try{
			appModel.handlerBack();//调用此方法，通知App返回按键由H5控制
		}catch (e){

		}
        $(document).on("back",function(){
	        var platform = window.Android || window;
		    platform.finishSelf();				  	

		});			
        //控制页面返回按钮的操作事件
		$("#UI-back-normal").hide();
		$("#UI-back-unnormal").show();
		
        if($sigdiv.jSignature('getSettings').data.length==0){
        	ngUtils.alert("请签名");
			return;
		}else{
            if(window.navigator.onLine==false){
				ngUtils.alert("网络连接错误，请检查网络连接");
				// return;
			}			
		 //    $scope.signatureNative = JSON.stringify($sigdiv.jSignature("getData", "native"));
		 //      var datapair = $sigdiv.jSignature("getData", "image");
		 //      			    var i = new Image();
			//     i.src = "data:" + datapair[0] + "," + datapair[1];
			//     i.style.cssText = "width:inherit";
			//     $scope.signature64 = i.src;
			    
		 //    console.log("签名轨迹",$scope.signatureNative);
		 //    console.log("签名64", $scope.signature64);
			// WithdrawService.saveSingature(contractType,obj);

			document.querySelector(".ui-wrap").appendChild(signaturePage);
	        $("#gfb-signaturePlace").empty();
	            var datapair = $sigdiv.jSignature("getData", "image");
	            $scope.signatureNative = JSON.stringify($sigdiv.jSignature("getData", "native"));
	            var imgBox = document.createElement("div"),
	                rect1 = document.createElement("div"),
	                rect2 = document.createElement("div"),
	                rect3 = document.createElement("div"),
	                rect4 = document.createElement("div"),
	                btnWrap = document.createElement("div"),
	                sureBtn = document.createElement("button");
	                // cancelBtn = document.createElement("button");
	            	imgBox.className = "handWritter";
	                rect1.className = "rect rect1";
	                rect2.className = "rect rect2";
	                rect3.className = "rect rect3";
	                rect4.className = "rect rect4";
	                btnWrap.className = "ajp-btn-wrap ajp-button-flex";
	                btnWrap.style.cssText = "position:fixed;left:0;bottom:1.6rem;";
	                // cancelBtn.className = "ajp-btn disabled mr-1";
	                sureBtn.className = "fydBtn";
	                // cancelBtn.innerHTML = "取消";
	                sureBtn.innerHTML = "确定";
	                
				imgBox.id="dataimg";
	            imgBox.style.cssText = "position:relative; width:90%; height: 25rem; margin: 50px auto 20px; display: -webkit-box; -webkit-box-align:center; text-align: center;"
				
			    var i = new Image();
			    // i.src = "data:" + datapair[0] + "," + datapair[1];
			    i.src = $scope.totalSign;
			    i.style.cssText = "width:inherit";
			    $scope.signature64 = i.src;

			    imgBox.appendChild(i);
				imgBox.appendChild(rect1);
				imgBox.appendChild(rect2);
				imgBox.appendChild(rect3);
				imgBox.appendChild(rect4); 
				signaturePage.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:10;-webkit-transform:translate3d(0,0,0); overflow:hidden;";
				
				// btnWrap.appendChild(cancelBtn);
				btnWrap.appendChild(sureBtn);
				
				var spantip = document.createElement("span");
			    spantip.innerHTML = "请确认您的签名";
			    spantip.style.cssText = "color: rgba(0, 0, 0, 0.81); font-size: 2rem;";
			    var divtip = document.createElement("div");
			    divtip.appendChild(spantip);
			    divtip.style.cssText = "margin-top:8rem; text-align: center;";
			    signaturePage.appendChild(divtip);
				
				$scope.signature64='';
				$scope.signatureNative='';
			    signaturePage.appendChild(imgBox); 
			    signaturePage.appendChild(btnWrap);

			    
			    //点击弹出页面         取消按钮
			  //   cancelBtn.addEventListener("click",function(){
			  //   	$scope.index='';
			  //   	//控制页面返回按钮的操作事件
					// $("#UI-back-normal").show();
					// $("#UI-back-unnormal").hide();
					
			  //       $("#signaturePage").empty().remove();
			  //       $sigdiv.jSignature("reset");
			        
			  //       signaturePage = document.createElement("div");
			  //   	signaturePage.id = "signaturePage"; 
			  //   	signaturePage.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;z-index:10;-webkit-transform:translate3d(0,"+ch+"px,0); overflow:hidden;";
			  //   },false);
			    //点击弹出页面   确定按钮
			    sureBtn.addEventListener("click",function(){
			    	console.log('WithdrawRecordObject.sltAccountId==',WithdrawRecordObject.sltAccountId);
			    	if(WithdrawRecordObject.sltAccountId == '' || WithdrawRecordObject.sltAccountId == undefined) {
                        if(window.__wxjs_environment === 'miniprogram') {
                             wx.miniProgram.postMessage({ data: {success: true,code:1,date:$scope.SignDate,id:$scope.SignId} });
		                     wx.miniProgram.navigateBack();   
                        } else {
	                        var params = {
	                     		isSign: true,
	                     		date:$scope.SignDate,
	                     		id:$scope.SignId
	                     	};
	                     	window.appModel.setPageResult(JSON.stringify(params));
	                     	var platform = window.Android || window;
	                        platform.finishSelf();
                        }
			    	} else {
                          fydorderService.pendingInformation($scope).then(function(res){
								console.log("res==",res);
								if(res.status=='1') {
								        if(window.__wxjs_environment === 'miniprogram') {
											 wx.miniProgram.postMessage({ data: {success: true,code:1,date:$scope.SignDate,id:$scope.SignId} });
					                         wx.miniProgram.navigateBack();  
										} else {
									        var params = {
					                     		isSign: true,
					                     		date:$scope.SignDate,
					                     		id:$scope.SignId
					                     	};
					                     	window.appModel.setPageResult(JSON.stringify(params));
					                     	// appModel.signatureSuc('1');
					                     	var platform = window.Android || window;
					                        platform.finishSelf();			
										}									

								} else {
						           				
								}
								$scope.isLoad = false;
								
							})			    		
			    	}
			  
                     // alert(9999)
                    
                    

			    	//控制页面返回按钮的操作事件
//			    	$timeout(function(){
//			    		$("#UI-back-normal").show();
//						$("#UI-back-unnormal").hide();
//			    	},0);
//				

					// if(UserInfo.signFailureNum>=10){
			  //   		ngUtils.ConfirmBack("您的签名失败次数过多，是否转客服处理？",
			  //   				function(){confirmSignatureAudit($("#signaturePage"))},
			  //   				function(){
			  //   					$sigdiv.jSignature("reset");
					// 	    		$scope.confirm($("#signaturePage"));
			  //   				}
			  //   		);
			  //   	}else{
			  //   					    		$sigdiv.jSignature("reset");
			  //   		// 保存签名
			  //   		$scope.confirm($("#signaturePage"));
			  //   	}
			      
			    },false);

			///

                //检验是否网络中断    如果中断弹出提示
			 //  	$scope.name="小王子";
			 //  	$scope.nameTotal = $scope.name.split('');
			 //  	$scope.nameLen = ($scope.name.split('')).length;
			 //  	if(Number($scope.index)<Number($scope.nameLen)) {
				//   	  UserInfo.realName=$scope.nameTotal[$scope.index];
				//   	  // $scope.index = Number($scope.index)+1;
			 //  	} else {
			 //  		return;
			 //  	}


			 //  	console.log('index==',$scope.index);
			 //  	console.log('realName==',UserInfo.realName)

			 //    UserInfo.mobile="17621035736";

				// if(window.navigator.onLine==false){
				// 	ngUtils.alert("网络连接错误，请检查网络连接");
				// 	// return;
				// }
				// UserInfo.signature64 = $scope.signature64;
				// UserInfo.signatureNative = $scope.signatureNative;
				// WithdrawService.saveSingature($scope);	


			////
			}




	}


    // 重置按钮
     $(".gfb-btn-reset").on("click",function(){
     	$sigdiv.jSignature("reset");
     });


     //取消按钮
     $(".gfb-btn-cancel").on("click",function(){
		if(contractType == 'changeCard'){
	     	$sigdiv.jSignature("reset");
			UserInfo.repaceSupplemental = false;
			UserInfo.deductAuth = false;
			$("#signaturePage").empty().remove();
			//换卡的时候签名页面点击取消按钮
			var platform = window.Android || window;
			platform.gotoChangeBankCard("","","","");
		}else{
	     	$sigdiv.jSignature("reset");
	     	$scope.goToLocation();
		}
		

     });

	$scope.goToLocation = function() {
		// 平台服务协议和个人信息授权书
		if (contractType == 'xieyi') {
			UserInfo.personalInfoAuthor = false;
			UserInfo.platFormService = false;
			//history.go(-1);
			var platform = window.Android || window;
			platform.gotoEtakeForIdentity("");
			$("#signaturePage").empty().remove();
			return;
		} else if (contractType == 'txht') {
			UserInfo.noticeInfoContract = false;
			UserInfo.loanInfoContract = false;
			history.go(-1);
			$("#signaturePage").empty().remove();
			return;
		} else if (contractType == 'changeCard') {
			UserInfo.repaceSupplemental = false;
			UserInfo.deductAuth = false;
			history.go(-1);
			$("#signaturePage").empty().remove();
			return;
		}
		history.go(-1);
		$("#signaturePage").empty().remove();
	}
	
	//从签名确认页返回到签名页的方法
	$scope.goToNormal = function() {
		//控制页面返回按钮的操作事件
		$("#UI-back-normal").show();
		$("#UI-back-unnormal").hide();
		
        $("#signaturePage").empty().remove();
        $sigdiv.jSignature("reset");
        
        signaturePage = document.createElement("div");
    	signaturePage.id = "signaturePage"; 
    	signaturePage.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:10;-webkit-transform:translate3d(0,"+ch+"px,0); overflow:hidden;";    
	}
});


/**
 * 等待签字人工审核结果页面 controller
 */
app.controller('handWritterWaitingCtrl', function ($routeParams,$scope,ngUtils,$location,UserInfo,WithdrawService,$window) {
	
	UserInfo.mobile = $routeParams.mobile;
	UserInfo.signatureType = $routeParams.signatureType;
	// var token=$routeParams.token;
	// $window.localStorage.setItem("x-auth-token",token);
	$scope.goToApp = function(){
		WithdrawService.refreshSignatureAudit('0');
	}
	$scope.refresh=function (){
		WithdrawService.refreshSignatureAudit('1');
	}
});