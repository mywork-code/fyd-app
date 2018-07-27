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

    var head= document.getElementsByTagName('head')[0]; 
    var script= document.createElement('script'); 
    script.type= 'text/javascript'; 
    // script.src= 'https://jic.talkingdata.com/app/h5/v1?appid=013E50A7803D4C12AA6AB3A3B5E439AE&vn=房易贷&vc=1'; //测试
    script.src= 'https://jic.talkingdata.com/app/h5/v1?appid=53AFD9EE62D744E49A31F1C8B7A22E57&vn=房易贷&vc=1'; //生产
    head.appendChild(script);  
    //跳转到安家趣花安卓下载页面
    $scope.routeajppAndroid = function(){
        TDAPP.onEvent("立即下载");

        // window.location.href ="http://a.app.qq.com/o/simple.jsp?pkgname=com.vcredit.ajqh";  
    } 
});