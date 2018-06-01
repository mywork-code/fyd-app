'use strict';
var app = angular.module('gfbApp');

/**
 * 有奖-主页面 controller
 */
app.controller('ZmAuthResultCtrl', function ($scope, $location, $routeParams) {
    var result = $routeParams.status;
    if (result == "success" || result == "failure") {
        $scope.status = result;
    } else {
        $scope.status = "failure";
    }
});
