/**
 * Created by wanglei07 on 2016/9/14.
 */
'use strict';
var app = angular.module('gfbApp');

/**
 * 手机号码处理
 */
app.filter('MobileReplaceFilter', function() {
	return function(value) {
		if (null == value || value == '') {
			return '';
		}
		return value.substring(0, 3) + "****" + value.substring(7, 11);
	}
});

/**
 * 姓名处理
 */
app.filter('NameReplaceFilter', function() {
	return function(value) {
		if (null == value || value == '') {
			return '';
		}
		var len=value.length;
		var str="";
		if(len>2){
			for(var i=0;i<len-2;i++){
				str+="*";
			}
			return value.substring(0, 1) + str + value.substring(len-1, len);
		}else{
			return "*"+value.substring(1, 2);
		}
	}
});

/**
 * 身份证处理
 */
app.filter('CardReplaceFilter', function() {
	return function(value) {
		if(null==value || ''==value){
			return '';
		}
		var len = value.length;
		return value.substring(0, 6) + "********" + value.substring(14, len);
	}
});

/**
 * 服务合同编号格式化
 */
app.filter("serviceContract", function() {
	return function(loanContract) {
		if (loanContract == null || loanContract == "")
			return loanContract;
		else
			return loanContract + "-3";
	}
});

/**
 * 担保合同编号格式化
 */
app.filter("guaranteeContract", function() {
	return function(loanContract) {
		if (loanContract == null || loanContract == "")
			return loanContract;
		else
			return loanContract + "-1";
	}
});

/**
 * 取数值中百万位上的数值
 */
app.filter('moneyformatMillion', function() {
	return function(input) {
		var chineseNumber = function(dValue) {
			var maxDec = 2;
			// 验证输入金额数值或数值字符串：
			dValue = dValue.toString().replace(/,/g, "");
			dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
			if (dValue == "") {
				return "零元整";
			} // （错误：金额为空！）
			else if (isNaN(dValue)) {
				return "错误：金额不是合法的数值！";
			}

			var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
			var parts;
			var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
			if (dValue.length > 1) {
				if (dValue.indexOf('-') == 0) {
					dValue = dValue.replace("-", "");
					minus = "负";
				} // 处理负数符号“-”
				if (dValue.indexOf('+') == 0) {
					dValue = dValue.replace("+", "");
				} // 处理前导正数符号“+”（无实际意义）
			}
			// 变量定义：
			var vInt = "";
			var vDec = ""; // 字符串：金额的整数部分、小数部分
			var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
			// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
			var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null
					|| Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
			parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
			if (parts.length > 1) {
				vInt = parts[0];
				vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
				if (NoneDecLen) {
					maxDec = vDec.length > 5 ? 5 : vDec.length;
				} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
				var rDec = Number("0." + vDec);
				rDec *= Math.pow(10, maxDec);
				rDec = Math.round(Math.abs(rDec));
				rDec /= Math.pow(10, maxDec); // 小数四舍五入
				var aIntDec = rDec.toString().split('.');
				if (Number(aIntDec[0]) == 1) {
					vInt = (Number(vInt) + 1).toString();
				} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
				if (aIntDec.length > 1) {
					vDec = aIntDec[1];
				} else {
					vDec = "";
				}
			} else {
				vInt = dValue;
				vDec = "";
				if (NoneDecLen) {
					maxDec = 0;
				}
			}
			if (vInt.length > 44) {
				return "错误：金额值太大了！整数位长【" + vInt.length.toString()
						+ "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
			}
			var num = Number(vInt);
			var tag = 0, temp = -1;
			if (vInt.length > 0) {
				for (var i = vInt.length - 1; i >= 0; i--) {
					tag++;
					if (tag == 7) {
						temp = vInt[i];
						break;
					}
				}
			}
			var digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌",
					"玖");
			var index = Number(temp)
			return temp == -1 ? "/" : temp;
		};
		if (input) {
			return chineseNumber(input);
		}
	}
});

/**
 * 取数值中十万位上的
 */
app.filter('moneyformatShiwan', function() {
	return function(input) {
		var chineseNumber = function(dValue) {
			var maxDec = 2;
			// 验证输入金额数值或数值字符串：
			dValue = dValue.toString().replace(/,/g, "");
			dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
			if (dValue == "") {
				return "零元整";
			} // （错误：金额为空！）
			else if (isNaN(dValue)) {
				return "错误：金额不是合法的数值！";
			}

			var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
			var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
			if (dValue.length > 1) {
				if (dValue.indexOf('-') == 0) {
					dValue = dValue.replace("-", "");
					minus = "负";
				} // 处理负数符号“-”
				if (dValue.indexOf('+') == 0) {
					dValue = dValue.replace("+", "");
				} // 处理前导正数符号“+”（无实际意义）
			}
			// 变量定义：
			var vInt = "";
			var vDec = ""; // 字符串：金额的整数部分、小数部分
			var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
			var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null
					|| Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
			parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
			if (parts.length > 1) {
				vInt = parts[0];
				vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
				if (NoneDecLen) {
					maxDec = vDec.length > 5 ? 5 : vDec.length;
				} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
				var rDec = Number("0." + vDec);
				rDec *= Math.pow(10, maxDec);
				rDec = Math.round(Math.abs(rDec));
				rDec /= Math.pow(10, maxDec); // 小数四舍五入
				var aIntDec = rDec.toString().split('.');
				if (Number(aIntDec[0]) == 1) {
					vInt = (Number(vInt) + 1).toString();
				} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
				if (aIntDec.length > 1) {
					vDec = aIntDec[1];
				} else {
					vDec = "";
				}
			} else {
				vInt = dValue;
				vDec = "";
				if (NoneDecLen) {
					maxDec = 0;
				}
			}
			var num = Number(vInt);
			var tag = 0, temp = -1;
			if (vInt.length > 0) {
				for (var i = vInt.length - 1; i >= 0; i--) {
					tag++;
					if (tag == 6) {
						temp = vInt[i];
						break;
					}
				}
			}
			var digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌",
					"玖");
			var index = Number(temp)
			return temp == -1 ? "/" : temp;
		};
		if (input) {
			return chineseNumber(input);
		}
	}
});

/**
 * 取数值中万位上的数值
 */
app.filter('moneyformatWan', function() {
	return function(input) {
		var chineseNumber = function(dValue) {
			var maxDec = 2;
			// 验证输入金额数值或数值字符串：
			dValue = dValue.toString().replace(/,/g, "");
			dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
			if (dValue == "") {
				return "零元整";
			} // （错误：金额为空！）
			else if (isNaN(dValue)) {
				return "错误：金额不是合法的数值！";
			}

			var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
			var parts;
			var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
			if (dValue.length > 1) {
				if (dValue.indexOf('-') == 0) {
					dValue = dValue.replace("-", "");
					minus = "负";
				} // 处理负数符号“-”
				if (dValue.indexOf('+') == 0) {
					dValue = dValue.replace("+", "");
				} // 处理前导正数符号“+”（无实际意义）
			}
			// 变量定义：
			var vInt = "";
			var vDec = ""; // 字符串：金额的整数部分、小数部分
			var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
			// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
			var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null
					|| Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
			parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
			if (parts.length > 1) {
				vInt = parts[0];
				vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
				if (NoneDecLen) {
					maxDec = vDec.length > 5 ? 5 : vDec.length;
				} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
				var rDec = Number("0." + vDec);
				rDec *= Math.pow(10, maxDec);
				rDec = Math.round(Math.abs(rDec));
				rDec /= Math.pow(10, maxDec); // 小数四舍五入
				var aIntDec = rDec.toString().split('.');
				if (Number(aIntDec[0]) == 1) {
					vInt = (Number(vInt) + 1).toString();
				} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
				if (aIntDec.length > 1) {
					vDec = aIntDec[1];
				} else {
					vDec = "";
				}
			} else {
				vInt = dValue;
				vDec = "";
				if (NoneDecLen) {
					maxDec = 0;
				}
			}
			if (vInt.length > 44) {
				return "错误：金额值太大了！整数位长【" + vInt.length.toString()
						+ "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
			}
			var num = Number(vInt);
			var tag = 0, temp = -1;
			if (vInt.length > 0) {
				for (var i = vInt.length - 1; i >= 0; i--) {
					tag++;
					if (tag == 5) {
						temp = vInt[i];
						break;
					}
				}
			}
			var digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌",
					"玖");
			var index = Number(temp)
			return temp == -1 ? "/" : temp;
		};
		if (input) {
			return chineseNumber(input);
		}
	}
});

/**
 * 取数值中千位上的数字
 */
app.filter('moneyformatThousand', function() {
	return function(input) {
		var chineseNumber = function(dValue) {
			var maxDec = 2;
			// 验证输入金额数值或数值字符串：
			dValue = dValue.toString().replace(/,/g, "");
			dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
			if (dValue == "") {
				return "零元整";
			} // （错误：金额为空！）
			else if (isNaN(dValue)) {
				return "错误：金额不是合法的数值！";
			}
			var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
			var parts;
			var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
			if (dValue.length > 1) {
				if (dValue.indexOf('-') == 0) {
					dValue = dValue.replace("-", "");
					minus = "负";
				} // 处理负数符号“-”
				if (dValue.indexOf('+') == 0) {
					dValue = dValue.replace("+", "");
				} // 处理前导正数符号“+”（无实际意义）
			}
			// 变量定义：
			var vInt = "";
			var vDec = ""; // 字符串：金额的整数部分、小数部分
			var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
			// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
			var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null
					|| Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
			parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
			if (parts.length > 1) {
				vInt = parts[0];
				vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
				if (NoneDecLen) {
					maxDec = vDec.length > 5 ? 5 : vDec.length;
				} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
				var rDec = Number("0." + vDec);
				rDec *= Math.pow(10, maxDec);
				rDec = Math.round(Math.abs(rDec));
				rDec /= Math.pow(10, maxDec); // 小数四舍五入
				var aIntDec = rDec.toString().split('.');
				if (Number(aIntDec[0]) == 1) {
					vInt = (Number(vInt) + 1).toString();
				} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
				if (aIntDec.length > 1) {
					vDec = aIntDec[1];
				} else {
					vDec = "";
				}
			} else {
				vInt = dValue;
				vDec = "";
				if (NoneDecLen) {
					maxDec = 0;
				}
			}
			if (vInt.length > 44) {
				return "错误：金额值太大了！整数位长【" + vInt.length.toString()
						+ "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
			}
			var num = Number(vInt);
			var tag = 0, temp = -1;
			if (vInt.length > 0) {
				for (var i = vInt.length - 1; i >= 0; i--) {
					tag++;
					if (tag == 4) {
						temp = vInt[i];
						break;
					}
				}
			}
			var digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌",
					"玖");
			var index = Number(temp)
			return temp == -1 ? "/" : temp;
		};
		if (input) {
			return chineseNumber(input);
		}
	}
});

/**
 * 取数值中百位上的数字
 */
app.filter('moneyformatHundred', function() {
	return function(input) {
		var chineseNumber = function(dValue) {
			var maxDec = 2;
			// 验证输入金额数值或数值字符串：
			dValue = dValue.toString().replace(/,/g, "");
			dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
			if (dValue == "") {
				return "零元整";
			} // （错误：金额为空！）
			else if (isNaN(dValue)) {
				return "错误：金额不是合法的数值！";
			}
			var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
			var parts;
			var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
			if (dValue.length > 1) {
				if (dValue.indexOf('-') == 0) {
					dValue = dValue.replace("-", "");
					minus = "负";
				} // 处理负数符号“-”
				if (dValue.indexOf('+') == 0) {
					dValue = dValue.replace("+", "");
				} // 处理前导正数符号“+”（无实际意义）
			}
			// 变量定义：
			var vInt = "";
			var vDec = ""; // 字符串：金额的整数部分、小数部分
			var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
			// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
			var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null
					|| Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
			parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
			if (parts.length > 1) {
				vInt = parts[0];
				vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
				if (NoneDecLen) {
					maxDec = vDec.length > 5 ? 5 : vDec.length;
				} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
				var rDec = Number("0." + vDec);
				rDec *= Math.pow(10, maxDec);
				rDec = Math.round(Math.abs(rDec));
				rDec /= Math.pow(10, maxDec); // 小数四舍五入
				var aIntDec = rDec.toString().split('.');
				if (Number(aIntDec[0]) == 1) {
					vInt = (Number(vInt) + 1).toString();
				} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
				if (aIntDec.length > 1) {
					vDec = aIntDec[1];
				} else {
					vDec = "";
				}
			} else {
				vInt = dValue;
				vDec = "";
				if (NoneDecLen) {
					maxDec = 0;
				}
			}
			if (vInt.length > 44) {
				return "错误：金额值太大了！整数位长【" + vInt.length.toString()
						+ "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
			}
			var digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌",
					"玖");
			var num = Number(vInt);
			var tag = 0, temp = -1;
			if (vInt.length > 0) {
				for (var i = vInt.length - 1; i >= 0; i--) {
					tag++;
					if (tag == 3) {
						temp = vInt[i];
						break;
					}
				}
			}
			var index = Number(temp)
			return temp == -1 ? "/" : temp;
		};
		if (input) {
			return chineseNumber(input);
		}
	}
});

/**
 * 取数值中十位上的数字
 */
app.filter('moneyformatShi', function() {
	return function(input) {
		var chineseNumber = function(dValue) {
			var maxDec = 2;
			// 验证输入金额数值或数值字符串：
			dValue = dValue.toString().replace(/,/g, "");
			dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
			if (dValue == "") {
				return "零元整";
			} // （错误：金额为空！）
			else if (isNaN(dValue)) {
				return "错误：金额不是合法的数值！";
			}
			var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
			var parts;
			var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
			if (dValue.length > 1) {
				if (dValue.indexOf('-') == 0) {
					dValue = dValue.replace("-", "");
					minus = "负";
				} // 处理负数符号“-”
				if (dValue.indexOf('+') == 0) {
					dValue = dValue.replace("+", "");
				} // 处理前导正数符号“+”（无实际意义）
			}
			// 变量定义：
			var vInt = "";
			var vDec = ""; // 字符串：金额的整数部分、小数部分
			var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
			// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
			var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null
					|| Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
			parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
			if (parts.length > 1) {
				vInt = parts[0];
				vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
				if (NoneDecLen) {
					maxDec = vDec.length > 5 ? 5 : vDec.length;
				} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
				var rDec = Number("0." + vDec);
				rDec *= Math.pow(10, maxDec);
				rDec = Math.round(Math.abs(rDec));
				rDec /= Math.pow(10, maxDec); // 小数四舍五入
				var aIntDec = rDec.toString().split('.');
				if (Number(aIntDec[0]) == 1) {
					vInt = (Number(vInt) + 1).toString();
				} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
				if (aIntDec.length > 1) {
					vDec = aIntDec[1];
				} else {
					vDec = "";
				}
			} else {
				vInt = dValue;
				vDec = "";
				if (NoneDecLen) {
					maxDec = 0;
				}
			}
			if (vInt.length > 44) {
				return "错误：金额值太大了！整数位长【" + vInt.length.toString()
						+ "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
			}
			var digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌",
					"玖");
			var num = Number(vInt);
			var tag = 0, temp = -1;
			if (vInt.length > 0) {
				for (var i = vInt.length - 1; i >= 0; i--) {
					tag++;
					if (tag == 2) {
						temp = vInt[i];
						break;
					}
				}
			}
			var index = Number(temp)
			return temp == -1 ? "/" : temp;
		};
		if (input) {
			return chineseNumber(input);
		}
	}
});

/**
 * 取数值中个位上的数字
 */
app.filter('moneyformatYuan', function() {
	return function(input) {
		var chineseNumber = function(dValue) {
			var maxDec = 2;
			// 验证输入金额数值或数值字符串：
			dValue = dValue.toString().replace(/,/g, "");
			dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
			if (dValue == "") {
				return "零元整";
			} // （错误：金额为空！）
			else if (isNaN(dValue)) {
				return "错误：金额不是合法的数值！";
			}
			var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
			var parts;
			var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
			if (dValue.length > 1) {
				if (dValue.indexOf('-') == 0) {
					dValue = dValue.replace("-", "");
					minus = "负";
				} // 处理负数符号“-”
				if (dValue.indexOf('+') == 0) {
					dValue = dValue.replace("+", "");
				} // 处理前导正数符号“+”（无实际意义）
			}
			// 变量定义：
			var vInt = "";
			var vDec = ""; // 字符串：金额的整数部分、小数部分
			var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
			// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
			var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null
					|| Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
			parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
			if (parts.length > 1) {
				vInt = parts[0];
				vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
				if (NoneDecLen) {
					maxDec = vDec.length > 5 ? 5 : vDec.length;
				} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
				var rDec = Number("0." + vDec);
				rDec *= Math.pow(10, maxDec);
				rDec = Math.round(Math.abs(rDec));
				rDec /= Math.pow(10, maxDec); // 小数四舍五入
				var aIntDec = rDec.toString().split('.');
				if (Number(aIntDec[0]) == 1) {
					vInt = (Number(vInt) + 1).toString();
				} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
				if (aIntDec.length > 1) {
					vDec = aIntDec[1];
				} else {
					vDec = "";
				}
			} else {
				vInt = dValue;
				vDec = "";
				if (NoneDecLen) {
					maxDec = 0;
				}
			}
			if (vInt.length > 44) {
				return "错误：金额值太大了！整数位长【" + vInt.length.toString()
						+ "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
			}
			var digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌",
					"玖");
			var num = Number(vInt);
			var tag = 0, temp = -1;
			if (vInt.length > 0) {
				for (var i = vInt.length - 1; i >= 0; i--) {
					tag++;
					if (tag == 1) {
						temp = vInt[i];
						break;
					}
				}
			}
			var index = Number(temp)
			return temp == -1 ? "/" : temp;
		};
		if (input) {
			return chineseNumber(input);
		}
	}
});

/**
 * 获取小数后的角
 */
app.filter('moneyformatJiao', function() {
	return function(input) {
		var chineseNumber = function(dValue) {
			var maxDec = 2;
			// 验证输入金额数值或数值字符串：
			dValue = dValue.toString().replace(/,/g, "");
			dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
			if (dValue == "") {
				return "零元整";
			} // （错误：金额为空！）
			else if (isNaN(dValue)) {
				return "错误：金额不是合法的数值！";
			}
			var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
			var parts;
			var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
			if (dValue.length > 1) {
				if (dValue.indexOf('-') == 0) {
					dValue = dValue.replace("-", "");
					minus = "负";
				} // 处理负数符号“-”
				if (dValue.indexOf('+') == 0) {
					dValue = dValue.replace("+", "");
				} // 处理前导正数符号“+”（无实际意义）
			}
			// 变量定义：
			var vInt = "";
			var vDec = ""; // 字符串：金额的整数部分、小数部分
			var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
			// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
			var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null
					|| Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
			parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
			if (parts.length > 1) {
				vInt = parts[0];
				vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
				if (NoneDecLen) {
					maxDec = vDec.length > 5 ? 5 : vDec.length;
				} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
				var rDec = Number("0." + vDec);
				rDec *= Math.pow(10, maxDec);
				rDec = Math.round(Math.abs(rDec));
				rDec /= Math.pow(10, maxDec); // 小数四舍五入
				var aIntDec = rDec.toString().split('.');
				if (Number(aIntDec[0]) == 1) {
					vInt = (Number(vInt) + 1).toString();
				} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
				if (aIntDec.length > 1) {
					vDec = aIntDec[1];
				} else {
					vDec = "";
				}
			} else {
				vInt = dValue;
				vDec = "";
				if (NoneDecLen) {
					maxDec = 0;
				}
			}
			if (vInt.length > 44) {
				return "错误：金额值太大了！整数位长【" + vInt.length.toString()
						+ "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
			}
			var digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌",
					"玖");
			var num = vDec.substr(0, 1);
			var index;
			if (num == "") {
				index = 0;
			} else {
				index = Number(num);
			}
			return index;
		};
		if (input) {
			return chineseNumber(input);
		}
	}
});

/**
 * 获取小数后的分
 */
app.filter('moneyformatFen', function() {
	return function(input) {
		var chineseNumber = function(dValue) {
			var maxDec = 2;
			// 验证输入金额数值或数值字符串：
			dValue = dValue.toString().replace(/,/g, "");
			dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
			if (dValue == "") {
				return "零元整";
			} // （错误：金额为空！）
			else if (isNaN(dValue)) {
				return "错误：金额不是合法的数值！";
			}
			var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
			var parts;
			var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
			if (dValue.length > 1) {
				if (dValue.indexOf('-') == 0) {
					dValue = dValue.replace("-", "");
					minus = "负";
				} // 处理负数符号“-”
				if (dValue.indexOf('+') == 0) {
					dValue = dValue.replace("+", "");
				} // 处理前导正数符号“+”（无实际意义）
			}
			// 变量定义：
			var vInt = "";
			var vDec = ""; // 字符串：金额的整数部分、小数部分
			var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
			// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
			var NoneDecLen = (typeof (maxDec) == "undefined" || maxDec == null
					|| Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
			parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
			if (parts.length > 1) {
				vInt = parts[0];
				vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
				if (NoneDecLen) {
					maxDec = vDec.length > 5 ? 5 : vDec.length;
				} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
				var rDec = Number("0." + vDec);
				rDec *= Math.pow(10, maxDec);
				rDec = Math.round(Math.abs(rDec));
				rDec /= Math.pow(10, maxDec); // 小数四舍五入
				var aIntDec = rDec.toString().split('.');
				if (Number(aIntDec[0]) == 1) {
					vInt = (Number(vInt) + 1).toString();
				} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
				if (aIntDec.length > 1) {
					vDec = aIntDec[1];
				} else {
					vDec = "";
				}
			} else {
				vInt = dValue;
				vDec = "";
				if (NoneDecLen) {
					maxDec = 0;
				}
			}
			if (vInt.length > 44) {
				return "错误：金额值太大了！整数位长【" + vInt.length.toString()
						+ "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
			}
			var digits = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌",
					"玖");
			var num = vDec.substr(1, 2);
			var index;
			if (num == "") {
				index = 0;
			} else {
				index = Number(num);
			}
			return index;
		};
		if (input) {
			return chineseNumber(input);
		}
	}
});

/**
 * 借款金额：人民币大写
 */
app.filter('moneyformatChinese',function() {
		return function(input) {
			var chineseNumber = function(dValue) {
				var maxDec = 2;
				// 验证输入金额数值或数值字符串：
				dValue = dValue.toString().replace(/,/g, "");
				dValue = dValue.replace(/^0+/, ""); // 金额数值转字符、移除逗号、移除前导零
				if (dValue == "") {
					return "零元整";
				} // （错误：金额为空！）
				else if (isNaN(dValue)) {
					return "错误：金额不是合法的数值！";
				}

				var minus = ""; // 负数的符号“-”的大写：“负”字。可自定义字符，如“（负）”。
				var CN_SYMBOL = ""; // 币种名称（如“人民币”，默认空）
				if (dValue.length > 1) {
					if (dValue.indexOf('-') == 0) {
						dValue = dValue.replace("-", "");
						minus = "负";
					} // 处理负数符号“-”
					if (dValue.indexOf('+') == 0) {
						dValue = dValue.replace("+", "");
					} // 处理前导正数符号“+”（无实际意义）
				}
				// 变量定义：
				var vInt = "";
				var vDec = ""; // 字符串：金额的整数部分、小数部分
				var resAIW; // 字符串：要输出的结果
				var parts; // 数组（整数部分.小数部分），length=1时则仅为整数。
				var digits, radices, bigRadices, decimals; // 数组：数字（0~9——零~玖）；基（十进制记数系统中每个数字位的基是10——拾,佰,仟）；大基（万,亿,兆,京,垓,杼,穰,沟,涧,正）；辅币（元以下，角/分/厘/毫/丝）。
				var zeroCount; // 零计数
				var i, p, d; // 循环因子；前一位数字；当前位数字。
				var quotient, modulus; // 整数部分计算用：商数、模数。
				// 金额数值转换为字符，分割整数部分和小数部分：整数、小数分开来搞（小数部分有可能四舍五入后对整数部分有进位）。
				var NoneDecLen = (typeof (maxDec) == "undefined"
						|| maxDec == null || Number(maxDec) < 0 || Number(maxDec) > 5); // 是否未指定有效小数位（true/false）
				parts = dValue.split('.'); // 数组赋值：（整数部分.小数部分），Array的length=1则仅为整数。
				if (parts.length > 1) {
					vInt = parts[0];
					vDec = parts[1]; // 变量赋值：金额的整数部分、小数部分
					if (NoneDecLen) {
						maxDec = vDec.length > 5 ? 5 : vDec.length;
					} // 未指定有效小数位参数值时，自动取实际小数位长但不超5。
					var rDec = Number("0." + vDec);
					rDec *= Math.pow(10, maxDec);
					rDec = Math.round(Math.abs(rDec));
					rDec /= Math.pow(10, maxDec); // 小数四舍五入
					var aIntDec = rDec.toString().split('.');
					if (Number(aIntDec[0]) == 1) {
						vInt = (Number(vInt) + 1).toString();
					} // 小数部分四舍五入后有可能向整数部分的个位进位（值1）
					if (aIntDec.length > 1) {
						vDec = aIntDec[1];
					} else {
						vDec = "";
					}
				} else {
					vInt = dValue;
					vDec = "";
					if (NoneDecLen) {
						maxDec = 0;
					}
				}
				if (vInt.length > 44) {
					return "错误：金额值太大了！整数位长【"
							+ vInt.length.toString()
							+ "】超过了上限——44位/千正/10^43（注：1正=1万涧=1亿亿亿亿亿，10^40）！";
				}
				// 准备各字符数组 Prepare the characters corresponding to
				// the digits:
				digits = new Array("零", "壹", "贰", "叁", "肆", "伍",
						"陆", "柒", "捌", "玖"); // 零~玖
				radices = new Array("", "拾", "佰", "仟"); // 拾,佰,仟
				bigRadices = new Array("", "万", "亿", "兆", "京", "垓",
						"杼", "穰", "沟", "涧", "正"); // 万,亿,兆,京,垓,杼,穰,沟,涧,正
				decimals = new Array("角", "分", "厘", "毫", "丝"); // 角/分/厘/毫/丝
				resAIW = ""; // 开始处理
				// 处理整数部分（如果有）
				if (Number(vInt) > 0) {
					zeroCount = 0;
					for (i = 0; i < vInt.length; i++) {
						p = vInt.length - i - 1;
						d = vInt.substr(i, 1);
						quotient = p / 4;
						modulus = p % 4;
						if (d == "0") {
							zeroCount++;
						} else {
							if (zeroCount > 0) {
								resAIW += digits[0];
							}
							zeroCount = 0;
							resAIW += digits[Number(d)]
									+ radices[modulus];
						}
						if (modulus == 0 && zeroCount < 4) {
							resAIW += bigRadices[quotient];
						}
					}
					resAIW += "元";
				}
				// 处理小数部分（如果有）
				for (i = 0; i < vDec.length; i++) {
					d = vDec.substr(i, 1);
					if (d != "0") {
						resAIW += digits[Number(d)] + decimals[i];
					}
				}
				// 处理结果
				if (resAIW == "") {
					resAIW = "零" + "元";
				} // 零元
				if (vDec == "") {
					resAIW += "整";
				} // ....元整
				resAIW = CN_SYMBOL + minus + resAIW; // 人民币/负......元角分/整
				return resAIW;
			};
			if (input) {
				return chineseNumber(input);
			}
		}
	});
/*
 * 绝对值处理
 */
app.filter('MathAbsFilter', function() {
	return function(value) {
		return Math.abs(value);
	}
});
/*
 * 数值百分话  0.005 =》 5
 */
app.filter('MathDifferFilter', function() {
	return function(value) {
		return Math.floor(value * 10000) / 100;
	}
});
/*金额千分位*/
app.filter('thousandsFilter', function() {
	return function(value) {
		if (null == value || value == '') {
			return '0.00';
		}
		var reg = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
		return Number(value).toFixed(2).toString().replace(reg, "$1,");
	}
});
/*时间戳转化为年月日*/
app.filter('DateFilter', function() {
	return function(value) {
		if (null == value || value == '') {
			return '';
		}
		var d = new Date(value);
		return d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate()+'日'
	}
});
/*时间戳转化为年月日 2014/12/04*/
app.filter('DateSlashFilter', function() {
	return function(value) {
		if (null == value || value == '') {
			return '';
		}
		var d = new Date(value);
		return d.getFullYear() + '/' + (d.getMonth()+1) + '/' + (d.getDate()<10?'0'+d.getDate():d.getDate())
	}
});
/*
 * 显示银行卡号后四位
 */
app.filter('lastFour', function() {
	return function(value) {
		if(value == '' || value == null){
	        return ''
	    }
	    return value.slice(-4)
	}
});