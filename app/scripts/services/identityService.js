
'use strict';

var app=angular.module("gfbApp");

/**
 * 通用 services
 */
app.factory("IdentityService", function($resource, $location, $window, Constant, UserInfo,
						MobileVerifyInfo, MyCenterService, ngUtils) {
	return {
		/**
		 * 初始化OCR解析接口
		 */
		invorkeOCR: function(){
			var path  = Constant.APIRoot + "/identity/recognize";
			var service = $resource(path,{},{
				invorkeOCR:{method:'POST'}
			});
			return service;
		},
		//初始化页面信息(照片上传页面)
		initIdentityInfo: function(scope){
			var path  = Constant.APIRoot + "/customer/initIdentityInfo";
			var eGetServiceObj = this;
			var service = $resource(path,{},{
				save:{method:'POST'}
			});
			var params = {
					mobile: UserInfo.mobile
			};
			//ngUtils.loadingAlert();
			service.save(params,
			function(response){
				if(response && response.status == "1"){
					//ngUtils.loadingAlertClose();
					scope.idenNO=response.data.customer.identityNo;
					UserInfo.specialSltAccountId=response.data.sltAccountId;
					UserInfo.identityNo=response.data.customer.identityNo;
					UserInfo.customerId=response.data.customer.id;
					UserInfo.identityExpires=response.data.customer.identityExpires;
					UserInfo.personFlag=response.data.customer.identityPerson;
					UserInfo.customerStatus=response.data.customer.status;
					UserInfo.mobileAuthFlag=response.data.customer.mobileAuthFlag;
					
					if(response.data.customer.identityExpires=="无效"){
						scope.identityExpires="";
					}else{
						scope.identityExpires=response.data.customer.identityExpires;
					}
					if(null==UserInfo.personFlag){
						UserInfo.personFlag="0";
					}
					if(UserInfo.identityFlag =="0"){
						//初始化学历和婚姻状况
						//学历
						UserInfo.degree = response.data.customer.educationDegree;
						if(UserInfo.degree != null && UserInfo.degree != "" && UserInfo.degree != undefined){
							if(UserInfo.degree == 'ssjys'){
								UserInfo.degreeText = '硕士及以上';
							}else if(UserInfo.degree == 'bk'){
								UserInfo.degreeText = '本科';
							}else if(UserInfo.degree == 'zkjyx'){
								UserInfo.degreeText = '专科及以下';
							}
						}
						//婚姻状况
						UserInfo.marState=response.data.customer.marryStatus;
						if(UserInfo.marState != null && UserInfo.marState != "" && UserInfo.marState != undefined){
							if(UserInfo.marState == 'yh'){
								UserInfo.marText = '已婚';
							}else if(UserInfo.marState == 'wh'){
								UserInfo.marText = '未婚';
							}else if(UserInfo.marState == 'lh'){
								UserInfo.marText = '离异';
							}else if(UserInfo.marState == 'so'){
								UserInfo.marText = '其他';
							}
						}
						
						//用户的真是姓名
						var realName = response.data.customer.realName;
						if(realName != null && realName != "" && realName != undefined){
							UserInfo.realName=response.data.customer.realName;
						}
					}
					
					UserInfo.mobileAuthStatus=response.data.customer.mobileAuthStatus;
					var mobile=response.data.customer.mobile;
					//已经手机实名认证
					if(mobile!=null && UserInfo.repeatCreditFlag!=1 ){
						if(UserInfo.mobileAuthStatus=='0'){
							UserInfo.mobileAuthDesc='未认证';
							UserInfo.mobileAuthStatus=='0';
						}else if(UserInfo.mobileAuthStatus=='1'){
							UserInfo.mobileAuthDesc='认证中';
							UserInfo.mobileAuthStatus=='1';
						}else if(UserInfo.mobileAuthStatus=='2'){
							UserInfo.mobileAuthDesc='已认证';
							UserInfo.mobileAuthStatus=='2';
						}else if(UserInfo.mobileAuthStatus==''||UserInfo.mobileAuthStatus==undefined){
							UserInfo.mobileAuthDesc='未认证';
							UserInfo.mobileAuthStatus=='0';
						}
					}else if(UserInfo.mobileAuthStatus=0 && UserInfo.repeatCreditFlag==1){
						//重新手机实名认证
						UserInfo.mobileAuthStatus=='0';
						UserInfo.mobileAuthDesc='未认证';
					}else if(UserInfo.mobileAuthStatus==1 && UserInfo.repeatCreditFlag==1){
						//重新手机实名认证
						UserInfo.mobileAuthStatus=='1';
						UserInfo.mobileAuthDesc='认证中';
					}else if(UserInfo.mobileAuthStatus==2 && UserInfo.repeatCreditFlag==1){
						//重新手机实名认证
						UserInfo.mobileAuthStatus=='2';
						UserInfo.mobileAuthDesc='已认证';
					}else if(mobile==null ){
						//没有进行手机实名认证
						UserInfo.mobileAuthStatus=='0';
						UserInfo.mobileAuthDesc='未认证';
					}else if((UserInfo.mobileAuthStatus==''||UserInfo.mobileAuthStatus==undefined )&& UserInfo.repeatCreditFlag==1){
						//没有进行手机实名认证
						UserInfo.mobileAuthStatus=='0';
						UserInfo.mobileAuthDesc='未认证';
					}
					//ngUtils.loadingAlertClose();
					//eGetServiceObj.initPage();
				}else{
					//ngUtils.loadingAlertClose();
					ngUtils.alert(response.msg);
				}
			},
			function(error){
				//ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		
		//下载身份证图片
		downloadPicture: function(type){
			var path  = Constant.APIRoot + "/customer/download";
			var service = $resource(path,{},{
				save:{method:'POST'}
			});
			var params = {
					imgType:type,
					customerId: UserInfo.customerId
			};
			//ngUtils.loadingAlert();
			service.save(params,
			function(response){
				if(response && response.status == "1"){
					//ngUtils.loadingAlertClose();
					//返回Base64图片
					if('front' == type){
						UserInfo.frontImg="data:image/gif;base64,"+response.data.front;
					}else if('back' == type){
						UserInfo.backImg="data:image/gif;base64,"+response.data.back;
					}else if('person' == type){
						UserInfo.personImg="data:image/gif;base64,"+response.data.person;
					}
					
				}else{
					//ngUtils.loadingAlertClose();
					//ngUtils.alert(response.msg);
				}
			},
			function(error){
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},
		//提交用户信息	(第一页:身份证相关信息)
		saveUserInfo: function(){
			var path  = Constant.APIRoot + "/customer/saveBasicInfo";
			var service = $resource(path,{},{
				save:{method:'POST'}
			});
			var params = {
					mobile: UserInfo.mobile,
					customerId: UserInfo.customerId,
					realName: UserInfo.realName,
					educationDegree: UserInfo.degree, // 学历
					marryStatus: UserInfo.marState,// 婚姻状态
					identityNo:UserInfo.identityNo	//身份证号
			};
			ngUtils.loadingAlert();
			service.save(params,
			function(response){
				if(response && response.status == "1"){
					ngUtils.loadingAlertClose();
					ngUtils.alert(response.msg);
					//如果手机未认证
					if(response.data.mobileAuthStatus=='0'||response.data.mobileAuthStatus==null){
						$location.url("/phoneValidate");
					}else{
					    $location.url("/creditLogin");
					}
				}else{
					ngUtils.loadingAlertClose();
					ngUtils.alert(response.msg);
				}
			},
			function(error){
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
			});
		},

		checkBlackList: function () {
			var path = Constant.APIRoot + "/blacklist/filter";
			var service = $resource(path, {}, {
				connect: {method: 'POST'}
			});
			var params = {
				mobile: "",
				customerId: ""
			};
			service.connect(params,
				function (response) {
					if (response && response.status == "1") {

					}
				},
				function (error) {

				}
			);
		},
        //校验信息完整性
		checkUserInfo: function () {
			if(ngUtils.isBlank(UserInfo.realName)){
				ngUtils.alert("姓名不能为空")
				return false;
			}else if(ngUtils.isBlank(UserInfo.degree)){
				ngUtils.alert("请选择学历")
				return false;
			}else if(ngUtils.isBlank(UserInfo.marState)){
				ngUtils.alert("请选择婚姻状况")
				return false;
			}else{
				return true;
			}
		},
		// e取跳转页面route
		initPage: function () {
			 /**
		     * 进入E取页面
		     * 根据客户状态，跳转到不同页面
		     * 身份认证页面、征信页面/社保公积金页面、提现页面,结果页面
		     */
		    var path;
		    var thisService=this;
		    switch(UserInfo.customerStatus){
		        case '00': // 身份认证页面
		        	//初始化身份证图片下载
					this.downloadPicture("front");
					this.downloadPicture("back");
					this.downloadPicture("person");
		            path = "/IdentityValidate";  // 进入首页身份认证页面
		            break;
		        case '01': // 征信登陆
		        	if(UserInfo.mobileAuthStatus=='0'||UserInfo.mobileAuthStatus==null){//手机未认证  进入手机认证页面
		        		path="/phoneValidate";
		        		break;
		        	}
		            path = "/creditLogin";
		            break;
		        case '0001'://征信登陆
		            path="/creditLogin";
		            break;
		        case '02': // 征信激活页面
		            path = "/creditReportSecondLogin";
		            break;
		        case '0201': // 征信已激活，手机实名未完成
		            if(UserInfo.mobileAuthFlag == "auth"){
		                path = "/mobileSuccess";
		            }else if(UserInfo.mobileAuthFlag == "noauth"){
		                path = "/mobileNoAuth";
		            }else if(UserInfo.mobileAuthFlag == "fail"){
		                MobileVerifyInfo.repeatFlag = "1";
		                path = "/phoneValidate";
		            }else{
		                path = "/creditActiveWait";
		            }
		            break;
		        case '04': // 决策进行中
		            path = "/waittingResult";
		            break;
		        case '05': // 决策异常
		            path = "/waittingResult";
		            break;
		        case '0501': // 征信姓名 和 手机实名认证姓名不匹配
		            path = "/identityFail";
		            break;
		        case '06': // 提现页面
		        	//额度为零跳转到失败页面
		        	thisService.validateAvailableCreditAuth();
		            break;
		        case '-99': // 额度过期
		        	path = "/IdentityValidate";
		            break;
		        default  :
		            path = "/IdentityValidate";
		            break;
		    };

		    // 地址非空跳转
		    if(path != ''){
		        $location.url(path);    
		    }
		},
		//校验可用额度
		validateAvailableCreditAuth: function () {
			var path = Constant.APIRoot + "/customer/validate/creditAuth";
			var service = $resource(path, {}, {
				connect: {method: 'POST'}
			});
			var params = {
				customerId: UserInfo.customerId
			};
			service.connect(params,
				function (response) {
					if (response && response.status == "1") {
						UserInfo.creditExpire=response.data.creditExpire;
						var unlockedDate=response.data.unlockedDate;
						var loanType=response.data.loanType;
						UserInfo.loanType=loanType;
						if(unlockedDate!=undefined && unlockedDate!=null){
							UserInfo.remainDate=unlockedDate;
//							if(UserInfo.remainDate>=0){
				        		$location.url("/applyFail");
//				        	}
						}else{
							if (UserInfo.specialSltAccountId && UserInfo.specialSltAccountId != '') {
				            	var mobile = UserInfo.mobile;
				            	var sltAcctId = UserInfo.specialSltAccountId;
				            	$location.url("/showWithdrawInfo");
				            } else {
				            	if(loanType==0||loanType==2){
				            		$location.url("/withdraw");
				            	}else if(loanType==3){
				            		ngUtils.alert("你有一笔订单正在提现中,不能再次提现！");
				            		var token = $window.localStorage.getItem("x-auth-token");
//				            		$location.url("/eGet?xAuthToken="+token);
				            		$rootScope.goBackHome();
				            	}else{
				            		ngUtils.alert("不符合提现条件！");
				            		var token = $window.localStorage.getItem("x-auth-token");
//				            		$location.url("/eGet?xAuthToken="+token);
				            		$rootScope.goBackHome();
				            	}
				            }
						}
					}
				},
				function (error) {
					ngUtils.alert("网络异常!请稍后再试");
				}
			);
		}
	}
});