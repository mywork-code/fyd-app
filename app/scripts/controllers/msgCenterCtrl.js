/**
 * Created by wanglei07 on 2016/9/14.
 */
var app = angular.module('gfbApp');

app.controller('msgCenterCtrl',function($scope,$rootScope,$timeout){

    /*2种消息切换*/
    $scope.showMeg = 0;
    $scope.megShowDetail = function(index){
        $scope.showMeg = index;
    };


    /*通知消息列表*/
    $scope.expanders = [{
        title : 'Click me to expand',
        text : 'Hi there folks, I am the content that was hidden but is now shown.',
        checked:false
    }, {
        title : 'Click this',
        text : 'I am even better text than you have seen previously',
        checked:true
    }, {
        title : 'Test',
        text : 'test',
        checked:false
    }];
    /*账户消息*/
    $scope.accounts = [{
        title : '1Click me to expand',
        text : 'Hi there folks, I am the content that was hidden but is now shown.',
        checked:true

    }, {
        title : '1Click this',
        text : 'I am even better text than you have seen previously',
        checked:false
    }, {
        title : '1Test',
        text : 'test',
        checked:false
    }];

    $scope.info = {
        msg : 0,
        Account:0
    };

   /* 点击跟新剩余未查看消息*/
    $scope.changeMsg = function(){
        $scope.info.msg = 0;
        angular.forEach($scope.expanders,function(a){
            if(!a.checked) {
                $scope.info.msg +=1;
            }
        });
    };
    $scope.changeAccount = function(){
        $scope.info.Account = 0;
        angular.forEach($scope.accounts,function(a){
            if(!a.checked) {
                $scope.info.Account +=1;
            }
        });
    };

    /*初始化未查看消息*/
    angular.forEach($scope.expanders,function(a){
        if(!a.checked) {
            $scope.info.msg +=1;
        }
    });
    angular.forEach($scope.accounts,function(a){
        if(!a.checked) {
            $scope.info.Account +=1;
        }
    });

});
