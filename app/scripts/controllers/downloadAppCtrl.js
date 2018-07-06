'use strict';
var app = angular.module('gfbApp');

/**
 * 有奖-主页面 controller
 */
app.controller('downloadAppCtrl', function($scope) {
	var clipboard = new Clipboard('.copyBtn').on('success', function(e) {
        var e = e || window.event;
        console.log(e);
    }).on('error', function(e) {});

    //跳转到安家趣花安卓下载页面
    // $scope.routeajppAndroid = function(){
    //     window.location.href ="http://a.app.qq.com/o/simple.jsp?pkgname=com.vcredit.ajqh";  
    // } 




    
});
