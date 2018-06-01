
'use strict';

var app=angular.module("gfbApp");
/**
 *提现相关 services
 */

app.factory("BindBankService",function($rootScope,$q,$http,$resource,$location,$window,$timeout,Constant,UserInfo,RegisterInfo,WithdrawService,WithdrawRecordObject,BindCardObject,RepaceBindCardObject,ContractInfo,ngUtils,CommonService,BankMaps){
	return {	 
         /**
         * 获取更换银行卡合同信息
         * add by lc 2017-04-10
         */
        getChangeCardContInfo: function($scope){
            ngUtils.loadingAlert();
            var path = Constant.APIRoot + "/contract/changeCardContInfo ";
            var cardService = $resource(path, {}, {
                connect : {
                    method : 'POST'
                }
            });
            var cardParams = {
                    mobile              : UserInfo.mobile//手机号
                };
            
            cardService.connect(cardParams,function(response){
                console.log('response===',response);
                if (response && response.status == 1) {
                    var _data = response.data;
                    if(response.data.isOldFlag == '1') { //老合同
                        $scope.flag = false;
                    } else {
                        $scope.flag = true;
                    }
                    //console.log(_data)
                    ContractInfo.realName                     =_data.realName;//客户手填的姓名
                    ContractInfo.authAccountName              =_data.authAccountName;//网络征信、社保、公积金的姓名
                    ContractInfo.identityNo                   =_data.identityNo;//客户的身份证
                    ContractInfo.mobile                       =_data.mobile;//客户的身份证
                    ContractInfo.liveAddress                       =_data.identityRecognizeAddress;//客户的住址
                    ContractInfo.contractNosStr               =_data.contractNosStr;//客户扣款授权书的两个的个人信用借款合同的合同号
                    ContractInfo.otherContractNosStr          =_data.otherContractNosStr;//客户扣款授权书的两个的个人贷款服务与咨询合同的合同号
                    ContractInfo.danBaoContractNOsStr         =_data.danBaoContractNOsStr;// 客户扣款授权书的两个的个人贷款委托担保合同
                    ContractInfo.sltAccountInfoList           =_data.sltAccountInfoList;//生成合同 要用（待补资料/复核中/已放款/已逾期）的所有订单信息。
                    ContractInfo.cardNo                       =_data.cardNo;//银行卡号
                    ContractInfo.cardBank                     =_data.cardBank;//银行名称
                    ContractInfo.sltAccountInfoList           =_data.sltAccountInfoList;//银行名称
                    RepaceBindCardObject.sltAccountInfoListSize           =_data.sltAccountInfoListSize;//银行名称
                    ContractInfo.sltAccountInfo0 = _data.sltAccountInfo0; //改卡时，首贷和加贷都未还清的情况下的第一个订单的信息
                    ContractInfo.sltAccountInfo1 = _data.sltAccountInfo1; //改卡时，首贷和加贷都未还清的情况下的第二个订单的信息
                    ContractInfo.signature0 = _data.signature0; //改卡时，首贷和加贷都未还清的情况下的第一个订单的手写签名
                    ContractInfo.signature1 = _data.signature1; //改卡时，首贷和加贷都未还清的情况下的第二个订单的手写签名
                    ContractInfo.signaturePicture = _data.signaturePicture;
                    UserInfo.realName                           =_data.realName;//客户手填的姓名
                    UserInfo.authAccountName                    =_data.authAccountName;//网络征信、社保、公积金的姓名
                    UserInfo.identityNo                         =_data.identityNo;//客户的身份证
                    UserInfo.mobile                             =_data.mobile;//客户的身份证
                    UserInfo.signatureType='3';                                         //签字场景(1:授信签字；2：绑卡签字；3换卡签字),
                    UserInfo.signFailureNum=_data.signFailureNum;               //签字失败的次数
                    UserInfo.signatureAuditStatus=_data.signAuditStatus;        //审核的状态
                    ngUtils.loadingAlertClose();
                } else {
                    ngUtils.loadingAlertClose();
                    ngUtils.alert(response.msg);
                }
              },function(error){
                    ngUtils.loadingAlertClose();
                    ngUtils.alert("网络错误，请稍后重试或联系客服。");
             });
        },  
                        
	}
});

