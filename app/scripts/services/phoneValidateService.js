'use strict';
var app = angular.module('gfbApp');

/**
 *
 */
app.factory('phoneValidateService', function ($resource, $location, $window,UserInfo,MobileVerifyInfo,Constant,CountdownObj,$interval, ngUtils) {
    return {

        /**
         * 初始化聚信力请求，返回接口
         */
        initJuXinLi: function () {
            var path = Constant.APIRoot + "/juxinli/mobile/init";
            var service = $resource(path, {}, {
                init: {method: 'POST'}
            });
            return service;
        },

        /**
         * 聚信力 - 手机详单手机申请
         * type = collect|reset
         */
        collectRequest: function (type) {
            var path = Constant.APIRoot + "/juxinli/mobile/req/" + type;
            var service = $resource(path, {}, {
                request: {method: 'POST'}
            });
            return service;
        },

        /**
         * 聚信力 -- 手机详单请求反馈接口
         * type =  collect|reset
         */
        circulateCollect: function (type) {
            var path = Constant.APIRoot + "/juxinli/mobile/resp/" + type;
            var service = $resource(path, {}, {
                circulate: {method: 'POST'}
            });
            return service;
        },

        /**
         * 查询手机实名认证状态，并根据结果判断跳转页面
         */
        queryMobileAuthFlag: function () {
            var path = Constant.APIRoot + "/customer/init";
            var service = $resource(path, {}, {
                query: {method: 'POST'}
            });
            var param = {
                openId: UserInfo.openId
            };
            ngUtils.loadingAlert();
            service.query(param,
                function (response) {
                    ngUtils.loadingAlertClose();
                    if (response && response.status == 1) {
                        UserInfo.customerId = response.data.customerId;
                        UserInfo.customerStatus = response.data.status;
                        UserInfo.mobileAuthStatus = response.data.mobileAuthStatus;
                        UserInfo.mobileAuthFlag = response.data.mobileAuthFlag; // 手机详单状态
                        if (UserInfo.mobileAuthFlag == "auth") {//已认证
                            $location.url("/mobileSuccess");
                        } else if (UserInfo.mobileAuthFlag == "wait") {//认证中
                            $location.url("/creditActiveWait");
                        } else if (UserInfo.mobileAuthFlag == "noauth") {//未认证
                            $location.url("/mobileNoAuth");
                        } else {
                            ngUtils.alert("手机实名认证失败，请重新进行认证");
                            MobileVerifyInfo.repeatFlag = "1";
                            $location.url("/phoneValidate");
                        }
                    } else {
                        ngUtils.alert("网络错误，请稍后重试或联系客服。");
                    }
                },
                function (error) {
                    ngUtils.loadingAlertClose();
                    ngUtils.alert("网络错误，请稍后重试或联系客服。");
                });
        },

        /**
         * 手机实名报告完成页面 ，并根据客户状态跳转页面
         */
        completeMobileAuth: function () {
            var path = Constant.APIRoot + "/customer/init";
            var service = $resource(path, {}, {
                query: {method: 'POST'}
            });
            var param = {
                openId: UserInfo.openId
            };
            ngUtils.loadingAlert();
            service.query(param,
                function (response) {
                    ngUtils.loadingAlertClose();
                    if (response && response.status == "1") {
                        UserInfo.customerId = response.data.customerId;
                        UserInfo.customerStatus = response.data.status;
                        UserInfo.mobileAuthStatus = response.data.mobileAuthStatus;
                        UserInfo.mobileAuthFlag = response.data.mobileAuthFlag;
                        if (UserInfo.mobileAuthStatus == "1") {
                            UserInfo.mobileAuthDesc = "认证中";
                        } else {
                            UserInfo.mobileAuthDesc = "未认证";
                        }
                        if (response.data.quickLoanCust) {
                            UserInfo.quickLoan = response.data.quickLoanCust; // 是否快贷客户
                        }
                        if (UserInfo.customerStatus == "00") {
                            // 身份认证页面
                    		var token = $window.localStorage.getItem("x-auth-token");
                    		$location.url("/eGet?xAuthToken="+token);
                        } else if (UserInfo.customerStatus == "0101") {
                            // 快贷信息申请页面
                            $location.url("/");
                        } else if (UserInfo.customerStatus == "01") {
                            // 征信登陆
                            $location.url("/creditLogin");
                        } else if (UserInfo.customerStatus == "02") {
                            // 征信激活页面
                            $location.url("/creditReportSecondLogin");
                        } else if (UserInfo.customerStatus == "03") {
                            // 征信空白用户，直接跳转到征信失败页面
                             $location.url("/creditAuditFail");
                        } else {
                    		var token = $window.localStorage.getItem("x-auth-token");
                    		$location.url("/eGet?xAuthToken="+token);
                        }
                    } else {
                        ngUtils.alert("网络错误，请稍后重试或联系客服。");
                    }

                },
                function (error) {
                    ngUtils.loadingAlertClose();
                    ngUtils.alert("网络错误，请稍后重试或联系客服。");
                });

        },

        beginInterval: function(count){
            if(count){ // 如果没有设置总倒计时 时长，就默认用60
                CountdownObj.curCount = count; // 初始化剩余秒数
            }else{
                CountdownObj.curCount = CountdownObj.count; // 初始化剩余秒数
            }
            CountdownObj.content = CountdownObj.curCount + "秒"; // 初始化显示文字
            CountdownObj.disFlag = true; // 初始化按钮置灰设置
            $interval.cancel(CountdownObj.interValObj); // 初始化计时器
            //启动定时器
            CountdownObj.interValObj = $interval(
                function(){
                    if (CountdownObj.curCount == 0) {
                        $interval.cancel(CountdownObj.interValObj);
                        CountdownObj.disFlag = false; //放开倒计时按钮
                        CountdownObj.content = "重发";
                    } else {
                        CountdownObj.curCount--;
                        CountdownObj.disFlag = true; //灰置倒计时按钮
                        CountdownObj.content = CountdownObj.curCount + "秒";
                    }
                },1000);
        },endInterval:function(){
            $interval.cancel(CountdownObj.interValObj); // 初始化计时器
            CountdownObj.count="60";
            CountdownObj.curCount="60"; // 初始化显示文字
            CountdownObj.disFlag = false; // 初始化按钮置灰设置
            CountdownObj.content="获取"
        }
    }
});

