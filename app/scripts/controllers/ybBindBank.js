'use strict';
var app = angular.module('gfbApp');

/**
 * 易宝 绑卡
 */
app.controller('ybBindBankCtrl', function ($rootScope,$scope, $routeParams,yibaoService,ngUtils,$timeout,UserInfo,$location,YibaoPay,CountdownObj,CommonService) {
	$scope.isShowKeyboard = false;//键盘
	$scope.isShowKeyFlag = false;//是否可以显示键盘 第一次获取短信成功后才可以
    CommonService.appBack(function(){
        YibaoPay.BankCardName = '';
        YibaoPay.cardCode = '';
        YibaoPay.phone = '';
        YibaoPay.isFormBank = true;
        CommonService.endInterval();
        $location.url(YibaoPay.repayURL);

    })
    if(UserInfo.realName=='' || UserInfo.identityNo=='') {
        UserInfo.realName = $routeParams.realName;
        UserInfo.identityNo = $routeParams.identityNo;
    }
    document.title = "绑定银行卡";
	$scope.CountdownObj = CountdownObj;
    $scope.YibaoPay = YibaoPay;
    CountdownObj.content='获取验证码';
    CountdownObj.disFlag = false; // 初始化按钮置灰设置
    $scope.UserInfo=UserInfo;
    $scope.keyMsg = '';
    yibaoService.InitBindBank();
    $scope.firstCode = '';  
    $scope.firstPhone = '';
    YibaoPay.cardCode = '';
    YibaoPay.phone = '';
    CommonService.endInterval();
    try {
        if($routeParams.cardCode) {
           YibaoPay.cardCode = $routeParams.cardCode;
        }
        if($routeParams.phone) {
            YibaoPay.phone = $routeParams.phone;
        }

    } catch(e) {
        // statements
        console.log(e);
    }    
	
	$scope.showKeyBoard = function(){
		if($scope.isShowKeyFlag){
			$scope.isShowKeyboard = true
		}
	}
	
	$scope.addKeyBd = function(num){//数字键
		var len = $scope.keyMsg.length;
		if($scope.keyMsg.length < 6){
			$scope.keyMsg += num;
			$("#inputBoxContainer span").html('');
			Array.prototype.slice.call($scope.keyMsg).forEach(function(e,i){
				$("#inputBoxContainer span").eq(i).html(e)
			})
            // console.log('str=',$scope.keyMsg);
            YibaoPay.MsgCode=$scope.keyMsg;            
		}
		
	}
	$scope.removKeyBD = function(){
        // $scope.keyMsg = '';
        // $scope.isShowKeyboard = false;//关闭键盘
        // $("#inputBoxContainer span").html('');
		if($scope.keyMsg.length >0){
			$scope.keyMsg = $scope.keyMsg.slice(0,$scope.keyMsg.length-1)
			$("#inputBoxContainer span").html('');
			// console.log($scope.keyMsg)
			Array.prototype.slice.call($scope.keyMsg).forEach(function(e,i){
				$("#inputBoxContainer span").eq(i).html(e)
			})
            YibaoPay.MsgCode=$scope.keyMsg;    
		}
		
	}
	$scope.clearKeybord = function(){//清空输入的短信息
		$scope.keyMsg = '';
		$("#inputBoxContainer span").html('');
	}
    $scope.sendMsg = function(){
    	
        ngUtils.loadingAlert();
        if(ngUtils.trimA(YibaoPay.phone).length!='11'){
            ngUtils.loadingAlertClose();
            ngUtils.alert('手机号码格式不正确');
        } else if(ngUtils.trimA(YibaoPay.phone).length=='11'){
            if($scope.firstCode==''){
        		yibaoService.getSmsReg().then(function(res){
        			if(res && res.status == '1'){//只有发送成功 才可以点击键盘
        				$scope.isShowKeyFlag = true;
        				$scope.firstCode = YibaoPay.cardCode;
                        $scope.firstPhone = YibaoPay.phone;
        			}
                	$scope.clearKeybord();
                	$scope.isShowKeyboard = false;
                    
                });
            } else {
                if($scope.firstCode==YibaoPay.cardCode && $scope.firstPhone == YibaoPay.phone) {//重发时判断手机号是否改动
                      yibaoService.AgainGetSmsReg(yibaoService).then(function(res){
                        $scope.clearKeybord();
                        $scope.isShowKeyFlag = true;
                        $scope.isShowKeyboard = false;

                    })
                } else {
                        yibaoService.getSmsReg().then(function(res){
                            if(res && res.status == '1'){//只有发送成功 才可以点击键盘
                                $scope.isShowKeyFlag = true;
                            }
                            $scope.clearKeybord();
                            $scope.isShowKeyboard = false;
                            $scope.firstCode = YibaoPay.cardCode;
                            $scope.firstPhone = YibaoPay.phone;
                        });                    
                }
              
            }
            
        } 
        // if($('.yibao-bindcardno').val()=='') {
        //     ngUtils.alert('银行卡号不能为空');
        // }  
        // if($('.yibao-bank').val()=='') {
        //     ngUtils.alert('银行不能为空');
        // }

         // yibaoService.getSmsReg();
    }
    // $scope.resendSendCode = function(){
    //      CommonService.beginInterval(60);
    // }    
    $scope.chooseBank = function(){ 
    	CommonService.endInterval();
         $location.url('/chooseBank?cardCode='+YibaoPay.cardCode+"&phone="+YibaoPay.phone);
        // yibaoService.yibaoChooseBank();
    }    
    $scope.yibaoSubmit = function(){
        var str = "";//定义div里所有span的值组成的字符串
        var spans = new Array();//定义一个数组，用来存放每一个span的值
        $(".yibao-bogusInput span").each(function(i, obj){
            spans[i] = $(this).text();
        });//循环取出span的值放入数组中
        str = spans.join("");//将数组中的值用逗号连接起来
       
        $scope.str=str;
        // console.log('YibaoPay.phone',YibaoPay.phone)
        // console.log('YibaoPay.BankCardName',YibaoPay.BankCardName)
        // console.log('YibaoPay.cardCode',YibaoPay.cardCode)
        // console.log('YibaoPay.MsgCode',YibaoPay.MsgCode)

        yibaoService.yibaoMsgCheck($scope);
    }            


});




/*我要还款*/
app.controller('ybRepaymentCtrl', function ($rootScope,ngUtils,$location,$scope, $timeout,$routeParams,yibaoService,YibaoPay,$window,UserInfo,CountdownObj,CommonService) {
    $scope.UserInfo = UserInfo;
    document.title = "我要还款";
    CommonService.appBack(function(){
       $location.url("/fydOrder?mobile="+UserInfo.mobile+"&token="+UserInfo.xAuthToken).replace();//返回到我的账单

    })
      // CommonService.beginInterval(120);   
    YibaoPay.repayURL = $location.$$url;
    yibaoService.InitBindBank();
    $scope.YibaoPay = YibaoPay;
    // appModel.title('我要还款');
    if (YibaoPay.sltAcctId == '' || YibaoPay.sltAcctId == undefined ) {
        YibaoPay.sltAcctId = $routeParams.sltAcctId;
    }
    if (YibaoPay.vbsBid == '' || YibaoPay.vbsBid == undefined) {
        YibaoPay.vbsBid = $routeParams.vbsBid;
    }    
    if (UserInfo.mobile == '' || YibaoPay.mobile == undefined) {
        UserInfo.mobile = $routeParams.mobile;
    }    

    // UserInfo.xAuthToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJqd3Rfd2l0aG91dF9zcHJpbmdfc2VjdXJpdHkiLCJhdXRoIjoidGVzdCIsImV4cCI6MTUyNDEzNjMzMX0.wnolDM5Em51UbMKJi9VMQThHrKkt2P9XE7ptG_IFbnI4kTGOvh3M1EihpjgZJtEiUiOaA1TLRHjaMU8Uwta5Tg";
    UserInfo.xAuthToken = $routeParams.token;
    UserInfo.mobile=$routeParams.mobile;
    YibaoPay.sltAcctId=$routeParams.sltAcctId;
    yibaoService.repay();
    
    if(YibaoPay.isFormBank == true){
    	$('.yibao-mask').show();
        $('.yibao-mask').css('opacity','0.5');
        $(".repayNew").show();      
        YibaoPay.isFormBank = false;
        setTimeout(function(){
            bankSwiperInit();
        },50)
    }
    $scope.repayment = function() {
        if(YibaoPay.isPayResult=='1') {
             $location.url('/repayResult').replace();
        } else {
            $('.yibao-mask').show();
            $('.yibao-mask').css('opacity','0.5');
            $(".repayNew").show();
            bankSwiperInit();
        }
       


    } 
    $scope.sendMsgBack = function() {
         $('.yibao-mask').hide();
         $('.repayNew').hide();
         $scope.isShowSmsReg =false;
         $scope.isShowKeyboard = false;//键盘
        // window.history.go(-1);
    }             
    $scope.changeSelectbox = function() {
        // console.log(YibaoPay.selectSrc);
        if(YibaoPay.selectSrc=='img/ajp-botton-off.png') {
            YibaoPay.selectSrc='img/ajp-botton-on.png';
        } else if(YibaoPay.selectSrc=='img/ajp-botton-on.png') {
            YibaoPay.selectSrc='img/ajp-botton-off.png';
        } 
      
    }; 
    $scope.YibaoPay = YibaoPay;
    $scope.UserInfo = UserInfo;
    $scope.isShowSmsReg = false;
    $scope.keyMsg = '';
    $scope.isCanSub = false;//是否可以提交--短信发送成功后
    $scope.isSubOne = true;//判断一次提交，防抖 
    $scope.YibaoPay = YibaoPay;
    YibaoPay.BankCardName ="";
    CountdownObj.content='获取验证码';
    CountdownObj.disFlag=false;
    $scope.CountdownObj = CountdownObj;
    // console.log(YibaoPay.bankCardNumber);
    $scope.isShowKeyboard = false;//键盘
    // $scope.isShowSmsReg=true;
   $scope.addKeyBd = function(num){//数字键
        var len = $scope.keyMsg.length;
        if($scope.keyMsg.length < 6){
            $scope.keyMsg += num;
            $("#inputBoxContainer span").html('');
            Array.prototype.slice.call($scope.keyMsg).forEach(function(e,i){
                $("#inputBoxContainer span").eq(i).html(e)
            })
        }
        
    }
    $scope.CloseYibaoMask = function() {
            $scope.isShowKeyboard = false;
            $scope.isShowSmsReg =false;
            $('.yibao-mask').hide();
            // $('.yibao-mask').css('opacity','0.5');
            $(".repayNew").hide();    
            $scope.keyMsg = '';
            $("#inputBoxContainer span").html('');
    } 
    $scope.removKeyBD = function(){
        if($scope.keyMsg.length >0){
            $scope.keyMsg = $scope.keyMsg.slice(0,$scope.keyMsg.length-1)
            $("#inputBoxContainer span").html('');
            // console.log($scope.keyMsg)
            Array.prototype.slice.call($scope.keyMsg).forEach(function(e,i){
                $("#inputBoxContainer span").eq(i).html(e)
            })
        }
        
    }
    $scope.showSmsReg = function(list){
         $scope.bindMobile = list.phone;
        // $scope.isShowSmsReg = true;
        $scope.cardNo=list.cardNo;
        $scope.bankCode=list.bankCode;
        if(YibaoPay.selectSrc=='img/ajp-botton-on.png') {
           $scope.activePayType = '2';
        } 
        if(YibaoPay.dueAmt<=0) {
            $scope.activePayType = '2';
            $scope.amount = YibaoPay.nextBillAmt;
        } else if(YibaoPay.dueAmt>0&&YibaoPay.selectSrc=='img/ajp-botton-on.png'){
            $scope.activePayType = '2';
            $scope.amount = YibaoPay.totalAmt;
        }  else {
            $scope.activePayType = '1';
            $scope.amount = YibaoPay.dueAmt;
        }
        YibaoPay.reCardNo=list.cardNo;
        YibaoPay.reBankCode=list.bankCode;
        YibaoPay.reActivePayType=$scope.activePayType;  
        YibaoPay.Reamount=$scope.amount;
        console.log('YibaoPay.Reamount===',YibaoPay.Reamount)
        // $scope.amount =;
        // $('.repayNew').hide();
        // $('.getSmsReg').show()
        // $scope.isShowSmsReg=true;           
        yibaoService.yibaoShowSmsReg($scope).then(function(res){
            console.log(res)
            if(res.status == '1'){
                $scope.isCanSub = true;
                YibaoPay.requestNo= res.data.requestNo;
                $('.repayNew').hide();
                $('.getSmsReg').show()
                $scope.isShowSmsReg=true;                                        
                if(res.data.beenSentFlag == '1'){//重发
                   
                }else {
                    CountdownObj.content='重新获取(' + CountdownObj.content  +')';
                    CommonService.beginInterval(120);                    
                }

            } else {
                ngUtils.alert(res.msg);
                if(res.msg=='还款数据失效，请刷新页面再试') {
                    $location.url("/fydOrder?mobile="+UserInfo.mobile+"&token="+UserInfo.xAuthToken).replace();//返回到我的账单
                }                    
                $scope.CloseYibaoMask();
            }
        })

      
    }
    

    $scope.CheckSmsReg = function(){
    	
    	if($scope.isSubOne == false)return;
    	$scope.isSubOne = false;
        var str = "";//定义div里所有span的值组成的字符串
        var spans = new Array();//定义一个数组，用来存放每一个span的值
        $(".pay-bogusInput span").each(function(i, obj){
            spans[i] = $(this).html();
        });//循环取出span的值放入数组中
        str = spans.join("");//将数组中的值用逗号连接起来
        // console.log('str=',str);
         $scope.str=str;
        yibaoService.yibaoMsgPay($scope).then(function(res){
        	$scope.isSubOne = true;
             console.log(res)
        	if (res && res.status == '1') {
           		$location.url('/repayResult');

            } else {
            	$scope.keyMsg = '';
		        $scope.isShowKeyboard = false;//关闭键盘
		        $("#inputBoxContainer span").html('');	
		        if(res.msg == '短信验证码过期'){
                    
		        	CommonService.endInterval();
		        }
            	ngUtils.alert(res.msg);

            }
        })

    }
    $scope.ReGetMsg = function(){ //重新发送验证码
        ngUtils.loadingAlert();
        yibaoService.yibaoReGetMsg(yibaoService);

    }    
    $scope.AddBankCard = function(){//添加银行卡
            $location.url('/bindBank?realName='+UserInfo.realName+"&identityNo="+UserInfo.identityNo).replace();
        
    }
    $scope.yibaodelete = function(list){//删除银行卡
        $scope.delCardNo=list.cardNo;
        yibaoService.deleteBankCard($scope).then(function(res){
                if (res && res.status == '1') {
                   
                    setTimeout(function(){
                        bankSwiperInit();
                    },50)
                    
                }
        })

    }




    function bankSwiperInit(){
        $timeout(function(){
            $(function(){
                window.slideUtil = (function($) {

                    var listItem = $('.bank_content1'),
                        listOpts = $('.bank_right');

                    var onthel = false, // 是否处于最左端
                        isScroll = false, // 列表是否滚动状态
                        initX = 0, // 初始X坐标
                        initY = 0, // 初始Y坐标
                        endX = 0, // 结束时X坐标
                        endY = 0, // 结束时Y坐标
                        moveX = 0, // listItem 移动的距离
                        expandLi = null; // 是否存在展开的list

                    var slideMaxWid = listOpts.width();
                    // console.log(slideMaxWid)

                    var handleSlide = (function() {
                    	listItem.off('touchstart touchmove touchend');
                        listItem.on('touchstart',function(e){
                            // 判断有无已经展开的li，如果有，是否是当前的li，如果不是，将展开的li收起
                            if( expandLi ){
                                if( expandLi.parent().index()!==$(this).parent().index() ){
                                    // 判断当前list是左滑还是上下滑
                                    if( Math.abs(endY-initY) < Math.abs(endX-initX) ){
                                        e.preventDefault();
                                    }
                                    expandLi.css('-webkit-transform','translateX('+0+'px)');
                                }
                            }

                            initX = e.targetTouches[0].pageX;
                            initY = e.targetTouches[0].pageY;

                            moveX = $(this).offset().left;

                            $(this).on('touchmove',function(e){
                                console.log('aa')

                                var curY = e.targetTouches[0].pageY;
                                var curX = e.targetTouches[0].pageX;
                                var X = curX - initX; // 不断获取移动的距离

                                $(this).removeClass('animated');

                                if( Math.abs(endY-initY)<Math.abs(endX-initX) ){
                                    e.preventDefault();
                                    if( moveX==0 ){
                                        if( X>0 ) {
                                            $(this).css('-webkit-transform','translateX('+0+'px)');
                                        }else if( X<0 ){
                                            if( X<-slideMaxWid ) X=-slideMaxWid;
                                            $(this).css('-webkit-transform','translateX('+X+'px)');
                                        }
                                    }
                                    // 已经处于最左
                                    else if( moveX < 0 ){
                                        onthel = true;
                                        if( X>0 ) { // 向右滑
                                            if( X-slideMaxWid>0 ){
                                                $(this).css('-webkit-transform','translateX('+0+'px)');
                                            }else{
                                                $(this).css('-webkit-transform','translateX('+(X-slideMaxWid)+'px)');
                                            }
                                        }else { // 左滑
                                            $(this).addClass('animated');
                                            $(this).css('-webkit-transform','translateX('+0+'px)');
                                        }
                                    }
                                }else{
                                    isScroll = true;

                                }

                            })
                        })

                        listItem.on('touchend',function(e){

                            endX = e.changedTouches[0].pageX;
                            endY = e.changedTouches[0].pageY;
                            var X = endX - initX;

                            $(this).addClass('animated');
                            //Slide to right or the distance of slide to left less than 20;
                            if( X>-20||onthel||isScroll ){
                                $(this).css('-webkit-transform','translateX('+0+'px)');
                                onthel = false;
                                isScroll = false;
                            }else{
                                $(this).css('-webkit-transform','translateX('+(-slideMaxWid)+'px)');
                                expandLi = $(this);
                            }
                        })

                    })();

                })(Zepto);
            });
        },100);
    }





});
/*我要还款结果*/
app.controller('repayResultCtrl', function ($scope, UserInfo,$rootScope,$routeParams,$timeout,YibaoPay,yibaoService,$location,CommonService) {
    $scope.UserInfo = UserInfo;
    CommonService.appBack(function(){
        $location.url("/fydOrder?mobile="+UserInfo.mobile+"&token="+UserInfo.xAuthToken).replace();//返回到我的账单
    })
    $scope.YibaoPay = YibaoPay;
	$scope.UserInfo = UserInfo;
	$scope.result = '';//fail  wait  suc
     yibaoService.yibaoRepayResult($scope);
     
     $scope.checkBill = function(){//查看账单
         $location.url("/fydOrder?mobile="+UserInfo.mobile+"&token="+UserInfo.xAuthToken).replace();//返回到我的账单
     }
     $scope.refresh = function(){//刷新
         // window.location.reload();
    	 yibaoService.yibaoRepayResult($scope);
     }
});
/*初始化银行列表*/
app.controller('yibaoChooseBankCtrl', function ($scope, $rootScope,$routeParams,YibaoPay,$timeout,$location,yibaoService,CommonService) {
    CommonService.appBack(function(){
        $location.url('/bindBank').replace();

    })
    document.title = "选择银行";
    $scope.YibaoPay = YibaoPay;
    yibaoService.InitBankList();
    $scope.bankCard = function(list) {
        $('.yibao-bank').val(list.bankName);
        YibaoPay.BankCardName=list.bankName;
        YibaoPay.bankCode=list.bankCode;
        // YibaoPay.cardCode = $routeParams.cardCode;
        // YibaoPay.phone = $routeParams.phone;        
        $location.url('/bindBank?cardCode='+$routeParams.cardCode+"&phone="+$routeParams.phone).replace();
    }        

}); 