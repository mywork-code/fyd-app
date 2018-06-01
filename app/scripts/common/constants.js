'use strict';

var app = angular.module("gfbApp");

app.factory("Constant",function(){
	return {
		// 安家派测试环境
//		"APIRoot" : "http://gfbapp.vcash.cn/appweb/data/ws/rest", // rest根目录
		"APIRoot" : "https://fyd-uat.apass.cn/appweb/data/ws/rest", // rest根目录
		"Root" : "http://gfbapp.vcash.cn/appweb", // 系统根目录
		"ContractNeedPath" : "http://gfbapp.vcash.cn", // 合同中需要的网络平台地址
		"espRoot":"http://espapp.sit.apass.cn/appweb/data/ws/rest"//请求合同所需电商后台地址
	}
});

//首页
app.factory("HomeIndexInfo", function() {
	return {
		// 首页显示的页面 1：测颜值 2：激活钱包 3:有额度，提现
		"page" : "1",
		// 颜值
		"faceScore" : 0,
		// 授信总额度
		"totalAmount" : 0.00,
		// 可用额度
		"availableAmount" : 0.00,
		//失效时间
		"expireDate" : ""
	}
});

/**
 * 整个页面的信息对象
 */
app.factory("PageObject",function(){
	return {
		back: function(){
			history.back();
		},  //返回事件
		title: "安家派",  //标题
		close: function(){
			wx.close();
		},  //关闭事件
		cacheData: {}  //缓存数据对象
	};
});

/**
 * 页面控制对象
 */
app.factory("PageControllerObject", function() {
	return {
		contractPage:""	//重新签字控制合同跳转  1表示直接跳转到下一个合同
	};
});
/**
 * 倒计时对象
 */
app.factory("CountdownObj",function(){
	return {
		count: "120",  // 倒计时总时长
		curCount:  "120",// 当前剩余总时间长度
		interValObj: "", // timer变量，控制时间
	    disFlag: false,  // 倒计时按钮是否禁掉
	    content: "获取"  // 倒计时按钮上显示文本
	};
});

/**
 * 用户登录注册相关信息
 */
app.factory("RegisterInfo", function() {
	return {
		account : "", //账号
		password : "", //注册密码
		newPassword : "", //重置的新密码
		reconfirmPassword : "", //再次确认密码
		verifyCode : "", //注册账号时的手机验证码
		tranPassword : "", // 交易密码
		handPassword : "", //手势密码
		email : "", //电子邮件地址
		faceScore : "",//颜值
		deviceId : "", //用户最新登录设备号
		identityNo:""//身份证号
	}
});

/**
 * 用户登录注册相关信息
 */
app.factory("OrderInfo", function() {
	return {
		totalAmount : "",         //授信总额度
		availableAmount : "",     //可用额度
		totalWithdrawAmount : "", //提现总额
		totalOverDueAmount : "", //当前逾期总金额
		sltDetailList:"",       //订单数据详情
		loanType : ""             //贷款类型(是否可提现)
	}
});

/**
 * 用户相关信息对象
 */
app.factory("UserInfo",function(){
	return {
		userId:"",	
		mobile: "",//手机号
		mobileStr: "",//中间是*的手机号
		customerId: "", //客户号
		realName: "", //客户手填的姓名
		newName: "", //ocr识别出客户的姓名
		authAccountName: "", //网络征信、社保、公积金的姓名
		fromSelectPage: "", //选择银行名称的时候是从哪个页面进来的(绑卡还是换卡)
		identityNo: "", //身份证号
		identityNoStr:"",//中间有*身份证号
		specialSltAccountId: "", //单笔放款sltAccountId
		identityExpires: "", //身份证有效日期
		personFlag: "0", //手持身份证上传标识  上传-1   未上传-0
		degree: "", //学历
		identityFlag:"0",//判断身份认证页面是否需要初始化
		job: "", //职业
		marState: "",//婚姻状况
		localRegistry: "0",// 本地籍 是-1 否-
		creditLimit: 0 ,//信用额度
		avalidLimit: 0, //可用额度
		frontImg: "", 
		backImg: "",
		personImg: "",
		mobileAuthStatus: "0",
		mobileAuthDesc: "未认证", //状态描述
		mobileAuthFlag: "wait",
		availableLimit: "0.00",
		expireDays : 30,
		hasSettledOrder : '',//是否有已经结清的订单 true:有；false:没有
		isBindCardInvalid: "1",//绑定银行卡是否有效:0-否 1-是
		repeatCreditFlag: 0, //是否是重新授信；1-是； 0-否
		showAccount: {},
		signature64:"", //手写签名数据
		signatureNative:"", //手写签名笔画
		uploadFailedCount :0, //照片上传失败次数
		remindStatus:1, //还款日提醒状态
		loanType: "",//贷款类型（0:第一次体现\1:加贷\2:再贷）
		anjieDate:"",//每月按揭还款日
		contractStyle:"",//当前签署合同类型
		platFormService:"",//是否签署平台服务协议
		personalInfoAuthor:"",//是否签署个人信息授权书
		loanInfoContract:"",//是否签署贷款合同
		noticeInfoContract:"",//是否签署特别提示函
		withDrawSignature:"",//提现处是否签字
		personInfoSignature:"",//协议处时候签字
		agentService:"",//是否签署转介绍服务协议
		intermediaryService:"",//是否签署转介绍居间服务协议
		agentSignature:"",//转介绍协议出是否签字
		customerStatus:"",//客户状态
		agentFlag:"N",//是否注册转介绍
		tranPassword:"",//交易密码
		newtranPassword:"",//新交易密码
		reconfirmPassword:"",//确认密码
		remainDate:0,	//额度申请失败锁单剩余天数
		deductAuth:false,	//扣款授权书
		repaceSupplemental:false,	//变更借记卡卡号协议
		identityNoText:"",//输入的身份证
		cardNoText:"",//输入的银行卡号
	    bindlinkFlag:"",//绑卡时候跳转链接状态  1我的中心绑卡 2提现绑卡
	    hashAddCredit:"",//是否已经提额
	    supportAdvanceFlag:"",	//是否可以提额
		signatureType:"",		// 通用签字场景(1:授信签字；2：绑卡签字；3换卡签字),
		signFailureNum:"",		// 通用签字失败的次数,
		signatureAuditStatus:"",	// 授信阶段有效签字人工审核的状态
		tempCardNo:"",		// 临时银行卡,
		tempCardBank:""	,// 临时银行
		xAuthToken:""   //用户token

	}
});

/**
 * 身份证相关对象
 */
app.factory("IdentityInfo",function(){
	return {
		frontUploaded: false, //正面照是否上传
		frontImage: "", //正面照图片
		backUploaded: false, //反面照是否上传
		backImage: "", //反面照图片
		personUploaded: false, //手持照是否上传
		personImage: "" //手持照图片
	}
});

app.factory("UserContacterInfo",function(){
	return {
		id:""
	}
	});

app.factory("DegreeList", function () {
    var list = [{ text: '硕士及以上', value: 'ssjys' },
	    		{ text: '本科', value: 'bk' },
	    		{ text: '专科及以下', value: 'zkjyx' }
    ];
    return list;
});

app.factory("MarStatusList", function () {
    var list = [{ text: '已婚', value: 'yh' },
                { text: '未婚', value: 'wh' },
                { text: '离异', value: 'lh' },
                { text: '其他', value: 'so' }
    ];
    return list;
});

/**
 * 证件类型列表
 */
app.factory("CertificateList", function () {
    var list = [{ text: '身份证', value: '0' },
                { text: '户口簿', value: '1' },
                { text: '护照', value: '2' },
                { text: '军官证', value: '3' },
                { text: '士兵证', value: '4' },
                { text: '港澳居民来往内地通行证', value: '5' },
                { text: '台湾同胞来往内地通行证', value: '6' },
                { text: '临时身份证', value: '7' },
                { text: '外国人居住证', value: '8' },
                { text: '警官证', value: '9' },
                { text: '香港身份证', value: 'A' },
                { text: '澳门身份证', value: 'B' },
                { text: '台湾身份证', value: 'C' },
                { text: '其他证件', value: 'X' }
    ];
    return list;
});

/**
 * 手机实名认证相关信息
 */
app.factory('MobileVerifyInfo', function () {
    return {
        token: '', //token
        mobilePsw: '',//手机服务密码
        captcha: '', // 手机动态码
        success: false,
        website: '',
        account: '',
        verifyFlag: false,
        repeatFlag: '0' // 手机重新实名标识（1 - 是重新做）
    }
});

/**
 * 征信账号信息对象
 */
app.factory('ZhengxinInfo', function () {
    return {
        username: '', // 注册账号 用户名
        password: '', // 注册账号 密码
        confirmpassword: '', // 确认密码
        token: '', 
        questionList: null,
        content: '',
        realName: '',		// 客户真实姓名
        certNo: '',			//	用户身份证号
        certTypeValue: '',
        certTypeDesc: '',
        vercode: '',
        email: '',
        activeCode: '',
        mobile: '',			// 银联预留电话
        //银测征信信息
        supportWay: '2',	//	1、只支持五个问题，2、支持五个问题以及银测获取方式
        smscode: '', 		// 	手机动态码
        unionhtml: '', 		// 	认证码的跳转页面信息
        verCodeBase64: '', 	// 	验证码图片Base64
        verCode:'',			//  图片验证码
        cardNo:'',			// 	银测卡号
        cardNumber:'',		// 卡信息接口返回的卡号，用于密码加密(注意：跟输入的卡号不一样)
        cardTypeConfirmed:'0', //卡的详情是否获得		
        cardRule: {			//	卡的验证规则，控制页面显示
			cardNo: true,
            mobile: false,
            smsCode: false,
            expire: false,
            cvn2: false,
            credential: false,
            name: false,
            password: false	
        },		
        expire:	'',			//	信用卡有效期
        expireMonth:'01',		//	有效期月份
        expireYear:'15',		//  有效期年份
        cvn2:	'',			//	信用卡反面3位cvn
        cardPassword:'',	//  卡密
        unionPayCode:'',		//	银联认证码
        unionPayToken:'',	// 	银联令牌
        exponent:'',
        modulus:''
    }
});
/**
 * 关系列表
 */
app.factory("ContacterListOne", function () {
    var list = [{ text: '请选择', value: '' },
                { text: '父子/女', value: 'fzn' },
	    		{ text: '母子/女', value: 'mzn' },
	    		{ text: '子女', value: 'zn' },
	    		{ text: '兄弟姐妹', value: 'xdjm' },
	    		{ text: '其他', value: 'qt' }
    ];
    return list;
   });	
/**
 * 关系列表
 */
app.factory("ContacterListTwo", function () {
    var list = [{ text: '请选择', value: '' },
                { text: '父子/女', value: 'fzn' },
	    		{ text: '母子/女', value: 'mzn' },
	    		{ text: '子女', value: 'zn' },
	    		{ text: '兄弟姐妹', value: 'xdjm' },
	    		{ text: '同事', value: 'ts' },
	    		{ text: '朋友', value: 'py' },
	    		{ text: '其他', value: 'qt' }
    ];
    return list;
   });
/**
 * 关系列表
 */
app.factory("ContacterInfoType", function () {
  return {
	  fzn: '父子（女）',  
	  mzn: '母子（女）',
	  zn: '子女',
	  xdjm: '兄弟姐妹', 
	  ts: '同事',
	  py: '朋友',
	  qt: '其他'
  } 
   });
/**
 * 关系列表
 */
app.factory("BankMaps", function () {
  return {
	  jianhang: 'CCB',      //建设银行
	  gonghang: 'ICBC',     //工商银行
	  guangda: 'CEB',   	//光大银行
	  nonghang: 'ABC', 		//农业银行
	  zhaohang: 'CMB',		//招商银行
	  zhonghang: 'BOC',		//中国银行
	  minhang: 'CMBC',		//民生银行
	  zhongxinhang: 'CITIC',//中信银行
	  jiaohang: 'COMM',		//交通银行
	  youhang: 'PSBOC',  	//邮储银行
	  guangfahang: 'CGB', 	//广发银行  
	  pinganhang: 'PAB',	//平安银行  
	  huaxiahang: 'HXBANK',	//华夏银行 
	  xingyehang: 'CIB',	//兴业银行 
	  pufahang: 'SPDB',		//浦发银行 
	  guokai:'CDB',			//国家开发银行 
	  zhongjin:'EXIMBC', 	//中国进出口银行 
	  nongfa:'ADBC',		//中国农业发展银行
//	  dalianhang: 'DLB',    //大连银行
//	  dongyahang: 'BEA',    //东亚银行
//	  shanghaihang: 'SHBANK',//上海银行
//	  beijinghang: 'BJBANK',
//	  chengshang:'',    	//城市商业银行
	  hengfeng:'EGBANK',	//恒丰银行 
	  zheshang:'CZBANK',	//浙商银行
	  nonghe:'YDRCB',		//农业合作银行
	  bohai:'BOHAIB',       //渤海银行股份有限公司
	  weishang:'HSBANK'       //微商银行

  } 
});

/**
 * 借款信息对象
 */
app.factory('BorrowInfo',function () {
	return {
		detailList:''
	}
});


/**
 * 月份列表
 */
app.factory("MonthList", function () {
    var list = [
                { text: '01', value: '01' },
                { text: '02', value: '02' },
                { text: '03', value: '03' },
                { text: '04', value: '04' },
                { text: '05', value: '05' },
                { text: '06', value: '06' },
                { text: '07', value: '07' },
                { text: '08', value: '08' },
                { text: '09', value: '09' },
                { text: '10', value: '10' },
                { text: '11', value: '11' },
                { text: '12', value: '12' } 
    ];
    return list;
});

/**
 * 日期列表
 */
app.factory("DateList", function () {
    return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
});
/**
 * 年份列表
 */
app.factory("YearList", function () {
	var list =[{ text: '15', value: '15' }];
	for(var i=16;i<100;i++){
		var item={text: i,value:i};
		list.push(item);
	}
    return list;
});


/**
 * 提现信息对象
 */
app.factory('WithdrawRecordObject', function () {
	return {
		totalAmount: 0, //可用额度
		availableAmount: 0, //可用额度
		totalRepayAmount: 0, //分期共计总额
		withdrawMoney: "1,000.00", //提现金额
		feeAmount: 20, //手续费
		scheduleAmount: 0, //每期应还金额
		installInfoList: 0, //分期详情list
		sltAccountList: 0, //借款记录list
		paymentType: "", //分期期数
		paymentTypeFlag: false, //是否已经选择分期标识1
		typeFlag: false, //是否已经选择分期标识2
		checkWhetherBlack: "", //分期期数
		monthlyPaymentDate: "", //加贷的情境下每月还款日
		applyWithdrawTime: "", //提现申请时间
		loanDate: "", //放款时间
		bindCardFlag: "", //绑卡的状态
		cardFlag: "", //
		formalitiesRate: "", //手续费率
		loanType: "", //贷款类型（0:第一次体现\1:加贷\2:再贷）
		sltAccountId:"",//	订单的id
		contractNO:"",	// 合同编码
		showDeatil:false //是否展示分期详情
	}
});
/**
 * 提现详细信息对象
 */
app.factory('WithdrawDetailInfo', function () {
	return {
		applyDate: "", //提现申请时间
		loanDate: "", //放款时间
		terminateDate: "", //解约时间
		loanAmount: "", //提现金额
		tranStatus: "", //贷款状态
		reviewDate: "",//审核通过时间
		orderClosedDate: "",//订单结清时间
		surrenderDate: "",//解约时间
		flag:"",
		cardNo: "",//银行卡号
		cardNoStr: "",//银行卡尾号
		cardBank: "",
        bankCode: "",
        repeatFlag:"",	//是否允许重新申请   true不允许
        unlockDays:""	//锁单剩余天数
	}
});

/**
 * 绑卡信息对象
 */
app.factory('BindCardObject', function () {
	return {
		bindCardFlag: "", //是否绑卡已经帮的卡是否失效
		selectBindFlag: false, //是否选择发卡行
		isChangeBankCard: "", //是否可以换卡
		failFlag: "", //绑卡失败的标示
		cardNo: "",    //银行卡号
		cardNoStr: "", //银行卡的尾号
		cardType: "",  //银行卡类型
		bankCode: "",  //银行code
		cardBank: ""   //银行名称
	}
});

/**
 * 绑卡信息对象
 */
app.factory('BindMortgageBank', function () {
	return { 
		mortCardFlag: "", //是否绑卡已经帮的卡是否失效
		selectBindFlag: false, //是否选择发卡行
		ifSameBank:"",//是否是八家银行
		failFlag: "", //绑卡失败的标示
		cardNo: "",    //银行卡号
		cardNoStr: "",    //银行卡的尾号
		cardType: "",  //银行卡类型
		bankCode: "",  //银行code
		cardBank: "",   //银行名称
		payCardNo:"",//支付银行卡的卡号
		payCardBank:"",//支付银行名称
		payBankCode:"",//支付银行code
		payCardType:"",//支付银行卡类型
		mortgageAmount:"",//每月按揭银行还款额
		currentProvince:"",//现居住地省份
		currentCity:"",//现居住地城市
		currentAddress:"",//现居住地地址
		mortgageLiveStatus:"",//按揭房子地址是否与现居住地址相同
		mortgageProvince:"",//按揭房子省份
		mortgageCity:"",//按揭房子城市
		mortgageAddress:"",//按揭房子详细地址
		isSelectMortgBank:""//是否选择按揭银行
	}
});

/**
 * 更换银行卡信息的对象
 */
app.factory('RepaceBindCardObject', function () {
	return {
		bindCardFlag: "", //是否绑卡已经帮的卡是否失效
		selectBindFlag: false, //是否选择发卡行
		agreeContractFlag: "", //授权协议和补充协议是否同意
		accreditAgreeId: "", //授权协议的合同号
		AccreditAgreeTime: "", //授权协议的合同号的创建时间
		supplementalAgreeId: "", //补充协议的合同号
		supplementalAgreeTime: "", //补充协议的合同号的创建时间
		cardNo: "",    //银行卡号
		cardNoStr: "", //银行卡的尾号
		cardType: "",  //银行卡类型
		bankCode: "",  //银行code
		cardBank: ""   //银行名称
	}
});

/**
 * 清贷信息对象
 */
app.factory('ClearInfo', function () {
    return {
    	bindCard : '',
    	vbsBid : '',//VBS业务号
    	sltAccountId : '',//订单号
    	operateFlag : '',//0:手动还款中，1：手动还款操作结束,2：清贷中，3：清贷操作结束
    	isExemption : '',//是否免息(0 全额 1 全免 2不收清贷手续费  )
    	exemptionFlag : '',//免息的标识 0：在7天免息天内；1：在8到30天的免手续费时间内；2：正常清贷
    	clearLoanAmount : '',//清贷的总金额
    	clearLoanCapitalAmt : '',//清贷的本金
    	type:''//9:提前清贷，10：免息清贷
    }
});


/**
 * 还款对象信息对象
 */
app.factory('RepaymentInfo', function () {
    return {
    	isFreeInterest: 'false', // 免息标识  false-否    true-是
    	isOverDue: 'false', // 是否已逾期  false-否   true-是
    	overDueAmt: '0', // 逾期金额
    	repaymentDay: '', // 还款日
    	repaymentAmt: '0', // 当前还款金额
    	saveInterestFree: '0', // 免息清贷节省利息
    	saveInterestAdvance: '0', // 提前清贷节约利息
    	withdrawList: null, // 体现记录
    	operateFlag: '1', // 还款状态  0-还款中    1-已还完成
    	loanType: '0', // 0-第一次体现，1-加贷，2-再贷，3-有笔体现未放款，4-不能够取现
    	repayInfoList : ''//还款详情list
    }
});
/**
 * 合同页面展示信息
 */
app.factory('newContractInfo', function () {
	return {
		realName: "",
		identityNo: "",
		mobile:"",
		signData:"",
		LoanAmt:"",
		loanPeriods: "", //借款还款期数
		monthlyInterestRate: "", //月利率
		monthlyServeRate: "", //月服务费率  
		monthlyplatformServeRate: "", //平台服务费率
		principal:"",//月本金
		feeAmount:"",//手续费
		repaymentDate:"",//还款日
		downPayment:"",//首付金额
		balancePayment:"",//尾款
		cardNo:"",//银行卡号
		firstCapital:"",//第一期应还本金
		secondCapital:"",//第二期应还本金
		thirdCapital:"",//第三期应还本金以后
		cardBank:"",//银行银行
		liquidatedDamage:"",//违约金
		signaturePicture:"",//客户电子签名
		firstMonth:"",
		secondMonth:"",
		thirdMonth:"",
		feePayDay:""	//平台手续费支付日

	}
});
/**
 * 合同页面展示信息
 */
app.factory('ContractInfo', function () {
    return {
    	realName: "",
    	identityNo: "",
    	authAccountName:"", //客户通过优先级的选择客户的用于验卡的姓名
    	withdrawMoney:"",	//提现金额
    	openId: "", //微信号
    	nowyear: "", // 当前年份
    	nowMonth: "", // 当前月份
    	nowDay: "", // 当前日期
    	nowHours:"",//小时
    	nowMinutes:"",//分钟
    	nowSeconds:"",//秒
    	repayEndyear: "", // 还款截止年份
    	repayEndMonth: "", // 还款截止月份
    	repayEndDay: "", // 还款截止日期
    	loanAmt: "", // 借款额度
    	loanPeriods: "", //借款还款期数
    	monthInterest: "", // 月利率
    	everyMonthMoney: "", //每月还款金额
    	handFee: "", // 手续费
    	handFeeInterest: "", // 手续费率
    	everyMonthServiceMoney: "", // 每月服务费
    	serviceInterest: "", // 服务费率
    	bankCode: "", // 银行卡号
    	bankName: "", // 银行名称
    	firstRepayAmt: "", // 首期还款金额
    	otherRepayAmt: "", // 其余每期还款金额
    	repayDay: "", //每月还款日
    	firstRepayDate: "", // 首期还款日期
    	firstServiceAmt: "", // 首期服务费金额
    	otherServiceAmt: "", // 其余每期服务费金额
    	serviceFeePeriod: "", // 服务费支付期数
    	serviceRepayDay: "", // 服务费每月支付日期
    	firstServiceRepayDate: "", // 首期服务费支付日期
    	deductFailFee: "" ,// 扣款失败违约金
    	everyMonthBenxi:"", //每月应付本息
    	sltAccountInfoList:"", //生成合同 要用（待补资料/复核中/已放款/已逾期）的所有订单信息。
    	sltAccountInfoListSize:"", //生成合同 要用（待补资料/复核中/已放款/已逾期）的所有订单信息的个数。
    	contractNosStr:"",//客户扣款授权书的两个的个人信用借款合同的合同号
    	otherContractNosStr:"",//合同
    	danBaoContractNOsStr:"",// 客户扣款授权书的两个的个人贷款委托担保合同
    	contractNO:"",//合同
    	monthlyPrincipalInterestAmt:"",//每月本息还款金额, 月还款本金+利息
    	dailyInterest:"",//利息的日利率=月利率/30
    	dailyServiceInterest:"",//日服务费率=月服务费率/30
    	signature64:"", //手写签名数据
    	preContractNo:"",//上份借款合同编号
    	contractWorkCity: "",// 工作所在城市
    	identityRecognizeAddress:"",//身份证居住地址
    	liveAddress:"",//微信公众号录入的现居住地址(包括省、市、地方)
    	dailyServiceInterestAmtForFT:"",//首期每日服务费金额 = 提现金额*月服务费率/30
    	firstRepayYear:"",// 首期还款年
    	firstRepayMonth:"",// 首期还款月
        firstRepayDay:"",// 首期还款日
        kouShiFei:"",//本息扣失或服务费扣失
        guaranteeInterest:"",//月担保费率 
        monthGuananteeAmt:"",//月担保费
        firstDailyGuaranteeAmt:"",//首期每日担保费
        otherGuaranteeAmt: "", // 其余每期担保费
        otherMonthRepayAmt:"",//第二期至最后一期每期应还金额
        platformAccName:"",//平台账户名
        everyMonthServiceAmtForFT:"",//每月应付服务费金额=提现金额*月服务费率
        otherServiceAmtForFT:"",	//自第二期起每期服务费金额
        sltAccountInfo0:"", //改卡时，首贷和加贷都未还清的情况下的第一个订单的信息
        sltAccountInfo1:"", //改卡时，首贷和加贷都未还清的情况下的第二个订单的信息
        serviceName:"", //服务方名称	
        serviceStamp:"", //服务方用章
        contractNameList:"",//根据合同/贷款类型得到不同的展示合同list的页面
        vbsContractInfoList:"", //获得vbs生成的合同信息
        signature0:"",//改卡时，首贷和加贷都未还清的情况下的第一个订单的手写签名
		signature1:"", //改卡时，首贷和加贷都未还清的情况下的第二个订单的手写签名		
    	everyMonthMoneyForFT:"",// 外贸(特别提示函)：每月还款金额 = 提现金额/期数+月利息+月服务费+月担保费
    	productType:""// 产品类型 区分现金 租金
    }
    
});

/**
 * 小贷合同-首次
 */
app.factory("xiaoDaiContractFirst",function(){
	var list = [
					{ text: '贷款用途声明', value: 'DOCUMENTKIND/DDQ/DAIKUANYONGTU' },
					{ text: '个人信用借款合同(首次)', value: 'DOCUMENTKIND/DDQ/XINYONGHETONG' },
					{ text:	'个人借款服务与咨询合同(首次)',	value: 'DOCUMENTKIND/DDQ/JIEKUANHETONG'},
					{ text:	'特别提示函(首次)',	value: 'DOCUMENTKIND/DDQ/TEBIETISHIHAN'},
					{ text:	'第三方扣款授权委托书',	value: 'DOCUMENTKIND/DDQ/KOUKUANWEITUOSHU'}
				];
	return list;			
});


/**
 * 小贷合同-加贷
 */
app.factory("xiaoDaiContractSecond",function(){
	var list = [
					{ text: '贷款用途声明', value: 'DOCUMENTKIND/DDQ/DAIKUANYONGTU' },
					{ text: '个人信用借款合同(加贷)', value: 'DOCUMENTKIND/DDQ/XINYONGHETONGJD' },
					{ text:	'个人借款服务与咨询合同(加贷)',	value: 'DOCUMENTKIND/DDQ/JIEKUANHETONGJD'},
					{ text:	'特别提示函(加贷)',	value: 'DOCUMENTKIND/DDQ/TEBIETISHIHAN'},
					{ text:	'第三方扣款授权委托书',	value: 'DOCUMENTKIND/DDQ/TEBIETISHIHANJD'}
				];
	return list;			
});


/**
 * 外贸合同-首次
 */
app.factory("waiMaoContractFirst",function(){
	var list = [
					{ text: '贷款合同(首次)', value: 'DOCUMENTKIND/DDQWM/DKHT' },
					{ text:	'个人贷款服务与咨询合同',	value: 'DOCUMENTKIND/DDQWM/GRDKFWHT'},
					{ text:	'个人贷款委托担保合同',	value: 'DOCUMENTKIND/DDQWM/GRDKWTDBHT'},
					{ text:	'个人客户扣款授权书',	value: 'DOCUMENTKIND/DDQWM/GRKHKKSQS'},
					{ text:	'特别提示函(首次)',	value: 'DOCUMENTKIND/DDQWM/TBTSH'},
					{ text:	'个人消费信托贷款借款借据',	value: 'DOCUMENTKIND/DDQWM/JKJJ'}
				];
	return list;			
});

/**
 * 外贸合同-加贷
 */
app.factory("waiMaoContractSecond",function(){
	var list = [
					{ text: '贷款合同(加贷)', value: 'DOCUMENTKIND/DDQWM/DKHTJD' },
					{ text: '还款分期表（非固定数额还款）', value: 'DOCUMENTKIND/DDQWM/HKFQB' },
					{ text:	'个人贷款服务与咨询合同',	value: 'DOCUMENTKIND/DDQWM/GRDKFWHT'},
					{ text:	'个人贷款委托担保合同',	value: 'DOCUMENTKIND/DDQWM/GRDKWTDBHT'},
					{ text:	'个人客户扣款授权书',	value: 'DOCUMENTKIND/DDQWM/GRKHKKSQS'},
					{ text:	'特别提示函(加贷)',	value: 'DOCUMENTKIND/DDQWM/TBTSHJD'},
					{ text:	'个人消费信托贷款借款借据',	value: 'DOCUMENTKIND/DDQWM/JKJJ'}
				];
	return list;			
});

/**
 * 合同列表(单卡)
 */
app.factory("ContractCardList",function(){
	var list = [
					{ text: '贷款合同', value: 'DOCUMENTKIND/FYDAOPAI/DKHT' },
					{ text: '个人贷款服务与咨询合同', value: 'DOCUMENTKIND/FYDAOPAI/GRDKFWZXHT' },
					{ text: '个人贷款委托担保合同', value: 'DOCUMENTKIND/FYDAOPAI/GRDKWTDBHT' },
					{ text: '个人客户扣款授权书', value: 'DOCUMENTKIND/FYDAOPAI/GRKHKKSQS' },
					{ text: '特别提示函', value: 'DOCUMENTKIND/FYDAOPAI/TBTSH' }

				];
	return list;			
});

/**
 * 合同列表(多卡)
 */
app.factory("ContractCardsList",function(){
	var list = [
					{ text: '贷款合同', value: 'DOCUMENTKIND/FYDAOPAI/DKHT' },
					{ text: '个人贷款服务与咨询合同', value: 'DOCUMENTKIND/FYDAOPAI/GRDKFWZXHT' },
					{ text: '个人贷款委托担保合同', value: 'DOCUMENTKIND/FYDAOPAI/GRDKWTDBHT' },
					{ text: '个人客户扣款授权书', value: 'DOCUMENTKIND/FYDAOPAI/GRKHKKSQS' },
					{ text: '特别提示函', value: 'DOCUMENTKIND/FYDAOPAI/TBTSH' },
					{ text: '关于变更还款卡号的补充协议', value: 'DOCUMENTKIND/FYDAOPAI/BGHKKHBCXY' },
					{ text: '个人信用信息查询及提供授权书(外贸信托)', value: 'two_one' },
					{ text: '个人信用信息查询及提供授权书(杭州担保通道)', value: 'two_two' },
					{ text: '个人信息授权书', value: 'two_there' }

				];
	return list;			
});


/**
 * APP账号同步相关信息
 */
app.factory("SynchronizeData",function(){
	return {
		customerInfo:{
			openId: "", 
			agent: "",
			appId: "",
			appAccount: null,	
		},		
		identityNo: "",
		syncCheckFlag: "0"
	}
});

/**
 * 按揭银行选择列表
 */
app.factory("AnjieBankList",function(){
	return [{text:'中国工商银行',value:'zggsyh'},
	        {text:'中国农业银行',value:'zgnyyh'},
	        {text:'中国银行',value:'zgyh'},
	        {text:'中国建设银行',value:'zgjsyh'},
	        {text:'国家开发银行',value:'gjkfyh'},
	        {text:'中国进出口银行',value:'zgjckyh'},
	        {text:'中国农业发展银行',value:'zgnyfzyh'},
	        {text:'交通银行',value:'jtyh'},
	        {text:'中信银行',value:'zxyh'},
	        {text:'中国光大银行',value:'zggdyh'},
	        {text:'华夏银行',value:'hxyh'},
	        {text:'中国民生银行',value:'zgmsyh'},
	        {text:'广东发展银行',value:'gdfzyh'},
	        {text:'招商银行',value:'zsyh'},
	        {text:'兴业银行',value:'xyyh'},
	        {text:'上海浦东发展银行',value:'shpdfzyh'},
	        {text:'平安银行股份有限公司',value:'payhgfyxgs'},
	        {text:'中国邮政储蓄银行',value:'zgyzcxyh'},
	        {text:'城市商业银行',value:'cssyyh'},
	        {text:'恒丰银行',value:'hfyx'},
	        {text:'浙商银行',value:'zsyh'},
	        {text:'农村合作银行',value:'nchzyh'},
	        {text:'渤海银行股份有限公司',value:'bhyhgfyxgs'},
	        {text:'徽商银行股份有限公司',value:'hsyhgfyxgs'}
	        ]
});
/**
 * 客户分享二维码信息表  记录邀请人信息表
 */
app.factory("DimensionInfo",function(){
	return {
		openId: "",
		ticket: "", //获取二维码的ticket
		identityNo:"",//身份证号码
		mobile: "", //手机号
		sceneCode: "", //邀请码规则（一万减去customerId）
		sceneDesc: "", //生成二维码的邀请码的描述
		sceneType: "" ,//1：永久二维码；2：临时二维码
		ifidentity:"0",//身份证号状态
		ifmobile:"0",//手机号码状态
		unionhtml: '', 		// 	认证码的跳转页面信息
		verCodeBase64: '', 	// 	验证码图片Base64
		AgentSignature:"",//协议处时候签字
		sceneCodeUrl:"",	//二维码地址
		sumInvitee:"",		//邀请客户数
		availableAmount:"",	//可提现金额
		totalAmount:"",		//总金额
		hashWithdrawAmount:"",//已体现金额
		inviterAwardsStreamList:"",//奖励列表
		awardsWithdrawRecordList:"",//提现记录
		status:""	,		//状态
		headImgUrl:""		//客户头像url
	}
});
/**
 * Advance Types
 */
app.factory("AdvanceTypes",function(){
	return {
		ZM: false, // 芝麻信用认证状态编码
		ZMStatusName: '未认证', // 芝麻信用认证状态名称
		CC: false,  // 信用卡认证状态编码
		CCStatusName: '未认证' // 信用卡认证状态名称
	};
});
/**
 * 易宝支付数据
 */
app.factory("YibaoPay",function(){
	return {
		bankCardNumber: '', // 已绑定银行卡个数、
		userBankCardInfoList:  '',//已绑定绑定银行卡列表
		requestNo:''  ,//交易流水号
		sltAcctId:'' ,//订单单号
		vbsBid: '', //vbs单号
		dueAmt:'', //逾期金额
		nextBillAmt:'',//下一期账单金额
		BankCardList:'' ,//银行卡列表初始化
		BankCardName:'' ,//银行卡名称
		bankCode:'' ,//银行卡简称
		selectSrc:'img/ajp-botton-off.png',
		payAmount:'' ,//结果页-还款金额
		cardCode:'' , //输入的银行卡号
		phone:'', //输入预留手机号
		MsgCode:'', //验证码
		nextBillMonth:'' ,//最后还款月份
		nextBillDay:'' ,//最后还款日
		isPayResult:'', //是否进入还款页面
		isFormBank:false, //是否从绑卡页面返回
		reCardNo:'',
		reBankCode:'',
		reActivePayType:'',
		Reamount:''
 	};
});
