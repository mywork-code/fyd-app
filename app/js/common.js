function comGoBack(){
    $(document).triggerHandler("back");
}
Zepto(function ($) {
    //用fastclick防止点透
    window.addEventListener('load', function () {
        FastClick.attach(document.body);
    }, false);
    //使用requestAnimationFrame做倒计时
    function timerCount(ele, n) {
        var timer, $this = $(ele), countNum = n || 90;
        countNum *= 90;
        function timer() {
            countNum--;
            $this.addClass('disabled').html(Math.floor(countNum / 90) + ' 秒');
        }

        requestAnimationFrame(function () {
            timer();
            if (countNum > 0) {
                requestAnimationFrame(arguments.callee);
            } else {
                countNum = ( n || 90) * 90;
                $this.removeClass('disabled').html('重新获取');
            }
        });

        //setInterval的写法  如果客户中有人用安卓4.3系统考虑换过来
//		clearInterval(timer);
//         timer = setInterval(function(){
//               countNum -- ;
//              if (countNum < 0 ) {
//	                $this.removeClass('disabled');
//	                 clearInterval(timer);
//	                 countNum = n || 90 ;
//	                 return  $this[0].innerHTML= '重新获取'
//             }else{
//             		$this.addClass('disabled');
//             		$this[0].innerHTML= countNum +' 秒';	               		
//             }
//         }, 1000);
    };

    $('.UI-mask').tap(function () {
        $(this).removeClass('show');
    });
    $('.UI-mask .UI-btn-close').tap(function () {
        $('.UI-mask').removeClass('show');
        event.stopPropagation(); //阻止事件向上冒泡
    });
    $('.UI-mask .maskCtrl').tap(function () {
        $(this).parent('.UI-mask').addClass('show');
        event.stopPropagation(); //阻止事件向上冒泡
    });




})