'use strict';

var module = angular.module('gfbApp');

module.factory('httpInteceptor', function($q, $rootScope, $location, $window,
		ngUtils) {
	
    return {
        request : function(config) {
        	var currDate = new Date();
        	var year = currDate.getFullYear();
        	var month = currDate.getMonth() + 1;
        	if(month < 10){
        		month = "0" + month;
        	}
        	var day = currDate.getDate();
        	if(day < 10){
        		day = "0" + day;
        	}
        	// var hour = currDate.getHours();
        	// if(hour < 10){
        	// 	hour = "0" + hour;
        	// }
        	var key = "Apass@" + year + month + day + "00";
        	var token = $window.localStorage.getItem("x-auth-token");
    		if(token && token != ''){
    			if(config.data){
    				$.extend(config.data, {"x-auth-token":token});
    			}else{
    				config.data ={"x-auth-token":token};
    			}
    		}
    		if (config.data) {
				var jsonData = JSON.stringify(config.data);

				var key = CryptoJS.enc.Utf8.parse(key);

				var srcs = CryptoJS.enc.Utf8.parse(jsonData);
				var data = CryptoJS.AES.encrypt(srcs, key, {
					mode : CryptoJS.mode.ECB,
					padding : CryptoJS.pad.Pkcs7
				}).toString();

				config.data = {
					"h5Data" : data
				};
			}
			return config;
        },
        response : function(response) {
            return $q.when(response).then(function(t) {
                if (t.data.status == '-2') {
                    if(window.__wxjs_environment) {
                         wx.miniProgram.postMessage({ data: {msg: response.msg,code:-2} });
                         wx.miniProgram.navigateBack();                     
                    } else {    
                        appModel.gotoLogin();

                    }              
                	// var platform = window.Android || window;
     	          	// platform.clear_UserToken();
                    $window.localStorage.removeItem("x-auth-token");
  	          	 
                	// if(t.data.msg && t.data.msg != ''){
                	// 	ngUtils.alert(t.data.msg);
                	// }
                	// $rootScope.gotoLogin();
                }
                return t;
            });
        }
    };
});