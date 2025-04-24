/**
 * Created by Jim on 3/13/2017.
 */

/* global CodeMirror,globals,_,$ */
/* jshint -W073 */
(function (angular, CodeMirror) {
	'use strict';

	var moduleName = 'basics.common';

	/* jshint -W074 */
	/* jshint -W040 */
	angular.module(moduleName).directive('basicsQuantityQueryEditor', [
		'$q', '$http', 'basicsQuantityQueryEditorService', '$timeout',
		'quantityQueryEditorControllerServiceCache',
		'constructionsystemCommonQuantityQueryEditorShowHintService',
		function ($q, $http, basicsQuantityQueryEditorService, $timeout,
			quantityQueryEditorControllerServiceCache, constructionsystemCommonQuantityQueryEditorShowHintService) {
			var tokenType = {
				functionName: 'functionName',
				parameterName: 'parameterName',
				parameterValue: 'parameterValue',
				operator: 'operator',
				assignOperator: 'assignOperator',
				parameterValueSeperator: 'parameterValueSeperator',
				startParameterValueQuoto: 'startParameterValueQuoto',
				endParameterValueQuoto: 'endParameterValueQuoto',
				number: 'number',
				string: 'string',
				blankSpace: 'blankSpace'
			};

			return {
				restrict: 'A',
				require: 'ngModel',
				scope: {
					editorDataService: '=',
					cmReadOnly: '=',
					cmDocValue: '=',
					entity: '=',
					onInit: '&'
				},
				controllerAs: 'ctrl',
				controller: ['$scope', controller],
				link: link
			};

			function getParameterTypeKeyMapExtKey(functionsArray) {
				var parameterTypeKeyMapExtKey = {};
				if ((functionsArray !== null && functionsArray !== undefined) && (functionsArray instanceof Array)) {
					for (var i = 0; i < functionsArray.length; i++) {
						var functionObj = functionsArray[i];
						if (functionObj.ParameterTypes && functionObj.ParameterTypes.ParameterTypeList) {
							var parameterTypeList = functionObj.ParameterTypes.ParameterTypeList;
							for (var j = 0; j < parameterTypeList.length; j++) {
								var key = parameterTypeList[j].Key.Text;
								var extKey = parameterTypeList[j].ExtKey;
								if (!Object.prototype.hasOwnProperty.call(parameterTypeKeyMapExtKey,key)) {
									parameterTypeKeyMapExtKey[key] = extKey;
								}
							}
						}
					}
				}
				return parameterTypeKeyMapExtKey;
			}

			function getParameterValueKeyMapExtKey(functionsArray) {
				var parameterValueKeyMapExtKeyObject = {};
				if ((functionsArray !== null && functionsArray !== undefined) && (functionsArray instanceof Array)) {
					for (var i = 0; i < functionsArray.length; i++) {
						var functionObj = functionsArray[i];
						if ((!!functionObj.Parameters) && (functionObj.Parameters instanceof Array)) {
							var parametersArray = functionObj.Parameters;
							for (var j = 0; j < parametersArray.length; j++) {
								var key = parametersArray[j].Key;
								var extKey = parametersArray[j].ExtKey;
								if (!Object.prototype.hasOwnProperty.call(parameterValueKeyMapExtKeyObject,key)) {
									parameterValueKeyMapExtKeyObject[key] = extKey;
								}
							}
						}
					}
				}
				return parameterValueKeyMapExtKeyObject;
			}

			function getLastToken(editor, currentToken) {
				var lastToken = null;
				var lastPos = {ch: currentToken.start, line: currentToken.lineNo};
				lastToken = editor.getTokenAt(lastPos);
				lastToken.lineNo = currentToken.lineNo;
				return lastToken;
			}

			function getStyle(styleFlag) {
				return 'quantity-query-' + styleFlag;
			}

			function getExtKeyOfParameterNameFromKey(parameterTypeKeyMapExtKey, key) {
				var extKey = null;
				if ((!!parameterTypeKeyMapExtKey) && (!!key)) {
					if ((parameterTypeKeyMapExtKey[key])) {
						extKey = parameterTypeKeyMapExtKey[key];
					}
				}
				return extKey;
			}

			function controller($scope) {

				var self = this;
				var _changeTimeout;
				this.cm = null;

				this.activeToolTip = null;
				this.tokenType = tokenType;
				this.getLastToken = getLastToken;
				this.getCurrentFunctionName = function (editor, currentToken) {
					var currentFunctionName = null;
					if (currentToken.type === getStyle(tokenType.functionName)) {
						currentFunctionName = currentToken.string;
					} else {
						var lastToken = null;
						if (currentToken.string === '(') {
							lastToken = getLastToken(editor, currentToken);
							if (lastToken.type === getStyle(tokenType.functionName)) {
								currentFunctionName = lastToken.string;
							}
						} else {
							lastToken = getLastToken(editor, currentToken);
							while ((!!lastToken) && (lastToken.string !== '') && (lastToken.string !== '(')) {
								lastToken = getLastToken(editor, lastToken);
							}
							if (lastToken.string === '(') {
								lastToken = getLastToken(editor, lastToken);
								if (lastToken.type === getStyle(tokenType.functionName)) {
									currentFunctionName = lastToken.string;
								}
							}
						}
					}
					return currentFunctionName;
				};
				this.getCurrentParameterName = function (editor, currentToken) {
					var currentParameterName = null;
					if (currentToken.type === getStyle(tokenType.parameterName)) {
						currentParameterName = currentToken.string;
					} else {
						var lastToken = getLastToken(editor, currentToken);
						while ((!!lastToken) && (lastToken.type !== getStyle(tokenType.parameterName)) &&
						(lastToken.string !== '') && (lastToken.string !== '(')) {
							lastToken = getLastToken(editor, lastToken);
						}
						if (lastToken.type === getStyle(tokenType.parameterName)) {
							currentParameterName = lastToken.string;
						}
					}
					return currentParameterName;
				};

				this.getStyle = getStyle;
				this.arrayContains = function (arr, item) {
					if (!Array.prototype.indexOf) {
						var i = arr.length;
						while (i--) {
							if (arr[i] === item) {
								return true;
							}
						}
						return false;
					}
					if (arr) {
						return arr.indexOf(item) !== -1;
					} else {
						return false;
					}
				};
				this.getFunctionDescription = function (functionsArray, functionName) {
					var description = null;
					if ((!!functionsArray) && (functionsArray instanceof Array)) {
						for (var i = 0; i < functionsArray.length; i++) {
							if (functionsArray[i].functionName === functionName) {
								description = functionsArray[i].functionExtDesc;
								break;
							}
						}
					}
					return description;
				};
				this.getParameterDescription = function (functionsArray, functionName, parameterName) {
					var description = null;
					if ((!!functionsArray) && (functionsArray instanceof Array)) {
						for (var i = 0; i < functionsArray.length; i++) {
							if (functionsArray[i].functionName === functionName) {
								var parametersArray = functionsArray[i].ParametersArray;
								if ((!!parametersArray) && (parametersArray instanceof Array)) {
									for (var j = 0; j < parametersArray.length; j++) {
										if (parametersArray[j].parameterName === parameterName) {
											description = parametersArray[j].parameterNameDesc;
											break;
										}
									}
								}
								break;
							}
						}
					}
					return description;
				};
				this.getParameterValueDescription = function (functionsArray, functionName, parameterName, parameterValue) {
					var description = null;
					if ((!!functionsArray) && (functionsArray instanceof Array)) {
						for (var i = 0; i < functionsArray.length; i++) {
							if (functionsArray[i].functionName === functionName) {
								var parametersArray = functionsArray[i].ParametersArray;
								if ((!!parametersArray) && (parametersArray instanceof Array)) {
									for (var j = 0; j < parametersArray.length; j++) {
										if (parametersArray[j].parameterName === parameterName) {
											var parameterValuesArray = parametersArray[j].parameterValuesArray;
											if ((!!parameterValuesArray) && (parameterValuesArray instanceof Array)) {
												for (var k = 0; k < parameterValuesArray.length; k++) {
													if ((parameterValuesArray[k].parameterValueExtKey === parameterValue) ||
														(parameterValuesArray[k].parameterValueShortKey === parameterValue)) {
														description = parameterValuesArray[k].parameterValueExtDesc;
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
					return description;
				};
				this.getExtKeyOfParameterNameFromKey = getExtKeyOfParameterNameFromKey;


				var operatorExtKeysArray = [];
				var functionsArray = [];
				var uomArray = [];
				var operatorObjectsArray = [];
				var parameterTypeKeyMapExtKey = [];
				var parameterValueKeyMapExtKey = [];

				var parameterTypeValidEnum = {
					none: 0,
					item: 1,
					prop: 2
				};


				function setValueOfCMDoc(docValue) {
					self.cm && self.cm.off('change', onChange);
					if (docValue) {
						self.cm.doc.setValue(docValue);
					} else {
						self.cm.doc.setValue('');
					}
					self.cm && self.cm.on('change', onChange);
				}

				self.loadInfo = {languageId: null, isLoaded: false};

				function setValueToCodeMirror(languageId, typeFlag) {
					var parameterEntity = $scope.editorDataService.getSelected();
					if (parameterEntity) {
						var dataService = $scope.editorDataService;
						var serviceName = dataService.getServiceName();
						if (serviceName === 'constructionSystemMainInstanceParameterService' || serviceName === 'constructionSystemMainInstance2ObjectParamService') {
							if (typeFlag === 'instanceParameter')
							{
								self.cm.isInstanceParameter = true;
							}else{
								self.cm.isInstanceParameter=false;
							}
							basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity = null;
							basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity = null;
							setCMEditable();
							setValueOfCMDoc(parameterEntity.QuantityQuery);
						} else {
							if (parameterEntity.CosDefaultTypeFk === 3 || parameterEntity.CosDefaultTypeFk === 4 || parameterEntity.CosDefaultTypeFk === 5) {
								setCMEditable();
							} else {
								setCMReadOnly();
							}
							if (self.cm.options.languageCode !== 'en') {
								if (!!parameterEntity.QuantityQueryTranslationList && angular.isArray(parameterEntity.QuantityQueryTranslationList)) {
									var needCreate = true;
									var currentTranslationEntity = null;
									for (var i = 0; i < parameterEntity.QuantityQueryTranslationList.length; i++) {
										if (parameterEntity.QuantityQueryTranslationList[i].BasLanguageFk === languageId) {
											needCreate = false;
											currentTranslationEntity = parameterEntity.QuantityQueryTranslationList[i];
											break;
										}
									}
									if (needCreate === true) {
										var createTranslationEntityParam = {Id: null, LangugeId: languageId};
										if (parameterEntity.QuantityQueryTranslationList.length > 0) {
											createTranslationEntityParam.Id = parameterEntity.QuantityQueryTranslationList[0].Id;
										}
										$http.post(globals.webApiBaseUrl + 'cloud/common/translation/createTranslationEntity', createTranslationEntityParam).then(
											function (response) {
												if (response.data) {
													currentTranslationEntity = response.data;
													if (typeFlag === 'cosParameter') {
														basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity = currentTranslationEntity;
														parameterEntity.QuantityQueryTranslationList.push(basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity);
													} else if (typeFlag === 'cosParameter2Template') {
														basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity = currentTranslationEntity;
														parameterEntity.QuantityQueryTranslationList.push(basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity);
													}

													setValueOfCMDoc(null);
												}
											}
										);
									} else {
										if (currentTranslationEntity) {
											if (typeFlag === 'cosParameter') {
												basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity = currentTranslationEntity;
											} else if (typeFlag === 'cosParameter2Template') {
												basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity = currentTranslationEntity;
											}

											setValueOfCMDoc(currentTranslationEntity.Description);
										}
									}
								}
							} else {
								if (typeFlag === 'cosParameter') {
									basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity = null;
								} else if (typeFlag === 'cosParameter2Template') {
									basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity = null;
								}
								setValueOfCMDoc(parameterEntity.QuantityQueryInfo.Description);
							}
						}
					} else {
						setCMReadOnly();
						setValueOfCMDoc('');
					}
				}

				function setCMReadOnly() {
					self.cm.options.readOnly = 'nocursor';
				}

				function setCMEditable() {
					self.cm.options.readOnly = false;
				}

				function selectedLanguageChanged(languageId, typeFlag) {
					$http.get(globals.webApiBaseUrl + 'cloud/common/language/getCultureByLanguageId?languageId=' + languageId).then(function (response) {
						var languageCode = response.data;
						self.cm.setOption('languageCode', languageCode);

						setRibFunctionsXMLAndUom(self.cm, languageCode).then(function () {
							setValueToCodeMirror(languageId, typeFlag);
						});
					}, function () {
						self.loadInfo.isLoaded = false;
					});
					self.loadInfo.languageId = languageId;
					self.loadInfo.isLoaded = true;
				}

				var constructionSystemQuantityQueryEditorControllerService = quantityQueryEditorControllerServiceCache.getService('constructionSystemQuantityQueryEditorControllerService', $scope.editorDataService.getServiceName());

				constructionSystemQuantityQueryEditorControllerService.registerLanguageSelectionChanged(selectedLanguageChanged);

				function defaultTypeChanged() {
					var headerRecord = $scope.editorDataService.getSelected();
					if (headerRecord && (headerRecord.CosDefaultTypeFk === 3 || headerRecord.CosDefaultTypeFk === 4 || headerRecord.CosDefaultTypeFk === 5)) {
						setCMEditable();
						if (headerRecord.QuantityQueryInfo) {
							if (headerRecord.QuantityQueryInfo.Description) {
								self.cm.doc.setValue(headerRecord.QuantityQueryInfo.Description);
							} else {
								self.cm.doc.setValue('');
							}
						} else {
							if (headerRecord.QuantityQuery) {
								self.cm.doc.setValue(headerRecord.QuantityQuery);
							} else {
								self.cm.doc.setValue('');
							}
						}
					} else {
						//-------------------
						if ($scope.editorDataService.getServiceName() === 'constructionSystemMasterParameter2TemplateDataService') {
							if (!!basicsQuantityQueryEditorService && !!basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity) {
								basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity = null;
								// basicsQuantityQueryEditorService.selectedCosMasterParameter2TemplateLanguageId = basicsQuantityQueryEditorService.defaultLanguageId;
								if (constructionSystemQuantityQueryEditorControllerService) {
									if (!constructionSystemQuantityQueryEditorControllerService.onLanguageSelectionChanged) {
										constructionSystemQuantityQueryEditorControllerService = constructionSystemQuantityQueryEditorControllerService.createService();
									}
									constructionSystemQuantityQueryEditorControllerService.onLanguageSelectionChanged.fire(basicsQuantityQueryEditorService.selectedCosMasterParameter2TemplateLanguageId,
										'cosParameter2Template');
								}
							}
						} else if ($scope.editorDataService.getServiceName() === 'constructionSystemMasterParameterDataService') {
							if (!!basicsQuantityQueryEditorService && !!basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity) {
								basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity = null;
								basicsQuantityQueryEditorService.selectedCosMasterParameterLanguageId = basicsQuantityQueryEditorService.defaultLanguageId;
								if (constructionSystemQuantityQueryEditorControllerService) {
									if (!constructionSystemQuantityQueryEditorControllerService.onLanguageSelectionChanged) {
										constructionSystemQuantityQueryEditorControllerService = constructionSystemQuantityQueryEditorControllerService.createService();
									}
									constructionSystemQuantityQueryEditorControllerService.onLanguageSelectionChanged.fire(basicsQuantityQueryEditorService.selectedCosMasterParameterLanguageId,
										'cosParameter');
								}
							}
						}

						//-------------------
						setCMReadOnly();
						self.cm.doc.setValue('');
					}
				}

				if ($scope.editorDataService.getServiceName() === 'constructionSystemMasterParameterDataService' ||
					$scope.editorDataService.getServiceName() === 'constructionSystemMasterParameter2TemplateDataService') {
					$scope.editorDataService.registerDefaultTypeChanged(defaultTypeChanged);
				}

				$scope.$on('$destroy', function () {
					constructionSystemQuantityQueryEditorControllerService.unRegisterLanguageSelectionChanged(selectedLanguageChanged);
					self.loadInfo = {languageId: null, isLoaded: false};
				});

				function getFunctionParams(cm, functionObj, parameterTypeNodes, parameterNodes) {
					for (var i = 0; i < parameterTypeNodes.length; i++) {
						if (!cm.options.arrayContains(functionObj.ParametersArray, parameterTypeNodes[i].ExtKey)) {
							var parameterObj = {
								parameterNameKey: parameterTypeNodes[i].Key.Text,
								parameterName: parameterTypeNodes[i].ExtKey,
								parameterNameDesc: parameterTypeNodes[i].ExtDesc,
								parameterValuesArray: []
							};
							functionObj.ParametersArray.push(parameterObj);
							var parameterValueObj = null;
							if (parameterObj.parameterNameKey === 'QNorm') {
								if ((!!functionObj.calcDictionary) && (!!functionObj.calcDictionary.Norms) &&
									(functionObj.calcDictionary.Norms instanceof Array)) {
									var normsArray = functionObj.calcDictionary.Norms;
									var parameterValuesObjectArray = [];
									for (var m = 0; m < normsArray.length; m++) {
										var norm = normsArray[m];
										parameterValueObj = {
											parameterValueKey: norm.Key,
											parameterValueExtKey: norm.ExtKey,
											parameterValueExtDesc: norm.ExtDesc,
											parentParameterValueKey: null,
											hasChildren: false
										};
										if (norm.ShortKey) {
											parameterValueObj.parameterValueShortKey = norm.ShortKey;
										}
										parameterValuesObjectArray.push(parameterValueObj);
										if ((!!norm.Policies) && (norm.Policies instanceof Array) && (norm.Policies.length > 0)) {
											parameterValueObj.hasChildren = true;
											var policiesArray = norm.Policies;
											for (var n = 0; n < policiesArray.length; n++) {
												parameterValueObj = {
													parameterValueKey: policiesArray[n].Key,
													parameterValueExtKey: policiesArray[n].ExtKey !== null? policiesArray[n].ExtKey : policiesArray[n].Key,
													parameterValueExtDesc: policiesArray[n].Key,
													parentParameterValueKey: norm.Key,
													hasChildren: false
												};
												parameterValuesObjectArray.push(parameterValueObj);
											}
										}
									}
									parameterObj.parameterValuesArray = parameterValuesObjectArray;
								}
							} else {
								if (parameterNodes) {
									for (var j = 0; j < parameterNodes.length; j++) {
										var typeConfigList = parameterNodes[j].TypeConfigList;
										for (var k = 0; k < typeConfigList.length; k++) {
											if (typeConfigList[k].TypeName === parameterObj.parameterNameKey && typeConfigList[k].Valid === parameterTypeValidEnum.item) {
												parameterValueObj = {
													parameterValueKey: parameterNodes[j].Key,
													parameterValueExtKey: parameterNodes[j].ExtKey,
													parameterValueExtDesc: parameterNodes[j].ExtDesc
												};
												if (parameterNodes[j].ShortKey) {
													parameterValueObj.parameterValueShortKey = parameterNodes[j].ShortKey;
												}
												if (parameterNodes[j].PType) {
													parameterValueObj.parameterValuePType = parameterNodes[j].PType;
												}
												if (parameterNodes[j].Pic) {
													parameterValueObj.parameterValuePic = {
														sizeX: parameterNodes[j].Pic.SizeX,
														sizeY: parameterNodes[j].Pic.SizeY,
														Path: parameterNodes[j].Pic.Path
													};
												}
												if (typeConfigList[k].TypeName === 'Type') {
													if (typeConfigList[k].ConnectionsForTypeNode) {
														parameterValueObj.connectionsForTypeNode = typeConfigList[k].ConnectionsForTypeNode;
													}
												}
												if (typeConfigList[k].TypeName === 'HRef') {
													if (typeConfigList[k].ConnectionsForHRefNode) {
														parameterValueObj.connectionsForHRefNode = typeConfigList[k].ConnectionsForHRefNode;
													}
												}
												parameterObj.parameterValuesArray.push(parameterValueObj);
												break;
											}
										}
									}
								}
							}
						}
					}
					var containUoM = false;
					var uomParameterObj = null;
					for (var p = 0; p < functionObj.ParametersArray.length; p++) {
						if (functionObj.ParametersArray[p].parameterNameKey === 'UoM') {
							containUoM = true;
							uomParameterObj = functionObj.ParametersArray[p];
							break;
						}
					}
					if (containUoM === true) {
						if (uomParameterObj.parameterValuesArray.length === 0) {
							for (var q = 0; q < uomArray.length; q++) {
								var parameterValueObjTemp = {
									parameterValueKey: uomArray[q],
									parameterValueExtKey: uomArray[q],
									parameterValueExtDesc: uomArray[q]
								};
								uomParameterObj.parameterValuesArray.push(parameterValueObjTemp);
							}
						}
					}
				}

				function handleChange(cm, data) {
					// var inputContent = cm.doc.getLine(0);
					// support multiple lines
					var inputContent = cm.getValue();
					var parameterEntity = $scope.editorDataService.getSelected();

					var dataService = $scope.editorDataService;
					var serviceName = dataService.getServiceName();
					if (serviceName === 'constructionSystemMainInstanceParameterService' || serviceName === 'constructionSystemMainInstance2ObjectParamService') {
						if (basicsQuantityQueryEditorService.codeMirrorContentChange) {
							basicsQuantityQueryEditorService.codeMirrorContentChange.fire(null, {newQuantityQuery: inputContent});
						}

						// Fixe defect:#88562, Not need syn the value again if the quantity query editor value come from the InstatanceParameter
						if (!!parameterEntity && !cm.isInstanceParameter) {
							parameterEntity.QuantityQuery = inputContent;
							$scope.editorDataService.markItemAsModified(parameterEntity);
							$scope.editorDataService.gridRefresh();
						}

					} else {
						if ((!!parameterEntity) && (parameterEntity.CosDefaultTypeFk === 3 || parameterEntity.CosDefaultTypeFk === 4 || parameterEntity.CosDefaultTypeFk === 5)) {
							if (basicsQuantityQueryEditorService.codeMirrorContentChange) {
								basicsQuantityQueryEditorService.codeMirrorContentChange.fire(null, {newQuantityQuery: inputContent});
							}

							if (self.cm.options.languageCode !== 'en') {
								if (serviceName === 'constructionSystemMasterParameter2TemplateDataService') {
									if (basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity) {
										basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity.Description = inputContent;
										if (!!parameterEntity && !!parameterEntity.QuantityQueryTranslationList && angular.isArray(parameterEntity.QuantityQueryTranslationList)) {
											var temp1 = _.find(parameterEntity.QuantityQueryTranslationList,
												{
													'Id': basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity.Id,
													'BasLanguageFk': basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity.BasLanguageFk
												});
											if (temp1) {
												temp1.Description = inputContent;
											}
										}
										if (!!parameterEntity && parameterEntity.QuantityQueryInfo.DescriptionTr === null && !!basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity) {
											parameterEntity.QuantityQueryInfo.DescriptionTr = basicsQuantityQueryEditorService.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity.Id;
										}
									}
								} else {
									if (basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity) {
										basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity.Description = inputContent;
										if (!!parameterEntity && !!parameterEntity.QuantityQueryTranslationList && angular.isArray(parameterEntity.QuantityQueryTranslationList)) {
											var temp2 = _.find(parameterEntity.QuantityQueryTranslationList,
												{
													'Id': basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity.Id,
													'BasLanguageFk': basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity.BasLanguageFk
												});
											if (temp2) {
												temp2.Description = inputContent;
											}
										}
										if (!!parameterEntity && parameterEntity.QuantityQueryInfo.DescriptionTr === null && !!basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity) {
											parameterEntity.QuantityQueryInfo.DescriptionTr = basicsQuantityQueryEditorService.currentCosMasterParameterQuantityQueryTranslationEntity.Id;
										}
									}
								}
							}
							else {
								parameterEntity.QuantityQueryInfo.Description = inputContent;
							}

							$scope.editorDataService.markItemAsModified(parameterEntity);
							$scope.editorDataService.gridRefresh();
						}
					}
					cm.isInstanceParameter=false;

					// action complete, delete, enter
					var origins = ['+delete'];
					if (origins.indexOf(data.origin) !== -1 || data.text.length > 1) {
						return;
					}
					// get input text
					var input = data.text[0];

					var cursor = cm.getCursor();
					var token = cm.getTokenAt(cursor);

					if (
						(token.type === cm.options.getStyle(cm.options.tokenType.operator) ||
						token.type === cm.options.getStyle(cm.options.tokenType.blankSpace) ||
						token.type === cm.options.getStyle(cm.options.tokenType.parameterValueSeperator) ||
						token.type === cm.options.getStyle(cm.options.tokenType.startParameterValueQuoto) ||
						token.type === cm.options.getStyle(cm.options.tokenType.endParameterValueQuoto) ||
						token.type === cm.options.getStyle(cm.options.tokenType.parameterValue) ||
						token.type === cm.options.getStyle(cm.options.tokenType.parameterName) ||
						token.type === cm.options.getStyle(cm.options.tokenType.string)) ||
						(token.string === '(') || (input === ':') ||
						(token.type === null && (token.string === '>' || token.string === '=' || token.string === '<'))
					) {
						if (!cm.state.completionActive) {
							// show the intelligent tip panel.
							cm.showHintQuantityQueryEditor({completeSingle: true});
						}
					}

				}

				function onChange(cm, data) {
					if (_changeTimeout) {
						$timeout.cancel(_changeTimeout);
					}

					_changeTimeout = $timeout(function () {
						_changeTimeout = null;
						handleChange(cm, data);
					}, 300);
				}

				function onFocus() {
					var serviceName = $scope.editorDataService.getServiceName();
					var langCode = null;
					if (serviceName === 'constructionSystemMasterParameterDataService') {
						langCode = basicsQuantityQueryEditorService.languageCodeMapLanguageIdOject[basicsQuantityQueryEditorService.selectedCosMasterParameterLanguageId];
					} else if (serviceName === 'constructionSystemMasterParameter2TemplateDataService') {
						langCode = basicsQuantityQueryEditorService.languageCodeMapLanguageIdOject[basicsQuantityQueryEditorService.selectedCosMasterParameter2TemplateLanguageId];
					} else {
						langCode = basicsQuantityQueryEditorService.languageCodeMapLanguageIdOject[basicsQuantityQueryEditorService.selectedLanguageId];
					}
					setRibFunctionsXMLAndUom(self.cm, langCode);
					$scope.$emit('updateRequested', true);
				}

				function resetOpetionConfigValue(cm) {
					parameterTypeKeyMapExtKey = [];
					parameterValueKeyMapExtKey = [];
					operatorExtKeysArray = [];
					functionsArray = [];
					uomArray = [];
					operatorObjectsArray = [];

					cm.setOption('parameterTypeKeyMapExtKey', null);
					cm.setOption('parameterValueKeyMapExtKey', null);
					cm.setOption('operatorExtKeysArray', null);
					cm.setOption('functionsArray', null);
					cm.setOption('uomArray', null);
					cm.setOption('operatorObjectsArray', null);
				}

				function extractRibFunctionsXMLAndUom(cm, jsonData) {
					resetOpetionConfigValue(cm);
					var xmlDocJson = jsonData.RibFunctionDoc;
					var uomArrayReturned = jsonData.UomArray;
					if (xmlDocJson && uomArrayReturned) {
						uomArray = uomArrayReturned;
						if (xmlDocJson.Global && xmlDocJson.Global.Operators) {
							operatorObjectsArray = xmlDocJson.Global.Operators;
							for (var i = 0; i < xmlDocJson.Global.Operators.length; i++) {
								operatorExtKeysArray.push(xmlDocJson.Global.Operators[i].ExtKey);
							}
						}

						if (xmlDocJson.Functions) {
							parameterTypeKeyMapExtKey = getParameterTypeKeyMapExtKey(xmlDocJson.Functions);
							parameterValueKeyMapExtKey = getParameterValueKeyMapExtKey(xmlDocJson.Functions);
							cm.setOption('parameterTypeKeyMapExtKey', parameterTypeKeyMapExtKey);
							cm.setOption('parameterValueKeyMapExtKey', parameterValueKeyMapExtKey);
							for (var j = 0; j < xmlDocJson.Functions.length; j++) {
								var functionObj = {
									functionKey: xmlDocJson.Functions[j].Key,
									functionName: xmlDocJson.Functions[j].ExtKey,
									functionExtDesc: xmlDocJson.Functions[j].ExtDesc,
									defaultUoMs: xmlDocJson.Functions[j].DefaultUoMs,
									ParametersArray: []
								};
								if (xmlDocJson.Functions[j].ExtKey === 'QTO') {
									var defaultTypes = xmlDocJson.Functions[j].DefaultTypes;
									if (defaultTypes && (defaultTypes instanceof Array)) {
										var defaultTypesObjectArray = [];
										for (var k = 0; k < defaultTypes.length; k++) {
											var defaultTypeObj = {};
											defaultTypeObj.dim = defaultTypes[k].DIM;
											defaultTypeObj.p_Type = defaultTypes[k].P_Type;
											defaultTypesObjectArray.push(defaultTypeObj);
										}
										functionObj.defaultTypesObjectArray = defaultTypesObjectArray;
									}

									var defaultUoMs = xmlDocJson.Functions[j].DefaultUoMs;
									if (defaultUoMs && (defaultUoMs instanceof Array)) {
										var defaultUoMsObjectArray = [];
										for (var m = 0; m < defaultUoMs.length; m++) {
											var defaultUoMObj = {};
											defaultUoMObj.dim = defaultTypes[m].DIM;
											defaultUoMObj.uoM = defaultTypes[m].UoM;
											defaultUoMsObjectArray.push(defaultUoMObj);
										}
										functionObj.defaultUoMsObjectArray = defaultUoMsObjectArray;
									}

									var calcDictionary = xmlDocJson.Functions[j].CalcDictionary;
									if (calcDictionary) {
										functionObj.calcDictionary = calcDictionary;
									}
								}
								functionsArray.push(functionObj);

								if (xmlDocJson.Functions[j].ParameterTypes && xmlDocJson.Functions[j].ParameterTypes.ParameterTypeList) {
									getFunctionParams(cm, functionObj, xmlDocJson.Functions[j].ParameterTypes.ParameterTypeList, xmlDocJson.Functions[j].Parameters);
								}
							}
						}
					}
					cm.setOption('operatorExtKeysArray', operatorExtKeysArray);
					cm.setOption('operatorObjectsArray', operatorObjectsArray);
					cm.setOption('functionsArray', functionsArray);

					function getFunctionNamesArray(cm, functionsArray) {
						var functionNamesArray = [];
						var functionObjectsArray = functionsArray;
						if (functionObjectsArray) {
							for (var i = 0; i < functionObjectsArray.length; i++) {
								if (!cm.options.arrayContains(functionNamesArray, functionObjectsArray[i].functionName)) {
									functionNamesArray.push(functionObjectsArray[i].functionName);
								}
							}
						}
						return functionNamesArray;
					}

					cm.setOption('functionNamesArray', getFunctionNamesArray(cm, functionsArray));
					cm.setOption('uomArray', uomArray);
				}

				function setRibFunctionsXMLAndUom(cm, languageCode) {
					var deferred = $q.defer();

					if (basicsQuantityQueryEditorService.ribFunctionsXMLAndUomOjbectArray[languageCode]) {
						extractRibFunctionsXMLAndUom(cm, basicsQuantityQueryEditorService.ribFunctionsXMLAndUomOjbectArray[languageCode]);
						deferred.resolve();
					} else {
						var ribFunctioinsXMLAndUoMJsonData = basicsQuantityQueryEditorService.getRIBFunctioinsXMLAndUoM(languageCode);
						ribFunctioinsXMLAndUoMJsonData.then(function (response) {
							basicsQuantityQueryEditorService.ribFunctionsXMLAndUomOjbectArray[languageCode] = response;
							extractRibFunctionsXMLAndUom(cm, response);
							deferred.resolve();
						});
					}

					return deferred.promise;
				}

				this.init = function (element, settings) {
					self.cm = new CodeMirror(element[0], settings);

					if ($scope && $scope.cmReadOnly) {
						if ($scope.cmReadOnly === false) {
							setCMEditable();
						} else {
							setCMReadOnly();
						}
					} else {
						setCMReadOnly();
					}

					self.cm.on('change', onChange);
					self.cm.on('cursorActivity', self.cm.showDescription);

					self.cm.on('focus', onFocus);
				};
			}

			function link(scope, element, attrs) {
				var defaults = {
					lineNumbers: true,
					autoCloseBrackets: true,
					matchBrackets: true,
					theme: 'default script',
					tabSize: 8,
					indentUnit: 8,
					indentWithTabs: true,
					mode: {
						name: 'quantity-query-script'
					},
					hintOptions: {
						completeSingle: false
					},
					extraKeys: {
						'Ctrl': 'autocompleteQuantityQueryEditor'
					},
					foldGutter: true,
					gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
					lint: true,
					tokenType: scope.ctrl.tokenType,
					activeToolTip: scope.ctrl.activeToolTip,
					getLastToken: scope.ctrl.getLastToken,
					getCurrentFunctionName: scope.ctrl.getCurrentFunctionName,
					getCurrentParameterName: scope.ctrl.getCurrentParameterName,
					getFunctionDescription: scope.ctrl.getFunctionDescription,
					getExtKeyOfParameterNameFromKey: scope.ctrl.getExtKeyOfParameterNameFromKey,
					getParameterDescription: scope.ctrl.getParameterDescription,
					getParameterValueDescription: scope.ctrl.getParameterValueDescription,
					getStyle: scope.ctrl.getStyle,
					arrayContains: scope.ctrl.arrayContains,
					ulListObject: null
				};
				var options = scope.$parent.$eval(attrs.options);
				var settings = $.extend(defaults, options || {});
				scope.ctrl.init(element, settings);

				var splitter = element.closest('.k-splitter').data('kendoSplitter');
				if (splitter) {
					splitter.bind('layoutChange', refreshCm);
				}

				function refreshCm() {
					if (scope.ctrl.cm) {
						scope.ctrl.cm.refresh();
					}
				}

				scope.$on('$destroy', function () {
					if (splitter) {
						splitter.unbind('layoutChange', refreshCm);
					}
				});
			}
		}
	]);
})(angular, CodeMirror);