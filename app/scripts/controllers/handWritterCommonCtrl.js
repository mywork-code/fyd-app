'use strict';
var app = angular.module('gfbApp');

/**
 * 手写签名公共控制器
 */
app.controller('handWritterCommonCtrl', function ($rootScope,$scope,$location,UserInfo,WithdrawRecordObject,ngUtils,WithdrawService,$cacheFactory,$routeParams) {

	var contractType=$routeParams.type;
	$scope.headerShowFlag=true;
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
	signaturePage.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;z-index:10;-webkit-transform:translate3d(0,"+ch+"px,0); overflow:hidden;";
	var $sigdiv = $('#gfd-signaturePlace');
	$sigdiv.jSignature({
		height: "25rem",
		width: "100%"
	});
    
	//跳转到帮助中心
	$scope.gotoHelpCenter=function(){
	  $("#signaturePage").empty().remove();
	  $sigdiv.jSignature("reset");
	  var token=window.localStorage.getItem("x-auth-token");
      $location.url("/helpCenter?xAuthToken="+token);
	}
	
	//保存签名
	$scope.confirm = function(obj){
		//检验是否网络中断    如果中断弹出提示
		if(window.navigator.onLine==false){
			ngUtils.alert("网络连接错误，请检查网络连接");
			// return;
		}
		UserInfo.signature64 = $scope.signature64;
		UserInfo.signatureNative = $scope.signatureNative;
		//$rootScope.gotoEtakeForIdentity('true');
		//alert(UserInfo.signatureNative);
		WithdrawService.saveContract(contractType,obj);
	}

	//保存按钮
	$(".gfb-btn-save").on("click",function(){
		//控制页面返回按钮的操作事件
		$("#UI-back-normal").hide();
		$("#UI-back-unnormal").show();
		
        if($sigdiv.jSignature('getSettings').data.length==0){
        	ngUtils.alert("请签名");
			return;
		}else{
			document.querySelector(".ui-wrap").appendChild(signaturePage);
	        $("#gfb-signaturePlace").empty();
	    	var jSig_native = $sigdiv.jSignature("getData", "native");
            var datapair = $sigdiv.jSignature("getData", "image");
            $scope.signatureNative = JSON.stringify(toPaseInt(jSig_native));
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
			    
			    imgBox.appendChild(i);
				imgBox.appendChild(rect1);
				imgBox.appendChild(rect2);
				imgBox.appendChild(rect3);
				imgBox.appendChild(rect4); 
				signaturePage.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;z-index:10;-webkit-transform:translate3d(0,0,0); overflow:hidden;";
				
				btnWrap.appendChild(cancelBtn);
				btnWrap.appendChild(sureBtn);
				
				var spantip = document.createElement("span");
			    spantip.innerHTML = "请确认您的签名";
			    spantip.style.cssText = "color: rgba(0, 0, 0, 0.81); font-size: 2rem;";
			    var divtip = document.createElement("div");
			    divtip.appendChild(spantip);
			    divtip.style.cssText = "margin-top:8rem; text-align: center;";
			    signaturePage.appendChild(divtip);
				
			    signaturePage.appendChild(imgBox); 
			    signaturePage.appendChild(btnWrap); 
			    
			    //点击弹出页面         取消按钮
			    cancelBtn.addEventListener("click",function(){
			    	//控制页面返回按钮的操作事件
					$("#UI-back-normal").show();
					$("#UI-back-unnormal").hide();
					
			        $("#signaturePage").empty().remove();
			        $sigdiv.jSignature("reset");
			        
			        signaturePage = document.createElement("div");
			    	signaturePage.id = "signaturePage"; 
			    	signaturePage.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;z-index:10;-webkit-transform:translate3d(0,"+ch+"px,0); overflow:hidden;";
			    },false);
			    
			    //点击弹出页面   确定按钮
			    sureBtn.addEventListener("click",function(){
			    	//控制页面返回按钮的操作事件
					$("#UI-back-normal").show();
					$("#UI-back-unnormal").hide();
					
					/*$("#signaturePage").empty().remove();*/
			        $sigdiv.jSignature("reset");
			        
			        // 保存签名
			        $scope.confirm($("#signaturePage"));
			    },false);
			}
	});
    
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
			platform.gotoChangeBankCard("","");
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
			$rootScope.gotoEtakeForIdentity();
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
    	signaturePage.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:#fff;z-index:10;-webkit-transform:translate3d(0,"+ch+"px,0); overflow:hidden;";    
	}
	function toPaseInt(json){
		var len = json.length;
		for(var i = 0;i < len; i++){
			json[i].x = pase(json[i].x);
			json[i].y = pase(json[i].y);
		}
		function pase(data){
			for(var i in data){
				data[i] = parseInt(data[i]);
			}
			return data;
		}
		return json;
	}
});