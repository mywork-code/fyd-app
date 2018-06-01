/**
 * Created by wanglei07 on 2016/9/14.
 */
var app = angular.module('gfbApp');

app.controller('phoneValidateCtrl',function($rootScope,$scope, $location, $resource,$interval,phoneValidateService,UserInfo,MobileVerifyInfo,CountdownObj,Constant,ngUtils){
    $scope.clearValiNum = function(){
    	UserInfo.mobile = "";
    }

    $scope.showPass = true;
    $scope.togglePass = function(){
        $scope.showPass = ! $scope.showPass;
    }
    
  //点击删除已填手机号码
	$scope.clearPhoneNum = function(){
		UserInfo.mobile = "";
	}
	
	// 清空动态码 和 服务密码
    MobileVerifyInfo.captcha = "";
    MobileVerifyInfo.mobilePsw = "";
    $scope.UserInfo = UserInfo;
    $scope.MobileVerifyInfo = MobileVerifyInfo;
    $scope.CountdownObj = CountdownObj;
    
    $scope.Index = 0;
    $scope.choseWay = function(index){
        $scope.Index = index;
    }

    // 跳转到重置手机密码页面
    $scope.backToPhoneVerify = function(){
		$location.url("/mobileVerify");
    }
    
    //密码明文
    //$rootScope.passFunction();
    // 显示手机动态码输入界面，并倒计时
    $scope.captcha = false;
    $scope.showCodePage = function(type){
        if(type == "collect"){
        	$scope.captcha = true;
        }
        //启用定时器，倒计时
        phoneValidateService.beginInterval(60);
    }
    $scope.showCodeP = function(){
    	$scope.captcha = true;
    	event.stopPropagation();
    }

    // 关闭弹出层
    $scope.closeCodePage = function(){
    	$scope.captcha = false;
        $interval.cancel(CountdownObj.interValObj);
    }

    //吉林电信详单验证码弹出框
    $scope.showCodeDialog = function(){
    	$scope.captcha = true;
    }

    // 关闭吉林电信详单验证码弹出框
    $scope.closeCodeDialog = function(){
    	$scope.captcha = false;
    }

    // 跳转到重置手机密码页面
    $scope.toResetPsw = function(){
        CountdownObj.content = "获取";
        CountdownObj.disFlag = false;
        $interval.cancel(CountdownObj.interValObj);
        $location.url("/ServicePass");
    }

    //第一步：初始化聚信力接口：type： collect - 采集信息，reset - 重置密码
    $scope.initJuXinLi = function(type){
        var flag = $scope.validMobileInfo(type,"");
        //校验未通过，返回
        if(!flag){
            return;
        }
        //初始化接口
        var service = phoneValidateService.initJuXinLi();
        var params = {
            customerId: UserInfo.customerId,
            realName: UserInfo.realName,
            identityNo: UserInfo.identityNo,
            mobile: UserInfo.mobile,
            repeatFlag: MobileVerifyInfo.repeatFlag
        };
        //页面弹出层
        ngUtils.loadingAlert();
        service.init(params,
            function(response){
                if(response.status=="1"){
                    MobileVerifyInfo.token = response.data.token;
                    MobileVerifyInfo.website = response.data.website;
                    // 初始化成功，调用提交采集申请的方法
                    $scope.collectRequest(type,"inner");
                }else{
                    ngUtils.loadingAlertClose();
                    // 黑名单用户，直接跳转到决策失败页面
                    if(response.data == "blacklist" || response.data == "secondsale" || response.data == "signcomplate"){
                        UserInfo.expireDay = 15;
                        $location.path("/decisionError");
                        $location.replace();
                    }else{
                        ngUtils.alert(response.msg);
                    }
                }
            },
            function(error){
                ngUtils.loadingAlertClose();
                ngUtils.alert("服务器繁忙，请稍后再试");
            });
    }

    //第二步： 提交采集申请, operate:表示发起方式，hand- 从页面发起  inner - 页面内部发起
    $scope.collectRequest = function(type,operate){
        var flag;
        if(operate == "inner"){
            // 内部调用不需要检查数据
            flag = true;
        }else{
            // 从页面发起的调用，需要验证数据
            flag = $scope.validMobileInfo(type,operate);
        }
        //校验未通过，返回
        if(!flag){
            return;
        }
        if(operate == "hand"){
            // 从页面调用，需要加弹出层
            ngUtils.loadingAlert();
        }
        var requestImpl = phoneValidateService.collectRequest(type);
        // captcha  和   password 参数注意？？？
        var params={
            customerId: UserInfo.customerId,
            realName: UserInfo.realName,
            identityNo: UserInfo.identityNo,
            account:UserInfo.mobile,
            password:MobileVerifyInfo.mobilePsw,
            token:MobileVerifyInfo.token,
            website:MobileVerifyInfo.website,
            captcha:MobileVerifyInfo.captcha,
            repeatFlag: MobileVerifyInfo.repeatFlag
        };
        //验证动态密码时，加上参数Type
        if (MobileVerifyInfo.captcha && type == "collect") {
            params.type = "SUBMIT_CAPTCHA";
        }else if(type == "reset"){
            params.type = "SUBMIT_RESET_PWD";
        }
        requestImpl.request(params,
            function(response){
                if(response.status=="1"){
                    //成功，即调用循环采集方法
                    $scope.circulateCollect(120,type);
                }else{
                    ngUtils.loadingAlertClose();
                    ngUtils.alert(response.msg);
                }
            },
            function(error){
                ngUtils.loadingAlertClose();
                ngUtils.alert("服务器繁忙，请稍后再试");
            });

    }

    //第三步： 循环采集
    $scope.circulateCollect = function(times,type){
        var circuImpl = phoneValidateService.circulateCollect(type);
        var params={
            customerId: UserInfo.customerId,
            realName: UserInfo.realName,
            identityNo: UserInfo.identityNo,
            account:UserInfo.mobile,
            password:MobileVerifyInfo.mobilePsw,
            token:MobileVerifyInfo.token,
            website:MobileVerifyInfo.website,
            captcha:MobileVerifyInfo.captcha,
            repeatFlag: MobileVerifyInfo.repeatFlag
        };
        //验证动态密码时，加上参数Type
        if (MobileVerifyInfo.captcha && type == "collect") {
            params.type = "SUBMIT_CAPTCHA";
        }else if(type == "reset"){
            params.type = "SUBMIT_RESET_PWD";
        }
        circuImpl.circulate(params,
            function(response){
                if(response && response.status == "1"){
                    // 成功后调用执行的内容
                    if (response && response.data) {
                        if (response.data.type == 'CONTROL') {
                            if (response.data.processCode == '10003') {
                                //密码错误
                            	//清空服务密码
                            	MobileVerifyInfo.mobilePsw="";
                                ngUtils.loadingAlertClose();
                                ngUtils.alert(response.data.content);
                            }
                            if (response.data.processCode == '10002') {
                                //采集信息时，输入动态密码
                                ngUtils.loadingAlertClose();
                                MobileVerifyInfo.captcha = "";
                                $scope.showCodePage(type);
                            }
                            if (response.data.processCode == '10004') {
                                // 动态密码错误
                                ngUtils.loadingAlertClose();
                                ngUtils.alert("动态密码错误");
                            }
                            if (response.data.processCode == '10006') {
                                //动态密码失效
                                ngUtils.loadingAlertClose();
                                ngUtils.alert(response.data.content);
                            }
                            if (response.data.processCode == '10007') {
                                //简单密码或初始密码无法登录
                                ngUtils.loadingAlertClose();
                                ngUtils.alert(response.data.content);
                            }
                            if (response.data.processCode == '10008') {
                                //申请提交成功，开始采集
                                ngUtils.loadingAlertClose();
                                $scope.closeCodePage();
                                ngUtils.alert("手机实名认证申请提交成功");
                                if(UserInfo.mobileSource == "quickPage"){
                                    UserInfo.mobileAuthStatus = "1"; //认证中
                                    UserInfo.mobileAuthDesc = "认证中"; //设置手机实名状态
                                    $location.url("/creditLogin");
                                }else if(MobileVerifyInfo.repeatFlag == "1"){
                                    // 手机重新实名认证
                                    $location.url("/phoneValidate");
                                }else{
                                    UserInfo.mobileAuthStatus = "1";
                                    UserInfo.mobileAuthDesc = "认证中";
                                    $location.url("/creditLogin");
                                }
                            }
                            if (response.data.processCode == '11000') {//密码重置成功
                                ngUtils.loadingAlertClose();
                                ngUtils.alert("密码设置成功");
                                $location.url("/phoneValidate");
                            }
                            //吉林电信查询详单需要获取详单
                            if(response.data.processCode == '10017'){
                                ngUtils.loadingAlertClose();
                                //ngUtils.alert(response.data.content);
                                $("#msgText").text(response.data.content+",获取之后在下方输入提交（此处验证码是运营商的要求，请谅解）。");
                                $scope.showCodeDialog();
                            }
//
                            return;
                        } else if (response.data.type == 'ERROR') {
                            if ((response.data.content).indexOf("上限") != -1) {
                                response.data.content = response.data.content + "明天再试";
                            }
                            ngUtils.alert(response.data.content);
                            ngUtils.closeLoading();
                            return;
                        }
                        // 除了TIP和RUNNING以外的类型均属于 打断流程的消息
                        if (response.data.type == 'TIP' || response.data.type == "RUNNING") {
                        } else {
                            times = 0;
                        }
                    }
                    // 递归条件：根据times值，决定是否继续执行
                    if (--times > 0) {
                        $scope.circulateCollect(times,type);
                    } else {
                        ngUtils.alert("查询失败，请重新尝试！");
                        ngUtils.loadingAlertClose();
                    }

                }else{
                    //执行失败时操作：弹出提示，清空页面上输入的动态码，结束loading 页面
                }

            },
            function(error){
                ngUtils.loadingAlertClose();
                ngUtils.alert("服务器繁忙，请稍后再试");
            });

    };

    /**
     * 手机实名认证中页面刷新按钮：检测当前实名实名状态
     */
    $scope.phonereflesh = function(){
        phoneValidateService.queryMobileAuthFlag();
    }

    /**
     * 完成手机实名报告
     */
    $scope.completeMobileAuth = function(){
        wx.closeWindow();
        //MobileService.completeMobileAuth();
    }

    // 验证数据完整性
    $scope.validMobileInfo = function(type,operate){
        var flag = false;
        var mobile = UserInfo.mobile;
        var mobileReg = /^1[0-9]{10}$/;
        flag = ngUtils.checkIdCardImpl(mobile, "手机号码格式不正确", mobileReg);
        if (!flag) {
            return false;
        }
        // 验证手机服务密码(忘记密码初始化时不需要检测)
        if(type != "reset"){
            var mobilePsw = MobileVerifyInfo.mobilePsw;
            flag = ngUtils.checkIdCardImpl(mobilePsw, "手机服务密码不能为空", "");
            if (!flag) {
                return false;
            }
        }

        /*add by lc 2016-07-27*/
        if(operate == "hand" && type == "reset"){
            var mobilePsw = MobileVerifyInfo.mobilePsw;
            var mobilePswReg = /^\d{6}$/;
            flag = ngUtils.checkIdCardImpl(mobilePsw, "请输入6位数字服务密码", mobilePswReg);
            if (!flag) {
                return false;
            }
        }

        if(operate == "hand"){
            var captcha =  MobileVerifyInfo.captcha;
            flag = ngUtils.checkIdCardImpl(captcha, "验证码不能为空", "");
            if (!flag) {
                return false;
            }
        }
        return true;


    }
});
