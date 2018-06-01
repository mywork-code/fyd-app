'use strict';

var app = angular.module("gfbApp");

/**
 * 通用 services
 */
app.factory("CommonService", function($resource, $location, $interval, $window, CountdownObj, Constant, UserInfo,
        BindCardObject, ngUtils, $q, ContractInfo,$timeout) {
    return {
        /**
         * 初始化倒计时信息，并且启动计时器
         */
        beginInterval : function(count) {

            if (count) { // 如果没有设置总倒计时 时长，就默认用120
                CountdownObj.curCount = count; // 初始化剩余秒数
            } else {
                CountdownObj.curCount = CountdownObj.count; // 初始化剩余秒数
            }
            CountdownObj.content = CountdownObj.curCount; // 初始化显示文字
            CountdownObj.disFlag = true; // 初始化按钮置灰设置
            $interval.cancel(CountdownObj.interValObj); // 初始化计时器
            // 启动定时器
            CountdownObj.interValObj = $interval(function() {
                if (CountdownObj.curCount <= 1) {
                    $interval.cancel(CountdownObj.interValObj);
                    CountdownObj.disFlag = false; // 放开倒计时按钮
                    CountdownObj.content = "获取验证码";
                } else {
                    CountdownObj.curCount--;
                    CountdownObj.disFlag = true; // 灰置倒计时按钮
                    CountdownObj.content = CountdownObj.curCount;
                }
            }, 1000);
        },
        endInterval : function() {
            $interval.cancel(CountdownObj.interValObj); // 初始化计时器
            CountdownObj.count = "120";
            CountdownObj.curCount = "120"; // 初始化显示文字
            CountdownObj.disFlag = false; // 初始化按钮置灰设置
            CountdownObj.content = "获取验证码"
        },
        
        /**
         * 决策失败锁单30天判断
         */
        getLockedDate : function() {
        	 var path = Constant.APIRoot + "/customer/initDecisionUnlockedDate";
             var service = $resource(path, {}, {
                 recredit : {
                     method : 'POST'
                 }
             });
             var param = {
                 mobile : UserInfo.mobile,
                 customerId : UserInfo.customerId
             };
             ngUtils.addLoading();
             service.recredit(param, function(response) {
                 ngUtils.closeLoading();
                 if (response && response.status == "1") {
                     UserInfo.remainDate=response.data.unlockedDate;
                 } 
             }, function(error) {
                 ngUtils.closeLoading();
             });
           
        },

        /**
         * 客户授信过期重新授信
         */
        reApplyAmt : function(type) {
            var path = Constant.APIRoot + "/customer/recredit";
            var service = $resource(path, {}, {
                recredit : {
                    method : 'POST'
                }
            });
            var param = {
                mobile : UserInfo.mobile,
                customerId : UserInfo.customerId,
                reCreditType : type
            };
            ngUtils.addLoading();
            service.recredit(param, function(response) {
                ngUtils.closeLoading();
                if (response && response.status == "1") {
                    UserInfo.mobileAuthStatus = "0";
                    UserInfo.mobileAuthDesc = "未认证";
                    UserInfo.repeatCreditFlag = "1";
            		var token = $window.localStorage.getItem("x-auth-token");
            		$location.url("/eGet?xAuthToken="+token);
                } else {
                    ngUtils.alert("网络错误，请稍后重试或联系客服。");
                }
            }, function(error) {
                ngUtils.closeLoading();
                ngUtils.alert("网络错误，请稍后重试或联系客服。");
            });

        },

        /**
         * 重新返回做征信申请
         */
        reCreditApply : function() {
            var path = Constant.APIRoot + "/customer/toregister";
            var service = $resource(path, {}, {
                reApply : {
                    method : 'POST'
                }
            });
            var param = {
                mobile : UserInfo.mobile,
                customerId : UserInfo.customerId
            };
            ngUtils.addLoading();
            service.reApply(param, function(response) {
                ngUtils.closeLoading();
                if (response && response.status == "1") {
                    $location.url("/creditLogin");
                } else {
                    ngUtils.alert(response.msg);
                }
            }, function(error) {
                ngUtils.closeLoading();
                ngUtils.alert("网络错误，请稍后重试或联系客服。");
            });
        },

        /**
         * 获取constants list
         */
        selectConstantsByDictCode : function(dictCode) {// 先弹出loading页面
            ngUtils.addLoading();
            var deferred = $q.defer();
            var path = Constant.APIRoot + "/bind/selectConstansList";
            var service = $resource(path, {}, {
                selectConstantList : {
                    method : 'POST'
                }
            });
            var params = {
                dictCode : dictCode
                // 微信号
            };

            service.selectConstantList(params, function(response) {
                // 关闭loading页面
                ngUtils.closeLoading();
                deferred.resolve(response.data.ConstansList);
            }, function(error) {
                // 关闭loading页面
                ngUtils.closeLoading();
                ngUtils.alert("网络错误，请稍后重试或联系客服。");
            });
            return deferred.promise;
        },

        /**
         * 获取按揭银行list
         */
        selectMortgageByDictCode : function(dictCode) {// 先弹出loading页面
            ngUtils.addLoading();
            var deferred = $q.defer();
            var path = Constant.APIRoot + "/bind/selectMortgageList";
            var service = $resource(path, {}, {
                selectConstantList : {
                    method : 'POST'
                }
            });
            var params = {
                dictCode : dictCode // 编码
            };

            service.selectConstantList(params, function(response) {
                // 关闭loading页面
                ngUtils.closeLoading();
                deferred.resolve(response.data.mortgageList);
            }, function(error) {
                // 关闭loading页面
                ngUtils.closeLoading();
                ngUtils.alert("网络错误，请稍后重试或联系客服。");
            });
            return deferred.promise;
        },
        
        /**
         * 获取系统当前时间(yyyy-MM-dd HH:mm:ss)
         */
        getCurrentDate : function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var year = date.getFullYear();// 当前年份year
            var month = date.getMonth() + 1;// 当前月份month
            var day = date.getDate();// 当前日day
            var hours = date.getHours();// 时
            var minutes = date.getMinutes();// 分
            var seconds = date.getSeconds();// 秒
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (day >= 0 && day <= 9) {
                day = "0" + day;
            }
            if (hours >= 0 && hours <= 9) {
                hours = "0" + hours;
            }
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes;
            }
            if (seconds >= 0 && seconds <= 9) {
                seconds = "0" + seconds;
            }
            ContractInfo.nowyear = year;// 当前年份
            ContractInfo.nowMonth = month;// 当前月份
            ContractInfo.nowDay = day;// 当前日期
            ContractInfo.nowHours = hours;// 小时
            ContractInfo.nowMinutes = minutes;// 分钟
            ContractInfo.nowSeconds = seconds;// 秒
        },
        appBack:function(callback){
            try{
                appModel.handlerBack();//调用此方法，通知App返回按键由H5控制
            }catch (e){

            }
            $(document).on("back",function(){
                $timeout(function(){
                    $(document).off("back");
                    callback&&callback();
                },2);
            });
        }
    }

});