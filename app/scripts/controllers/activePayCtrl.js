'use strict';
var app = angular.module('gfbApp');

/**
 * 主动还款成功页面
 */
app.controller('activePaySuccessCtrl', function ($scope, $routeParams) {
    if ($routeParams.amount) {
        $scope.amount = "￥" + $routeParams.amount;
    }
});
/**
 * 主动还款成功页面
 */
app.controller('activePayFailureCtrl', function ($scope, $routeParams) {
    var code = $routeParams.code;
    var message = "";
    if (code == "AP005") {
        message = "温馨提示:您有操作中的订单,请耐心等候系统处理结果。";
    } else if (code == "-1") {
        message = "温馨提示:系统登录超时,请重新登录后再试。";
    } else if (code == "AP003") {
        message = "温馨提示:当期账单已结清，无需重复还款。";
    } else {
        message = "温馨提示:网络异常请稍后再试" + (code ? ("[" + code + "]") : "");
    }
    $scope.tipMessage = message;
});
