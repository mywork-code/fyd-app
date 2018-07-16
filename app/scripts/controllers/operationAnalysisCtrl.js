'use strict';
var app = angular.module('gfbApp');

/**
 * 有奖-主页面 controller
 */
app.controller('operationAnalysisCtrl', function($scope,$routeParams) {
    //跳转到房易贷报表
    $scope.routeaFydBill = function(){
        window.appModel.showNewWebPage("https://report-uat.apass.cn/#/fyd-home?token="+$routeParams.token,"房易贷",true);
    } 
    //跳转到安家趣花报表
    $scope.routeaAjqhBill = function(){
    	window.appModel.showNewWebPage("http://10.254.20.16:3000/#/ajqh-home?token="+$routeParams.token,"安家趣花",true);  
        // window.appModel.showNewWebPage("https://report-uat.apass.cn/#/ajqh-home?token="+$routeParams.token,"安家趣花");  
    }     
});
