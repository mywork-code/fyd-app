
'use strict';

var app=angular.module("gfbApp");
/**
 *提现相关 services
 */
app.factory("WithdrawService",function($rootScope,$http,$window,PageControllerObject,$resource,$location,
    Constant,UserInfo,WithdrawRecordObject,BindCardObject,ContractInfo,RepaymentInfo,
    ngUtils,ContacterInfoType,UserContacterInfo,$routeParams,RepaceBindCardObject,$q){
	return {


        //保存合同相关信息(*):contractType(表示协议类型)
        saveContract: function(contractType,obj){
        	var $me = this;
    		var path = Constant.APIRoot + "/agreement/saveContract";
    		var service = $resource(path, {}, {
    			saveInfo : {
    				method : 'POST'
    			}
    		});
    		var param = {
    				mobile: UserInfo.mobile,
    				customerId: UserInfo.customerId,
    				realName: UserInfo.realName,
    				desc: contractType,
    				signature64:UserInfo.signature64,
                    signatureNative:UserInfo.signatureNative,
    				sltAccountId:WithdrawRecordObject.sltAccountId,
    				signatureType:UserInfo.signatureType
    		};
    		service.saveInfo(param,
    		function(response){
    			if(response && response.status == "1"){
    				if(null!=obj && ''!=obj){
    					obj.empty().remove();
    				}
    				ContractInfo.agreeFlag = "yes";
    				ContractInfo.id = response.data.id;
    				ContractInfo.agreeDate = response.data.date;
    				WithdrawRecordObject.agreeFlag = true; 
    				WithdrawRecordObject.agreeFlag0 = true;
    				UserInfo.customerId=response.data.customerId;
    				UserInfo.signatureAuditStatus='1';
    				//协议相关
    				if(contractType=='xieyi'){
    					UserInfo.personInfoSignature=1;
    					//$location.url('/IdentityValidate?flag=once');
    					//返回app身份认证页
    					$rootScope.gotoEtakeForIdentity();
//    				}else if(contractType=='txht'){
//    					UserInfo.withDrawSignature=1;
//    					$location.url('/withdraw?flag=once');
    				}else if(contractType=='changeCard'){
    					UserInfo.changeCardFlag=1;
    					var platform = window.Android || window;
    					platform.gotoChangeBankCard(ContractInfo.id,ContractInfo.agreeDate,UserInfo.signatureAuditStatus,UserInfo.signFailureNum);
//    					$location.url('/changedBankCard?flag=once');
    					
    				}else if(PageControllerObject.contractPage==1){
    					//调用业务数据修改订单状态
    					$me.changeStatus();
    					PageControllerObject.contractPage=0;
    				}
    				
    			}else{
                    obj.empty().remove();
                    UserInfo.signature64 = '';
    				UserInfo.signFailureNum=response.data.signFailureNum;
    				UserInfo.customerId=response.data.customerId;
                    WithdrawRecordObject.agreeFlag0 = false;
                    UserInfo.platFormService=false;
    				WithdrawRecordObject.agreeFlag0 = false;
    				ngUtils.alert(response.msg);
    			}
    		},
    		function(error){
    			if(operator != "check"){
    				ngUtils.loadingAlertClose();
        		}
    			ngUtils.alert("网络错误，请稍后重试或联系客服。");
    			
    		});
    	},
        //微信小程序保存签名
        saveSingature: function($scope){
            var $me = this;
            var path = Constant.APIRoot + "/agreement/saveContract";
            // var path = "https://fyd-uat.apass.cn/appweb/data/ws/rest/agreement/saveContract";
            var service = $resource(path, {}, {
                saveInfo : {
                    method : 'POST'
                }
            });
            var param = {
                    mobile: UserInfo.mobile,
                    realName: UserInfo.realName,//当前验证的字(如:谭世林,当前验证:世)
                    status: $scope.status,//0:还有别的字等待验证,1:签字验证最后一个
                    signature64:UserInfo.signature64,// 图片base64(建议你传值得时候验证下能不能转换为图片)
                    signatureNative:UserInfo.signatureNative,//signatureNative
                    sltAccountId:WithdrawRecordObject.sltAccountId,//   清算层id
                    code:"",//协议编号
                    desc:"",//协议描述
                    num:$scope.name ,//姓名全称
                    sltAccountId:$scope.sltAccountId

                    
            };
            // console.log('param1==',UserInfo.signature64);
            // console.log('param2==',UserInfo.signatureNative);
            console.log('param==',param);

            service.saveInfo(param,
            function(response){
                if(response && response.status == "1"){
                    ngUtils.alert("识别成功");
                    if(($scope.index)==($scope.nameLen-1)) {
                        $scope.totalSign = response.data.base64;
                        $scope.SignDate =  response.data.date;
                        $scope.SignId = response.data.id;
                        $scope.signSuc();
                        // return;
                    }      
                    // $scope.signSuc();
                    $scope.resetSignSuc();
                    UserInfo.realName=$scope.nameTotal[$scope.index];
                    $scope.index = Number($scope.index)+1;
                    $scope.nameSign = $scope.nameTotal[$scope.index];
                    if(String($scope.index)==(Number($scope.nameLen)-1)) {
                        $scope.status='1';
                    }
                    // console.log($scope.index);
                    // console.log($scope.nameLen-1)
                    // if(null!=obj && ''!=obj){
                    //     obj.empty().remove();
                    // }
                    // ContractInfo.agreeFlag = "yes";
                    // ContractInfo.id = response.data.id;
                    // ContractInfo.agreeDate = response.data.date;
                    // WithdrawRecordObject.agreeFlag = true; 
                    // WithdrawRecordObject.agreeFlag0 = true;
                    // UserInfo.customerId=response.data.customerId;
                    // UserInfo.signatureAuditStatus='1';

                         // ngUtils.alert(response.msg);
                    //协议相关
//                     if(contractType=='xieyi'){
//                         UserInfo.personInfoSignature=1;
//                         //$location.url('/IdentityValidate?flag=once');
//                         //返回app身份认证页
//                         $rootScope.gotoEtakeForIdentity();
// //                  }else if(contractType=='txht'){
// //                      UserInfo.withDrawSignature=1;
// //                      $location.url('/withdraw?flag=once');
//                     }else if(contractType=='changeCard'){
//                         UserInfo.changeCardFlag=1;
//                         var platform = window.Android || window;
//                         platform.gotoChangeBankCard(ContractInfo.id,ContractInfo.agreeDate,UserInfo.signatureAuditStatus,UserInfo.signFailureNum);
// //                      $location.url('/changedBankCard?flag=once');
                        
//                     }else if(PageControllerObject.contractPage==1){
//                         //调用业务数据修改订单状态
//                         $me.changeStatus();
//                         PageControllerObject.contractPage=0;
//                     }


                }else{
                    // obj.empty().remove();
                    // UserInfo.signature64 = '';
                    // UserInfo.signFailureNum=response.data.signFailureNum;
                    // UserInfo.customerId=response.data.customerId;
                    // WithdrawRecordObject.agreeFlag0 = false;
                    // UserInfo.platFormService=false;
                    // WithdrawRecordObject.agreeFlag0 = false;
                    $scope.resetSignSuc();
                    ngUtils.alert(response.msg);
                }
                $scope.isReqing = false;
            },
            function(error){
                $scope.isReqing = false;
                // if(operator != "check"){
                //     ngUtils.loadingAlertClose();
                // }
                $scope.resetSignSuc();
                ngUtils.alert("网络错误，请稍后重试或联系客服。");
                
            });
        },        
        // 获取微信小程序参数
        getConfig:function($scope){
            var path = Constant.APIRoot + "/wechat/config/query";
            var service = $resource(path, {}, {
                connect : {
                    method : 'POST'
                }
            });
            var params = {
               address:$scope.locationUrl, //当前网页URL
                "x-auth-token": $scope.token,
            };
            ngUtils.loadingAlert();
            console.log(params)
            var deferred = $q.defer();
            service.connect(params, function(response) {
                if(response && response.status == "1"){
                    deferred.resolve(response);
                }else {
                    ngUtils.alert(response.msg);
                }
                console.log(response)

                ngUtils.loadingAlertClose();
            }, function(error) {
                ngUtils.loadingAlertClose();
                ngUtils.alert("网络错误，请稍后重试或联系客服。");
            });
            return deferred.promise;
        },   
        //提交意见反馈
        saveFeedBack:function($scope){
            var path = Constant.APIRoot + "/feedBack/save";
            var service = $resource(path, {}, {
                connect : {
                    method : 'POST'
                }
            });
            var params = {
               mobile:$scope.mobile, 
               comments:$scope.comments, 
               picture1:$scope.imgSrc1,
               picture2:$scope.imgSrc2,  
               picture3:$scope.imgSrc3
            };
            console.log('params==',params)
            ngUtils.loadingAlert();
            console.log(params)
            var deferred = $q.defer();
            service.connect(params, function(response) {
                if(response && response.status == "1"){
                    deferred.resolve(response);
                }else {
                    ngUtils.alert(response.msg);
                }
                console.log(response)

                ngUtils.loadingAlertClose();
            }, function(error) {
                ngUtils.loadingAlertClose();
                ngUtils.alert("网络错误，请稍后重试或联系客服。");
            });
            return deferred.promise;
        },   


    	// 进行人工审核签字
    	signatureAuditApply: function(contractType,obj){
    		var path = Constant.APIRoot + "/agreement/signature/auditApply";
    		var service = $resource(path, {}, {
    			saveInfo : {
    				method : 'POST'
    			}
    		});
    		var param = {
    				mobile:UserInfo.mobile,
    				openId: UserInfo.openId,
    				customerId: UserInfo.customerId,
    				realName: UserInfo.realName,
					educationDegree: UserInfo.degree, // 学历
					marryStatus: UserInfo.marState,// 婚姻状态
					agreeMentDesc: contractType,// 协议类型
					cardNo: UserInfo.tempCardNo,// 换卡 银行卡号
					cardBank: UserInfo.tempCardBank,// 银行
    				signature64:UserInfo.signature64,
    				signatureType:UserInfo.signatureType //签字场景(1:授信签字；2：绑卡签字；3换卡签字),
    		};
    		service.saveInfo(param,
    		function(response){
    			if(response && response.status == "1"){
    				 
    				var platform = window.Android || window;
    				platform.startSignAutiding(UserInfo.signatureType); 
    				
    				obj.empty().remove();
    			}else{
    				ngUtils.alert(response.msg);
    			}
    		},
    		function(error){
    			ngUtils.alert("网络错误，请稍后重试或联系客服。");
    		});
    	},
    	
    	// 查询某个场景下的人工审核签字的情况（刷新按钮）
    	refreshSignatureAudit: function(falgt){
    		var path = Constant.APIRoot + "/agreement/search/signatureAudit";
    		var service = $resource(path, {}, {
    			saveInfo : {
    				method : 'POST'
    			}
    		});
    		var param = {
    			mobile: UserInfo.mobile,
    			signatureType:UserInfo.signatureType //签字场景(1:授信签字；2：绑卡签字；3:换卡签字),
    		};
    		service.saveInfo(param,
    		function(response){
    			if(response && response.status == "1"){
    				// 审核状态（ -1:拒绝; 0：审核中；1：通过）
    				UserInfo.signatureAuditStatus= response.data.signAuditStatus;
    				UserInfo.signFailureNum=response.data.signFailureNum;
    				if(falgt=='0'){
    					ContractInfo.id = response.data.id;
	    				ContractInfo.agreeDate = response.data.date;
	    				var platform = window.Android || window;
	    				if(UserInfo.signatureType==1){
	    					
    					  var returnJson={signFailureNum:UserInfo.signFailureNum,signatureAuditStatus:UserInfo.signatureAuditStatus};
    					  platform.gotoEtakeForIdentity(JSON.stringify(returnJson));
	    				}else{
	    					platform.gotoChangeBankCard(ContractInfo.id,ContractInfo.agreeDate,UserInfo.signatureAuditStatus,UserInfo.signFailureNum);
	    				}
    				}else{
    					if(UserInfo.signatureAuditStatus!='0'){
    						var platform = window.Android || window;
        					if(UserInfo.signatureType==1){
        						var returnJson={signFailureNum:UserInfo.signFailureNum,signatureAuditStatus:UserInfo.signatureAuditStatus};
          					    platform.gotoEtakeForIdentity(JSON.stringify(returnJson));
        					}else{
        						ContractInfo.id = response.data.id;
        	    				ContractInfo.agreeDate = response.data.date;
        	    				
            					platform.gotoChangeBankCard(ContractInfo.id,ContractInfo.agreeDate,UserInfo.signatureAuditStatus,UserInfo.signFailureNum);
        					}
        				}
    				}
    			}else{
    				ngUtils.alert(response.msg);
    			}
    		},
    		function(error){
    			ngUtils.alert("网络错误，请稍后重试或联系客服。");
    		});
    	},
        //初始化提现合同信息-房易贷
        initWithdrawContractInfo: function(){
            var path = Constant.APIRoot + "/contract/queryCashStagesContract";
            // var path='http://gfbapp.vcash.cn/appweb/data/ws/rest/contract/queryCashStagesContract';
            var service = $resource(path, {}, {
                saveInfo : {
                    method : 'POST'
                }
            });
            var param = {
                    mobile :UserInfo.mobile,
                    capital:ContractInfo.withdrawMoney,
                    paymentType:ContractInfo.loanPeriods                    
            };
            //console.log(param)
            service.saveInfo(param,
            function(response){
                console.log(response)
                if(response && response.status == "1"){
                    var _data = response.data;

                    ContractInfo.cardNo=_data.cardNo;                                                   //卡号
                    ContractInfo.cardBank=_data.cardBank;                                               //银行
                    var now = new Date();
                    ContractInfo.nowyear=now.getFullYear();
                    ContractInfo.nowMonth=now.getMonth()+1;
                    ContractInfo.nowDay=now.getDate();
                    ContractInfo.nowHours=now.getHours();
                    ContractInfo.nowMinutes=now.getMinutes();
                    ContractInfo.nowSeconds=now.getSeconds();

                    
                    ContractInfo.realName=_data.realName;
                    ContractInfo.identityNo=_data.identityNo;
                    ContractInfo.mobile=_data.mobile;
                    ContractInfo.liveAddress=_data.identityRecognizeAddress;
                    ContractInfo.signaturePicture=_data.signaturePicture;

                    var eachPeroidEntity = _data.length>1?_data.cidList[1]:[];
                    var secondPeroidEntity = _data.length>2?_data.cidList[2]:[];

                    ContractInfo.repaymentDay=_data.repaymentDay;                                   //每月还款日
                    ContractInfo.eachPeriodTotalAmount = _data.eachPeriodTotalAmount;              //每期应还

                    ContractInfo.eachBenjinAmt = _data.eachPeriodCapital;                            //月本金
                    
//                  ContractInfo.monthlyPrincipalInterestAmt=(parseFloat(ContractInfo.eachBenjinAmt)+parseFloat(_data.monthlyInterestRate)*parseFloat(ContractInfo.eachBenjinAmt) ).toFixed(2);         //月本息
                    ContractInfo.monthlyPrincipalInterestAmt=_data.monthlyPrincipalInterestAmt;   //自第二期月本息、
                    ContractInfo.monthlyInterestBenjinAmt =_data.monthlyInterestBenjinAmt; //月利息

                    ContractInfo.fitstGuananteeAmt = (ContractInfo.withdrawMoney)*0.02;
                    ContractInfo.monthGuananteeAmt=_data.monthlyGuaranteeCost;                      //每月担保费
                    ContractInfo.dayGuananteeAmt=(ContractInfo.monthGuananteeAmt/30).toFixed(2);                //日担保费
                    
                    ContractInfo.monthInterest=_data.monthlyInterestRate;                               //月利率
                    ContractInfo.monthInterestPercent=parseFloat(_data.monthlyInterestRate)*100;        //月利率 百分比
                    ContractInfo.dayInterest=(parseFloat(ContractInfo.monthInterestPercent)/30).toFixed(2);         //日利率
                    ContractInfo.dayInterestPercent=(parseFloat(ContractInfo.monthInterest)/30 * 100).toFixed(2)    //日利率  百分比
                    
                    ContractInfo.monthFuwuFeeRate = _data.monthlyPlatformServiceRate;                       //月平台服务费率
                    ContractInfo.monthFuwuFee = parseFloat(ContractInfo.monthFuwuFeeRate ) *parseFloat(ContractInfo.withdrawMoney) ; //月平台服务费
                    if(null!=ContractInfo.monthFuwuFee && undefined !=ContractInfo.monthFuwuFee){
                        var dayInter=parseFloat(ContractInfo.monthFuwuFee/30);
                        ContractInfo.dayFuwuFee=(dayInter).toFixed(2);                                          //日平台服务费    
                    }

                    ContractInfo.monthlyFixedRepayment = (parseFloat(ContractInfo.withdrawMoney)*parseFloat(ContractInfo.monthInterest)+parseFloat(ContractInfo.withdrawMoney)/parseFloat(ContractInfo.loanPeriods)).toFixed(2);//每期偿还本息数额,固定数额

                    ContractInfo.everyMonthServiceMoney  = _data.formalities;                           //手续费率
                    
                    ContractInfo.ptShouxuRete = _data.platformformalitiesRate;                          //平台手续费率
                    ContractInfo.ptShouxuFee = _data.platformformalitiesRate*ContractInfo.withdrawMoney;//平台手续费
                    
                    ContractInfo.cardNo=_data.cardNo;                                                   //卡号
                    ContractInfo.cardBank=_data.cardBank;                                               //银行
                    
                    ContractInfo.monthlyServiceRate=_data.monthlyServiceRate;                           //月服务费率
                    ContractInfo.monthlyServiceAmt=parseFloat(_data.monthlyServiceRate) * ContractInfo.withdrawMoney;//月服务费
                    //日服务费
                    if (ContractInfo.withdrawMoney!=null && ContractInfo.withdrawMoney!=undefined) {
                        var withdrawAmt=parseFloat(ContractInfo.withdrawMoney);
                        ContractInfo.dayInterestAmount= (ContractInfo.monthlyServiceAmt/30).toFixed(2); 
                    }
                    
                    //第二期起月服务费金额
                    if (ContractInfo.withdrawMoney!=null && ContractInfo.withdrawMoney!=undefined) {            //月服务费
                        ContractInfo.twoPeroidMonthInterAmt=parseFloat(ContractInfo.withdrawMoney)*parseFloat(ContractInfo.monthlyServiceRate);
                    }
                    
                    if (ContractInfo.withdrawMoney!=null && ContractInfo.withdrawMoney!=undefined && ContractInfo.withdrawMoney >5000) {
                        ContractInfo.benXiKoushi=50;
                        ContractInfo.fuWuDanbaoKoushi=50;
                    }else{
                        ContractInfo.benXiKoushi=25;
                        ContractInfo.fuWuDanbaoKoushi=25;
                    }
                    ContractInfo.benXiKoushi =  _data.principalInterestPunish; //本息扣失
                    ContractInfo.fuWuDanbaoKoushi =  _data.guarantPunish; //担保费扣失扣失
                    ContractInfo.dailyInterestTotalAmount =          _data.dailyInterestTotalAmount //每日总利息

                }else{
                    ngUtils.alert(response.msg);
                }
            },
            function(error){
                ngUtils.alert("网络异常,请稍后再试!");
                
            });
        },    	

	}
});

