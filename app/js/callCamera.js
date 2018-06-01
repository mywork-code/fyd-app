
var photoProcess = function(data){
//	 var deviceType = getDeviceType();
//	 console.log("photoProcess is triggerd");
     var imgencoded = encodeURIComponent(data);
     $('#img64').val(data).trigger('change');
     $('#confirmAnalyze').triggerHandler('click');
}

function signSuccess(){
	
	 $(document).triggerHandler("signSuc");
}

var getDeviceType = function (){
	  var u = navigator.userAgent;
	     if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
	              return "Android";
	     }else if(u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1){
	              return "iOS";
	     }
	     return "Android";
}