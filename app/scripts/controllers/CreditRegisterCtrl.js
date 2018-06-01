/**
 * Created by wanglei07 on 2016/9/14.
 */
var app = angular.module('gfbApp');

app.controller('CreditRegisterCtrl',function($rootScope,$scope,Constant,$location,ZhengxinInfo,UserInfo,CreditService,CountdownObj,CertificateList,ngUtils){
    
	//点击删除已填手机号码
	$scope.clearPhoneNum = function(){
		ZhengxinInfo.mobile = "";
	}
	
	
	$scope.UserInfo = UserInfo;
	ZhengxinInfo.vercode = ""; //reset
	$scope.ZhengxinInfo = ZhengxinInfo;
	$scope.CountdownObj = CountdownObj;
	$scope.CertificateList = CertificateList;
	
	/**
	 * 进入征信注册 - 证件列表页面
	 */
	$scope.selectCert = function(){
		$location.url("/certificateList");
	}
	
	/**
	 * 获取验证码
	 */
	$scope.getRegisterVerifyCode = function(type){
		CreditService.getRegisterVerifyCode(type);
	}
	
	/**
	 * 征信注册第一步 -- 验证证件信息是否正确
	 */
	$scope.checkCertInfo = function(){
		//校验数据完整性
		var flag = $scope.validIdentity();
		if(!flag){
			return;
		}
		//$location.url("/creditRegUser");
		ZhengxinInfo.realName = UserInfo.realName;
		CreditService.checkCertInfo();
	};
	
	/**
	 * 征信注册第二步 -- 发送短信验证码到手机上
	 */
	$scope.sendMsgToMobile = function(){
		var mobileRegexp = /^1\d{10}$/;
		var flag = ngUtils.checkIdCardImpl(ZhengxinInfo.mobile, "手机号码格式不正确", mobileRegexp);
		if(!flag){
			return;
		}
		// 调用服务，发送短信验证码
		CreditService.sendMsgToMobile();		
		
	}
	
	/**
	 * 征信注册第三步 -- 提交所有注册信息
	 * 
	 */
	$scope.submitRegister = function(){
		var flag = $scope.validSubmit();
		if(!flag){
			return ;
		}
		// 调用服务，提交注册数据
		CreditService.submitRegister();
	}
	
	$scope.toLogin = function(){
		ZhengxinInfo.vercode = "";
		$location.url("/creditLogin");
	}
	/**
	 * 注册征信成功后回到征信登入页面
	 */
	$scope.toCreditLogin=function(){
		ZhengxinInfo.vercode = "";
		$location.url("/creditLogin");
	}
	/**
	 * 校验征信注册证件信息
	 */
    $scope.validIdentity = function(){
    	var flag = false;
    	//验证征信账号姓名
    	flag = ngUtils.checkIdCardImpl(UserInfo.realName, "姓名不能为空", "");
    	if(!flag){
    		return false;
    	}
    	//验证证件类型是否选择
    	/*flag = ngUtils.checkIdCardImpl(ZhengxinInfo.certTypeValue, "证件类型不能为空", "");
    	if(!flag){
    		return false;
    	}*/
    	//验证证件号是否为空
    	flag = ngUtils.checkIdCardImpl(ZhengxinInfo.certNo, "证件号码不能为空", "");
    	if(!flag){
    		return false;
    	}
    	//验证动态码是否为空
    	flag = ngUtils.checkIdCardImpl(ZhengxinInfo.vercode, "验证码不能为空", "");
    	if(!flag){
    		return false;
    	}
    	return true;
    }; 
    
    /**
     * 注册提交前 校验数据完整性
     */
    $scope.validSubmit = function(){
    	var flag = false;
    	//验证征信注册用户名
    	var nameReg = /^([0-9]|[a-zA-Z]){6,16}$/;
    	flag = ngUtils.checkIdCardImpl(ZhengxinInfo.username, "登录名格式不正确", nameReg);
    	if(!flag){
    		return false;
    	}
    	//验证征信注册用户密码格式
    	var pswReg = /^([0-9]|[a-zA-Z]){6,20}$/;
    	flag = ngUtils.checkIdCardImpl(ZhengxinInfo.password, "密码格式不正确", pswReg);
    	if(!flag){
    		return false;
    	}
    	
    	if(ZhengxinInfo.password != ZhengxinInfo.confirmpassword){
    		ngUtils.alert("确认密码不一致");
            return false;
    	}
//    	//验证征信注册用户邮箱
//    	var mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
//    	flag = ngUtils.checkIdCardImpl(ZhengxinInfo.email, "邮箱格式不正确", mailReg);
//    	if(!flag){
//    		return false;
//    	}
    	//验证征信注册用户手机号
    	var mobileRegexp = /^1\d{10}$/;
    	flag = ngUtils.checkIdCardImpl(ZhengxinInfo.mobile, "手机号码格式不正确", mobileRegexp);
    	if(!flag){
    		return false;
    	}
    	//验证征信注册用户动态码
    	flag = ngUtils.checkIdCardImpl(ZhengxinInfo.smscode, "手机动态码不能为空", "");
    	if(!flag){
    		return false;
    	}
    	return true;
    };
    
	//监测用户真实姓名内容
	$scope.$watch('UserInfo.realName',function(newValue, oldValue){
		if(null==newValue || newValue=='' || newValue==undefined){
			$rootScope.userInfoRealNameFlag=true;
		}else{
			$rootScope.userInfoRealNameFlag=false;
		}
	});
	
	//监测证件类型内容
	$scope.$watch('ZhengxinInfo.certTypeValue',function(newValue, oldValue){
		if(null==newValue || newValue=='' || newValue==undefined){
			$rootScope.zhengxinInfoCertTypeDescFlag=true;
		}else{
			$rootScope.zhengxinInfoCertTypeDescFlag=false;
		}
	});
	
	//监测证件号码内容
	$scope.$watch('ZhengxinInfo.certNo',function(newValue, oldValue){
		if(null==newValue || newValue=='' || newValue==undefined){
			$rootScope.zhengxinInfoCertNoFlag=true;
		}else{
			$rootScope.zhengxinInfoCertNoFlag=false;
		}
	});
	
	//监测验证码内容
	$scope.$watch('ZhengxinInfo.vercode',function(newValue, oldValue){
		if(null==newValue || newValue=='' || newValue==undefined){
			$rootScope.zhengxinInfoVercodeFlag=true;
		}else{
			$rootScope.zhengxinInfoVercodeFlag=false;
		}
	});
	
	//征信用户信息添加的监听
	//监测用户姓名内容
	$scope.$watch('ZhengxinInfo.username',function(newValue, oldValue){
		if(null==newValue || newValue=='' || newValue==undefined){
			$rootScope.zhengxinInfoUsernameFlag=true;
		}else{
			$rootScope.zhengxinInfoUsernameFlag=false;
		}
	});
	
	//监测用户密码内容
	$scope.$watch('ZhengxinInfo.password',function(newValue, oldValue){
		if(null==newValue || newValue=='' || newValue==undefined){
			$rootScope.zhengxinInfoPasswordFlag=true;
		}else{
			$rootScope.zhengxinInfoPasswordFlag=false;
		}
	});
	
	//监测用户确认密码内容
	$scope.$watch('ZhengxinInfo.confirmpassword',function(newValue, oldValue){
		if(null==newValue || newValue=='' || newValue==undefined){
			$rootScope.zhengxinInfoConfirmpasswordFlag=true;
		}else{
			$rootScope.zhengxinInfoConfirmpasswordFlag=false;
		}
	});
	
	//监测用户确认密码内容
	$scope.$watch('ZhengxinInfo.mobile',function(newValue, oldValue){
		if(null==newValue || newValue=='' || newValue==undefined){
			$rootScope.zhengxinInfoMobileFlag=true;
		}else{
			$rootScope.zhengxinInfoMobileFlag=false;
		}
	});
	
	//监测手机验证码内容
	$scope.$watch('ZhengxinInfo.smscode',function(newValue, oldValue){
		if(null==newValue || newValue=='' || newValue==undefined){
			$rootScope.zhengxinInfoSmscodeFlag=true;
		}else{
			$rootScope.zhengxinInfoSmscodeFlag=false;
		}
	});
	
});
