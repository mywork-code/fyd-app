'use strict';
var app = angular.module('gfbApp');
/**
 * 选择银行卡页面控制器
 */
app.controller("bankListCtrl",function($scope, $location, BindCardObject,RepaceBindCardObject, BindBankService){
    // Bank List
    BindBankService.getBankList().then(function(data){
    	$scope.bankList = data;
    });
	$scope.BindCardObject = BindCardObject;
	$scope.RepaceBindCardObject=RepaceBindCardObject;
    if(RepaceBindCardObject.changeBankFlag=="1"){
    	//Back changebank
    	 $scope.backSelectedBank=function(){
    	   		$location.url("/changedBankCard");
    	    }
    	 //Chose Card
    	 $scope.selectedBank=function(bankCode,cardBank,cardType){    		 
    		 RepaceBindCardObject.cardBank = cardBank;
    		 RepaceBindCardObject.bankCode=bankCode;
    		 RepaceBindCardObject.ncardType=cardType;
    		 RepaceBindCardObject.selectBindFlag =true;
     		$location.url("/changedBankCard");
     	}
    	 
    }else{
    	 // Back
        $scope.backSelectedBank=function(){
       		$location.url("/bindBandCard");
        }
        
        // Choose Card
    	$scope.selectedBank=function(bankCode,cardBank,cardType){
    		BindCardObject.bankCode = bankCode;
    		BindCardObject.cardBank = cardBank;
    		BindCardObject.cardType = cardType;
    		BindCardObject.selectBindFlag =true;
    		$location.url("/bindBandCard");
    	}
    }
   
});