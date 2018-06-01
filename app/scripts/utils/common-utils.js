/**
 * 通用工具
 */
'use strict';

var app = angular.module('gfbApp');

app.factory("ngUtils",function(){
	return {
		/**
		 * 获取指定选择器的元素对象
		 */
		get: function(selector){
			return $(selector);
		},
		/**
		 * 设置当前选择器的焦点
		 */
		setFocus: function(selector){
			$(selector).focus();
		},
		/**
		 * 显示当前选择器的元素
		 */
		show: function(selector){
			$(selector).show();
		},
		/**
		 * 显示当前选择器的元素并居中
		 */
		showMediate: function(selector){
			$(selector).css("display","-webkit-box");
		},
		/**
		 * 隐藏当前选择器的元素
		 */
		hide: function(selector){
			$(selector).hide();
		},
		/**
		 * 获取或设置指定选择器元素的文本内容
		 */
		text: function(selector,value){
			if(value==undefined){
				return $(selector).text();
			}else{
				return $(selector).text(value);
			}
		},
		/**
		 * 判定是否是电话号码
		 */
		isPhoneNo: function(value){
			return /^1\d{10}$/.test(value);
		},
		/**
		 * 判定是否是手机服务密码
		 */
		isPhonePassword: function(value){
			return /^\d{6}$/.test(value);
		},
		/**
		 * 判定是否是邮箱
		 */
		isEmail: function(value){
			return /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/.test(value);
		},
		/**
		 * 判定是否是身份证号码
		 */
		isIdentityNo: function(value){
			return /^(\d{15})$|^(\d{17}(?:\d|x|X))$/.test(value);
		},
		/**
		 * 判定学信网密码合法性
		 */
		isXXWPassword: function(value){
			return /^.{8,30}$/.test(value);
		},
		/**
		 * 判断值是否为空
		 */
	    isBlank: function(value) {
		    return value == undefined || value == null || this.trim(value) == '';
	    },
	    /**
		 * 去空格
		 */
	    trim: function(value) {
		    return value.replace(/(^\s*)|(\s*$)/g, '');
	    },
	    isBankCardNo: function(value){
	    	return /^[0-9]{16,19}$/.test(value);
	    },
        trimA: function(value) {
		    return value.replace(/\s/g, '')
	    },	   

	    /**
	     * 是否输入的合法金额
	     */
	    isLegalAmount:function(val){
	    	return /^[0-9]+(.[0-9]{1,2})?$/.test(val);
	    },
	    
	    /**
         * 添加Loading框
         */
        addLoading : function() {
			try {
				appModel.showLoading();
			}catch(e){
				//console.log('Loading')
			}
        },
        /**
         * 关闭Loading框
         */
        closeLoading : function() {
			try {
				appModel.closeLoading();
			}catch(e){
				//console.log('closeLoading')
				//$rootScope.routeLoading = false;
			}
        },
	    
	    /**
		 * 根据ID查询DOM
		 */
	    getDom : function(id) {
		    return window.document.getElementById(id);
	    },
	    
	    /**
	     * 校验字段规则
	     * fieldName:字段值
	     * msg：弹出的提示信息
	     * regexp：正则匹配规则
	     */
	    checkIdCardImpl: function(fieldName, msg, regexp){
	    	if (fieldName == undefined || fieldName == '' || (regexp != '' && regexp.test(fieldName) == false)) {
	    		/*var tip = $.tips({
	                content:msg,
	                stayTime:"2000",
	                type:"warn"
	            });*/
	    		var oHtml = $("<div/>",{class:'UI-Alert-mask'}).append('<div class="errorAlert">'+ msg+'</div></div>');
	    	    $("body").append(oHtml);
	    	    setTimeout(function(){
	    	        oHtml.remove();
	    	    },1300);
	            return false;
	        }
	        return true;	
	    },
	    /**
	     * 弹出消息
	     */
	   /* alert: function(msg){
	    	var tip = $.tips({
                content:msg,
                stayTime:"2000",
                type:"warn"
            });
	    },*/
	    alert:function(text){
	    	 var oHtml = $("<div/>",{class:'UI-Alert-mask'}).append('<div class="errorAlert">'+ text+'</div></div>');
	    	    $("body").append(oHtml);
	    	    setTimeout(function(){
	    	        oHtml.remove();
	    	    },1500);
	    },
       alertLong:function(text){
	    	 var oHtml = $("<div/>",{class:'UI-Alert-mask'}).append('<div class="errorAlert">'+ text+'</div></div>');
	    	    $("body").append(oHtml);
	    	    setTimeout(function(){
	    	        oHtml.remove();
	    	    },3000);
	    },	    
	    //显示弹出框内容，同时设置弹出框存在的时间
	    alertAndTime:function(text,time){
	    	 var oHtml = $("<div/>",{class:'UI-Alert-mask'}).append('<div class="errorAlert">'+ text+'</div></div>');
	    	    $("body").append(oHtml);
	    	    setTimeout(function(){
	    	        oHtml.remove();
	    	    },time);
	    },
	    newLoading:function(){
			//此处是显示加载图
		    var el=$.loading({
		        content:'加载中...'
		    });
		    //此处是设置过2秒后  loading消失
		    setTimeout(function(){
		        el.loading("hide");
		    },2000);
		    //此处是；loading消失后的回调函数
		    el.on("loading:hide",function(){
		        console.log("loading hide");
		    });
	    },
	    /**
    	 * 格式化日期
    	 */
    	getFormatDate:function(date){
    		var year = date.getFullYear();
    		var month = date.getMonth()+1;
    		var day= date.getDate();       
            var hour= date.getHours();       
            var minute= date.getMinutes();       
            var second= date.getSeconds();
    		return year+"/"+month+"/"+day+" "+hour+":"+minute+":"+second;
    	},
    	/**
    	 * 描述：将金额转换成中文大写
    	 */
    	convertToChinese:function(num){
    		if(isNaN(num))return "无效数值！";
            var strPrefix="";
            if(num<0)strPrefix = "(负)";
            num=Math.abs(num);
            if(num>=1000000000000) return "无效数值！";
            var strOutput = "";
            var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
            var strCapDgt='零壹贰叁肆伍陆柒捌玖';
            num += "00";
            var intPos = num.indexOf('.');
            if (intPos >= 0){
                num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
            }
            strUnit = strUnit.substr(strUnit.length - num.length);
            for (var i=0; i < num.length; i++){
                strOutput += strCapDgt.substr(num.substr(i,1),1) + strUnit.substr(i,1);
            }
            return strPrefix+strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    		
    	},
    	/*新增方法*/
    	/*
    	 * 确认弹窗
    	 */    	
    	constraintAlertStop:function(text,btn,callback){
    	    var oHtml = '<div class="ajp-mask "><div class="ajp-confirm ajp-pos-center ajp-alert only"><h3>提示</h3><p>'+text+'</p><div class="ajp-button-flex"><button class="ajp-btn-prem ok">'+btn+'</button></div></div></div>';
    	    $("body").append(oHtml);
    	    $(".ajp-alert.ajp-confirm").on("tap",".ok",function(){
    	        if(typeof callback == 'function'){
    	            callback();
    	        }
    	    })
    	},
    	/*
    	 * 确认弹窗
    	 */    	
    	constraintAlert:function(text,btn,callback){
    	    var oHtml = '<div class="ajp-mask "><div class="ajp-confirm ajp-pos-center ajp-alert only"><h3>提示</h3><p>'+text+'</p><div class="ajp-button-flex"><button class="ajp-btn-prem ok">'+btn+'</button></div></div></div>';
    	    $("body").append(oHtml);
    	    $(".ajp-alert.ajp-confirm").on("tap",".ok",function(){
    	        $(".ajp-mask").remove();
    	        if(typeof callback == 'function'){
    	            callback();
    	        }
    	    })
    	},
    	/*新增方法*/
    	/*
    	 * 确认弹窗
    	 */    	
    	constraintAlerts:function(text,btn){
    	    var oHtml = '<div class="ajp-mask "><div class="ajp-confirm ajp-pos-center ajp-alert only"><h3>提示</h3><p>'+text+'</p><div class="ajp-button-flex"><button class="ajp-btn-prem ok">'+btn+'</button></div></div></div>';
    	    $("body").append(oHtml);
    	    $(".ajp-alert.ajp-confirm").on("tap",".ok",function(){
    	        $(".ajp-mask").remove();
    	    })
    	},
    	/*新loading*/
    	loadingAlert:function(text){
    		try{
    			appModel.showLoading();
    		}catch(e){
    			var text=text||"加载中..."
                var oHtml = $("<div/>",{class:'UI-Alert-mask'}).append('<div class="loadingAlert">'+ text+'</div></div>');
                $("body").append(oHtml);
    		}
    		
			
        },
        /*looding关闭*/
        loadingAlertClose:function(){
        	try{
        		appModel.closeLoading();
        	}catch(e){
        		$(".UI-Alert-mask").remove();
        	}
        	
        },
        /*验证密码的长度*/
        validatePasswordLength:function(obj){
        	var length=obj.length;
    		if(length<6){
    			return "请输入6-12位字母与数字组合密码";
    		}else if(length>12){
    			return "请输入6-12位字母与数字组合密码";
    		}else{
    			return "";
    		}
        },
        /*重写confirm*/
        Confirm:function(msg,callback){
			var oHtml = '<div class="ajp-mask "><div class="ajp-confirm ajp-pos-center"><p>'+msg+'</p><div class="ajp-button-flex"><button class="ajp-btn-prem cancel">取消</button><button class="ajp-btn-prem ok">确认</button></div></div></div>';
			$("body").append(oHtml);
			$(".ajp-confirm .cancel").tap(function(){
				$(this).parents(".ajp-mask").remove();
				return false;
			});
			$(".ajp-confirm .ok").tap(function(){
				$(this).parents(".ajp-mask").remove();
				if(typeof callback == 'function'){
					callback();
				}
			});
    	},  
		/*重写confirm2*/
		RewriteConfirm: function (msg,callback,remove) {
			var oHtml = '<div class="UI-mask confirm_mew" slip-stop click-stop><div class="ajp-confirm UI-ob-center"><h3>温馨提示</h3><p>' + msg + '</p><div class="ajp-button-flex"><button class="ajp-btn-prem cancel">否</button><button class="ajp-btn-prem ok">是</button></div></div></div>';
			$("body").append(oHtml);
			$(".ajp-confirm .cancel").tap(function () {
				$(this).parents(".confirm_mew").remove();
				if (typeof remove == 'function') {
					remove();
				}
			});
			$(".ajp-confirm .ok").tap(function () {
				$(this).parents(".confirm_mew").remove();
				if (typeof callback == 'function') {
					callback();
				}
			});
		},
    	
    	 /*重写confirm 确认在左边*/
        ConfirmLeft:function(msg,callback){
    		var oHtml = '<div class="ajp-mask "><div class="ajp-confirm ajp-pos-center">'+msg+'<div class="ajp-button-flex"><button class="ajp-btn-prem ok">确认</button><button class="ajp-btn-prem cancel">取消</button></div></div></div>';
            $("body").append(oHtml);
            $(".ajp-confirm .cancel").tap(function(){
                $(this).parents(".ajp-mask").remove();
                return false;
            });
            $(".ajp-confirm .ok").tap(function(){
                $(this).parents(".ajp-mask").remove();
                if(typeof callback == 'function'){
                    callback();
                }
            });
    	},  
    	
    	/*重写confirm 双跳转*/
        ConfirmBack:function(msg,callback,callback1){
			var oHtml = '<div class="ajp-mask "><div class="ajp-confirm ajp-pos-center"><p>'+msg+'</p><div class="ajp-button-flex"><button class="ajp-btn-prem cancel">取消</button><button class="ajp-btn-prem ok">确认</button></div></div></div>';
			$("body").append(oHtml);
			$(".ajp-confirm .cancel").tap(function(){
				$(this).parents(".ajp-mask").remove();
				callback1();
			});
			$(".ajp-confirm .ok").tap(function(){
				$(this).parents(".ajp-mask").remove();
				if(typeof callback == 'function'){
					callback();
				}
			});
    	},  /*重写confirm改变文字 双跳转*/
        ConfirmBack2miss:function(msg,callback,callback1){
			var oHtml = '<div class="ajp-mask "><div class="ajp-confirm ajp-pos-center"><p>'+msg+'</p><div class="ajp-button-flex"><button class="ajp-btn-prem cancel">取消</button><button class="ajp-btn-prem ok">确认</button></div></div></div>';
			$("body").append(oHtml);
			$(".ajp-confirm .cancel").tap(function(){
				$(this).parents(".ajp-mask").remove();
				callback1();
			});
			$(".ajp-confirm .ok").tap(function(){
				$(this).parents(".ajp-mask").remove();
				if(typeof callback == 'function'){
					callback();
				}
			});
    	}, /*重写confirm改变文字 双跳转交易密码使用*/
        ConfirmBack3miss:function(msg,callback1,callback){
			var oHtml = '<div class="ajp-mask "><div class="ajp-confirm ajp-pos-center"><p>'+msg+'</p><div class="ajp-button-flex"><button class="ajp-btn-prem cancel">重新输入</button><button class="ajp-btn-prem ok">忘记密码</button></div></div></div>';
			$("body").append(oHtml);
			$(".ajp-confirm .cancel").tap(function(){
				$(this).parents(".ajp-mask").remove();
				callback1();
			});
			$(".ajp-confirm .ok").tap(function(){
				$(this).parents(".ajp-mask").remove();
				if(typeof callback == 'function'){
					callback();
				}
			});
    	},/*重写confirm单独一个方法*/
        ConfirmBack1miss:function(msg,callback){
			var oHtml = '<div class="ajp-mask "><div class="ajp-confirm ajp-pos-center ajp-alert only"><h3>提示</h3><p>'+msg+'</p><div class="ajp-button-flex"><button class="ajp-btn-prem ok">返回</button></div></div></div>';
			$("body").append(oHtml);
			$(".ajp-alert.ajp-confirm").on("tap",".ok",function(){
				$(".ajp-mask").remove();
				if(typeof callback == 'function'){
					callback();
				}
			})
    	},
    	//签名弹框样式
    	ConfirmSign:function(msg,callback,callback1){
			var oHtml = '<div class="confrimWhite"><div class="com-obc com"><p class="text">'+msg+'</p><div class="but"><button class="ok">确认</button><button class="cancel">取消</button></div></div></div>';
			$("body").append(oHtml);
			$(".confrimWhite .cancel").click(function(){
				$(this).parents(".confrimWhite").remove();
				if(typeof callback == 'function'){
					callback1();
				}
			});
			$(".confrimWhite .ok").click(function(){
				$(this).parents(".confrimWhite").remove();
				if(typeof callback == 'function'){
					callback();
				}
			});
		},
        /*检测字符串里面是否有空格*/
        checkWithSpace:function(str){
        	if (str.indexOf(" ") == -1) {
        	    return false;
        	} else {
        	    return true;
        	}
    	},
        /*检测字符串里面必须为字母和数字的组合*/
    	validate_password:function(str){
    		//为字符或者数字正则表达式
	    	var Regx = /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/;
	    	var allFlag=Regx.test(str);
	    	if(allFlag){
	    		return false;
	    	}else{
	    		return true;
	    	}
    	},
    	/*检测输入框只能输入数字*/
    	onlyInputNum:function(){
   		 	var keyCode = event.keyCode;
   		 	if ((keyCode >= 48 && keyCode <= 57)){
   		 		event.returnValue = true;
   		 	} else {
   	           event.returnValue = false;
   		 	}
    	}
	};
});