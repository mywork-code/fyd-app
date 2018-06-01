'use strict';

var app = angular.module("gfbApp");
/**
 *密码相关services
 */
app.factory("TransactionGestureService", function($window,$http, $resource, $location, Constant,RegisterInfo, ngUtils,IndexService,WithdrawService,CommonService,UserInfo) {
	return {
		
		/**
		 * 判断是否可以修改交易密码
		 */
		ifTranPassword : function() {
			var path = Constant.APIRoot + "/transactionGesture/ifTranPassword";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				customerId:UserInfo.customerId,
				mobile : UserInfo.mobile
			};
			service.connect(params, function(response) {
				if (response && response.status == "1") {
					if(response.data){
						//修改交易密码
						$location.url("/changeTransactionPassword");
					}else{
						//设置交易密码
						$location.url("/addTransactionPassword");
					}
					
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 判断手势密码是否正确
		 */
		ifgesTruePassord : function(password,GestruePass,setGestur) {
			var path = Constant.APIRoot + "/transactionGesture/ifgesTruePassord";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				mobile:UserInfo.mobile,
				password : password
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					if(response.data){
						//手势密码验证正确
						setGestur.Num++;
						 $("#setGestrue").trigger("passwdDone");
			             $("#gesture-title").html("再次绘制解锁密码");
					}else{
						//手势密码验证失败
						setGestur.Num=0;
						 $("#setGestrue").trigger("passwdWrong");
					      setTimeout(function(){
					          GestruePass.clear();
					          $("#gesture-title").html("手势密码错误");
					      },500);
					}
					
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 发送短信验证码
		 */
		sendCodeToMobile : function(smsType) {
			var path = Constant.APIRoot + "/smsValidate/send";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				mobile : UserInfo.mobile,
				smsType : smsType
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					// 启动倒计时
					CommonService.beginInterval(60);
				} else {
					ngUtils.alert("验证码发送失败。");
					$location.url("/passwordManager");
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 新增交易密码
		 */
		savetransaction : function(type) {
			var path = Constant.APIRoot + "/transactionGesture/savetransaction";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				customerId:UserInfo.customerId,
				mobile : UserInfo.mobile,
				password : RegisterInfo.tranPassword,
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					$("#reward-wd-mask").removeClass("show");
					ngUtils.alert("设置成功");
					if(type == '1'){
						// 修改成功  跳转提现
//						$location.url("/withdraw");	
						//直接提现
						WithdrawService.goToWithDraw();
					}else{
						$("#UI-keyboard").hide();
						// 修改成功  跳转提现页面						
						$location.url("/withdraw");	
					}
					
				} else {
					//修改失败
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},

		/**
		 * 修改交易密码
		 */
		updatetransaction : function(password,verifyCode) {
			var path = Constant.APIRoot + "/transactionGesture/updatetransaction";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				customerId:UserInfo.customerId,
				mobile : UserInfo.mobile,
				password : password,
				verifyCode : verifyCode
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					ngUtils.alert("修改成功");
					// 修改成功  跳转首页
					$location.url("/managePassword");
				} else {
					//修改失败
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 判断是否有手势密码
		 */
		ifGesturePassword : function() {
			var path = Constant.APIRoot + "/transactionGesture/ifGesturePassword";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				mobile : UserInfo.mobile,
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					if(response.data){
						//设置手势密码
						$location.url("/gesturePassword");
					}else{
						//修改手势密码 -先验证手势密码
						$location.url("/checkgesturePassword1");
					}
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 判断是否有手势密码--手势密码开关
		 */
		ifGesturePasswords : function() {
			var path = Constant.APIRoot + "/transactionGesture/ifGesturePassword";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				mobile : UserInfo.mobile,
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					if(response.data){
						RegisterInfo.checkeMess = false;
					}else{
						RegisterInfo.checkeMess = true;
					}
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 设置手势密码
		 */
		saveGesture : function(password,type) {
			var path = Constant.APIRoot + "/transactionGesture/saveGesture";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				mobile : UserInfo.mobile,
				password : password,
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					ngUtils.alert("设置成功");
					// 登录成功 -设置密码成功-调到密码管理
					if(0==type){
						$location.url("/managePassword");
					}else{
						$location.url("/indexRoute");
					}
				} else {
					//修改失败
					ngUtils.alert("设置失败。");
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 给index。js调用是否需要手势密码
		 */
		ifLoginGesturePassword : function() {
			var path = Constant.APIRoot + "/transactionGesture/ifGesturePassword";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				mobile : UserInfo.mobile,
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					if(response.data){
						//无手势密码直接跳入首页 
						IndexService.initIndex();
					}else{
						IndexService.initIndex();
					}
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 给index。js调用,判断手势密码是否正确
		 */
		ifLogingesTruePassord : function(password,setGestur) {
			var path = Constant.APIRoot + "/transactionGesture/ifgesTruePassord";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				mobile:UserInfo.mobile,
				password : password
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					if(response.data){
						//手势密码验证正确跳首页
						IndexService.initIndex();
					}else{
						//手势密码验证失败跳入登录页面
						setGestur.Num++;
		            	var sunm=3-setGestur.Num;
		            	if(sunm==0){
		            		//手势密码错误超过3次
		            		$window.localStorage.removeItem("x-auth-token");
		            		RegisterInfo.password='';
		            		RegisterInfo.account='';
		            		$location.url("/login");
		            	}
		                $("#setGestrue").trigger("passwdWrong");
		                $("#gesture-error").show().html("密码错误,您还有"+sunm+"次机会尝试");
		                setTimeout(function(){
		                },500);
					}
					
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},	
		/**
		 * 判断交易密码是否正确 Withdraw
		 */
		ifWithdrawTranPassword : function(password,WithdrawService,setGestur) {
			var path = Constant.APIRoot + "/transactionGesture/ifWithdrawTranPasswordNew";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				customerId:UserInfo.customerId,
				mobile : UserInfo.mobile,
				password : password
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					//输入正确提现
					WithdrawService.goToWithDraw();
				} else {
					if(response.data){
						//交易密码失败的次数
						var failNum=response.data;
						var sum=3-failNum;
						if(sum==0){
							ngUtils.ConfirmBack1miss("交易密码输入次数过多,请重置交易密码",function(){
								//找回密码
								window.location.href="#/backTransactionPassword";
							});
							return;
						}
						ngUtils.ConfirmBack3miss("交易密码不正确,您还可以输入"+sum+"次",function(){
							//重新输入
							$("#reward-wd-dealPass").trigger("tapClaer");
						},function(){
							//找回密码
							window.location.href="#/backTransactionPassword";
						});
					}else{
						ngUtils.alert(response.msg);
					}
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 更改交易密码
		 */
		changeTranInfo : function(password,newpassword) {
			var path = Constant.APIRoot + "/transactionGesture/changeTranInfo";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				customerId:UserInfo.customerId,
				mobile:UserInfo.mobile,
				password : password,
				newpassword : newpassword
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					ngUtils.alert("修改成功");
					// 修改成功  跳转首页
					$location.url("/managePassword");
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 修改手势密码，先验证密码
		 */
		updateIfCheckGesture : function(password,setGestur) {
			var path = Constant.APIRoot + "/transactionGesture/ifgesTruePassord";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				mobile:UserInfo.mobile,
				password : password,
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					if(response.data){
						//手势密码验证正确跳重置页面
						$location.url("/gesturePassword");
					}else{
						//手势密码验证失败跳入登录页面
						setGestur.Num++;
		            	var sunm=3-setGestur.Num;
		            	if(sunm==0){
		            		//手势密码错误超过3次
		            		ngUtils.ConfirmBack("是否需要找回密码",function(){
		                		window.location.href="#/backGestures";
		                	},function(){
		                		window.location.href="#/managePassword";
		                	})
		            	}else{
				                $("#gesture-error").show().html("密码错误,您还有"+sunm+"次机会尝试");
				                setTimeout(function(){
				                	 $("#gesture-error").hide();
				                },1500);
		            	}
					}
					
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 跳过 手势密码置空
		 */
		jumpOver : function(obj) {
			var path = Constant.APIRoot + "/transactionGesture/jumpOver";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				
				mobile:UserInfo.mobile
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					//ngUtils.alert("清空手势密码成功");
					//清除token
					/*var platform = window.Android || window;
					platform.clear_UserToken();*/
					/*//手势密码置空
					if(obj==1){
						$location.url("/indexRoute");		
					}else{
						$location.url("/managePassword");	
					}*/
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		
		/**
		 * 跳过 手势密码置空
		 */
		jumpOvers : function(obj) {
			var path = Constant.APIRoot + "/transactionGesture/jumpOver";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				
				mobile:UserInfo.mobile
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					//ngUtils.alert("清空手势密码成功");
					//清除token
//					var platform = window.Android || window;
//					platform.clear_UserToken();
					/*//手势密码置空
					if(obj==1){
						$location.url("/indexRoute");		
					}else{
						$location.url("/managePassword");	
					}*/
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		/**
		 * 找回手势密码
		 */
		gesturesback : function(verifyCode) {
			var path = Constant.APIRoot + "/transactionGesture/gesturesback";
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				customerId:UserInfo.customerId,
				mobile : UserInfo.mobile,
				verifyCode : verifyCode
			};
			ngUtils.loadingAlert();
			service.connect(params, function(response) {
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					if(response.data){
						//验证码正确跳转到重置手势密码
						$location.url("/gesturePassword");
					}else{
						ngUtils.alert('验证码错误,请重新输入');	
					}
					
				} else {
					ngUtils.alert(response.msg);
				}
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		//校验身份证
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
            return pass;
        },
        //校验手机号
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
        }

		
		
	}
});
