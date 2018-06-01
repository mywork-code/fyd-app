'use strict';
var app = angular.module('gfbApp');

/**
 * 设置交易密码-主页面 controller
 */
app.controller('newDeslPasswordManageCtrl', function($rootScope,$scope, $location, ngUtils, Constant,CountdownObj,TransactionGestureService,
		UserInfo,RegisterInfo) {
	$scope.UserInfo = UserInfo;
	$scope.CountdownObj = CountdownObj;
	$scope.RegisterInfo = RegisterInfo;
	UserInfo.tranPassword="";
	UserInfo.newtranPassword="";
	UserInfo.reconfirmPassword="";
	RegisterInfo.verifyCode="";
	RegisterInfo.tranPassword="";
	RegisterInfo.reconfirmPassword="";
	RegisterInfo.newPassword="";
	
	var oPassWrap = $(".keyboard-pass");
    var newDeslPassOne, newDeslPassTwo;
    var timer = 0;
    oPassWrap.on("tapDone", function (e, pass) {
        switch (timer) {
            case 0:  //第一次输入
                newDeslPassOne = pass;
                timer = 1;
                deslRemaid("请再次确认交易密码");
                oPassWrap.trigger("tapClaer");
                break;
            case 1:
                newDeslPassTwo = pass;
                    if (newDeslPassTwo == newDeslPassOne) { //2次密码输入一致
                    	RegisterInfo.tranPassword=newDeslPassOne; 
                    	//新增交易密码
                    	TransactionGestureService.savetransaction('0');

                    } else {
                    	ngUtils.alert("2次密码输入不一致，请重新输入密码");
                	    deslRemaid("为了您的资金安全，请设置交易密码");
                        timer = 0;
                        oPassWrap.trigger("tapClaer");
                    }

                break;
            default:

        }
    });
    showPassKeyboard(oPassWrap);
    function showPassKeyboard(obj) {
        var oText;
        var oPassInput = obj.children("input");
        var oPassVal = oPassInput.val();
        var passShowLi = obj.find("li");
        $("#UI-keyboard").on("touchend", "li.num", function () {

            if ($(this).hasClass("num") && oPassVal.length < 6) {
                oText = $(this).text();
                setPassWordVal.add(oText);
            }
        });
        $("#UI-keyboard").on("touchstart", "li.remove", function () {
            if ($(this).hasClass("remove") && oPassVal.length > 0) {
                setPassWordVal.remove();
            }
        });

        var setPassWordVal = {
            add: function (num) {
                oPassVal += num;
                passShow(oPassVal);
                if (oPassVal.length == 6) { //密码输入6位
                    setTimeout(function () {
                        obj.trigger("tapDone", oPassVal);
                    }, 80)
                }
            },
            remove: function () {
                oPassVal = oPassVal.substring(0, oPassVal.length - 1);
                passShow(oPassVal);
            },
            clear: function () {
                oPassVal = "";
                passShow(oPassVal);
            }
        };
        obj.on("tapClaer", function () {
            setPassWordVal.clear();
        });
        function passShow(pass) {
            passShowLi.removeClass("done");
            for (var i = 0; i < pass.length; i++) {
                passShowLi.eq(i).addClass("done");
            }

        }

    }

    function deslRemaid(text) {
        $(".set-dealPass .com-wraning").html(text);
    }
});