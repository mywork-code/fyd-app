'use strict';
var app = angular.module('gfbApp');

/**
 * 有奖-主页面 controller
 */
app.controller('downloadAppCtrl', function($scope) {

    //跳转到安家趣花安卓下载页面
    $scope.routeajppAndroid = function(){
        window.location.href ="http://a.app.qq.com/o/simple.jsp?pkgname=com.vcredit.ajqh";  
    }  	
    
});
