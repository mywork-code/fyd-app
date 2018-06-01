/**
 * Created by wanglei07 on 2016/9/14.
 */
var app = angular.module('gfbApp');

app.controller('creditLoginCtrl', function($rootScope, $scope,$window,$interval, Constant,
		$location, ZhengxinInfo, UserInfo, CommonService, CreditService,CreditMethodChoiceSvc,
		ngUtils) {
	
	CreditService.init();
	ZhengxinInfo.password = "";
	ZhengxinInfo.vercode = "";
	$scope.ZhengxinInfo = ZhengxinInfo;
	$scope.UserInfo=UserInfo;
	//清空查询码
	ZhengxinInfo.activeCode="";
	$scope.deadLineFlag=false;
	
	/**
	 * 获取验证码
	 */
	$scope.getLoginVerifyCode = function(type){
		CreditService.getLoginVerifyCode(type);
	}
	
	/**
	 * 征信登陆 - 用户名，密码登陆
	 */
	$scope.confrimLogin = function(){
		var flag = $scope.validCreditLogin();
		if(!flag){
			return;
		}
		//调用服务 --通过用户名和密码登陆
		CreditService.login();	
	}
	
	/**
	 * 征信登陆 -- 五个校验问题答案提交
	 */
	$scope.submitAnswers = function() {
//		$rootScope.clearFixed();//清除下导航上移
		var param = {};// 初始化json参数
        var answers = $('input[type=radio]');// 获取问题列表
        var count = 0; // 统计radio选择的答案总个数
        // 将五个问题以questionNO:answer形式传给后台检测
        for (var i = 0; i < answers.length; i++) {
        	var obj = answers[i];
        	if(obj.checked){
                param[obj.name] = obj.value;
                count = count + 1;
        	}
        }
        if(count < 5){ // 五个问题都回答后，才能进行下一步
        	ngUtils.alert("五个问题都需要回答！");
            return;
        }
        
        // 五个问题 都选择答案后，调用服务，提交答案
        CreditService.submitAnswers(param);
	 }
	
	/**
	 * 征信登陆 -- 激活码查询征信报告
	 */
	$scope.submitActiveCode = function(){
		if(ZhengxinInfo.vercode.trim().length==0){
			ZhengxinInfo.vercode="";
			ngUtils.alert("验证码全为空格,请重新输入！");
			return;
		}
		if(ZhengxinInfo.activeCode && ZhengxinInfo.vercode){
			// 调用服务，根据激活码查询征信报告
			CreditService.submitActiveCode();
		}else{
			ngUtils.alert("身份验证码和验证码都不能为空！");
		}
	}
	
	/**
	 * 征信重新登陆查询
	 */
	$scope.repeatLogin = function(){
		ZhengxinInfo.operate = "repeat";
		$location.url("/creditLogin");	
	}
	
	/**
	 * 等待页面刷新(可用)
	 */
//	$scope.refresh = function(){
//		CreditService.loadCustomer();
//	}
	
	/**
	 * 决策异常页面，重新进行决策
	 */
	$scope.repeatActive = function(){
		$location.url("/creditReportSecondLogin");
	}
	
	/**
	 * 返回到身份识别页面
	 */
	$scope.backToIndentity = function(){
		CreditService.backToIndentity();
	}

	/**
	 * 征信登陆前 - 校验征信账号登陆
	 */
    $scope.validCreditLogin = function(){
    	var flag = false;
    	//校验征信登录名
    	flag = ngUtils.checkIdCardImpl(ZhengxinInfo.username, "登录名不能为空", "");
    	if(!flag){
    		return false;
    	}
    	//校验征信密码
    	flag = ngUtils.checkIdCardImpl(ZhengxinInfo.password, "密码不能为空", "");
    	if(!flag){
    		return false;
    	}
    	//校验征信验证码
    	flag = ngUtils.checkIdCardImpl(ZhengxinInfo.vercode, "验证码不能为空", "");
    	if(!flag){
    		return false;
    	}    	
    	return true;	
    };
    
    /**
     * 跳转到征信注册页面
     */
    $scope.toCreditReg = function(){
    	ZhengxinInfo.certTypeDesc='身份证';
		ZhengxinInfo.certTypeValue='0';
		ZhengxinInfo.certNo = UserInfo.identityNo;
		$location.url("/creditRegCert");
    };
    
    /**
     * 关闭提示图片返回征信登陆页面
     */
    $scope.closeDialog = function(){
		CreditService.closeDialog();
	}
    
	/**
	 * 银测获取查询码 - 在问题页面直接跳转到银测页面
	 */    
	$scope.redirectUnionPay = function() {
		// 初始化征信页面--获取认证码的跳转页面信息和验证码图片Base64字符串
		CreditMethodChoiceSvc.initNetCredit();
	};    
    
	/**
	 * 返回到身份认证页面
	 */
	$scope.reGet = function(){
		CommonService.reApplyAmt();
	}
	
	$scope.content="09分59秒";
	/**
	 * 10分钟倒计时(minutes为倒计时的分钟数)
	 */
	$scope.getLostTime = function(minutes){
		var seconds = minutes*60; //倒计时执行次数
		var endTime=new Date(); //倒计时的结束时间
		endTime.setMinutes(endTime.getMinutes() + minutes, endTime.getSeconds(), 0);
		endTime=endTime.getTime();
		function checkTime(i){
	        if(i < 10) {
				if(i<=0){
					i = "00";
				}else{
		            i = "0" + i;
				}
	         }
	        return i;
		}
	    $interval(function(){
	        var ts = (endTime - new Date());//计算剩余的毫秒数
	        var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
	        var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
	        var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
	        var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
	        dd = checkTime(dd);
	        hh = checkTime(hh);
	        mm = checkTime(mm);
	        ss = checkTime(ss);
	        if(mm==3&&ss==0){
	        	//ngUtils.alertAndTime("您还有三分钟时间完成问题验证，超时需重新登录",3000);
	        	ngUtils.constraintAlerts("您还有三分钟时间完成问题验证，超时需重新登录","确认");
	        }
	        if(mm==0&&ss==0){
	        	$scope.deadLineFlag=true;
	        }
	        $scope.content=mm + "分" + ss + "秒";
		},1000,seconds);
	}

	/**
	 * 等待页面刷新
	 */
	$scope.refresh = function(){
//		$rootScope.goBackHome(); // 返回首页
		//重新走决策
		// 将征信激活码及验证码 设置为特殊值
		ZhengxinInfo.activeCode = "special";
		ZhengxinInfo.vercode = "special";
		ZhengxinInfo.token = "special";
		// 调用决策接口
		CreditService.submitActiveCode();
	}
});
