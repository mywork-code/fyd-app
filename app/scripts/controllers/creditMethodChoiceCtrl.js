/**
 * Created by wanglei07 on 2016/9/14.
 */
var app = angular.module('gfbApp');

app.controller('creditMethodChoiceCtrl',function($scope, CreditMethodChoiceSvc) {
	/**
	 * 银测获取查询码 - 跳转银测页面
	 */
	$scope.redirectUnionPay = function() {
		// 初始化征信页面--获取认证码的跳转页面信息和验证码图片Base64字符串
		CreditMethodChoiceSvc.initNetCredit();
	};
	
	/**
	 * 5个问题获取查询码方式---获取5个问题
	 */
	$scope.redirectFiveQuestion = function() {
		CreditMethodChoiceSvc.redirectFiveQuestion();
	}
});