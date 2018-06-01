'use strict';
var app = angular.module('gfbApp');

/**
 * home
 */
app.controller('homeCtrl', function($scope, $location,$window) {
	
	$scope.gotoEGet = function(){
		var token = $window.localStorage.getItem("x-auth-token");
		$location.url("/eGet?xAuthToken="+token);
	}

	$scope.gotoOrder = function(){
		var token = $window.localStorage.getItem("x-auth-token");
		$location.url("/order?xAuthToken="+token);
	}

});
