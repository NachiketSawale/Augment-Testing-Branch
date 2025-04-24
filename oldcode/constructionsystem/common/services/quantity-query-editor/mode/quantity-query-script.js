/**
 * Created by jim on 3/14/2017.
 */

/* global CodeMirror,require,define,exports */
/* jshint -W073 */
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

	var wordRE = /[\w$\xa1-\uffff]/;


	var parameterTypeKeyMapExtKey = null;
	// eslint-disable-next-line no-unused-vars
	var parameterValueKeyMapExtKey = null;

	var operatorExtKeysArray = [];
	// eslint-disable-next-line no-unused-vars
	var operatorObjectsArray=[];
	var functionsArray=[];
	var functionNamesArray=[];
	// eslint-disable-next-line no-unused-vars
	var uomArray = [];

	var operatorCharRegexA = /[+\-*%=<>]+/;
	var operatorCharRegexB = /[a-z]+/i;
	var targetOperatorRegExp = '';
	var targetWordOperatorArray = [];
	var connectionTypeAllowEnum =
	{
		list: 0,
		all: 1,
		none: 2
	};

	var currentFunctionName = null;
	// eslint-disable-next-line no-unused-vars
	var constraintedParameterNamesArray = [];
	var currentParameterNamesArray = [];
	var currentParameterName = null;
	// eslint-disable-next-line no-unused-vars
	var typeParameterValue = null;
	var parameterNamesBefore = [];


	var lastCh = null;

	CodeMirror.defineMode('quantity-query-script', function (options) {

		var tokenType = options.tokenType;
		var getStyle = options.getStyle;
		var arrayContains = options.arrayContains;
		var getExtKeyOfParameterNameFromKey = options.getExtKeyOfParameterNameFromKey;

		function getTargetArray() {
			targetOperatorRegExp = '';
			targetWordOperatorArray = [];
			for (var i = 0; i < operatorExtKeysArray.length; i++) {
				var ope = operatorExtKeysArray[i];
				if (operatorCharRegexA.test(ope)) {
					for (var j = 0; j < ope.length; j++) {
						if (targetOperatorRegExp.indexOf(ope[j]) === -1) {
							targetOperatorRegExp += ope[j];
						}
					}
				} else if (operatorCharRegexB.test(operatorExtKeysArray[i])) {
					if (!arrayContains(targetWordOperatorArray, operatorExtKeysArray[i])) {
						targetWordOperatorArray.push(operatorExtKeysArray[i]);
					}
				}
			}
			if (targetOperatorRegExp !== null && targetOperatorRegExp !== undefined) {
				targetOperatorRegExp = new RegExp('[' + targetOperatorRegExp + ']');
			}
		}

		CodeMirror.optionHandlers.operatorExtKeysArray = function (cm, operatorExtKeysArrayParam) {
			operatorExtKeysArray = operatorExtKeysArrayParam;
			if (operatorExtKeysArray !== null && operatorExtKeysArray !== undefined) {
				getTargetArray();
			}
		};

		CodeMirror.optionHandlers.uomArray = function (cm, uomArrayParam) {
			uomArray = uomArrayParam;
		};

		CodeMirror.optionHandlers.functionNamesArray= function (cm, functionNamesArrayParam) {
			functionNamesArray= functionNamesArrayParam;
		};

		CodeMirror.optionHandlers.functionsArray = function (cm, functionsArrayParam) {
			functionsArray = functionsArrayParam;
		};

		CodeMirror.optionHandlers.operatorObjectsArray = function (cm, operatorObjectsArrayParam) {
			operatorObjectsArray = operatorObjectsArrayParam;
		};

		CodeMirror.optionHandlers.parameterTypeKeyMapExtKey = function (cm, parameterTypeKeyMapExtKeyParam) {
			parameterTypeKeyMapExtKey = parameterTypeKeyMapExtKeyParam;
		};

		CodeMirror.optionHandlers.parameterValueKeyMapExtKey = function (cm, parameterValueKeyMapExtKeyParam) {
			parameterValueKeyMapExtKey = parameterValueKeyMapExtKeyParam;
		};

		function tokenBase(stream, state) {
			var ch = stream.next();
			var result;
			if (ch === '"') {
				if (lastCh === '\\') {
					state.tokenize = tokenString(ch);
					lastCh = ch;
					return state.tokenize(stream, state);
				} else {
					if (lastCh === ':') {
						lastCh = ch;
						return getStyle(tokenType.startParameterValueQuoto);
					} else {
						lastCh = ch;
						return getStyle(tokenType.endParameterValueQuoto);
					}
				}
			} else if (ch === '.' && stream.match(/^\d+(?:[eE][+-]?\d+)?/)) {
				lastCh = ch;
				return getStyle(tokenType.number);
			} else if (/[()]/.test(ch)) {
				lastCh = ch;
				return null;
			} else if (ch === '0' && stream.eat(/x/i)) {
				stream.eatWhile(/[\da-f]/i);
				lastCh = ch;
				return getStyle(tokenType.number);
			} else if (ch === '0' && stream.eat(/o/i)) {
				stream.eatWhile(/[0-7]/i);
				lastCh = ch;
				return getStyle(tokenType.number);
			} else if (ch === '0' && stream.eat(/b/i)) {
				stream.eatWhile(/[01]/i);
				lastCh = ch;
				return getStyle(tokenType.number);
			} else if (/\d/.test(ch)) {
				stream.match(/^\d*(?:\.\d*)?(?:[eE][+-]?\d+)?/);
				lastCh = ch;
				return getStyle(tokenType.number);
			} else if (ch === ':') {
				stream.eatWhile(/[:=]/);
				if (stream.current() === ':=') {
					lastCh = ch;
					return getStyle(tokenType.assignOperator);
				}
			} else if (ch === ';') {
				lastCh = ch;
				return getStyle(tokenType.parameterValueSeperator);
			}
			else if ((!!targetOperatorRegExp.test) && angular.isFunction(targetOperatorRegExp.test) && targetOperatorRegExp.test(ch)) {
				if (lastCh === ' ') {
					stream.eatWhile(targetOperatorRegExp);
					result = checkOperator(stream.current());
					if (result !== null && result !== undefined) {
						lastCh = ch;
						return result;
					}
				}
			} else if (wordRE.test(ch)) {
				stream.eatWhile(wordRE);
				var cur = stream.current();
				result = checkFunctionNames(cur,functionNamesArray);
				if (result !== null && result !== undefined) {
					currentFunctionName = cur;
					typeParameterValue = null;
					constraintedParameterNamesArray = [];
					parameterNamesBefore = [];
					currentParameterNamesArray = getParameterNamesByFunctionName(currentFunctionName);
					lastCh = ch;
					return result;
				} else {
					result = checkParameterNames(cur);
					if (result !== null && result !== null) {
						currentParameterName = cur;
						state.functionName = currentFunctionName;
						parameterNamesBefore.push(cur);
						lastCh = ch;
						return result;
					} else {
						result = checkParameterValues(cur);
						if (result !== null && result !== undefined) {
							lastCh = ch;
							if (currentParameterName === getExtKeyOfParameterNameFromKey(parameterTypeKeyMapExtKey, 'Type')) {
								typeParameterValue = cur;
							}
							return result;
						} else {
							if (lastCh === ' ') {
								result = checkWordOperator(cur);
								if (result !== null && result !== null) {
									lastCh = ch;
									return result;
								} else {
									lastCh = ch;
									return getStyle(tokenType.string);
								}
							} else {
								lastCh = ch;
								return getStyle(tokenType.string);
							}
						}
					}
				}
			}else if(ch===' '){
				lastCh = ch;
				return getStyle(tokenType.blankSpace);
			}
			lastCh = ch;
		}


		function getExtKeyOfParameterValueFromKey(parameterValueKeyMapExtKey, key) {
			var extKey = null;
			if ((!!parameterValueKeyMapExtKey) && (!!key)) {
				if ((parameterValueKeyMapExtKey[key])) {
					extKey = parameterValueKeyMapExtKey[key];
				}
			}
			return extKey;
		}

		function getConstraintedParameterObjectArray(functionObjectsArray, functionName, typeParameterValue) {
			var constraintedParameterObjectsArray = [];
			for (var i = 0; i < functionObjectsArray.length; i++) {
				var functionObject = functionObjectsArray[i];
				if (functionObject.functionName === functionName) {
					var parametersArray = functionObject.ParametersArray;
					for (var j = 0; j < parametersArray.length; j++) {
						var parameterObj = functionObject.ParametersArray[j];
						if (parameterObj.parameterName === getExtKeyOfParameterNameFromKey(parameterTypeKeyMapExtKey, 'Type')) {
							var parameterValuesArray = parameterObj.parameterValuesArray;
							for (var k = 0; k < parameterValuesArray.length; k++) {
								var parameterValuesObj = parameterValuesArray[k];
								if (parameterValuesObj.parameterValueExtKey === typeParameterValue) {
									var connectionsForTypeNode = parameterValuesObj.connectionsForTypeNode;
									if ((!!connectionsForTypeNode) && (!!connectionsForTypeNode.ConnectionsTypeList)) {
										var connectionsTypeList = connectionsForTypeNode.ConnectionsTypeList;
										for (var m = 0; m < connectionsTypeList.length; m++) {
											if (connectionsTypeList[m].Allow === connectionTypeAllowEnum.list ||
												connectionsTypeList[m].Allow === connectionTypeAllowEnum.all) {
												var parameterName = getExtKeyOfParameterNameFromKey(parameterTypeKeyMapExtKey, connectionsTypeList[m].TypeName);
												if (parameterName) {
													var constraintedParameterObject = {
														parameterNameKey: connectionsTypeList[m].TypeName,
														parameterName: parameterName,
														parameterValuesArray: []
													};
													var unconstraintedParameterValueObjectArray = getParameterValuesByFunctionNameAndParameterName(functionName, parameterName);
													var finalParameterValueObjectArray = [];
													if (connectionsTypeList[m].Allow === connectionTypeAllowEnum.list) {
														var allowTypeList = connectionsTypeList[m].AllowTypeList;
														var constraintedParameterValueTextArray = [];
														for (var n = 0; n < connectionsTypeList[m].AllowTypeList.length; n++) {
															constraintedParameterValueTextArray.push(allowTypeList[n].Text);
														}
														for (var q = 0; q < unconstraintedParameterValueObjectArray.length; q++) {
															if (arrayContains(constraintedParameterValueTextArray, unconstraintedParameterValueObjectArray[q].parameterValueKey)) {
																finalParameterValueObjectArray.push(unconstraintedParameterValueObjectArray[q]);
															}
														}
													} else {
														finalParameterValueObjectArray = unconstraintedParameterValueObjectArray;
													}
													constraintedParameterObject.parameterValuesArray = finalParameterValueObjectArray;
													constraintedParameterObjectsArray.push(constraintedParameterObject);
												}
											}
										}
									}
									break;
								}
							}
							break;
						}
					}
					var containUoM = false;
					var uomParameterObj = null;
					for (var p = 0; p < functionObject.ParametersArray.length; p++) {
						if (functionObject.ParametersArray[p].parameterNameKey === 'UoM') {
							containUoM = true;
							uomParameterObj = functionObject.ParametersArray[p];
							break;
						}
					}
					if (containUoM === true) {
						constraintedParameterObjectsArray.push(uomParameterObj);
					}

					var containNorm = false;
					var normParameterObj = null;
					for (var r = 0; r < functionObject.ParametersArray.length; r++) {
						if (functionObject.ParametersArray[r].parameterNameKey === 'QNorm') {
							containNorm = true;
							normParameterObj = functionObject.ParametersArray[r];
							break;
						}
					}
					if (containNorm === true) {
						constraintedParameterObjectsArray.push(normParameterObj);
					}
					break;
				}
			}
			return constraintedParameterObjectsArray;
		}

		CodeMirror.registerHelper('quantityQueryEditor', 'getParameterObjectArrayByFunctionName', getParameterObjectArrayByFunctionName);


		CodeMirror.registerHelper('quantityQueryEditor', 'getConstraintedParameterObjectArray', getConstraintedParameterObjectArray);
		CodeMirror.registerHelper('quantityQueryEditor', 'getExtKeyOfParameterNameFromKey', getExtKeyOfParameterNameFromKey);
		CodeMirror.registerHelper('quantityQueryEditor', 'getExtKeyOfParameterValueFromKey', getExtKeyOfParameterValueFromKey);
		CodeMirror.registerHelper('quantityQueryEditor', 'getParameterValuesByFunctionNameAndParameterName', getParameterValuesByFunctionNameAndParameterName);

		function checkOperator(word) {
			if (arrayContains(operatorExtKeysArray, word)) {
				return getStyle(tokenType.operator);
			} else {
				return null;
			}
		}

		function checkWordOperator(word) {
			if (arrayContains(targetWordOperatorArray, word)) {
				return getStyle(tokenType.operator);
			} else {
				return null;
			}
		}

		function checkFunctionNames(word,functionNamesArray) {
			if (arrayContains(functionNamesArray, word)) {
				return getStyle(tokenType.functionName);
			} else {
				return null;
			}
		}

		function getParameterObjectArrayByFunctionName(functionName) {
			var parameterObjectsArray = [];
			if (functionName !== null && functionName !== undefined) {
				for (var i = 0; i < functionsArray.length; i++) {
					var functionObject = functionsArray[i];
					if (functionObject.functionName === functionName) {
						parameterObjectsArray = functionObject.ParametersArray;
						break;
					}
				}
			}
			return parameterObjectsArray;
		}

		function getParameterNamesByFunctionName(functionName) {
			var parameterNamesArray = [];
			if (functionName !== null && functionName !== undefined) {
				for (var i = 0; i < functionsArray.length; i++) {
					var functionObject = functionsArray[i];
					if (functionObject.functionName === functionName) {
						var parametersArray = functionObject.ParametersArray;
						for (var j = 0; j < parametersArray.length; j++) {
							var parameterObj = functionObject.ParametersArray[j];
							if (!arrayContains(parameterNamesArray, parameterObj.parameterName)) {
								parameterNamesArray.push(parameterObj.parameterName);
							}
						}
						break;
					}
				}
			}
			return parameterNamesArray;
		}

		function getParameterValuesByFunctionNameAndParameterName(functionName, parameterName) {
			var parameterValuesArray = [];
			if (functionName !== null && functionName !== undefined && parameterName !== null && parameterName !== undefined) {
				for (var i = 0; i < functionsArray.length; i++) {
					var functionObject = functionsArray[i];
					if (functionObject.functionName === functionName) {
						var parametersArray = functionObject.ParametersArray;
						for (var j = 0; j < parametersArray.length; j++) {
							var parameterObj = parametersArray[j];
							if (parameterObj.parameterName === parameterName) {
								parameterValuesArray = parameterObj.parameterValuesArray;
								break;
							}
						}
						break;
					}
				}
			}
			return parameterValuesArray;
		}

		function checkParameterNames(word) {
			if (currentFunctionName !== null && currentFunctionName !== undefined) {
				if (currentParameterNamesArray.length === 0) {
					currentParameterNamesArray = getParameterNamesByFunctionName(currentFunctionName);
				}
				if (arrayContains(currentParameterNamesArray, word) && (!arrayContains(parameterNamesBefore, word))) {
					return getStyle(tokenType.parameterName);
				} else {
					return null;
				}
			} else {
				return null;
			}
		}

		function checkParameterValues(word) {
			var functioinParamValueObjectsArray = getParameterValuesByFunctionNameAndParameterName(currentFunctionName, currentParameterName);
			var functioinParamValuesArray = [];
			for (var i = 0; i < functioinParamValueObjectsArray.length; i++) {
				if (!arrayContains(functioinParamValuesArray, functioinParamValueObjectsArray[i].parameterValueExtKey)) {
					functioinParamValuesArray.push(functioinParamValueObjectsArray[i].parameterValueExtKey);
				}
			}
			if (arrayContains(functioinParamValuesArray, word)) {
				return getStyle(tokenType.parameterValue);
			} else {
				return null;
			}
		}

		function tokenString(quote) {
			return function (stream, state) {
				var escaped = false, next;
				while ((next = stream.next())) {
					if (next === quote && !escaped) {
						break;
					}
					escaped = !escaped && next === '\\';
				}
				if (!escaped) {
					state.tokenize = tokenBase;
				}
				var word = stream.current();
				if (word.indexOf('"') === 0) {
					word = word.substr(1);
				}
				if (word.lastIndexOf('"') === (word.length - 1)) {
					word = word.substr(0, word.length - 1);
				}
				var result = checkParameterValues(word);
				if (result !== null && result !== undefined) {
					return result;
				} else {
					return getStyle(tokenType.string);
				}
			};
		}

		// Interface
		return {
			startState: function (basecolumn) {
				return {
					tokenize: tokenBase,
					scope: {offset: basecolumn || 0, type: 'filter', prev: null, align: false},
					indented: basecolumn || 0
				};
			},

			token: function (stream, state) {
				return state.tokenize(stream, state);
			},

			indent: function () {

			}
		};
	});

});
