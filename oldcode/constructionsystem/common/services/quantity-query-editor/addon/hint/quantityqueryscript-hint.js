/**
 * Created by jim on 3/16/2017.
 */

/* global CodeMirror,require,define,exports */
/* jshint -W038 */
/* jshint -W117 */
/* jshint -W073 */
/* jshint -W071 */
/* jshint -W074 */
(function (mod) {
	'use strict';
	if (typeof exports === 'object' && typeof module === 'object') {
		mod(require('../../lib/codemirror'));
	} // CommonJS
	else if (typeof define === 'function' && define.amd) {
		define(['../../lib/codemirror'], mod);
	} // AMD
	else {
		mod(CodeMirror);
	} // Plain browser env

})(function (CodeMirror) {
	'use strict';

	var pos = CodeMirror.Pos;
	var tokenType = null;

	var parameterTypeKeyMapExtKey = null;
	var parameterValueKeyMapExtKey = null;
	var functionObjectsArray = [];
	// eslint-disable-next-line no-unused-vars
	var uomArray = [];
	var functionNamesArray= [];

	var constraintedParameterObjectArray = [];
	var getLastTokenFunction = null;
	var getCurrentFunctionNameFunction = null;
	var getParameterObjectArrayByFunctionNameFunction = null;
	var getConstraintedParameterObjectArrayFunction = null;
	var getExtKeyOfParameterNameFromKeyFunction = null;
	var getExtKeyOfParameterValueFromKeyFunction = null;
	var getParameterValuesByFunctionNameAndParameterNameFunction = null;
	var getStyle = null;
	var arrayContains = null;
	var dataType = null;
	var languageCode = null;

	var typeFlagEnum = {
		functionName: 'functionName',
		parameterName: 'parameterName',
		parameterValue_Type: 'parameterValue_Type',
		parameterValue_QNorm: 'parameterValue_QNorm',
		parameterValue_Non_Type: 'parameterValue_Non_Type',
		operator: 'operator'
	};

	function getNextToken(editor, currentToken) {
		var doc = editor.getDoc();
		var lineContent = doc.getLine(0);
		var contentLength = lineContent.length;
		var nextToken = null;

		var nextPos = {ch: currentToken.end + 1, line: currentToken.lineNo};
		if (nextPos.ch <= contentLength) {
			nextToken = editor.getTokenAt(nextPos);
			nextToken.lineNo = currentToken.lineNo;
		}

		return nextToken;
	}

	function getQTODefaultTypesOjbectArray(functionObjectsArray) {
		var qtoDefaultTypesObjectArray = null;
		if (functionObjectsArray && (functionObjectsArray instanceof Array)) {
			for (var i = 0; i < functionObjectsArray.length; i++) {
				if (functionObjectsArray[i].functionName === 'QTO' && (!!functionObjectsArray[i].defaultTypesObjectArray)) {
					qtoDefaultTypesObjectArray = functionObjectsArray[i].defaultTypesObjectArray;
					break;
				}
			}
		}
		return qtoDefaultTypesObjectArray;
	}

	function getQTODefaultUoMsOjbjectArray(functionObjectsArray) {
		var qtoDefaultUoMsObjectArray = null;
		if (functionObjectsArray && (functionObjectsArray instanceof Array)) {
			for (var i = 0; i < functionObjectsArray.length; i++) {
				if (functionObjectsArray[i].functionName === 'QTO' && (!!functionObjectsArray[i].defaultUoMsObjectArray)) {
					qtoDefaultUoMsObjectArray = functionObjectsArray[i].defaultUoMsObjectArray;
					break;
				}
			}
		}
		return qtoDefaultUoMsObjectArray;
	}

	function comparteTwoDataItem(a, b) {
		if (a.text < b.text) {
			return -1;
		} else if (a.text === b.text) {
			return 0;
		} else {
			return 1;
		}
	}

	function scriptHint(editor, getToken, options) {
		var cur = editor.getCursor(), currentToken = getToken(editor, cur);
		var lastToken = null, nextToken = null;
		currentToken.lineNo = cur.line;
		var end = cur.ch, start = end;

		if (currentToken.type === getStyle(tokenType.string)) {
			start = currentToken.start;
			end = start + currentToken.string.length;
		} else if (currentToken.type === getStyle(tokenType.parameterName)) {
			start = currentToken.end;
			end = start;
		} else if (currentToken.type === getStyle(tokenType.parameterValue)) {
			start = currentToken.end;
			end = start;
		} else {
			start = currentToken.start + 1;
			end = start;
		}

		lastToken = getLastTokenFunction(editor, currentToken);
		nextToken = getNextToken(editor, currentToken);

		currentToken.state = CodeMirror.innerMode(editor.getMode(), currentToken.state).state;
		currentToken.lastToken = lastToken;
		currentToken.nextToken = nextToken;

		var dataList = getCompletions(editor, currentToken, options);
		if ((!!dataList) && (dataList instanceof Array)) {
			if (dataType !== typeFlagEnum.parameterValue_QNorm) {
				dataList.sort(comparteTwoDataItem);
			}
		}

		return {
			list: dataList,
			from: pos(cur.line, start),
			to: pos(cur.line, end),
			dataType: dataType,
			languageCode: languageCode,
			qtoDefaultTypesObjectArray: getQTODefaultTypesOjbectArray(functionObjectsArray),
			qtoDefaultUoMsObjectArray: getQTODefaultUoMsOjbjectArray(functionObjectsArray)
		};
	}

	function filterscriptHint(editor, options) {
		tokenType = editor.options.tokenType;
		getLastTokenFunction = editor.options.getLastToken;
		getCurrentFunctionNameFunction = editor.options.getCurrentFunctionName;
		languageCode = editor.options.languageCode;
		parameterTypeKeyMapExtKey = editor.options.parameterTypeKeyMapExtKey;
		parameterValueKeyMapExtKey = editor.options.parameterValueKeyMapExtKey;

		getParameterObjectArrayByFunctionNameFunction = CodeMirror.quantityQueryEditor.getParameterObjectArrayByFunctionName;

		getConstraintedParameterObjectArrayFunction = CodeMirror.quantityQueryEditor.getConstraintedParameterObjectArray;
		getExtKeyOfParameterNameFromKeyFunction = CodeMirror.quantityQueryEditor.getExtKeyOfParameterNameFromKey;
		getExtKeyOfParameterValueFromKeyFunction = CodeMirror.quantityQueryEditor.getExtKeyOfParameterValueFromKey;
		getParameterValuesByFunctionNameAndParameterNameFunction = CodeMirror.quantityQueryEditor.getParameterValuesByFunctionNameAndParameterName;

		functionObjectsArray = editor.options.functionsArray;
		uomArray = editor.options.uomArray;
		getStyle = editor.options.getStyle;
		arrayContains = editor.options.arrayContains;


		if (functionObjectsArray) {
			for (var i = 0; i < functionObjectsArray.length; i++) {
				if (!arrayContains(functionNamesArray, functionObjectsArray[i].functionName)) {
					functionNamesArray.push(functionObjectsArray[i].functionName);
				}
			}
		}

		return scriptHint(editor,
			function (e, cur) {
				return e.getTokenAt(cur);
			},
			options);
	}

	CodeMirror.registerHelper('hint', 'quantity-query-script', filterscriptHint);

	function getLastTypeParameterValue(editor, currentToken) {
		var lastTypeParameterValue = null;
		var lastToken = getLastTokenFunction(editor, currentToken);
		while ((lastToken !== null) && (lastToken.string !== '') && (lastToken.string !== '(')) {
			if (lastToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'Type')) {
				lastToken = getNextToken(editor, lastToken);
				if (lastToken.type === getStyle(tokenType.assignOperator)) {
					lastToken = getNextToken(editor, lastToken);
					if (lastToken.type === getStyle(tokenType.startParameterValueQuoto)) {
						lastToken = getNextToken(editor, lastToken);
						if (lastToken.type === getStyle(tokenType.parameterValue)) {
							lastTypeParameterValue = lastToken.string;
						}
					}
				}
				break;
			}
			lastToken = getLastTokenFunction(editor, lastToken);
		}
		return lastTypeParameterValue;
	}

	function getNextTypeParameterValue(editor, currentToken) {
		var nextTypeParameterValue = null;
		var nextToken = getNextToken(editor, currentToken);
		while ((nextToken !== null) && (nextToken.string !== '') && (nextToken.string !== ')')) {
			if (nextToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'Type')) {
				nextToken = getNextToken(editor, nextToken);
				if (nextToken.type === getStyle(tokenType.assignOperator)) {
					nextToken = getNextToken(editor, nextToken);
					if (nextToken.type === getStyle(tokenType.startParameterValueQuoto)) {
						nextToken = getNextToken(editor, nextToken);
						if (nextToken.type === getStyle(tokenType.parameterValue)) {
							nextTypeParameterValue = nextToken.string;
						}
					}
				}
				break;
			}
			nextToken = getNextToken(editor, nextToken);
		}
		return nextTypeParameterValue;
	}

	function checkParameterValueType(functionObjectsArray, functionName, parameterName, parameterValue) {
		var paramValueType = null;
		if (functionObjectsArray && (functionObjectsArray instanceof Array) && functionName && parameterName && parameterValue) {
			for (var i = 0; i < functionObjectsArray.length; i++) {
				if (functionObjectsArray[i].functionName === functionName) {
					var parametersArray = functionObjectsArray[i].ParametersArray;
					if (parametersArray && (parametersArray instanceof Array)) {
						for (var j = 0; j < parametersArray.length; j++) {
							if (parametersArray[j].parameterName === parameterName) {
								var parameterValuesArray = parametersArray[j].parameterValuesArray;
								if (parameterValuesArray && (parameterValuesArray instanceof Array)) {
									for (var k = 0; k < parameterValuesArray.length; k++) {
										if (parameterValuesArray[k].parameterValueExtKey === parameterValue &&
												(!!parameterValuesArray[k].parameterValuePType)) {
											paramValueType = parameterValuesArray[k].parameterValuePType;
											break;
										}
									}
								}
								break;
							}
						}
					}
					break;
				}
			}
		}
		return paramValueType;
	}

	function checkParameterValueDimForTypeParameter(functionObjectsArray, functionName, parameterValue) {
		var dim = null;
		if (functionObjectsArray && (functionObjectsArray instanceof Array) && functionName && parameterValue) {
			for (var i = 0; i < functionObjectsArray.length; i++) {
				if (functionObjectsArray[i].functionName === functionName) {
					var parametersArray = functionObjectsArray[i].ParametersArray;
					if (parametersArray && (parametersArray instanceof Array)) {
						for (var j = 0; j < parametersArray.length; j++) {
							if (parametersArray[j].parameterName === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'Type')) {
								var parameterValuesArray = parametersArray[j].parameterValuesArray;
								if (parameterValuesArray && (parameterValuesArray instanceof Array)) {
									for (var k = 0; k < parameterValuesArray.length; k++) {
										if (parameterValuesArray[k].parameterValueExtKey === parameterValue) {
											var connectionsForTypeNode = parameterValuesArray[k].connectionsForTypeNode;
											if ((!!connectionsForTypeNode) && (!!connectionsForTypeNode.Dim)) {
												dim = connectionsForTypeNode.Dim;
											}
											break;
										}
									}
								}
								break;
							}
						}
					}
					break;
				}
			}
		}
		return dim;
	}

	function getDefaultUoMsByFunctionName(functionObjectsArray, functionName) {
		var defaultUoMObjectArray = null;
		if (functionObjectsArray && (functionObjectsArray instanceof Array) && functionName) {
			for (var i = 0; i < functionObjectsArray.length; i++) {
				if (functionObjectsArray[i].functionName === functionName) {
					defaultUoMObjectArray = functionObjectsArray[i].defaultUoMs;
				}
			}
		}
		return defaultUoMObjectArray;
	}

	function hasUoMParameter(editor, currentToken) {
		var hasUoM = false;
		if (currentToken) {
			if (currentToken.type === getStyle(tokenType.parameterName) && currentToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'UoM')) {
				hasUoM = true;
			} else {
				var lastToken = getLastTokenFunction(editor, currentToken);
				while ((!!lastToken) && (lastToken.string !== '(')) {
					if (lastToken.type === getStyle(tokenType.parameterName) && lastToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'UoM')) {
						hasUoM = true;
						break;
					}
					lastToken = getLastTokenFunction(editor, lastToken);
				}
				if (hasUoM === false) {
					var nextToken = getNextToken(editor, currentToken);
					while ((!!nextToken) && (nextToken.string !== ')')) {
						if (nextToken.type === getStyle(tokenType.parameterName) && nextToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'UoM')) {
							hasUoM = true;
							break;
						}
						nextToken = getNextToken(editor, nextToken);
					}
				}
			}
		}
		return hasUoM;
	}


	function getHRefConnectionPropsArray(functionObjectsArray, functionName, parameterValue, operator) {
		var hrefConnectionPropsArray = [];
		if (functionObjectsArray && (functionObjectsArray instanceof Array) && functionName &&
				parameterValue && operator) {
			for (var i = 0; i < functionObjectsArray.length; i++) {
				if (functionObjectsArray[i].functionName === functionName) {
					var parametersArray = functionObjectsArray[i].ParametersArray;
					if (parametersArray && (parametersArray instanceof Array)) {
						for (var j = 0; j < parametersArray.length; j++) {
							if (parametersArray[j].parameterName === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'HRef')) {
								var parameterValuesArray = parametersArray[j].parameterValuesArray;
								if (parameterValuesArray && (parameterValuesArray instanceof Array)) {
									for (var k = 0; k < parameterValuesArray.length; k++) {
										if (parameterValuesArray[k].parameterValueExtKey === parameterValue) {
											var connectionsForHRefNode = parameterValuesArray[k].connectionsForHRefNode;
											if ((!!connectionsForHRefNode) && (!!connectionsForHRefNode.Operator) &&
													(connectionsForHRefNode.Operator === operator) && (!!connectionsForHRefNode.ConnectionPropList)) {
												var connectionPropList = connectionsForHRefNode.ConnectionPropList;
												if ((!!connectionPropList) && (connectionPropList instanceof Array)) {
													for (var m = 0; m < connectionPropList.length; m++) {
														var key = connectionPropList[m];
														var extKey = getExtKeyOfParameterValueFromKeyFunction(parameterValueKeyMapExtKey, key);
														if (!arrayContains(hrefConnectionPropsArray, extKey)) {
															hrefConnectionPropsArray.push(extKey);
														}
													}
												}
											}
											break;
										}
									}
								}
								break;
							}
						}
					}
					break;
				}
			}
		}
		return hrefConnectionPropsArray;
	}

	function getCompletions(editor, token) {
		var found = [], startStr = token.string;
		var lastToken = null;
		var lastLastToken = null;
		var lastLastLastToken = null;
		var lastLastLastLastToken = null;

		var typeParamValue = null;
		var functionName = getCurrentFunctionNameFunction(editor, token);
		var charOperatorObjectsArray = getCharOperatorObjectsArray(editor.options.operatorObjectsArray);
		var wordOperatorObjectsArray = getWordOperatorObjectsArray(editor.options.operatorObjectsArray);

		function isCharOperator(operator) {
			var flag = false;
			if ((!charOperatorObjectsArray) || (charOperatorObjectsArray.length === 0)) {
				charOperatorObjectsArray = getCharOperatorObjectsArray(editor.options.operatorObjectsArray);
			}
			if ((!!charOperatorObjectsArray) && (angular.isArray(charOperatorObjectsArray))) {
				for (var i = 0; i < charOperatorObjectsArray.length; i++) {
					if (charOperatorObjectsArray[i].ExtKey === operator) {
						flag = true;
					}
				}
			}
			return flag;
		}

		function isWordOperator(operator) {
			var flag = false;
			if ((!wordOperatorObjectsArray) || (wordOperatorObjectsArray.length === 0)) {
				wordOperatorObjectsArray = getCharOperatorObjectsArray(editor.options.operatorObjectsArray);
			}
			if ((!!wordOperatorObjectsArray) && (angular.isArray(wordOperatorObjectsArray))) {
				for (var i = 0; i < wordOperatorObjectsArray.length; i++) {
					if (wordOperatorObjectsArray[i].ExtKey === operator) {
						flag = true;
					}
				}
			}
			return flag;
		}

		function getCharOperatorObjectsArray(operatorObjectsArray) {
			var returnedArray = [];
			if (operatorObjectsArray) {
				for (var i = 0; i < operatorObjectsArray.length; i++) {
					var key = operatorObjectsArray[i].Key;
					if (key !== '&&' && key !== '||') {
						returnedArray.push(operatorObjectsArray[i]);
					}
				}
			}
			return returnedArray;
		}

		function getWordOperatorObjectsArray(operatorObjectsArray) {
			var returnedArray = [];
			if (operatorObjectsArray) {
				for (var i = 0; i < operatorObjectsArray.length; i++) {
					var key = operatorObjectsArray[i].Key;
					if (key === '&&' || key === '||') {
						returnedArray.push(operatorObjectsArray[i]);
					}
				}
			}
			return returnedArray;
		}

		function getCombindedTextForNormParameterValue(parameterValueObj, allParameterValueObjectsArray) {
			var result = parameterValueObj.parameterValueExtKey;
			if ((!!parameterValueObj) && (!!allParameterValueObjectsArray) && (allParameterValueObjectsArray instanceof Array)) {
				for (var i = 0; i < allParameterValueObjectsArray.length; i++) {
					if (allParameterValueObjectsArray[i].parameterValueKey === parameterValueObj.parentParameterValueKey) {
						result = allParameterValueObjectsArray[i].parameterValueExtKey + '\\' + parameterValueObj.parameterValueExtKey;
						break;
					}
				}
			}
			return result;
		}

		function gatherCompletions(arr, type, typeFlag) {
			dataType = typeFlag;
			if (arr !== null && arr !== undefined) {
				var className = getClassNameByType(type);
				var tempStart = startStr.toUpperCase();

				var tempStr = '';
				var temStr2 = '';
				var i = 0, e = 0;
				if (typeFlag === typeFlagEnum.functionName) {
					for (i = 0, e = arr.length; i < e; ++i) {
						var functionObj = arr[i];
						tempStr = functionObj.functionName.toUpperCase();
						if (tempStr.indexOf(tempStart) === 0 && !arrayContains(found, arr[i])) {
							if (className) {
								found.push({
									text: functionObj.functionName,
									className: className,
									dataItem: functionObj
								});
							} else {
								found.push(functionObj.functionName);
							}
						}
					}
				} else if (typeFlag === typeFlagEnum.parameterName) {
					for (i = 0, e = arr.length; i < e; ++i) {
						var parameterObj = arr[i];
						tempStr = parameterObj.parameterName.toUpperCase();
						if (tempStr.indexOf(tempStart) === 0 && !arrayContains(found, arr[i])) {
							if (className) {
								found.push({
									text: parameterObj.parameterName,
									className: className,
									dataItem: parameterObj
								});
							} else {
								found.push(parameterObj.parameterName);
							}
						}
					}
				} else if (typeFlag === typeFlagEnum.parameterValue_Type || typeFlag === typeFlagEnum.parameterValue_Non_Type ||
						typeFlag === typeFlagEnum.parameterValue_QNorm) {
					for (i = 0, e = arr.length; i < e; ++i) {
						var parameterValueObj = arr[i];
						tempStr = parameterValueObj.parameterValueExtKey.toUpperCase();
						if (parameterValueObj.parameterValueShortKey) {
							temStr2 = parameterValueObj.parameterValueShortKey.toUpperCase();
						}
						if ((tempStr.indexOf(tempStart) === 0 && !arrayContains(found, tempStr)) ||
								(temStr2.indexOf(tempStart) === 0 && !arrayContains(found, temStr2))) {
							if (className) {
								if (typeFlag === typeFlagEnum.parameterValue_QNorm) {
									if (parameterValueObj.parameterValueShortKey) {
										found.push({
											text: parameterValueObj.parameterValueShortKey,
											value: getCombindedTextForNormParameterValue(parameterValueObj, arr),
											className: className,
											dataItem: parameterValueObj
										});
									}
									found.push({
										text: parameterValueObj.parameterValueExtKey,
										value: getCombindedTextForNormParameterValue(parameterValueObj, arr),
										className: className,
										dataItem: parameterValueObj
									});
								} else {
									if (parameterValueObj.parameterValueShortKey) {
										found.push({
											text: parameterValueObj.parameterValueShortKey,
											className: className,
											dataItem: parameterValueObj
										});
									}
									found.push({
										text: parameterValueObj.parameterValueExtKey,
										className: className,
										dataItem: parameterValueObj
									});
								}
							} else {
								if (parameterValueObj.parameterValueShortKey) {
									found.push({
										text: parameterValueObj.parameterValueShortKey,
										dataItem: parameterValueObj
									});
								}
								found.push({
									text: parameterValueObj.parameterValueExtKey,
									dataItem: parameterValueObj
								});
							}
						}
					}
				}
				else if (typeFlag === typeFlagEnum.operator) {
					for (i = 0, e = arr.length; i < e; ++i) {
						var operatorObj = arr[i];
						if (!arrayContains(found, arr[i])) {
							if (className) {
								found.push({
									text: operatorObj.ExtKey,
									className: className,
									dataItem: operatorObj
								});
							} else {
								found.push({
									text: operatorObj.ExtKey,
									dataItem: operatorObj
								});
							}
						}
					}
				}
				else {
					for (i = 0, e = arr.length; i < e; ++i) {
						tempStr = arr[i].toUpperCase();
						if (tempStr.indexOf(tempStart) === 0 && !arrayContains(found, arr[i])) {
							if (className) {
								found.push({text: arr[i], className: className});
							} else {
								found.push(arr[i]);
							}
						}
					}
				}
			}
		}

		function getClassNameByType(type) {
			var tempType = 'unknown';
			if (type === getStyle(tokenType.functionName)) {
				tempType = 'fn';
			}
			else if (type === getStyle(tokenType.parameterName)) {
				tempType = 'object';
			}
			else if (type === getStyle(tokenType.parameterValue)) {
				tempType = 'object';
			}
			else {
				tempType = 'unknown';
			}
			return 'CodeMirror-Tern-completion CodeMirror-Tern-completion-' + tempType;
		}

		function getLastStartParameterValueQuoto(editor, currentToken) {
			var lastToken = getLastTokenFunction(editor, currentToken);
			while ((!!lastToken) && (lastToken.type !== getStyle(tokenType.startParameterValueQuoto))) {
				lastToken = getLastTokenFunction(editor, lastToken);
			}
			return lastToken;
		}

		function shouldAddEndQutoto(editor, currentToken){
			var lastToken=getLastTokenFunction(editor, currentToken);
			if(!!lastToken&&lastToken.type===getStyle(tokenType.startParameterValueQuoto)){
				lastToken=getLastTokenFunction(editor, lastToken);
				if(!!lastToken&&lastToken.type===getStyle(tokenType.assignOperator)){
					lastToken=getLastTokenFunction(editor, lastToken);
					if(!!lastToken&&lastToken.type===getStyle(tokenType.parameterName)){
						var nextToken=getNextToken(editor, currentToken);
						if(!nextToken||nextToken.string===')'||nextToken.type===getStyle(tokenType.parameterValueSeperator)){
							return true;
						}else{
							return false;
						}
					}else{
						return false;
					}
				}else{
					return false;
				}
			}else{
				return false;
			}
		}

		function getCompletionsForStartParameterValueQuoto(editor, token) {
			startStr = '';
			lastToken = getLastTokenFunction(editor, token);
			lastLastToken = null;
			if (lastToken !== null && lastToken !== undefined) {
				lastLastToken = getLastTokenFunction(editor, lastToken);
			}

			var constraintedParameterObject = null;
			var parameterValueObjectsArray = [];
			var currentParameterName = null;
			if (lastLastToken !== null && lastLastToken !== undefined && lastLastToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'Type')) {
				currentParameterName = lastLastToken.string;
				parameterValueObjectsArray = getParameterValuesByFunctionNameAndParameterNameFunction(functionName, currentParameterName);
				gatherCompletions(parameterValueObjectsArray, getStyle(tokenType.parameterValue), typeFlagEnum.parameterValue_Type);
			} else {
				if (functionName !== null) {
					currentParameterName = null;
					typeParamValue = getLastTypeParameterValue(editor, token);
					if (typeParamValue !== null) {
						if (lastLastToken !== null && lastLastToken !== undefined && lastLastToken.type === getStyle(tokenType.parameterName)) {
							currentParameterName = lastLastToken.string;
							constraintedParameterObjectArray = getConstraintedParameterObjectArrayFunction(functionObjectsArray, functionName, typeParamValue);
							for (var i = 0; i < constraintedParameterObjectArray.length; i++) {
								constraintedParameterObject = constraintedParameterObjectArray[i];
								if (constraintedParameterObject.parameterName === currentParameterName) {
									parameterValueObjectsArray = constraintedParameterObject.parameterValuesArray;
									if (lastLastToken !== null &&lastLastToken !== undefined &&  lastLastToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'QNorm')) {
										gatherCompletions(parameterValueObjectsArray, getStyle(tokenType.parameterValue), typeFlagEnum.parameterValue_QNorm);
									} else {
										gatherCompletions(parameterValueObjectsArray, getStyle(tokenType.parameterValue), typeFlagEnum.parameterValue_Non_Type);
									}
									break;
								}
							}
						} else {
							gatherCompletions(null, null, null);
						}
					} else {
						typeParamValue = getNextTypeParameterValue(editor, token);
						if (typeParamValue !== null) {
							if (lastLastToken !== null && lastLastToken !== undefined && lastLastToken.type === getStyle(tokenType.parameterName)) {
								currentParameterName = lastLastToken.string;
								constraintedParameterObjectArray = getConstraintedParameterObjectArrayFunction(functionObjectsArray, functionName, typeParamValue);
								for (var j = 0; j < constraintedParameterObjectArray.length; j++) {
									constraintedParameterObject = constraintedParameterObjectArray[j];
									if (constraintedParameterObject.parameterName === currentParameterName) {
										parameterValueObjectsArray = constraintedParameterObject.parameterValuesArray;
										if (lastLastToken !== null && lastLastToken !== undefined && lastLastToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'QNorm')) {
											gatherCompletions(parameterValueObjectsArray, getStyle(tokenType.parameterValue), typeFlagEnum.parameterValue_QNorm);
										} else {
											gatherCompletions(parameterValueObjectsArray, getStyle(tokenType.parameterValue), typeFlagEnum.parameterValue_Non_Type);
										}
										break;
									}
								}
							} else {
								gatherCompletions(null, null, null);
							}
						} else {
							if (lastLastToken !== null && lastLastToken !== undefined && lastLastToken.type === getStyle(tokenType.parameterName)) {
								currentParameterName = lastLastToken.string;
								parameterValueObjectsArray = getParameterValuesByFunctionNameAndParameterNameFunction(functionName, currentParameterName);
								if (lastLastToken !== null && lastLastToken !== undefined && lastLastToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'QNorm')) {
									gatherCompletions(parameterValueObjectsArray, getStyle(tokenType.parameterValue), typeFlagEnum.parameterValue_QNorm);
								} else {
									gatherCompletions(parameterValueObjectsArray, getStyle(tokenType.parameterValue), typeFlagEnum.parameterValue_Non_Type);
								}
							} else {
								gatherCompletions(null, null, null);
							}
						}
					}
				} else {
					gatherCompletions(null, null, null);
				}
			}
			return parameterValueObjectsArray;
		}


		if (token.type === null || token.type === undefined || token.type === '') {
			if (token.string === '') {
				startStr = '';
				gatherCompletions(null, null, null);
			} else if (token.string === '(') {
				startStr = '';
				if (token.lastToken !== null && token.lastToken !== undefined && token.lastToken.type === getStyle(tokenType.functionName)) {
					typeParamValue = getNextTypeParameterValue(editor, token);
					if (typeParamValue === null) {
						gatherCompletions(getParameterObjectArrayByFunctionNameFunction(token.lastToken.string), getStyle(tokenType.parameterName), typeFlagEnum.parameterName);
					} else {
						constraintedParameterObjectArray = getConstraintedParameterObjectArrayFunction(functionObjectsArray, functionName, typeParamValue);
						gatherCompletions(constraintedParameterObjectArray, getStyle(tokenType.parameterName), typeFlagEnum.parameterName);
					}
				} else {
					startStr = '';
					gatherCompletions(null, null, null);
				}
			} else if (token.string === ' ') {
				startStr = '';
				gatherCompletions(null, null, null);
			} else if (token.string === ':') {
				startStr = '';
				gatherCompletions(['='], null, null);
			} else if (token.string === '>' || token.string === '=' || token.string === '<') {
				startStr = '';
				lastToken = getLastTokenFunction(editor, token);
				if (lastToken !== null && lastToken !== undefined) {
					lastLastToken = getLastTokenFunction(editor, lastToken);
				}
				if (lastLastToken !== null && lastLastToken !== undefined) {
					lastLastLastToken = getLastTokenFunction(editor, lastLastToken);
				}
				if (lastLastLastToken !== null && lastLastLastToken !== undefined) {
					lastLastLastLastToken = getLastTokenFunction(editor, lastLastLastToken);
				}
				if (functionName && lastToken && lastLastToken && lastLastLastToken && lastLastLastLastToken &&
						lastToken.type === getStyle(tokenType.parameterValue) &&
						lastLastToken.type === getStyle(tokenType.startParameterValueQuoto) &&
						lastLastLastToken.type === getStyle(tokenType.assignOperator) &&
						lastLastLastLastToken.type === getStyle(tokenType.parameterName) &&
						lastLastLastLastToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'HRef')) {
					gatherCompletions(getHRefConnectionPropsArray(functionObjectsArray, functionName, lastToken.string, token.string), null, null);
				} else {
					gatherCompletions(null, null, null);
				}
			}
			else {
				startStr = '';
				gatherCompletions(null, null, null);
			}
		} else {
			if (token.type === getStyle(tokenType.functionName)) {
				gatherCompletions(null, null, null);
			} else if (token.type === getStyle(tokenType.parameterName)) {
				startStr = '';
				gatherCompletions([':="'], null, null);
			} else if (token.type === getStyle(tokenType.parameterValue)) {
				startStr = '';
				var shouldAddEndQutotoFlag = true;
				lastToken = getLastTokenFunction(editor, token);
				if (lastToken !== null && lastToken !== undefined) {
					lastLastToken = getLastTokenFunction(editor, lastToken);
				}
				if (lastLastToken !== null && lastLastToken !== undefined) {
					lastLastLastToken = getLastTokenFunction(editor, lastLastToken);
				}
				if (functionName && lastToken && lastLastToken && lastLastLastToken &&
						lastToken.type === getStyle(tokenType.startParameterValueQuoto) &&
						lastLastToken.type === getStyle(tokenType.assignOperator) &&
						lastLastLastToken.type === getStyle(tokenType.parameterName) &&
						lastLastLastToken.string === getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'Type')) {
					var parameterName = lastLastLastToken.string;
					var parameterValue = token.string;
					var parameterValueType = checkParameterValueType(functionObjectsArray, functionName, parameterName, parameterValue);
					if (parameterValueType === 'num') {
						if (hasUoMParameter(editor, token) === false) {
							var defaultUoMsObjectArray = getDefaultUoMsByFunctionName(functionObjectsArray, functionName);
							var dim = checkParameterValueDimForTypeParameter(functionObjectsArray, functionName, parameterValue);
							if ((!!defaultUoMsObjectArray) && (defaultUoMsObjectArray instanceof Array) && (!!dim)) {
								for (var k = 0; k < defaultUoMsObjectArray.length; k++) {
									var uomObj = defaultUoMsObjectArray[k];
									if (uomObj.DIM === dim) {
										var tempStr = '";' + getExtKeyOfParameterNameFromKeyFunction(parameterTypeKeyMapExtKey, 'UoM') + ':="' + uomObj.UoM + '"';
										var arrayToBind = [];
										arrayToBind.push(tempStr);
										gatherCompletions(arrayToBind, null, null);
										shouldAddEndQutotoFlag = false;
										break;
									}
								}
							}
						}
					}
				}
				if(shouldAddEndQutotoFlag === true){
					shouldAddEndQutotoFlag=shouldAddEndQutoto(editor, token);
				}
				if (shouldAddEndQutotoFlag === true) {
					gatherCompletions(['"'], null, null);
				} else {
					gatherCompletions(null, null, null);
				}
			} else if (token.type === getStyle(tokenType.operator)) {
				startStr = '';
				lastToken = getLastTokenFunction(editor, token);
				if ((!!lastToken) && (lastToken.string === ')')) {
					gatherCompletions(functionObjectsArray, getStyle(tokenType.functionName), typeFlagEnum.functionName);
				} else {
					gatherCompletions(null, null, null);
				}
			} else if (token.type === getStyle(tokenType.assignOperator)) {
				gatherCompletions(null, null, null);
			} else if (token.type === getStyle(tokenType.startParameterValueQuoto)) {
				getCompletionsForStartParameterValueQuoto(editor, token);
			} else if (token.type === getStyle(tokenType.parameterValueSeperator)) {
				startStr = '';
				if (functionName !== null) {
					typeParamValue = getLastTypeParameterValue(editor, token);
					if (typeParamValue !== null) {
						constraintedParameterObjectArray = getConstraintedParameterObjectArrayFunction(functionObjectsArray, functionName, typeParamValue);
						gatherCompletions(constraintedParameterObjectArray, getStyle(tokenType.parameterName), typeFlagEnum.parameterName);
					} else {
						typeParamValue = getNextTypeParameterValue(editor, token);
						if (typeParamValue !== null) {
							constraintedParameterObjectArray = getConstraintedParameterObjectArrayFunction(functionObjectsArray, functionName, typeParamValue);
							gatherCompletions(constraintedParameterObjectArray, getStyle(tokenType.parameterName), typeFlagEnum.parameterName);
						} else {
							gatherCompletions(getParameterObjectArrayByFunctionNameFunction(functionName), getStyle(tokenType.parameterName), typeFlagEnum.parameterName);
						}
					}
				} else {
					gatherCompletions(null, null, null);
				}
			} else if (token.type === getStyle(tokenType.number)) {
				gatherCompletions(null, null, null);
			} else if (token.type === getStyle(tokenType.string)) {
				if (token.lastToken.type === null || token.lastToken.type === undefined || token.lastToken.type === '') {
					if (token.lastToken.string === '(') {
						lastToken = getLastTokenFunction(editor, token.lastToken);
						if (lastToken.type === getStyle(tokenType.functionName)) {
							typeParamValue = getNextTypeParameterValue(editor, token);
							if (typeParamValue === null) {
								gatherCompletions(getParameterObjectArrayByFunctionNameFunction(lastToken.string), getStyle(tokenType.parameterName), typeFlagEnum.parameterName);
							} else {
								constraintedParameterObjectArray = getConstraintedParameterObjectArrayFunction(functionObjectsArray, functionName, typeParamValue);
								gatherCompletions(constraintedParameterObjectArray, getStyle(tokenType.parameterName), typeFlagEnum.parameterName);
							}
						} else if (lastToken.string === '(') {
							gatherCompletions(functionObjectsArray, getStyle(tokenType.functionName), typeFlagEnum.functionName);
						}
					} else if (token.lastToken.string === '') {
						gatherCompletions(functionObjectsArray, getStyle(tokenType.functionName), typeFlagEnum.functionName);
					}
				} else if (token.lastToken.type === getStyle(tokenType.operator)) {
					gatherCompletions(functionObjectsArray, getStyle(tokenType.functionName), typeFlagEnum.functionName);
				} else if (token.lastToken.type === getStyle(tokenType.parameterValueSeperator)) {
					if (functionName !== null) {
						typeParamValue = getLastTypeParameterValue(editor, token);
						if (typeParamValue !== null) {
							constraintedParameterObjectArray = getConstraintedParameterObjectArrayFunction(functionObjectsArray, functionName, typeParamValue);
							gatherCompletions(constraintedParameterObjectArray, getStyle(tokenType.parameterName), typeFlagEnum.parameterName);
						} else {
							typeParamValue = getNextTypeParameterValue(editor, token);
							if (typeParamValue !== null) {
								constraintedParameterObjectArray = getConstraintedParameterObjectArrayFunction(functionObjectsArray, functionName, typeParamValue);
								gatherCompletions(constraintedParameterObjectArray, getStyle(tokenType.parameterName), typeFlagEnum.parameterName);
							} else {
								gatherCompletions(getParameterObjectArrayByFunctionNameFunction(functionName), getStyle(tokenType.parameterName), typeFlagEnum.parameterName);
							}
						}
					} else {
						gatherCompletions(null, null, null);
					}
				}
			} else if (token.type === getStyle(tokenType.blankSpace)) {
				var startParameterValueQuotoToken = null;
				lastToken = getLastTokenFunction(editor, token);
				if (lastToken) {
					lastLastToken = getLastTokenFunction(editor, lastToken);
					if (lastLastToken) {
						lastLastLastToken = getLastTokenFunction(editor, lastLastToken);
						if (lastLastLastToken) {
							lastLastLastLastToken = getLastTokenFunction(editor, lastLastLastToken);
							if (lastLastLastLastToken) {
								if (lastToken.type === getStyle(tokenType.number) || lastToken.type === getStyle(tokenType.parameterValue)) {
									if (lastLastToken.type === getStyle(tokenType.startParameterValueQuoto)) {
										if (lastLastLastToken.type === getStyle(tokenType.assignOperator)) {
											if (lastLastLastLastToken.type === getStyle(tokenType.parameterName)) {
												gatherCompletions(charOperatorObjectsArray, getStyle(tokenType.operator), typeFlagEnum.operator);
											}
										}
									} else if (lastLastToken.type === getStyle(tokenType.blankSpace)) {
										if (lastLastLastToken.type === getStyle(tokenType.operator)) {
											if (lastLastLastLastToken.type === getStyle(tokenType.blankSpace)) {
												if (isWordOperator(lastLastLastToken.string)) {
													gatherCompletions(charOperatorObjectsArray, getStyle(tokenType.operator), typeFlagEnum.operator);
												} else if (isCharOperator(lastLastLastToken.string)) {
													gatherCompletions(wordOperatorObjectsArray, getStyle(tokenType.operator), typeFlagEnum.operator);
												}
											}
										}
									}
								} else if (lastToken.type === getStyle(tokenType.operator)) {
									if (isCharOperator(lastToken.string)) {
										if (lastLastToken.type === getStyle(tokenType.blankSpace)) {
											if (lastLastLastToken.type === getStyle(tokenType.number) || lastLastLastToken.type === getStyle(tokenType.parameterValue)) {
												if (lastLastLastLastToken.type === getStyle(tokenType.startParameterValueQuoto) ||
														lastLastLastLastToken.type === getStyle(tokenType.blankSpace)) {
													startParameterValueQuotoToken = getLastStartParameterValueQuoto(editor, token);
													getCompletionsForStartParameterValueQuoto(editor, startParameterValueQuotoToken);
												}
											}
										}
									} else if (isWordOperator(lastToken.string)) {
										if (lastLastToken.type === getStyle(tokenType.blankSpace)) {
											if (lastLastLastToken.type === getStyle(tokenType.number) || lastLastLastToken.type === getStyle(tokenType.parameterValue)) {
												if (lastLastLastLastToken.type === getStyle(tokenType.blankSpace)) {
													startParameterValueQuotoToken = getLastStartParameterValueQuoto(editor, token);
													getCompletionsForStartParameterValueQuoto(editor, startParameterValueQuotoToken);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return found;
	}
}
);
