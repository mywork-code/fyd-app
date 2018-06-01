'use strict';
var app = angular.module('gfbApp');

/**
 * 登录 controller
 */
app.controller('loginCtrl', function($scope,$rootScope,$routeParams,$window,$location,UserInfo,RegisterInfo,ngUtils,LoginService,CommonService,ContractInfo) {
    $rootScope.setTitle('登录');
    $scope.UserInfo = UserInfo;
    $scope.RegisterInfo = RegisterInfo;
    CommonService.appBack(function(){
        var curOrigin = window.location.origin,abssUrl = '';
        //window.location.href = 'http://192.168.191.1:9090/bss/system/bill?userId=8008986';
        if($routeParams.test == 'uat'){//uat环境 安家派账单没有uat环境，当bss是uat时，返回到bss sit
            abssUrl = 'http://bss.uat.apass.cn/bss/system/bill?userId='+UserInfo.ajqhUserId
        }else {
            abssUrl = curOrigin+'/bss/system/bill?userId='+UserInfo.ajqhUserId
        }

        window.location.href =abssUrl;
    })


    $scope.isload = true;
    $routeParams.ajqhUserId&&(UserInfo.ajqhUserId=$routeParams.ajqhUserId);
    $routeParams.app&&(UserInfo.app=$routeParams.app);
    if(UserInfo.app == 'newAjp'){//来自安家派App 隐藏返回按钮
        try{
            appModel.isShowLeftBtn('0')
        }catch(e){
            console.log('隐藏')
        }
    }else {

    }
    $scope.isPassShow = true;
    $scope.login = function(){
        if(!ngUtils.isPhoneNo(ngUtils.trimA(RegisterInfo.account))){
            ngUtils.alert('请输入正确手机号')
            return
        }else if(!/^[A-Za-z0-9]{6,12}$/.test(RegisterInfo.password)){
            ngUtils.alert('请输入6-12位密码')
            return
        }else {
            LoginService.loginAction()

        }

    }
});
