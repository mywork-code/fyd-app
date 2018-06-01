'use strict';
var app=angular.module("gfbApp");

/**
 * 转介绍 services
 */
app.factory("AgentService",function($http,$resource,$location,DimensionInfo,Constant,UserInfo,ContractInfo,ngUtils,CommonService){
	return {
		/**
		 * 转介绍初始化跳转页面
		 */
		initAgentPage: function(scope){
			var path = Constant.APIRoot + "/helpAgent/init";
			var agentService = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var agentParams = {
				mobile : UserInfo.mobile // 手机号
			};
			ngUtils.addLoading();
			agentService.connect(agentParams,function(response){
				ngUtils.closeLoading();
				if(response && response.status == 1){
					UserInfo.customerId=response.data.customerId;
					DimensionInfo.mobile=UserInfo.mobile;
					if(response.data.registeFlag=='1'){
						//进入二维码页
						DimensionInfo.sceneCodeUrl=response.data.sceneCodeUrl;
						DimensionInfo.sceneCode=response.data.sceneCode;
						$location.url('/agentHome');
					}else{
						//进入注册页面
						DimensionInfo.identityNo=response.data.identityNo;
						if(DimensionInfo.identityNo !=null && DimensionInfo.identityNo !='' && DimensionInfo.identityNo !=undefined){
							DimensionInfo.ifidentity = 1;//身份证号状态
						}
						$location.url('/agentRegister');
					}
				}else{
					ngUtils.alert(response.msg);
				}
			  },function(error){
				  	ngUtils.closeLoading();
				    ngUtils.alert("网络错误，请稍后重试或联系客服。");
			 });
		},
    	/**
         * 发送短信验证码
         */
        sendCodeToMobile: function(){
        	var path  = Constant.APIRoot + "/smsValidate/send";
    		var service = $resource(path,{},{
    			sendSMS:{method:'POST'}
    		});
    		var params = {
    				mobile: DimensionInfo.mobile,
    				smsType: "reset"
    		};
    		ngUtils.addLoading();
    		service.sendSMS(params, function(response){
    			ngUtils.closeLoading();
    			if(response && response.status == "1"){
    				// 启动倒计时
    				CommonService.beginInterval(60);
    			}else{
    				ngUtils.alert(response.msg);
    			}
    		},
    		function(error){
    			ngUtils.closeLoading();
    			ngUtils.alert("网络错误，请稍后重试或联系客服。");
    		});
        },
        /**
         * 提交：先验证短信验证码，成功后才提交换卡
         */
        submit: function(){
        	var thisService=this;
        	var path  = Constant.APIRoot + "/smsValidate/validate";
    		var service = $resource(path,{},{
    			check:{method:'POST'}
    		});
    		var params = {
    				mobile: DimensionInfo.mobile,
    				smsType: "reset",
    				code: DimensionInfo.vercode
    		};
    		ngUtils.addLoading();
    		service.check(params, function(response){
    			ngUtils.closeLoading();
    			if(response && response.status == "1"){
    				if(response.data == true){
    					//帮帮经纪人注册
    					thisService.agentRegister();
    				}else{
    					ngUtils.alert("验证码错误，请重新输入");
    				}			
    			}else{
    				ngUtils.alert("网络错误，请稍后重试或联系客服。");
    			}
    		},
    		function(error){
    			ngUtils.closeLoading(); 
    			ngUtils.alert("网络错误，请稍后重试或联系客服。");
    		});
        },
        /**
		 * 帮帮经纪人注册
		 */
		agentRegister:function() {
			//先弹出loading页面
			ngUtils.addLoading();
			var path = Constant.APIRoot + "/scene/create";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
					customerId         : UserInfo.customerId,//微信号
					identityNo		   : DimensionInfo.identityNo,//身份证号
					mobile             : DimensionInfo.mobile//手机号码
			};
			service.connect(params,function(response){
				//关闭loading页面
				ngUtils.closeLoading();
				if (response && response.status == 1) {
					ngUtils.alert('恭喜您注册经纪人成功!');
					DimensionInfo.sceneCodeUrl=response.data.sceneCodeUrl;
					DimensionInfo.sceneCode=response.data.sceneCode;
					$location.url("/agentHome");
				} else {
					ngUtils.alert(response.msg);
				}
			},
			function(error){
				ngUtils.closeLoading();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 身份证校验
		 * @param code 身份证号
		 * @returns 
		 */
		identityCodeValid:function(code) { 
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            var tip = "";
            var pass= true;
            
            if(!code || !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)){
                tip = "身份证号输入不合法";
                pass = false;
            }
            
           else if(!city[code.substr(0,2)]){
                tip = "地址编码错误";
                pass = false;
            }
            else{
                //18位身份证需要验证最后一位校验位
                if(code.length == 18){
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                    //校验位
                    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++)
                    {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if(parity[sum % 11] != code[17]){
                        tip = "校验位错误";
                        pass =false;
                    }
                }
            }
//            if(!pass) alert(tip);
            return pass;
        },
        /**
         * 校验手机号是否符合规则
         */
        isMobile:function(text) {
            var _emp=/^\s*|\s*$/g; 
            text = text.replace(_emp,"");
            
            var _d=/^1[3578][01379]\d{8}$/g;
            var _l=/^1[34578][01256]\d{8}$/g;
            var _y=/^(134[012345678]\d{7}|1[34578][0123456789]\d{8})$/g;
            if(_d.test(text)){
                return 3;//返回值为3，则是电信手机号码
            } else if(_l.test(text)){
            	return 2;//返回值为2，则是联通手机号码
            }else if(_y.test(text)){
            	return 1;//返回值为1，则是移动手机号码
            }
            return 0;//返回值为0，则不是手机格式
        },
        /**
         * 根据输入的身份证号得到用户的年龄
         */
        getAget:function(identity){
        	 var date = new Date();
        	 var year = date.getFullYear(); 
        	 var birthday_year = parseInt(identity.substr(6,4));
        	 var userage= year - birthday_year;
        	 return userage;
        }
	}
});

