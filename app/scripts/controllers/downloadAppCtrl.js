'use strict';
var app = angular.module('gfbApp');

/**
 * 有奖-主页面 controller
 */
app.controller('downloadAppCtrl', function($scope,ngUtils) {
	var clipboard = new Clipboard('.copyBtn').on('success', function(e) {
        var e = e || window.event;
        console.log(e);
        ngUtils.alert('复制成功');
    }).on('error', function(e) {});

    //跳转到安家趣花安卓下载页面
    // $scope.routeajppAndroid = function(){
    //     window.location.href ="http://a.app.qq.com/o/simple.jsp?pkgname=com.vcredit.ajqh";  
    // } 




    
});
/**
 * 有奖-主页面 controller
 */
app.controller('downloadRegAppCtrl', function($scope,ngUtils) {
    //跳转到安家趣花安卓下载页面
    $scope.routeajppAndroid = function(){
        window.location.href ="http://a.app.qq.com/o/simple.jsp?pkgname=com.vcredit.ajqh";  
    } 
});