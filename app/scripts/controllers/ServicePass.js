/**
 * Created by wanglei07 on 2016/9/14.
 */
var app = angular.module('gfbApp');

app.controller('ServicePass',function($scope,$rootScope,$timeout){

    $scope.showFindWay = 1;
    /*选择滑动*/
    var swiper = new Swiper('.eGet-servePassFindWrap', {
        effect: 'coverflow',
        centeredSlides: true,
        slidesPerView: 'auto',
        initialSlide:1,
        coverflow: {
            rotate: 40,
            stretch: 0,
            depth: 10,
            modifier: 1,
            slideShadows : false
        },
        onTransitionEnd:function(mySwiper){
            $timeout(function(){
                $scope.showFindWay = mySwiper.activeIndex;
            },20);
        }
    });
    
    //重置手机服务密码
    $scope.resetPhonePassword=function(operator,number){
    	var platform = window.Android || window;
		platform.sendSms(number,operator);
    }
});
