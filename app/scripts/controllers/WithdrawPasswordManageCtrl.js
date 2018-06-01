/**
 * Created by wanglei07 on 2016/10/9.
 * 提现设置交易密码-主页面 controller
 */
var app = angular.module('gfbApp');

app.controller('WithdrawPasswordManageCtrl', function ($scope, $timeout, $location, ngUtils,TransactionGestureService,
		RegisterInfo) {	
	$scope.RegisterInfo = RegisterInfo;
 
	//新增交易密码
	$scope.isPassDone = true;
	$scope.addTranPass=function(){
		if (newDeslPassTwo == newDeslPassOne) { //2次密码输入一致
			RegisterInfo.tranPassword=newDeslPassOne;
			TransactionGestureService.savetransaction('1');
			$("#UI-keyboard").hide();
            deslRemaid("密码设置成功！");
        } else {
        	ngUtils.alert("2次密码输入不一致，请重新输入密码");
            timer = 0;
            oPassWrap.trigger("tapClaer");
            $scope.isPassDone = true;
            $(this).off();
        }

	}	

    var oPassWrap = $(".keyboard-pass");
    var newDeslPassOne, newDeslPassTwo;
    var oBtn = $(".UI-btn");
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
                $timeout(function(){
                	$scope.isPassDone = false;
                },20);
                break;
            default:
        }
    });
    showPassKeyboard(oPassWrap);

    function showPassKeyboard(obj) {
        var oHtml = ' <div id="UI-keyboard" class="maskCtrl" style="display:none;"> <ul> <li class="num">1</li> <li class="num">2</li> <li class="num">3</li> <li class="num">4</li> <li class="num">5</li> <li class="num">6</li> <li class="num">7</li> <li class="num">8</li> <li class="num">9</li><li class="active"></li> <li class="num">0</li><li class="active remove"></li> </ul> </div>';
        $("body").append(oHtml);
        obj.on("click", function () {
            $("#UI-keyboard").show();
        });
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
        $(".set-dealPass .UI-remind").html(text);
    }    
});