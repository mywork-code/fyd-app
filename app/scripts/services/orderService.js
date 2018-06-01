'use strict';

var app=angular.module("gfbApp");

/**
 * 账单
 */
app.factory("OrderService", function($rootScope, $resource, $location, Constant, UserInfo,
						OrderInfo, ngUtils,ClearInfo,$q) {
	return {

		/**
		 * 初始化客户的订单数据
		 */
		initOrderData : function() {
			var path = Constant.APIRoot + "/order/init/data";
			// var path =  "http://app.apass.vcash.cn/appweb/data/ws/rest/order/init/data";
			var orderServiceObj=this;
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});

			var params = {
	            "mobile" : UserInfo.mobile,
				"x-auth-token":UserInfo.xAuthToken				
				// "mobile" : "13036898489",
				// "x-auth-token":"eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsaXN0ZW5pbmcuand0Lmlzc3Vlcj86bGlzdGVuaW5nLWp3dC1pc3N1ZXIiLCJhdWQiOiJsaXN0ZW5pbmcuand0LmF1ZGllbmNlPzpsaXN0ZW5pbmctand0LWF1ZGllbmNlIiwiaWF0IjoxNDkyMDU2MTA5LCJleHAiOjE2MTMwMTYxMDksImluZm8iOnsidXNlcklkIjoiMjMzNCIsIm1vYmlsZSI6IjEzOTEyOTg3NzYwIn19.7oR7vzNHtPkw6Clo-MtbGMoXxFm1W0JaVEj2o4_N9Yc"
			};
			ngUtils.loadingAlert();
			var deferred = $q.defer();
			service.connect(params, function(response) {
				console.log(response)
				ngUtils.loadingAlertClose();
				if (response && response.status == "1") {
					OrderInfo.cardNum                  =response.data.cardNum;
					OrderInfo.loanType                 =response.data.loanType;
					OrderInfo.totalAmount              =response.data.totalAmount;
					OrderInfo.availableAmount          =response.data.availableAmount;
					OrderInfo.withdrawAmount            =response.data.withdrawAmount;
					OrderInfo.totalWithdrawAmount      =response.data.totalWithdrawAmount;
					OrderInfo.totalOverDueAmount       =response.data.totalOverDueAmount;
					OrderInfo.sltDetailList            =response.data.sltDetailList;
					//添加用户的id，为app端清贷的时候使用
					UserInfo.customerId				   =response.data.customerId;
					var counts=OrderInfo.availableAmount - OrderInfo.withdrawAmount;
					if(counts<0){
						counts=-counts;
					}
					
					orderServiceObj.myBillprogressAnimation({ //加载
				        totle: OrderInfo.totalAmount,//总数
				        count: counts,//当前数
				        wrap: $("#myBillCanvasWrap"),
				        canvas:"myBillCanvas"
				    });
					
					if(OrderInfo.sltDetailList && OrderInfo.sltDetailList.length>0){
						
						$rootScope.showNoOrderFlag = false;
					}else{
						$rootScope.showNoOrderFlag = true;
					}
				} else {
					//操作失败
					ngUtils.alert(response.msg);
					$rootScope.showNoOrderFlag = true;
				}
				deferred.resolve(response);
			}, function(error) {
				ngUtils.loadingAlertClose();
				ngUtils.alert("网络错误，请稍后重试或联系客服。");
				$rootScope.showNoOrderFlag = true;
			});
			return deferred.promise;
		},
		toRepay:function(){
			var path = Constant.APIRoot + "/order/init/data";
			var orderServiceObj=this;
			var service = $resource(path, {}, {
				connect : {
					method : 'POST'
				}
			});
			var params = {
				"mobile" : UserInfo.mobile,
				"sltAccountId" : ClearInfo.sltAccountId,
				"x-auth-token":UserInfo.xAuthToken
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

		//加载动画
		myBillprogressAnimation:function (fn) {
		
			 window.requestAnimationFrame =
	                window.requestAnimationFrame ||
	                window.mozRequestAnimationFrame ||
	                window.webkitRequestAnimationFrame ||
	                window.msRequestAnimationFrame ||
	                function (callback) {
	                    window.setTimeout(callback, 1000 / 60);
	                };
	        var oWrap = $("#myBillCanvasWrap");
	        var canvas = document.getElementById("myBillCanvas");

	        var ctx = canvas.getContext("2d");

	        var oNum = oWrap.children("p.count").children("span"),
	                oWidth = oWrap.width() * 2,
	                oHeight = oWrap.height() * 2,
	                fontSize = parseInt(oWrap.css("font-size"));

	        canvas.width = oWidth;
	        canvas.height = oHeight;
			addPrototype();
	        var rX = oWidth / 2,
	                rY = oWidth / 2,
	                r = oWidth / 2 * 0.92,
	                totle = fn.totle || 20000,//总数,如果为零则为20000，为了旋转效果
	                count = fn.count == 0 ? totle : fn.count,
	                Num = 0,
	                NumEnd = 0,
	                range = 0.3,
	                moveStart = 0,
	                percent = count / totle,
	                showCount = 0,
					lineW = Math.floor((fontSize)/ 2),
					butLineWith =Math.floor(r-lineW),
					topLineWith = lineW;
	        var stop;
	        function loop() {
	            ctx.clearRect(0, 0, oWidth, oWidth);
	            ctx.beginPath();
	            //if(fn.count == 0 && NumEnd >= range ){
	            //    NumEnd = NumEnd >= 1 ? 1 : NumEnd;
	            //    moveStart = (NumEnd - range)/(1 - range);
	            //}else {
	            //    moveStart = 0;
	            //}
				moveStart = 0;
	            showCount = fn.count == 0 ? totle * (1 - Num) : totle * Num;
	            oNum.html(ngUtils.thousandsNum(Math.abs(showCount)));
	            drawBg();  //底圆

	            //进度条
	            progressForward();
				drawBgW();  //底圆
	            pointWhite();//点
	            stop = window.requestAnimationFrame(loop);
	            if (Num >= percent) {
	                Num = percent;
	                window.cancelAnimationFrame(stop);
	                if(fn.count == 0){
	                    ctx.clearRect(0, 0, oWidth, oWidth);
	                    ctx.beginPath();
	                    drawBg();
						drawBgW();  //底圆
	                    pointBlue();
	                }
	                oNum.html(ngUtils.thousandsNum(fn.count));
	            } else {

	                    Num += 0.01;
	                    NumEnd += 0.01;

	            }
	        }
	        loop();
	        function drawBg(){
				ctx.save();
				ctx.beginPath();
	            //底圆
	            //ctx.strokeStyle = "blue";
	            ctx.fillStyle = "#888";
	            ctx.arc(rX, rY, r, 0, 2 * Math.PI, false);
	            ctx.fill();
	        }
			function drawBgW(){
				ctx.save();
				ctx.beginPath();
				//底圆
				//ctx.strokeStyle = "blue";
				ctx.fillStyle = "#fff";
				ctx.arc(rX, rY, butLineWith, 0, 2 * Math.PI, false);
				ctx.fill();
			}
	        function progressForward(){
	            //进度条向前
	            ctx.save();
	            ctx.beginPath();

				ctx.fillStyle = 'rgba(176,25,26,1)';
				ctx.sector(rX, rY, r, (2*moveStart - 0.5)* Math.PI, (2 * Num - 0.5) * Math.PI).fill();
	        }
	        function pointWhite(){
	            //点
	            ctx.save();
	            ctx.beginPath();
	            ctx.lineWidth = topLineWith;
	            ctx.strokeStyle = "rgba(255,255,255,0.6)";
	            ctx.arc( rX + r*Math.cos((2*Num - 0.5)* Math.PI),rY + r*Math.sin((2*Num - 0.5)* Math.PI) + topLineWith/2, 2, 0, 2 * Math.PI, false);

	            ctx.stroke();
	        }
	        function pointBlue(){
	            //点
	            ctx.save();
	            ctx.beginPath();
	            ctx.lineWidth = topLineWith;
	            ctx.strokeStyle = "#ef0a2b";
	            ctx.arc( rX + r*Math.cos((2*Num - 0.5)* Math.PI),rY + r*Math.sin((2*Num - 0.5)* Math.PI)+ topLineWith/2, 2, 0, 2 * Math.PI, false);
	            ctx.stroke();
	        }

			function addPrototype() {
				CanvasRenderingContext2D.prototype.sector = function (x, y, radius, sDeg, eDeg) {
					this.save();
					this.translate(x, y);
					this.beginPath();
					this.arc(0, 0, radius, sDeg, eDeg);
					this.save();
					this.rotate(eDeg);
					this.moveTo(radius, 0);
					this.lineTo(0, 0);
					this.restore();
					this.rotate(sDeg);
					this.lineTo(radius, 0);
					this.closePath();
					this.restore();
					return this;
				}
			}
	    }
	}
});

