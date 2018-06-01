'use strict';

var app = angular.module("gfbApp");

//header服务弹框
app.directive("showAlert", ['$window','$location',
                            function ($window, $location) {
    return {
        restrict: "E",
        templateUrl: "views/directive/serveAlert.html",
        replace: true,
        link: function (scope, element, attrs) {
            scope.showMe = false;
            scope.showAlert = function () {
                scope.showMe = true;
            }
            scope.hideAlert = function () {
                scope.showMe = false;
                event.stopPropagation();
            }
            scope.stopP = function () {
                event.stopPropagation();
            }
            scope.gotoHelpCenter = function () {
            	var xAuthToken = $window.localStorage.getItem("x-auth-token");
            	$location.url("/helpCenter?xAuthToken=" + xAuthToken);
                event.stopPropagation();
            }
        }
    }
}]
);

app.directive('rotateLoading', ['$rootScope',
        function ($rootScope) {

            return {
                link: function (scope, element) { //attrs

                    element.addClass("hide");

                    $rootScope.$on('$routeChangeStart', function () {
                        element.removeClass("hide");
                    });

                    $rootScope.$on('$routeChangeSuccess', function () {
                        element.addClass("hide");
                    });
                }
            };
        }]
);
/*全页显示*/
app.directive("hollPage", function () {
    return {
        link: function (scope, element) {
        	function page(){
        		 var oHeight = parseInt(element[0].offsetHeight),
                 windowHeight = parseInt(window.innerHeight);
             if (oHeight < windowHeight) {
                 element[0].style.height = windowHeight + 'px';
             }
        	}
        	
        	page();
            window.addEventListener("resize", function () {
            	page();
            });
        }
    }
});
app.directive("touchStop", function () {
    return {
        link: function (scope, element) {
            document.body.addEventListener('touchmove', function (event) {
                event.preventDefault();

            }, false);
        }
    }
});
/*通知中心开关列表*/
app.directive('accordion', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<div ng-transclude></div>',
        controller: function () {
            var expanders = [];
            this.gotOpened = function (selectedExpander) {
                angular.forEach(expanders, function (expander) {
                    if (selectedExpander != expander) {
                        expander.showMe = false;
                    }
                });
            }
            this.addExpander = function (expander) {
                expanders.push(expander);
            }
        }
    }
});

app.directive('expander', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        require: '^?accordion',
        scope: {
            title: '=expanderTitle'
        },
        templateUrl: "views/directive/helpcetner.html",
        link: function (scope, element, attrs, accordionController) {
            scope.showMe = false;
            accordionController.addExpander(scope);
            scope.toggle = function toggle() {
                scope.showMe = !scope.showMe;
                accordionController.gotOpened(scope);
            }
        }
    }
});

/*消息中心开关列表*/
app.directive('msgList', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<div ng-transclude></div>',
        controller: function () {
            var expanders = [];
            this.gotOpened = function (selectedExpander) {
                angular.forEach(expanders, function (expander) {
                    if (selectedExpander != expander) {
                        expander.showMe = false;
                    }
                });
            };
            this.addExpander = function (expander) {
                expanders.push(expander);
            }
        }
    }
});
app.directive('msgBody', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        require: '^?msgList',
        scope: {
            title: '=expanderTitle',
            checked: '=expanderChecked'
        },
        templateUrl: "views/directive/helpcetner.html",
        link: function (scope, element, attrs, accordionController) {
            scope.showMe = false;
            accordionController.addExpander(scope);
            scope.toggle = function toggle() {
                scope.checked = true;
                scope.showMe = !scope.showMe;
                accordionController.gotOpened(scope);
            };
        }
    }
});
app.directive('focusShow', function () {
    return {
    	 link: function (scope, element) {
             element[0].scrollIntoView();
         }
    }
});
/*点击禁止冒泡*/
app.directive("clickStop", function () {
    return {
        link: function (scope, element) {
            element[0].addEventListener("click",function(event){
                event.stopPropagation();
            });
        }
    }
});
/*mask禁止滑动 slip-stop */
app.directive("slipStop", function () {
    return {
        link: function (scope, element) {
            element[0].addEventListener("touchmove",function(e){
                e.preventDefault();
                return false;
            });
        }
    }
});
/*验证手机号码*/
app.directive("telPhoneOnly", function (ngUtils) {
    return {
        require: '?ngModel',
        link: function (scope, element,attr,ngModel) {
            element[0].addEventListener("blur",num);
            function num(event){
                 if(this.value != '' && !/^1\d{10}$/.test(this.value.replace(/\s+/g, "") )){
                    this.value = '';
                    ngModel.$setViewValue(this.value);
                    ngUtils.alert('请输入正确手机号码');
                }
            }
        }
    }
});
/*只能输入数字*/
app.directive("numberOnly", function () {
    return {
        link: function (scope, element) {
            element[0].addEventListener("keydown",num);
            element[0].addEventListener("keypress",num);
            element[0].addEventListener("blur",num);

            function num(event){
                if(/[^\d]/.test(this.value)){//替换非数字字符
                    var temp_amount=this.value.replace(/[^\d]/g,'');
                    this.value = temp_amount;
                }
            }
        }
    }
});
/*限制值大小*/
app.directive("incomeNumLimit", function (ngUtils,$timeout,$filter) {
    return {
        require: '?ngModel',
        scope:{
            ngModel: '='
        },
        link: function (scope, element,attr,ngModel) {
            element[0].addEventListener("keyup",num);
            element[0].addEventListener("blur",num);
            var isAlsrt = true;
            function num(event){
                if(this.value != 0){
                    this.value = this.value.replace(/\b(0+)/gi,"");
      
          }else if(this.value == 0) {
                    this.value = this.value.replace(/\b(0+)/gi,"0");
                }
                if(this.value > 100000){
                    this.value =  100000;
                    ngModel.$setViewValue(this.value);
                    wranAlert();
                    event.stopPropagation();
                    event.preventDefault();
                }else if (this.value == 100000){
                    ngModel.$setViewValue(this.value);
                }
            };
            function wranAlert(){
                if(!isAlsrt){
                    return;
                }else {
                    ngUtils.alert('最多10万');
                }
                isAlsrt = false;
                $timeout(function(){
                    isAlsrt = true;
                },2000);
            };
        }
    }
});
//手机号码间隔
app.directive("phoneNumDist", function (ngUtils,$timeout,$filter) {
    return {
        link: function (scope, element,attr,ngModel) {
            element[0].addEventListener("keydown",dis);
            element[0].addEventListener("keypress",dis);
            element[0].addEventListener("keyup",dis);

            function dis(){
                var ctx = element[0];
                var curpos = ctx.selectionStart;
                var old_value = ctx.value;
                ctx.value = paddingSpace(ctx.value.replace(/\D/g,''));
                var index_delta = 0
                if(old_value[curpos - 1] == ' ') {
                    index_delta = -1
                } else {
                    var old_value_before_cursor = old_value.slice(0, curpos)
                    var old_value_before_cursor_spaced = paddingSpace(old_value_before_cursor)

                    index_delta = old_value_before_cursor_spaced.length - old_value_before_cursor.length
                }
                setCursorPosition(ctx, curpos, index_delta);
            }
            function paddingSpace(str) {
                return str.replace(/\s/g,'').replace(/(^\d{3})(?=\d)/g,"$1 ").replace(/(\d{4})(?=\d)/g,"$1 ");
            };

            function setCursorPosition(elem, index, index_delta) {
                var val = elem.value;
                var len = val.length;
                if (len < index) return;
                index += index_delta
                elem.focus()
                if (elem.setSelectionRange) {
                    elem.setSelectionRange(index, index)
                } else {
                    var range = elem.createTextRange();
                    range.moveStart("character", -len);
                    range.moveEnd("character", -len);
                    range.moveStart("character", index);
                    range.moveEnd("character", 0);
                    range.select();
                }
            };
        }
    }
});
//银行卡4位间隔
app.directive("codeDist", function () {
    return {
        link:function (scope, element,attr,ngModel) {
            element[0].addEventListener("keydown",dis);
            element[0].addEventListener("keypress",dis);
            element[0].addEventListener("keyup",dis);
            function dis(){
                var ctx = element[0];
                var curpos = ctx.selectionStart;
                var old_value = ctx.value;
                ctx.value = paddingSpace(ctx.value.replace(/\D/g,''));
                var index_delta = 0
                if(old_value[curpos - 1] == ' ') {
                    index_delta = -1
                } else {
                    var old_value_before_cursor = old_value.slice(0, curpos)
                    var old_value_before_cursor_spaced = paddingSpace(old_value_before_cursor)

                    index_delta = old_value_before_cursor_spaced.length - old_value_before_cursor.length
                }
                setCursorPosition(ctx, curpos, index_delta);
            }
            function paddingSpace(str) {
                return str.replace(/\s/g,'').replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
            };

            function setCursorPosition(elem, index, index_delta) {
                var val = elem.value;
                var len = val.length;
                if (len < index) return;
                index += index_delta
                elem.focus()
                if (elem.setSelectionRange) {
                    elem.setSelectionRange(index, index)
                } else {
                    var range = elem.createTextRange();
                    range.moveStart("character", -len);
                    range.moveEnd("character", -len);
                    range.moveStart("character", index);
                    range.moveEnd("character", 0);
                    range.select();
                }
            };
        }
    }
});