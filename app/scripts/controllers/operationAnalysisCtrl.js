'use strict';
var app = angular.module('gfbApp');

/**
 * 有奖-主页面 controller
 */
app.controller('operationAnalysisCtrl', function($scope) {

    //跳转到房易贷报表
    $scope.routeaFydBill = function(){
        window.appModel.showNewWebPage("https://report-uat.apass.cn/#/fyd-home","房易贷");  
    } 
    //跳转到安家趣花报表
    $scope.routeaAjqhBill = function(){
        window.appModel.showNewWebPage(" https://report-uat.apass.cn/#/ajqh-home","安家趣花");  
    }     

    
});
