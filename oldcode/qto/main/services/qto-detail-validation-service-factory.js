(function (angular) {
	/* global globals */

	'use strict';

	let moduleName = 'qto.main';

	angular.module(moduleName).factory('qtoDetailValidationServiceFactory', ['_', 'validationService', '$q', '$http', '$translate', '$injector', 'boqItemLookupDataService', 'qtoMainLineType', 'qtoMainFormulaType',
		'basicsLookupdataLookupDescriptorService', 'platformDataValidationService', 'platformRuntimeDataService', '$timeout', 'scriptEvalService', 'math', 'qtoBoqType', 'qtoFormulaValidationScriptTranslationDataService',
		function (_, validationService, $q, $http, $translate, $injector, boqItemLookupDataService, qtoMainLineType, qtoMainFormulaType,
			lookupDescriptorService, platformDataValidationService, platformRuntimeDataService, $timeout, scriptEvalService, math, qtoBoqType, scriptTransService) {

			var factoryService = {};

			factoryService.createNewQtoDetailValidationService = function (dataService, boqType) {

				var service = validationService.create('qtoMainDetailValidation', 'qto/main/detail/schema');

				var self = this;
				self.checkMandatory = function (entity, value, model, apply, errrParam) {
					var result = platformDataValidationService.isMandatory(value, model, errrParam);
					if (apply) {
						result.apply = true;
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.handlePageLineError = function (result, entity) {
					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, 'PageNumber');
						platformRuntimeDataService.applyValidationResult(result, entity, 'LineReference');
						platformRuntimeDataService.applyValidationResult(result, entity, 'LineIndex');
					} else {
						service.removeError(entity);
					}
				};

				service.handleValueAndOperate = function (result, entity) {
					if (result.valid) {
						service.removeError(entity);
					}
				};

				service.validateQtoLineTypeCode = function validateQtoLineTypeCode(entity, value) {
					$injector.get('qtoLineTypeCodeLookupService').getLookupData({lookupType: 'qtoLineTypeCode'}).then(function (data) {

						var item = _.find(data, {Code: value});

						if (item && item.Id) {
							entity.QtoLineTypeFk = item.Id;
							service.validateQtoLineTypeFk(entity, entity.QtoLineTypeFk);
						}
					});
					return true;
				};

				service.asyncValidateQtoLineTypeCode = function asyncValidateQtoLineTypeCode(entity, newValue, model) {
					return $injector.get('qtoLineTypeCodeLookupService').getLookupData({lookupType: 'qtoLineTypeCode'}).then(function (data) {

						var item = _.find(data, {Code: newValue});

						if (item && item.Id) {
							entity.QtoLineTypeFk = item.Id;

							return $q.when(platformDataValidationService.finishValidation({valid: true, apply: true},
								entity, newValue, model, service, dataService));
						}

						var result = platformDataValidationService.createErrorObject(moduleName + '.QtoLineTypeCodeNotFound');
						platformDataValidationService.finishValidation(result, entity, newValue, model, service, dataService);

						return $q.when(result);
					});
				};

				service.validateBoqItemCode = function validateBoqItemCode(entity, value, model) {

					if (platformDataValidationService.isEmptyProp(value)) {
						let errormessage = boqType === qtoBoqType.WipBoq || boqType === qtoBoqType.BillingBoq || boqType === qtoBoqType.PesBoq ?
							$translate.instant('qto.main.noLinkBaseBoqItem') :
							$translate.instant('qto.main.selectBoqItemError');

						return platformDataValidationService.finishValidation(
							{
								apply: true,
								valid: false,
								error: errormessage
							},
							entity, value, model, service, dataService);
					}
					if(_.isFunction(dataService.setChangedBoqIds)){
						dataService.setChangedBoqIds(entity.BoqItemFk);
					}
					entity.IsCalculate = true;
					service.validateBoqSplitQuantityFk(entity, entity.BoqSplitQuantityFk, 'BoqSplitQuantityFk');

					return true;
				};

				service.asyncValidateBoqItemCode = function asyncValidateBoqItemCode(entity, newValue, model, args, isFromBulkEditor) {
					return $injector.get('qtoBoqItemLookupService').getLookupData({lookupType: 'qtoDetailBoqItemCode'}).then(function (data) {
						let result = {};
						var qtoBoqList = [];
						$injector.get('cloudCommonGridService').flatten(data, qtoBoqList, 'BoqItems');
						/* 1. Find in client side */
						var value = newValue;

						var item = null;

						if (_.isNumber(value)) {
							item = _.find(qtoBoqList, {Id: value});
						} else {
							item = _.find(qtoBoqList, {Reference: value});
						}

						// if select lineitem to create item, correct boqItem code
						if (item.Id !== entity.BoqItemFk && entity.BoqItemFk > 0) {
							item = correctBoqItemCodeWithLineItemChanged(entity, item, qtoBoqList);
							if(!!item){
								newValue = item.Reference;
							}
						}

						function syncReferencedLine(refLines, entity, newValue){
							if (refLines && refLines.length) {
								_.forEach (refLines, function (item) {
									item.BoqItemFk = entity.BoqItemFk;
									item.BoqItemCode = newValue;
									item.BoqHeaderFk = entity.BoqHeaderFk;
									item.BoqSplitQuantityFk = entity.BoqSplitQuantityFk;

									/* if boq item change, set as true */
									item.IsBoqItemChange = true;
									item.IsBoqSplitChange = true;
									item.IsLineItemChange = entity.Version === 0 && entity.EstLineItemFk;
								});
								dataService.markEntitiesAsModified (refLines);
							}
						}

						if (item && item.Id && item.BoqLineTypeFk === 0) {
							// if position boq contains sub quantity, can not assign qto lines to BoqItem which contains sub quantity items.
							let qtoBoqStructureService = $injector.get('qtoBoqStructureService');
							if(qtoBoqStructureService.isCrbBoq() && _.isArray(item.BoqItems) && item.BoqItems.length > 0){
								if(_.find(item.BoqItems, function(item){return item.BoqLineTypeFk === 11;}) !== null){
									result = platformDataValidationService.createErrorObject(moduleName + '.SubQuantityBoQItemsErrormsg');
									platformDataValidationService.finishValidation(result, entity, newValue, model, service, dataService);

									return $q.when(result);
								}
							}

							// must find the same group qto before change the entity boqitemfk,boqitemcode,boqitemheaderfk
							let referencedLines = dataService.getTheSameGroupQto(entity);

							if(isFromBulkEditor) {
								return $http.get(globals.webApiBaseUrl + 'qto/main/detail/getboqsplitquantitiesForQto?boqItemId=' + item.Id + '&boqHeaderId=' + item.BoqHeaderFk).then(function (response) {
									let data = response.data;
									entity.BoqSplitQuantityFk = data.length > 0 ? data[0].Id : null;

									/*  Update item BoqItemFk */
									entity.BoqItemFk = item.Id;
									entity.BoqHeaderFk = item.BoqHeaderFk;

									/* if boq item change, set as true */
									entity.IsBoqItemChange = true;
									entity.IsBoqSplitChange = true;
									entity.IsLineItemChange = entity.Version === 0 && entity.EstLineItemFk;

									syncReferencedLine(referencedLines, entity, newValue);

									return $q.when(platformDataValidationService.finishValidation({valid: true, apply: true}, entity, newValue, model, service, dataService));
								});
							} else {
								if (entity.BoqItemFk !== item.Id) {
									let qtoLines = dataService.getList();
									let qtoLine = _.find(qtoLines, {'BoqItemFk': item.Id});
									entity.BoqSplitQuantityFk = qtoLine ? qtoLine.BoqSplitQuantityFk : null;
								}
								/*  Update item BoqItemFk */
								entity.BoqItemFk = item.Id;
								entity.BoqHeaderFk = item.BoqHeaderFk;

								syncReferencedLine(referencedLines, entity, newValue);

								return $q.when(platformDataValidationService.finishValidation({valid: true, apply: true},entity, newValue, model, service, dataService));
							}
						}
						else if (item && item.Id && item.BoqLineTypeFk === 11){
							let referencedLines = dataService.getTheSameGroupQto(entity);

							/*  Update item BoqItemFk */
							entity.BoqItemFk = item.Id;
							entity.BoqHeaderFk = item.BoqHeaderFk;
							entity.BoqSplitQuantityFk = null;

							/* if boq item change, set as true */
							entity.IsBoqItemChange = true;
							entity.IsBoqSplitChange = true;
							entity.IsLineItemChange = false;

							syncReferencedLine(referencedLines, entity, newValue);

							return $q.when(platformDataValidationService.finishValidation({valid: true, apply: true},entity, newValue, model, service, dataService));

						}
						else if (item && item.Id && item.BoqLineTypeFk !== 0) {
							result = platformDataValidationService.createErrorObject(moduleName + '.SurchargeBoQItemsErrormsg');
							platformDataValidationService.finishValidation(result, entity, newValue, model, service, dataService);

							return $q.when(result);
						}

						result = platformDataValidationService.createErrorObject(moduleName + '.BoqReferenceNotFound');
						platformDataValidationService.finishValidation(result, entity, newValue, model, service, dataService);

						return $q.when(result);
					});
				};

				function correctBoqItemCodeWithLineItemChanged(entity, boqItem, qtoBoqList){
					let item = null;
					if (entity.selectLineItem2Create && entity.BoqItemFk !== boqItem.Id){
						item = _.find(qtoBoqList, {Id: entity.BoqItemFk});
					}
					return item;
				}

				service.validateBoqItemFk = function (entity, value, model) {
					// Check for mandatory validation first
					if (value === 0) {
						value = null;
					}

					var qtoBoqList = $injector.get('basicsLookupdataLookupDescriptorService').getData('boqItemLookupDataService');
					var item = _.find(qtoBoqList, {Id: value});
					var result;
					if (entity[model] === value) {
						return true;
					}

					if (value === 0) {
						value = null;
					} else if (item && item.BoqLineTypeFk !== 0) {
						value = null;
						result = {
							apply: true, valid: false,
							error: $translate.instant('qto.main.selectBoqItemError')
						};
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						return result;
					}

					result = self.checkMandatory(entity, value, model, true);
					if (result.valid) {
						// set the qtoline uom as boq item
						var existItem = _.find(qtoBoqList, {'Id': value});
						if (existItem) {
							var originalUom = entity.BasUomFk;
							entity.BasUomFk = existItem.BasUomFk;
							if (originalUom !== existItem.BasUomFk) {
								dataService.filterByFormulaUom(entity);
							}
						}

						// recalculate the boq quantity
						entity.oldBoqItemFk = entity.BoqItemFk;
						dataService.calculateBoqQuantityByQtoLine(entity, value);
					}
					return result;
				};

				service.asyncValidateBoqSplitQuantityFk = function asyncValidateBoqSplitQuantityFk(entity, value, model) {

					entity.BoqSplitQuantityFk = value;

					var url = $http.get(globals.webApiBaseUrl + 'qto/main/detail/checkQtoDetailHasSplitQtyFkOfBoqItem?boqHeaderFk=' + entity.BoqHeaderFk + '&boqItemFk=' + entity.BoqItemFk);

					return url.then(function (response) {

						var result = {apply: true, valid: true};

						if (response.data && !entity.BoqSplitQuantityFk) {
							if (platformDataValidationService.isEmptyProp(value)) {
								result.valid = false;
								result.error = $translate.instant('qto.main.selectSplitQuantityError');
							}
						}

						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

						return $q.when(result);
					});
				};

				service.validateBoqSplitQuantityFk = function validateBoqSplitQuantityFk(entity, value, model) {
					var result = {apply: true, valid: true};

					var itemList = dataService.getList();
					var items = _.filter(itemList, function (item) {
						return item.Version > 0 && item.BoqItemFk === entity.BoqItemFk && item.BoqSplitQuantityFk && item.Id !== entity.Id;
					});

					if (items.length > 0) {
						if (platformDataValidationService.isEmptyProp(value)) {
							result.valid = false;
							result.error = $translate.instant('qto.main.selectSplitQuantityError');
						}
					}

					// set split no. as readonly
					dataService.setQtoLineSplitNoReadonly(entity, itemList);

					// Sync PrjLocation, ControllingUnit, PrcStructure, CostGroup in this qto detail group.
					let referencedLines = _.filter(dataService.getTheSameGroupQto(entity), function(qtoDetail){
						return qtoDetail.Id !== entity.Id;
					});
					if (referencedLines && referencedLines.length) {
						_.forEach(referencedLines, function (qtoDetail){
							qtoDetail.BoqSplitQuantityFk = value;
							qtoDetail.IsBoqSplitChange = entity.IsBoqSplitChange;
							qtoDetail.IsLineItemChange = entity.Version === 0 && entity.EstLineItemFk;
							dataService.syncQtoDetailGroupProperty(qtoDetail, entity);
						});

						dataService.markEntitiesAsModified(referencedLines);
					}

					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				service.validateEstLineItemFk = function (entity, value, model){
					var result = {apply: true, valid: true};

					var itemList = dataService.getList();

					// set lineitem as readonly
					dataService.setQtoLineLineItemReadonly(entity, itemList);

					// Sync PrjLocation, ControllingUnit, PrcStructure, CostGroup in this qto detail group.
					let referencedLines = _.filter(dataService.getTheSameGroupQto(entity), function(qtoDetail){
						return qtoDetail.Id !== entity.Id;
					});

					entity.EstLineItemFk = value;
					if (referencedLines && referencedLines.length) {
						_.forEach(referencedLines, function (qtoDetail){
							qtoDetail.EstHeaderFk = entity.EstHeaderFk;
							qtoDetail.EstLineItemFk = value;
							qtoDetail.IsLineItemChange = true;
							dataService.syncQtoDetailGroupProperty(qtoDetail, entity);
						});

						dataService.markEntitiesAsModified(referencedLines);
					}

					let items = _.filter(itemList, function (item) {
						return item.Version > 0 && item.BoqItemFk === entity.BoqItemFk && item.EstLineItemFk && item.Id !== entity.Id;
					});
					if (items.length > 0) {
						if (platformDataValidationService.isEmptyProp(value)) {
							result.valid = false;
							result.error = $translate.instant('qto.main.selectLineItemError');
						}
					}

					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				service.qtoFormulaImageCache = [];

				service.getBlobById = function (id) {
					var defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'cloud/common/blob/getblobbyid?id=' + id).then(function (response) {
						defer.resolve(response.data);
					});
					return defer.promise;
				};

				service.getFormulaImage = function (entity, formulaFk) {
					if(!entity){
						return;
					}

					let entities;

					if(!_.isArray(entity)){
						entities = [entity];
					}else{
						entities = entity;
					}

					function setValueIntoEntity(items, field, value){
						_.forEach(items, function(item){
							item[field] = value;
						});
					}

					if (formulaFk === null || formulaFk === undefined) {
						setValueIntoEntity(entities, 'Blob', null);
					} else {
						var qtoFormula = _.find(lookupDescriptorService.getData('QtoFormula'), {Id: formulaFk});
						if (qtoFormula !== null && qtoFormula !== undefined) {
							var basBlobsFk = qtoFormula.BasBlobsFk;
							setValueIntoEntity(entities, 'BasBlobsFk', basBlobsFk);
							if (basBlobsFk !== null) {
								var imageCache = _.find(service.qtoFormulaImageCache, {Id: basBlobsFk});
								if (imageCache === null || imageCache === undefined) {
									service.getBlobById(basBlobsFk).then(function (data) {
										var blobEntity = {
											Id: basBlobsFk,
											Content: data.Content
										};
										$timeout(function () {
											service.qtoFormulaImageCache.push(blobEntity);
											setValueIntoEntity(entities, 'Blob', data.Content);
										}, 300);
									});
								} else {
									setValueIntoEntity(entities, 'Blob', imageCache.Content);
								}
							} else {
								setValueIntoEntity(entities, 'Blob', null);
							}
						}
					}
				};

				service.clearValueAndOperatorByLineType = function (entity) {
					var qtoLineType = entity.QtoLineTypeFk;
					switch (qtoLineType) {
						// qto line type=1,3,4  qto formula type=1 the value and op  should be all clear
						// qto formula type=1  value and op needn’t  be clear
						// qto formula type=3  value should be all clear
						// qto line type=2/5/6/7:modify boq item with different UoM, the value and op  all clear

						case qtoMainLineType.Standard:
						case qtoMainLineType.Hilfswert:
						case qtoMainLineType.Subtotal:
						case qtoMainLineType.ItemTotal:
							var qtoFormulaFk = entity.QtoFormulaFk;
							var nowQtoFormula = _.find(lookupDescriptorService.getData('QtoFormula'), {Id: qtoFormulaFk});
							if (nowQtoFormula !== null && nowQtoFormula !== undefined) {
								var qtoFormulaTypeFk = nowQtoFormula.QtoFormulaTypeFk;
								if (qtoFormulaTypeFk !== qtoMainFormulaType.FreeInput) {
									service.clearCalculateFields(entity);
									service.clearOperatorFields(entity);
								}
							}
							break;

						case qtoMainLineType.CommentLine:
						case qtoMainLineType.RRefrence:
						case qtoMainLineType.LRefrence:
						case qtoMainLineType.IRefrence:
							service.clearCalculateFields(entity);
							service.clearOperatorFields(entity);
							break;
					}
				};

				var checkValueProperties = ['Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'];
				var checkOperators = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];
				var checkValues = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5'];

				service.validateQtoFormulaFk = function (entity, newValue, filed) {
					// filed is LineText and qto line Type is CommentLine
					if (filed === 'LineText' && entity.QtoLineTypeFk === qtoMainLineType.CommentLine) {
						var result = {apply: true, valid: true};
						entity[filed] = newValue;
						if (newValue && newValue.length > 56) {
							result = {
								apply: false, valid: false,
								error: $translate.instant('qto.main.CommentLine')
							};
						}

						platformRuntimeDataService.applyValidationResult(result, entity, filed);
						platformDataValidationService.finishValidation(result, entity, newValue, filed, service, dataService);

						return result;
					}

					if (filed !== 'QtoFormulaFk') {
						return true;
					}

					let referencedLines = dataService.getTheSameGroupQto(entity);
					if(!referencedLines || referencedLines.length <= 0){
						referencedLines = [entity];
					}

					let newQtoFormula = null;
					if (newValue !== null) {
						var targetData = lookupDescriptorService.getData('QtoFormula');
						newQtoFormula = targetData[newValue];
					}

					_.forEach(referencedLines, function(line){
						service.handleValueAndOperate({apply: true, valid: true}, line);
						line.ignoreScriptValidation = true;
						line.OldQtoFormula = angular.copy(line.QtoFormula);

						if (newValue === null) {
							line.QtoFormula = null;
						} else {
							line.QtoFormula = angular.copy(newQtoFormula);
							line.Result = 0;
							dataService.filterByFormulaUom(line, newValue);
						}
						line.QtoFormulaFk = newValue;

						// change qto formula keep or clear the value & operator
						dealQtoLineValueNOperatorByQtoFormula(line);

						dataService.cellStyleChanged.fire(line);
						dataService.updateReadOnlyDetail(line, lookupDescriptorService.getData('QtoFormulaAllUom'));
					});

					dataService.resizeGrid.fire(referencedLines[referencedLines.length - 1]);

					dataService.updateQtoLineReferenceReadOnly(referencedLines);
					service.getFormulaImage(referencedLines, newValue);
					dataService.markEntitiesAsModified(referencedLines);

					return true;
				};

				service.asyncValidateOperator1 = function (entity, newValue, field) {
					let defer = $q.defer();
					let valid = false, operator, result;
					if (entity.QtoFormulaFk === null) {
						defer.resolve({
							apply: false, valid: false,
							error: $translate.instant('qto.main.SelectQtoFormula')
						});
					} else {
						if (!newValue || newValue === '') {
							result = validateOperator(entity, field, newValue, field, newValue);
							_.forEach(checkOperators, function (item) {
								if (result.valid && item !== field) {
									result = validateOperator(entity, item, entity[item], field, newValue);
								}
							});

							platformDataValidationService.finishValidation(result, entity, newValue, field, service, dataService);
							defer.resolve(result);

							if (result.valid) {
								service.validateValue1ToValue5(entity, field, newValue);
							}

							return defer.promise;
						}

						/* jshint -W074 */ // It is necessary
						var url = 'qto/formula/uom/getFormulaUom?qtoFormulaFk=' + entity.QtoFormulaFk + '&uomFk=' + entity.BasUomFk;
						$http.get(globals.webApiBaseUrl + url).then(function (response) {
							var qtoFormulaUom = response.data;
							if (!qtoFormulaUom) {
								var allQtoFormula;
								var qtoFormulaFk = entity.QtoFormulaFk;

								allQtoFormula = lookupDescriptorService.getData('QtoFormula');
								qtoFormulaUom = _.find(allQtoFormula, {Id: qtoFormulaFk});
							}

							var isEmpty = !newValue || (newValue === '');

							switch (field) {
								case 'Operator1':
									valid = qtoFormulaUom.Operator1 ? isEmpty || qtoFormulaUom.Operator1.indexOf(newValue) >= 0 : false;
									operator = qtoFormulaUom.Operator1;
									break;
								case 'Operator2':
									valid = qtoFormulaUom.Operator2 ? isEmpty || qtoFormulaUom.Operator2.indexOf(newValue) >= 0 : false;
									operator = qtoFormulaUom.Operator2;
									break;
								case 'Operator3':
									valid = qtoFormulaUom.Operator3 ? isEmpty || qtoFormulaUom.Operator3.indexOf(newValue) >= 0 : false;
									operator = qtoFormulaUom.Operator3;
									break;
								case 'Operator4':
									valid = qtoFormulaUom.Operator4 ? isEmpty || qtoFormulaUom.Operator4.indexOf(newValue) >= 0 : false;
									operator = qtoFormulaUom.Operator4;
									break;
								case 'Operator5':
									valid = qtoFormulaUom.Operator5 ? isEmpty || qtoFormulaUom.Operator5.indexOf(newValue) >= 0 : false;
									operator = qtoFormulaUom.Operator5;
									break;
							}
							if (!valid) {
								var operatorErrorTr = operator ? $translate.instant('qto.main.' + operator) : null;
								defer.resolve({
									apply: false, valid: false,
									error: $translate.instant('qto.main.operatorError', {object: operatorErrorTr || 'empty'})
								});
							} else {

								result = validateOperator(entity, field, newValue, field, newValue);
								_.forEach(checkOperators, function (item) {
									if (result.valid && item !== field) {
										result = validateOperator(entity, item, entity[item], field, newValue);
									}
								});

								platformDataValidationService.finishValidation(result, entity, newValue, field, service, dataService);
								defer.resolve(result);

								if (result.valid) {
									service.validateValue1ToValue5(entity, field, newValue);
								}
							}
						});
					}
					return defer.promise;
				};

				service.asyncValidateOperator2 = service.asyncValidateOperator1;
				service.asyncValidateOperator3 = service.asyncValidateOperator1;
				service.asyncValidateOperator4 = service.asyncValidateOperator1;
				service.asyncValidateOperator5 = service.asyncValidateOperator1;

				function validateOperator(entity, model, value, focusOpreatorModel, focusOperatorModelValue) {
					delete entity.ignoreScriptValidation;
					let valueIndex = parseInt(model.replace('Operator', '')),
						isActive = entity.QtoFormula ? entity.QtoFormula['Value' + valueIndex + 'IsActive'] : false,
						isRequired = false,
						maxActiveIdx = dataService.maxActiveValueFieldIndex(entity),
						result = {
							apply: true,
							valid: true
						};

					if (isActive && entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === qtoMainFormulaType.Predefine) {
						// if a operator before this operator column has been set to '=', then this value no need to enter;
						let anyEqualSymbolBefore = false;
						if (valueIndex > 1) {
							for (let i = 1; i < valueIndex; i++) {
								let checkOperVal = entity[checkOperators[i - 1]];
								if (focusOpreatorModel && checkOperators[i - 1] === focusOpreatorModel) {
									checkOperVal = focusOperatorModelValue;
								}
								if (checkOperVal === '=') {
									anyEqualSymbolBefore = true;
								}
							}
						}

						// if operator(n) is not empty, then operator(n-1) can't be empty.
						if (!anyEqualSymbolBefore && !isRequired) {
							for (let k = valueIndex; k < maxActiveIdx; k++) {
								let checkOper = entity[checkOperators[k]];
								if (focusOpreatorModel && checkOperators[k] === focusOpreatorModel) {
									checkOper = focusOperatorModelValue;
								}
								isRequired = (checkOper && checkOper !== '');

								if (isRequired) {
									break;
								}
							}
						}

						// if value(n) is not empty, then operator(n) can't be empty.
						if (!anyEqualSymbolBefore && !isRequired) {
							if (entity[checkValueProperties[valueIndex - 1]] && entity[checkValueProperties[valueIndex - 1]] !== '') {
								isRequired = true;
							}
						}

						if (isRequired) {
							let modelTr = model ? $translate.instant('qto.main.' + model) : null;
							result = platformDataValidationService.isMandatory(value, modelTr);
							platformRuntimeDataService.applyValidationResult(result, entity, model);
						} else {
							removeFieldError(entity, model);
						}

						// check whether the last active operator is '=' or some operator before it is '='
						if (result.valid && value === '=') {
							return result;
						}

						if (result.valid && valueIndex === maxActiveIdx && !anyEqualSymbolBefore && focusOpreatorModel === model) {
							let anyValOrOperatorHasValue = false;
							for (let j = 1; j <= valueIndex; j++) {
								let val = entity[checkValueProperties[j - 1]];
								if (val !== null && val !== '') {
									anyValOrOperatorHasValue = true;
									break;
								}

								val = entity[checkOperators[j - 1]];
								if (val !== null && val !== '' && j < valueIndex) {
									anyValOrOperatorHasValue = true;
									break;
								}
							}
							if (anyValOrOperatorHasValue) {
								result = platformDataValidationService.createErrorObject('qto.main.lastOperatorShouldBeEqualSymbolError', model);
								platformRuntimeDataService.applyValidationResult(result, entity, model);
							}
						}
					}

					return result;
				}

				service.validateOperator1To5 = function (entity) {
					switch (entity.QtoLineTypeFk) {
						case qtoMainLineType.Standard:
						case qtoMainLineType.Hilfswert:
						case qtoMainLineType.Subtotal:
						case qtoMainLineType.ItemTotal:
							if (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === qtoMainFormulaType.Predefine) {
								_.forEach(checkOperators, function (item) {
									validateOperator(entity, item, entity[item]);
								});
							}
							break;
						default:
							return;
					}
				};

				service.validateNSyncQtoLineTypeInGroup = function(entity, targetLineType, previousLineType){
					// Sync Qto Linetype
					if (!targetLineType){
						return;
					}

					let referencedLines = _.filter(dataService.getTheSameGroupQto(entity), function(qtoDetail){
						return qtoDetail.Id !== entity.Id;
					});
					if (referencedLines && referencedLines.length) {
						_.forEach(referencedLines, function (qtoDetail){
							if(previousLineType && previousLineType.Id === 1){
								qtoDetail.bakResult = qtoDetail.Result;
								qtoDetail.Result = '(' + qtoDetail.Result + ')';
							}
							else if(previousLineType.Id === 8 && targetLineType.Id ===1 ){
								dataService.changeQtoLineTypeFromAuxToStd(qtoDetail);
							}

							qtoDetail.QtoLineTypeCode = targetLineType.Code;
							qtoDetail.QtoLineTypeFk = targetLineType.Id;
							qtoDetail.IsCalculate = true;
							service.validateQtoLineTypeFk(qtoDetail, qtoDetail.QtoLineTypeCode);
						});

						dataService.markEntitiesAsModified(referencedLines);
					}
				}

				service.validateQtoLineTypeFk = function (entity, value) {

					let res = {apply: true, valid: true};

					if (!value && !entity.QtoLineTypeFk) {
						res = platformDataValidationService.createErrorObject(moduleName + '.QtoLineTypeCodeNotFound');
						platformDataValidationService.finishValidation(res, entity, value, 'QtoLineTypeCode', service, dataService);
						return res;
					}

					if($injector.get('qtoMainHeaderDataService').getGqIsAvailable() && entity.IsGQ){
						service.validateIsGQ(entity, entity.IsGQ, 'IsGQ');
					}

					if (value) {
						value = value.toString();
					}

					dataService.isFirstStep = (entity.QtoLineTypeFk === qtoMainLineType.LRefrence);

					let isKeepResult = entity.QtoLineTypeFk === qtoMainLineType.CommentLine || entity.QtoLineTypeFk === qtoMainLineType.RRefrence ||
						entity.QtoLineTypeFk === qtoMainLineType.LRefrence || entity.QtoLineTypeFk === qtoMainLineType.IRefrence;

					if (entity.QtoLineTypeFk !== qtoMainLineType.ItemTotal && entity.QtoLineTypeFk !== qtoMainLineType.Subtotal && entity.QtoLineTypeFk !== qtoMainLineType.Standard && entity.QtoLineTypeFk !== qtoMainLineType.Hilfswert) {
						entity.QtoFormulaFk = null;
						entity.QtoFormula = null;
						entity.ignoreScriptValidation = true;
						removeErrorForValue1ToValue5AndOp1ToOp5(entity);
						removeFieldError(entity, 'Result');
						service.clearCalculateFields(entity, isKeepResult);
						service.clearOperatorFields(entity);
						entity.Factor =1;
					} else if(!entity.QtoFormulaFk){ // set as default
						let qtoHeader = dataService.parentService().getSelected();
						let qtoFormulas = lookupDescriptorService.getData('QtoFormula');
						let qtoFormula = _.find(qtoFormulas, {'BasRubricCategoryFk': qtoHeader.BasRubricCategoryFk, 'IsDefault': true });
						if (qtoFormula){
							entity.QtoFormulaFk = qtoFormula.Id;
							entity.QtoFormula = qtoFormula;
						}
					}

					let isCommentLine = entity.QtoLineTypeFk === qtoMainLineType.CommentLine;
					if (isCommentLine) {
						var readOnlyColumns = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5',
							'Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5', 'Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'];
						dataService.updateReadOnly(entity, readOnlyColumns, true);
					}
					dataService.cellStyleChanged.fire(dataService.getSelected());
					dataService.resizeGrid.fire(dataService.getSelected());
					dataService.updateReadOnlyDetail(entity);
					// dataService.gridRefresh();

					platformRuntimeDataService.applyValidationResult(res, entity, 'QtoLineTypeCode');
					platformDataValidationService.finishAsyncValidation(res, entity, value, 'QtoLineTypeCode', null, service, dataService);
					return res;
				};

				service.validateValue1 = function (entity, value, field) {
					if (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === 2) {
						return $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, dataService);
					}
				};

				function checkQtoDetailMaxLinenumber(qtoDetail){
					let result = {valid: true};

					if(!qtoDetail || !qtoDetail.QtoFormula || !_.isNumber(qtoDetail.QtoFormula.MaxLinenumber)){
						return result;
					}

					let referencedLines = dataService.getReferencedDetails(qtoDetail);
					if (referencedLines.length > qtoDetail.QtoFormula.MaxLinenumber) {
						result = platformDataValidationService.createErrorObject('qto.main.detail.outOfMaxLineNumber', {
							value0: qtoDetail.QtoFormula.Code,
							value1: qtoDetail.QtoFormula.MaxLinenumber
						});
					}

					return result;
				}

				service.asyncValidateValue1 = function (entity, newValue, field, formatterOptions, result) {
					let defer = $q.defer();
					if (field === 'LineText' && entity.QtoLineTypeFk === qtoMainLineType.CommentLine) {
						defer.resolve(true);
						return defer.promise;
					} else if (newValue !== entity.BoqItemFk && newValue && ((entity.QtoLineTypeFk === 6 && field === 'BoqItemReferenceFk'))) {
						let boqService = dataService.getBoqService();
						let qtoBoqList = $injector.get('basicsLookupdataLookupDescriptorService').getData('boqItemLookupDataService');
						let qtoBoq =  _.find(qtoBoqList,{'Id':newValue});

						if(!qtoBoq){
							qtoBoqList = boqService.getList();
							qtoBoq =  _.find(qtoBoqList,{'Id':newValue});
						}
						if (qtoBoqList) {
							if (qtoBoq && (qtoBoq.BoqLineTypeFk === 0 || qtoBoq.BoqLineTypeFk === 11)) {
								dataService.updateReadOnlyDetail(entity);
								defer.resolve(true);
							} else {
								defer.resolve({
									apply: false, valid: false,
									error: $translate.instant('qto.main.selectBoqItemError')
								});
							}
						}
						return defer.promise;
					} else if (entity.QtoLineTypeFk === 7) {
						if (!newValue) {
							defer.resolve({
								apply: false, valid: false,
								error: $translate.instant('qto.main.selectBoqItemError')
							}
							);
						} else {
							defer.resolve(true);
						}
						return defer.promise;

					} else if (result) {
						if (entity.__rt$data && entity.__rt$data.errors && result.valid){
							entity.__rt$data.errors[field] = null;
							platformDataValidationService.finishValidation(result, entity, newValue, field, service, dataService);
							dataService.gridRefresh();
						}
						entity.HasError = !result.valid;
						defer.resolve(result);
						return defer.promise;
					} else {
						let orignalReferencedQtoDetails = dataService.getReferencedDetails(entity);

						// update grouping info
						let newValueEndsWithEqualSymbol = newValue && newValue.toString().endsWith('=');
						let entityEndsWithEqualSymbol = dataService.isEndWithEqualSymbol(entity);
						if(newValueEndsWithEqualSymbol || entityEndsWithEqualSymbol){
							let isRemoveEqualSymbol = entityEndsWithEqualSymbol && !newValueEndsWithEqualSymbol;
							entity[field] = newValue;

							if(isRemoveEqualSymbol){
								dataService.updateQtoDetailGroupInfo();
							}else{
								dataService.updateQtoDetailGroupInfo(orignalReferencedQtoDetails);
							}
						}

						if(entity && entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput){
							let result = checkQtoDetailMaxLinenumber(entity);
							if(result && !result.valid){
								//dataService.updateQtoDetailGroupInfo ();
								platformDataValidationService.finishValidation(result, entity, newValue, field, service, dataService);
								defer.resolve(result);
								return defer.promise;
							}
							else{
								_.forEach(orignalReferencedQtoDetails, function(qtoDetail){
									if(qtoDetail.Id === entity.Id || (!qtoDetail.__rt$data || !qtoDetail.__rt$data.errors || !qtoDetail.__rt$data.errors[field])){
										return;
									}
									result = checkQtoDetailMaxLinenumber(qtoDetail);
									if(result.valid && qtoDetail.__rt$data.errors[field].error$tr$ === 'qto.main.detail.outOfMaxLineNumber'){
										dataService.markEntitiesAsModified(dataService.getReferencedDetails(qtoDetail));
										qtoDetail.__rt$data.errors[field] = null;
										platformDataValidationService.finishValidation(result, qtoDetail, qtoDetail[field], field, service, dataService);
									}
								});
							}
						}

						let asyncMarker = platformDataValidationService.registerAsyncCall(entity, newValue, field, dataService);
						asyncValidateValue(asyncMarker, entity, newValue, field, field.replace('Detail', ''));
						return asyncMarker.myPromise;
					}
				};
				service.asyncValidateValue2 = service.asyncValidateValue1;
				service.asyncValidateValue3 = service.asyncValidateValue1;
				service.asyncValidateValue4 = service.asyncValidateValue1;
				service.asyncValidateValue5 = service.asyncValidateValue1;

				service.asyncValidateValue1Detail = service.asyncValidateValue1;
				service.asyncValidateValue2Detail = service.asyncValidateValue1;
				service.asyncValidateValue3Detail = service.asyncValidateValue1;
				service.asyncValidateValue4Detail = service.asyncValidateValue1;
				service.asyncValidateValue5Detail = service.asyncValidateValue1;

				service.asyncValidateLineText = service.asyncValidateValue1;

				// if this function is work fine, then remove func freeInputLineTextBeforeValidation
				function freeInputLineTextBeforeValidationV10(value, field, entity, referenceList){
					let jsMathOperatorAndFunctions = ['**', 'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'atan2', 'ceil', 'cbrt', 'expm1', 'clz32', 'cos', 'cosh', 'exp', 'floor', 'fround', 'hypot', 'imul', 'log', 'log1p', 'log2', 'log10', 'max', 'min', 'pow', 'random', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc'];
					let result = {
						value: value,
						endWithOperator: false
					};

					value = value || '';

					let detail = angular.copy(entity);
					detail[field] = value;
					let referencedLines = dataService.getReferencedDetails(detail);

					_.each(referencedLines, function(line){
						if(line.Id !== entity.Id){
							referenceList.push(line);
						}
					});

					let index = _.findIndex(referencedLines, function (line) {
						return line.PageNumber === entity.PageNumber && line.LineReference === entity.LineReference && line.LineIndex === entity.LineIndex;
					});
					result.endWithOperator = index !== referencedLines.length - 1;

					if (checkValueProperties.indexOf(field) >= 0 || field === 'LineText') {
						for (let i = 0; i < jsMathOperatorAndFunctions.length; i++) {
							let fName = jsMathOperatorAndFunctions[i];

							if (!_.endsWith(value, fName)) {
								continue;
							}

							let nextEntity = referencedLines[index + 1];

							if (_.isUndefined(nextEntity)) {
								continue;
							}

							result.endWithOperator = false;
						}
					}

					let formulaStr = '';
					_.forEach(referencedLines, function (item){
						let currentFormula = item.Id === entity.Id ? value : (item.LineText || '');
						formulaStr += ' ' + currentFormula;
					});

					result.value = formulaStr;
					return result;
				}

				function asyncValidateValue(asyncMarker, entity, value, field, name) {

					let codesHasChecked = [];
					let detailVal = '';

					let endWithOperator = false, originalValue = value;
					let isMultiline = false;
					let referenceList = [];
					if (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === 2 && entity.QtoFormula.IsMultiline) {
						isMultiline = true;
						let result = freeInputLineTextBeforeValidationV10(value, field, entity, referenceList);
						value = result.value;
						// endWithOperator = result.endWithOperator; // will validate the group for multi-lines formula
					}
					if (value && value.replace) {
						detailVal = value.replace(/=$/g, ''); // only replace the last '='
					}
					let exp = '&exp=';
					// eslint-disable-next-line no-useless-escape
					if ((new RegExp('[^a-zA-Z\\d\.]', 'g')).test(value) && (checkValueProperties.indexOf(field) >= 0 || field === 'LineText')) {
						exp += encodeURIComponent(value);
					}

					asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'qto/main/detail/checkformulaandgetdetailrefs?qtoHeaderId=' + entity.QtoHeaderFk + exp).then(function (response) {
						let data = response.data,
							qtoDetailCodeMap = data.CodeMap,
							referenceDic = data.ReferenceDic,
							errorInfos = data.formulaError,
							isEndWithOperator = (new RegExp('[-+*/%^]$', 'g')).test(originalValue),
							result = {
								apply: true,
								valid: true
							};

						if (exp || errorInfos) {
							let errStr = '', i = 1;
							_.forEach(errorInfos, function (item) {
								if (endWithOperator && _.startsWith(item, 'End with a operator:')) {
									detailVal = detailVal.trimEnd().slice(0, detailVal.length - 1);
									isEndWithOperator = true;
									return;
								}

								errStr += ' &#10;';
								errStr += i + ', ' + item;
								i++;
							});

							if (endWithOperator && !isEndWithOperator && value) {
								errStr += ' &#10;';
								errStr += i + ', ' + 'Multiline freeinput formula need end with operator:' + value;
							}else if(new RegExp('\\.[^0-9]', 'g').test(value)){
								errStr += ' &#10;';
								errStr += i + ', ' + $translate.instant('cloud.common.ERROR_TYPE_NUMBER');
							}else if(new RegExp('([-+]\\s*){2,}', 'g').test(value)){
								errStr += ' &#10;';
								errStr += i + ', Wrong operator between two variate or value';
							}

							result.valid = errStr === '';
							if (!result.valid) {
								result.error = errStr;
							}
						}

						function checkSelfReference(codeToCheck, selfCode) {
							let hasSelfReference = false;

							if (codeToCheck.indexOf(selfCode) > -1) {
								return true;
							}

							_.forEach(codeToCheck, function (item) {
								if (codesHasChecked.indexOf(item) < 0) {
									let nextToCheck = _.find(qtoDetailCodeMap, {code: item});
									codesHasChecked = codesHasChecked.concat(item);
									if (nextToCheck && nextToCheck.referenceCodes && checkSelfReference(nextToCheck.referenceCodes, selfCode)) {
										hasSelfReference = true;
									}
								}
							});

							return hasSelfReference;
						}

						function checkCycleReference(referenceDic, codeToCheck, selfCode) {
							let cycleReferences = [];
							_.forEach(codeToCheck, function (item) {
								let itemTemp = padLeft(item.toString(), 6);
								if (Object.hasOwnProperty.call(referenceDic, itemTemp)) {
									if (referenceDic[itemTemp].indexOf(selfCode) !== -1) {
										cycleReferences.push(itemTemp);
									}
								}
							});

							return cycleReferences;
						}

						let reg = new RegExp('(\\d{0,4}[a-zA-Z]\\d)|(\\d+[a-zA-Z])|(\\d*[a-zA-Z]+\\d*)', 'g');
						let jsMathFunctions = ['abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'atan2', 'ceil', 'cbrt', 'expm1', 'clz32', 'cos', 'cosh', 'exp', 'floor', 'fround', 'hypot', 'imul', 'log', 'log1p', 'log2', 'log10', 'max', 'min', 'pow', 'random', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc'];
						let jsConstant = ['E', 'LN2', 'LN10', 'LOG2E','LOG10E', 'PI', 'SQRT1_2', 'SQRT2'];

						let code = dataService.getCode(entity);

						let qtoDetailCodeList = _.map(qtoDetailCodeMap, 'code');

						if (result.valid) {
							if (value && value.length >= 2) {

								// remove js Math function, then match parameters.
								let filterValue = value;
								_.forEach(jsMathFunctions, function (fun){
									let reg = new RegExp(fun +'\\s*\\(', 'gi');
									filterValue = filterValue.replace(reg, '(');
								});

								let qtoReferenceCodes = filterValue.match(reg);
								let transformQtoReferences = [];
								let codeFormulas = [];
								if (qtoReferenceCodes && qtoReferenceCodes.length > 0) {
									_.forEach(qtoReferenceCodes, function (item) {
										item = item.toString().toUpperCase();

										if(jsConstant.indexOf(item) < 0){
											let strReference = padLeft(item, 6);
											transformQtoReferences.push(strReference);

											// set the match code array
											let codeFormula = {code: '', matchCode: ''};
											codeFormula.code = strReference;
											codeFormula.matchCode = item.toString();
											codeFormulas.push(codeFormula);
										}
									});
									let hasUnValidCode = _.some(transformQtoReferences, function (referenceCode) {
										return qtoDetailCodeList.indexOf(referenceCode) === -1;
									});

									if (hasUnValidCode) {
										result = platformDataValidationService.createErrorObject('qto.main.hasUnValidCodeErrorMessage', {});
									}

									if (result.valid && checkSelfReference(transformQtoReferences, code)) {
										result = platformDataValidationService.createErrorObject('qto.main.selfReferenceErrorMessage', {});
									}

									if (result.valid) {
										let cycleReferences = checkCycleReference(referenceDic, transformQtoReferences, code);
										if (cycleReferences.length > 0) {
											let errorText = '';
											_.forEach(cycleReferences, function (item) {
												errorText = (errorText !== '' ? errorText + '-' : '') + item + '-' + code;
											});
											result = platformDataValidationService.createErrorObject('qto.main.cycleReferenceErrorMessage', {object: errorText});
										}
									}

									if (result.valid) {
										_.forEach(transformQtoReferences, function (item) {
											let codeformula = _.find(codeFormulas, {'code': item});
											let isMatch = codeformula && codeformula.matchCode && codeformula.matchCode.length < 6;
											let referenceItem = _.find(qtoDetailCodeMap, {code: item});
											if (referenceItem) {
												item = isMatch ? item.replace(/\b(0+)/gi, '') : item;
												referenceItem.code = isMatch ? referenceItem.code.replace(/\b(0+)/gi, '') : referenceItem.code;
												let reg = new RegExp(item, 'gi');
												detailVal = detailVal.replace(reg, referenceItem.result);
											}
										});
									}
								}
							} else if (field === 'QtoDetailReferenceFk') {
								if (result.valid) {
									let qtoDetail = _.find(qtoDetailCodeMap, {id: value});
									if (qtoDetail) {
										let errorText2 = '';
										if (qtoDetail.qtoDetailReferenceFk === entity.Id) {
											errorText2 = (errorText2 !== '' ? errorText2 + '-' : '') + entity.QtoDetailReference + '-' + qtoDetail.code;
											result.error = $translate.instant('qto.main.cycleReferenceErrorMessage', {object: errorText2});
											result.valid = false;
										} else if (qtoDetail.code) {
											let qtoReferenceCodes2 = qtoDetail.code.match(reg);
											let cycleReferences2 = checkCycleReference(referenceDic, qtoReferenceCodes2, code);
											if (cycleReferences2.length > 0) {
												_.forEach(cycleReferences2, function (item) {
													errorText2 = (errorText2 !== '' ? errorText2 + '-' : '') + item + '-' + code;
												});
												result.error = $translate.instant('qto.main.cycleReferenceErrorMessage', {object: errorText2});
												result.valid = false;
											}
										}
									}
								}
							}
						}

						if (result.valid) {
							if (name) {
								try {
									// eslint-disable-next-line no-useless-escape
									detailVal = detailVal.replace(/\,/g, '.');
									let evalResult = detailVal !== null && detailVal !== '' ? math.eval(detailVal.replace(/\*\*/g, '^').toLocaleLowerCase()) : '';
									if (angular.isNumber(evalResult) && field !== 'LineText') {
										entity[name] = evalResult;
									}
								} catch (ex) {
									if (!entity.QtoFormula || entity.QtoFormula.QtoFormulaTypeFk !== 2 || !entity.QtoFormula.IsMultiline) {
										entity[name] = 0;
									}
								}
							}

							if (result.valid) {
								result = scriptValidate(entity, field, (value === null || value === '' ? entity[name] : value));

							}
						}

						function validateRebCharacterLength(value, validateResult){
							if(_.isString(value) && value.length > 38){
								validateResult.error = $translate.instant('qto.main.detail.validationText.maxCharacterLenthReb23003');
								validateResult.valid = false;
							}
						}

						if (result.valid && entity.QtoFormula && !entity.QtoFormula.IsMultiline && entity.QtoFormula.QtoFormulaTypeFk === 2 && entity.QtoFormula.BasRubricCategoryFk === 84){
							validateRebCharacterLength(originalValue, result);
						}

						// shoud finish validation
						platformDataValidationService.finishValidation(result, entity, value, field, service, dataService);

						if(isMultiline || (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === 2 && entity.QtoFormula.BasRubricCategoryFk === 84)) {
							entity.HasError = !result.valid;
							// for isMultiLine qtolines, do validation for other reference lines
							if (referenceList && referenceList.length > 0) {
								_.each(referenceList, function (line) {
									service.asyncValidateValue1(line, line[field], field, undefined, result);
								});

								if(entity.QtoFormula && !entity.QtoFormula.IsMultiline && entity.QtoFormula.QtoFormulaTypeFk === 2 && entity.QtoFormula.BasRubricCategoryFk === 84 && field === 'LineText'){
									let characterLengthResult = angular.copy(result);
									characterLengthResult.valid = true;
									_.each(referenceList, function (line) {
										validateRebCharacterLength(line.LineText, characterLengthResult);

										if (!characterLengthResult.valid){
											platformRuntimeDataService.applyValidationResult(characterLengthResult, line, field);
											platformDataValidationService.finishValidation(characterLengthResult, line, line[field], field, service, dataService);
										}
									});
									dataService.gridRefresh();
								}
							}
						}

						return result;
					});
				}

				function scriptValidate(entity, model, value, validationIsFromBeforeEdit) {
					var valueIndex = parseInt(model.replace('Value', '').replace('Detail', '')),
						result = {
							apply: true,
							valid: true
						};
					if (entity.QtoFormula && entity.QtoFormula.QtoFormulaScriptEntities !== null && entity.QtoFormula.QtoFormulaScriptEntities.length > 0) {

						dataService.updateQtoDetailGroupInfo();

						var parameterList = getValuesParameter(entity, model, value);
						var referencedDetails = getItemForValidation(dataService.getReferencedDetails(entity));
						parameterList.push({
							'VariableName': 'ReferencedItems',
							'InputValue': referencedDetails
						});

						var scriptData = {
							ParameterList: parameterList,
							ValidateScriptData: entity.QtoFormula.QtoFormulaScriptEntities[0].ValidateScriptData || ''
						};

						// var reg = new RegExp('(^-?\\d+\\.\\d+$)|(^-?\\d+$)', 'g');
						_.forEach(scriptData.ParameterList, function (item) {
							if (item.VariableName === 'val' + valueIndex) {
								item.InputValue = (value === null || value === '') ? '' : value.replace(/\,/g, '.')  - 0;
							}
						});

						var response = scriptEvalService.synValidate(scriptData);
						if (response && response.length > 0) {
							var errorInfo = _.filter(response, function (info) {
								// eslint-disable-next-line no-prototype-builtins
								return info.hasOwnProperty('HasError') && info.HasError === true && info.Name.toLowerCase() === 'val' + valueIndex;
							});

							if (errorInfo.length === 0) {
								errorInfo = _.filter(response, function (info) {
									// eslint-disable-next-line no-prototype-builtins
									return info.hasOwnProperty('HasError') && info.HasError === true && info.Name.toLowerCase() === model.toLowerCase();
								});
							}

							if (errorInfo.length > 0) {
								var errorStr = '';
								for (var i = 0; i < errorInfo.length; i++) {
									if (i > 0) {
										errorStr += '&#10';
									}
									errorStr += errorInfo[i].Error;
								}
								if (value !== null || validationIsFromBeforeEdit) {
									result.valid = false;
									result.error = errorStr;
									result.errorType = 'scriptError';
								}
							}
						}
						setValueFieldIsDisableAfterScriptValidation(entity, response);
					}

					return result;
				}

				function getPiValue() {
					let category = 1;
					let currentHeader = dataService.getQtoHeader();

					if (currentHeader) {
						category = currentHeader.BasRubricCategoryFk;
					}

					switch (category)
					{
						// Onorm
						case 525:
							return 3.141592654;
						default:
							return 3.14159265359;
					}
				}

				var getRho = function () {
					let gonimeter = 3;
					let currentHeader = dataService.getQtoHeader();
					let PI = getPiValue();
					if (currentHeader) {
						gonimeter = currentHeader.BasGoniometerTypeFk;
					}
					switch (gonimeter) {
						// Degree
						case 1:
							return PI / 180.0;
						// Gradian
						case 2:
							return PI / 200.0;
						// Radian
						case 3:
							return 1;
					}
				};

				service.scriptValidateForUserForm = function(entity, userFormData) {
					var result = {
						valid : true,
						error : ''
					};
					var response = [];
					function getParameter(valueItem) {
						var parameters = [];

						for (var valueIndex = 1; valueIndex <= checkValueProperties.length; valueIndex++) {

							var valueValue = valueItem[checkValues[valueIndex - 1]];
							valueValue = valueValue === null || valueValue === '' ? '' : valueValue - 0;

							parameters.push({'VariableName': 'val' + valueIndex, 'InputValue': valueValue});
							parameters.push({'VariableName': 'val' + valueIndex + 'Detail', 'InputValue': valueValue.toString()});

							var operator = valueItem[checkOperators[valueIndex - 1]];
							operator = operator === null || operator === '' ? '' : operator;
							parameters.push({'VariableName': 'operator' + valueIndex, 'InputValue': operator});
						}

						// parameters.push({'VariableName': 'factor', 'InputValue': data.Factor});
						parameters.push({'VariableName': 'reference', 'InputValue': valueItem.QtoDetailReference ? valueItem.QtoDetailReference : ''});
						parameters.push({'VariableName': 'factor', 'InputValue': 0});
						parameters.push({'VariableName': 'result', 'InputValue': 0});
						parameters.push({'VariableName': 'subtotal', 'InputValue': 0});
						parameters.push({'VariableName': 'linetext', 'InputValue': ''});
						parameters.push({'VariableName': 'remarktext', 'InputValue': ''});
						parameters.push({'VariableName': 'remark1text', 'InputValue': ''});
						parameters.push({'VariableName': 'translator', 'InputValue': scriptTransService.getTranslator()});
						parameters.push({'VariableName': 'RHO', 'InputValue': getRho()});
						parameters.push({'VariableName': 'PI', 'InputValue': getPiValue()});

						return parameters;
					}

					if (entity.QtoFormula && entity.QtoFormula.QtoFormulaScriptEntities !== null && entity.QtoFormula.QtoFormulaScriptEntities.length > 0 && userFormData) {
						if(!_.isArray(userFormData.valueList) || userFormData.valueList.length <= 0) {
							return {
								result: result,
								scriptResponse: response
							};
						}
						dataService.updateQtoDetailGroupInfo();
						var referencedDetails = getItemForValidation(userFormData.valueList);

						var validateResults = [];
						_.forEach(userFormData.valueList,function(value){
							var parameterList = getParameter(value);

							parameterList.push({
								'VariableName': 'ReferencedItems',
								'InputValue': referencedDetails
							});

							var scriptData = {
								ParameterList: parameterList,
								ValidateScriptData: entity.QtoFormula.QtoFormulaScriptEntities[0].ValidateScriptData || ''
							};

							var synValidateResult = scriptEvalService.synValidate(scriptData);

							if (synValidateResult && synValidateResult.length > 0) {
								response = response.concat([synValidateResult]);

								var errorInfo = _.filter(synValidateResult, function (info) {
									// eslint-disable-next-line no-prototype-builtins
									return info.hasOwnProperty('HasError') && info.HasError === true && (info.Name.toLowerCase().startsWith('val') || info.Name.toLowerCase().startsWith('operator'));
								});

								if (errorInfo.length > 0) {
									validateResults = validateResults.concat(errorInfo);
								}
							}
						});

						var errorStr = '';
						if (validateResults && validateResults.length > 0) {
							result.valid = false;
							result.errorType = 'scriptError';

							var groupValidateResults = _.groupBy(validateResults, 'Error');

							_.forEach(groupValidateResults, function(fields, error){
								errorStr = errorStr + error + '&#10';
							});

							result.error += result.error + errorStr;
						}
					}

					return {
						result: result,
						scriptResponse: response
					};
				};

				service.validateFieldBeforeEdit = function (entity, model) {
					var result = scriptValidate(entity, model, entity[model], true);
					if (result.valid) {
						if (entity.__rt$data && entity.__rt$data.errors) {
							var error = entity.__rt$data.errors[model];
							if (error && error.errorType === 'scriptError') {
								removeFieldError(entity, model);
							}
						}
					} else {
						platformRuntimeDataService.applyValidationResult(result, entity, model);
					}
				};

				function setValueFieldIsDisableAfterScriptValidation(entity, response) {
					for (var valueIndex = 1; valueIndex <= checkValueProperties.length; valueIndex++) {
						let checkValueProp = checkValueProperties[valueIndex - 1];
						let checkValue = checkValues[valueIndex - 1];
						let checkOperator = checkOperators[valueIndex - 1];
						if (!!entity.QtoFormula && entity.QtoFormula['Value' + valueIndex + 'IsActive']) {
							var disableInfo = service.disableOrEnableInfo(response, true, valueIndex);
							if(disableInfo && disableInfo.length > 0){
								dataService.updateReadOnly(entity, [checkValueProp], true);
								if (entity.QtoFormula.QtoFormulaTypeFk === qtoMainFormulaType.Predefine) {
									dataService.updateReadOnly(entity, [checkOperator], true);
								}
							}

							var enableInfo = service.disableOrEnableInfo(response, false, valueIndex);
							if (enableInfo && enableInfo.length > 0) {
								dataService.updateReadOnly(entity, [checkValueProp], false);
								if (entity.QtoFormula.QtoFormulaTypeFk === qtoMainFormulaType.Predefine) {
									dataService.updateReadOnly(entity, [checkOperator], false);
								}
							}

							let readonlyInfo = getReadonlyInfo(response, 'val' + valueIndex);
							if(readonlyInfo){
								if(readonlyInfo.IsReadonly){
									entity[checkValueProp] = null;
									entity[checkValue] = null;
								}

								dataService.updateReadOnly(entity, [checkValueProp, checkValue], !!readonlyInfo.IsReadonly);
							}
						}
					}

					dataService.clearReadOnlyCfgForValueAndOptFile(entity);
				}

				function getReadonlyInfo(response, responseErrorfield){
					return _.find(response, function (info) {
						return Object.prototype.hasOwnProperty.call(info, 'IsReadonly') && info.Name.toLowerCase() === responseErrorfield;
					});
				}

				service.disableOrEnableInfo = function disableOrEnableInfo(data, isDisalbe, valueIndex) {
					return _.filter(data, function (info) {
						// eslint-disable-next-line no-prototype-builtins
						return ((info.hasOwnProperty('IsDisabled') && info.IsDisabled === isDisalbe && info.Name.toLowerCase() === 'val' + valueIndex) ||
							// eslint-disable-next-line no-prototype-builtins
							(info.hasOwnProperty('IsHidden') && info.IsHidden === false && info.Name.toLowerCase() === 'val' + valueIndex));
					});
				};

				service.clearCalculateFields = function (entity, isKeepResult) {
					entity.Value1 = null;
					entity.Value2 = null;
					entity.Value3 = null;
					entity.Value4 = null;
					entity.Value5 = null;
					entity.Value1Detail = null;
					entity.Value2Detail = null;
					entity.Value3Detail = null;
					entity.Value4Detail = null;
					entity.Value5Detail = null;
					entity.FormulaResult = null;
					entity.PrjLocationReferenceFk = null;
					entity.QtoDetailReferenceFk = null;
					entity.BoqItemReferenceFk = null;
					entity.LineText = null;
					// if commentLine to keep the result
					entity.Result = isKeepResult ? entity.Result : 0;
					// entity.Factor = null;
				};
				service.clearOperatorFields = function (entity) {
					entity.Operator1 = null;
					entity.Operator2 = null;
					entity.Operator3 = null;
					entity.Operator4 = null;
					entity.Operator5 = null;
				};

				function validateLineAddressInGroup(entity, value, model){ // validate qto line address is used in another qto detail group or not.
					let entityCopy = angular.copy(entity);
					entityCopy[model] = value;
					entityCopy.QtoDetailReference = dataService.getCode(entityCopy);

					let isUsed = dataService.isUsedInOtherGroup([entityCopy]);

					if (!isUsed.isValid && isUsed.inValidLine){
						let info = 'qto.main.lineReferenceIsUsedInAnotherGroup',
							infoParam =  {
								linereference: isUsed.inValidLine
							},
							message = $injector.get('$translate').instant(info, infoParam);

						$injector.get('platformModalService').showMsgBox(message, 'qto.main.changeLineReferenceFailed', 'info');
						return platformDataValidationService.createErrorObject(info,infoParam);
					}

					return platformDataValidationService.createSuccessObject();
				}

				service.qtoAddressValidate = function qtoAddressValidate(entity, pageNumber, lineReference, lineIndex, value, model) {

					if (isNaN(lineIndex) || lineIndex === '') {
						lineIndex = 0;
					}

					if (isNaN(pageNumber) || pageNumber === '') {
						pageNumber = 1;
					}

					pageNumber = parseInt(pageNumber);
					lineIndex = parseInt(lineIndex);
					entity.LineReference = lineReference;
					entity.PageNumber = pageNumber;
					entity.LineIndex = lineIndex;
					entity.IsModifyLineReference = true;
					let postParam = {
						Id: [entity.Id],
						QtoHeaderId: entity.QtoHeaderFk,
						PageNumber: [pageNumber],
						LineReference: [lineReference],
						LineIndex: [lineIndex],
						IsCheckedSheet: true
					};

					let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

					asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'qto/main/detail/ismapqtoaddress', postParam).then(
						function (response) {
							let data = response.data;
							let result = {
								apply: true,
								valid: true
							};

							if(data.ErrorSheet && model==='PageNumber'){
								result.apply = true;
								result.valid = false;
								result.error = $translate.instant('qto.main.detail.addressOverflow');
							}

							if(data.ErrorIndex && model==='LineIndex'){
								result.apply = true;
								result.valid = false;
								result.error = $translate.instant('qto.main.detail.addressOverflow');
							}

							if(data.ErrorLine && model==='LineReference'){
								result.apply = true;
								result.valid = false;
								result.error = $translate.instant('qto.main.detail.addressOverflow');
							}

							// validate for sheet
							let isSheetReadonly = data.IsSheetReadonly;
							if (result.valid) {
								if (isSheetReadonly) {
									result.apply = true;
									result.valid = false;
									result.error = $translate.instant('qto.main.sheetReadonly');
								}
							}

							if (result.valid) {
								if (!data.IsLiveOrReadable){
									result.apply = true;
									result.valid = false;
									result.error = $translate.instant('qto.main.sheetNoIsLiveOrReadable');
								}
							}

							// validate for unique
							if (result.valid) {
								let isUnique = data.IsUnique;
								if (isUnique) {
									var qtoDetailList = dataService.getList();
									angular.forEach(qtoDetailList, function (qto) {
										if (qto.LineReference === lineReference && qto.PageNumber === pageNumber && qto.LineIndex === lineIndex && qto.Id !== entity.Id) {
											isUnique = false;
										}
									});
								}

								result = {apply: true, valid: isUnique};
								if (!result.valid) {
									var pageNumberErrorTr = $translate.instant('qto.main.PageNumber');
									var lineReferenceErrorTr = $translate.instant('qto.main.LineReference');
									var lineIndexErrorTr = $translate.instant('qto.main.LineIndex');
									result.error = $translate.instant('qto.main.threeFiledUniqueValueErrorMessage', {
										field1: pageNumberErrorTr,
										field2: lineReferenceErrorTr,
										field3: lineIndexErrorTr
									});
								}
							}

							if (result.valid) {
								result = service.checkDependentQtoDetailItem(entity, pageNumber, lineReference, lineIndex);
							}

							if (result.valid) {
								entity.PageNumber = pageNumber;
								entity.LineIndex = lineIndex;

								var sortProperty = ['PageNumber', 'LineReference', 'LineIndex'];
								dataService.getList().sort(dataService.sortDetail(sortProperty));

								// page number+line reference+line index, if lineReference.length > 1, it is Onorm qto
								if (lineReference.length > 1)
								{
									entity.QtoDetailReference = padLeft(pageNumber.toString(), 4) + lineReference.toString() + padLeft(lineIndex.toString(), 3);
								}
								else
								{
									entity.QtoDetailReference = padLeft(pageNumber.toString(), 4) + lineReference + lineIndex;
								}

								entity.Code = entity.QtoDetailReference; // TODO: when bulk edit,show the code
								dataService.gridRefresh();
							}

							if (result.valid === true) {
								if (!data.ErrorSheet) {
									platformDataValidationService.finishAsyncValidation(result, entity, pageNumber, 'PageNumber', asyncMarker, service, dataService);
								}
								if (!data.ErrorLine) {
									platformDataValidationService.finishAsyncValidation(result, entity, lineReference, 'LineReference', asyncMarker, service, dataService);

								}
								if (!data.ErrorIndex) {
									platformDataValidationService.finishAsyncValidation(result, entity, lineIndex, 'LineIndex', asyncMarker, service, dataService);
								}

							} else {
								platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
							}


							// create the sheet no
							if (result.valid && model === 'PageNumber') {
								dataService.setPageNumberCreated(value); // create sheet in validation
								return $injector.get('qtoMainStructureDataService').createQtoStructure(value, entity.QtoHeaderFk, boqType, entity.QtoTypeFk).then(function (sheetItem) {
									entity.QtoSheetFk = sheetItem ? sheetItem.Id : null;
									dataService.setSelected(entity);
									var cell = dataService.getPageNumberCell();
									cell = cell ? cell : 0;
									var options = {
										item: entity,
										cell: cell + 1,
										forceEdit: true
									};
									dataService.setCellFocus(options);
								});
							}

							return result;
						}
					);
					return asyncMarker.myPromise;
				};

				service.validatePageNumber = function (entity, value, model) {
					if (value === 0) {
						value = '';
						entity[model] = value;
					}

					let fieldErrorTr = {
						fieldName: $translate.instant('qto.main.' + model)
					};
					let result = platformDataValidationService.isMandatory(value, model, fieldErrorTr);

					// validate for sheet readonly
					if (result.valid) {
						let qtoSheets = $injector.get('qtoMainStructureDataService').getList();
						let qtoSheet = _.find(qtoSheets, {'PageNumber': value, 'IsReadonly': true});
						if (qtoSheet) {
							result.apply = true;
							result.valid = false;
							result.error = $translate.instant('qto.main.sheetReadonly');
						}
					}

					// validate the group for multi lines
					if (result.valid) {
						result = validateLineAddressInGroup(entity, value, model);
					}

					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.asyncValidatePageNumber = function validatePageNumber(entity, value, model) {
					if (!isNaN(value) && value !== '' && value !== null && value !== 0) {

						let referencedLines = dataService.getReferencedDetails(entity);
						if (entity.QtoFormula !== null && entity.QtoFormula.IsMultiline  && referencedLines.length>1)
						{
							_.forEach (referencedLines, function (item) {
								item.PageNumber = value;
							});
							dataService.markEntitiesAsModified(referencedLines);
						}

						return service.qtoAddressValidate(entity, value, entity.LineReference, entity.LineIndex, value, model);
					}
				};

				function padLeft(num, n) {
					var len = num.toString().length;
					while (len < n) {
						num = '0' + num;
						len++;
					}
					return num;
				}

				service.validateLineReference = function (entity, value, model) {
					var fieldErrorTr = {fieldName: $translate.instant('qto.main.' + model)};
					var result = platformDataValidationService.isMandatory(value, model, fieldErrorTr);
					if(result.valid){
						value = value.toUpperCase();
						result = validateLineAddressInGroup(entity, value, model);
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.asyncValidateLineReference = function validateLineReference(entity, value, model) {
					if (value !== '') {
						value = value.toUpperCase();
						return service.qtoAddressValidate(entity, entity.PageNumber, value, entity.LineIndex, value, model);
					}
				};

				service.validateLineIndex = function (entity, value, model) {
					let fieldErrorTr = {fieldName: $translate.instant('qto.main.' + model)};
					let result = platformDataValidationService.isMandatory(value, model, fieldErrorTr);
					if(result.valid){
						result = validateLineAddressInGroup(entity, value, model);
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.asyncValidateLineIndex = function validateLineIndex(entity, value, model) {
					if (!isNaN(value) && value !== '' && value !== null) {
						return service.qtoAddressValidate(entity, entity.PageNumber, entity.LineReference, value, value, model);
					}
				};

				function onEntityCreated(e, entity) {
					// new record, don't need script validation immediately
					entity.ignoreScriptValidation = true;
					if (!entity.BoqItemCode) {
						let result = service.validateBoqItemCode(entity, entity.BoqItemCode, 'BoqItemCode');
						platformRuntimeDataService.applyValidationResult(result, entity, 'BoqItemCode');
					}else{
						if(boqType === qtoBoqType.QtoBoq){
							service.asyncValidateBoqItemCode(entity, entity.BoqItemCode, 'BoqItemCode').then(function(asyncResult){
								platformRuntimeDataService.applyValidationResult(asyncResult, entity, 'BoqItemCode');
							});
						}
					}

					$injector.get('basicsCostGroupAssignmentService').attach2NewEntity(entity, dataService.costGroupCatalogs);

					var detailStatuses = lookupDescriptorService.getData('QtoDetailStatus');
					var defaultStatus = !globals.portal ? _.find(detailStatuses, {IsDefault: true}) : _.find(detailStatuses, {IsDefaultExt: true});
					let relGroupQtoDetails = _.filter(dataService.getTheSameGroupQto(entity), function(qtoDetail){
						return qtoDetail.Id !== entity.Id;
					});

					if(relGroupQtoDetails && relGroupQtoDetails.length > 0){
						defaultStatus = _.find(detailStatuses, {Id: relGroupQtoDetails[0].QtoDetailStatusFk});
					}

					if (defaultStatus) {
						entity.QtoDetailStatusFk = defaultStatus.Id;
					}
					dataService.updateReadOnlyDetail(entity, lookupDescriptorService.getData('QtoFormulaAllUom'));
				}

				service.entityCreated = function (e, entity){
					onEntityCreated(e, entity);
				};

				service.checkDependentQtoDetailItem = function (entity) {
					var code = dataService.getCode(entity);
					var regex = new RegExp(code);
					var qtoDetailList = dataService.getList();
					var hasDependent = _.some(qtoDetailList, function (qtoDetailItem) {
						var isValid = false;
						_.forEach(checkValueProperties, function (checkProperty) {
							if (qtoDetailItem[checkProperty] && qtoDetailItem[checkProperty].length >= 6) {
								if (regex.test(qtoDetailItem[checkProperty])) {
									isValid = true;
								}
							}
						});
						return isValid;
					});

					if (hasDependent) {
						var error = 'qto.main.threeFiledReferenceErrorMessage';
						var errorParam = {
							code: code,
							field1: 'PageNumber',
							field2: 'LineReference',
							field3: 'LineIndex'
						};
						return platformDataValidationService.createErrorObject(error, errorParam);
					}

					return platformDataValidationService.createSuccessObject();
				};

				service.validateValue1Detail = function (entity, value, model) {
					switch (entity.QtoLineTypeFk) {
						case qtoMainLineType.Standard:
						case qtoMainLineType.Hilfswert:
						case qtoMainLineType.Subtotal:
						case qtoMainLineType.ItemTotal:
							return service.checkValueDetail(entity, value, model, 'Value1');
						case qtoMainLineType.RRefrence:
						case qtoMainLineType.LRefrence:
						case qtoMainLineType.IRefrence:
							return platformDataValidationService.createSuccessObject();
						default:
							return service.checkValueDetail(entity, value, model, 'Value1');
					}
				};

				service.validateLineText = function (entity, value, model) {
					if (model === 'LineText' && entity.QtoLineTypeFk === qtoMainLineType.CommentLine) {
						return service.validateQtoFormulaFk(entity, value, model);
					} else {
						return service.validateValue1Detail(entity, value, model);
					}
				};

				service.validateValue2Detail = function (entity, value, model) {
					switch (entity.QtoLineTypeFk) {
						case qtoMainLineType.RRefrence:
						case qtoMainLineType.IRefrence:
							return service.checkValueDetail(entity, value, model, 'Value2');
						case qtoMainLineType.LRefrence:
							return platformDataValidationService.createSuccessObject();

						default:
							return service.checkValueDetail(entity, value, model, 'Value2');
					}

				};

				service.validateValue3Detail = function (entity, value, model) {
					return service.checkValueDetail(entity, value, model, 'Value3');
				};

				service.validateValue4Detail = function (entity, value, model) {
					return service.checkValueDetail(entity, value, model, 'Value4');
				};

				service.validateValue5Detail = function (entity, value, model) {
					return service.checkValueDetail(entity, value, model, 'Value5');
				};

				service.getIsMapCulture = function (checkVal){
					let isMapCulture = $injector.get('estimateMainCommonCalculationService').getIsMapCulture(checkVal);

					let result = {apply: true, valid: true};
					if (!isMapCulture) {
						result = {
							apply: true,
							valid: false,
							error: $translate.instant('cloud.common.computationFormula')
						};
					}

					return result;
				};

				service.checkValueForUserForm = function (value) {
					let result = service.getIsMapCulture(value);

					if (result) {
						// eslint-disable-next-line no-useless-escape
						if (value.match(new RegExp('(^[\.,].*)|(^.*[\.,]$)', 'g'))) {
							result = {
								apply: true,
								valid: false,
								error: $translate.instant('cloud.common.ERROR_TYPE_NUMBER')
							};
						}
					}

					if (result.valid) {
						if (!platformDataValidationService.isEmptyProp(value)) {
							result = $injector.get('basicsCommonStringFormatService').validateInvalidChar(value);

							if (result.valid) {
								result = $injector.get('basicsCommonStringFormatService').includeChineseChar(value);
							}
						}

						if (result.valid) {
							if (value !== null && value !== '') {
								try {
									var detailVal = value.replace(/=/g, '').replace(',', '.');
									var evalValue = math.eval(detailVal.replace(/\*\*/g, '^'));
									if (angular.isNumber(evalValue)) {
										result.validValue = evalValue;
									}
								} catch (ex) {
									result = {
										apply: true,
										valid: false,
										error: $translate.instant('cloud.common.ERROR_TYPE_NUMBER')
									};
								}
							}
						}
					}

					return result;
				};

				service.checkValueDetail = function (entity, value, field, name) {
					delete entity.ignoreScriptValidation;
					var result = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, dataService);

					if (result) {
						// eslint-disable-next-line no-useless-escape
						if (value.match(new RegExp('(^[\.,].*)|(^.*[\.,]$)', 'g'))) {
							result = {
								apply: true,
								valid: false,
								error: $translate.instant('cloud.common.ERROR_TYPE_NUMBER')
							};
						}
					}

					if (result.valid) {
						removeFieldError(entity, field);
						if (entity.QtoLineTypeFk === qtoMainLineType.Standard ||
							entity.QtoLineTypeFk === qtoMainLineType.Hilfswert ||
							entity.QtoLineTypeFk === qtoMainLineType.Subtotal ||
							entity.QtoLineTypeFk === qtoMainLineType.ItemTotal) {
							if (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk !== qtoMainFormulaType.FreeInput) {
								let resultOperator = validateValue(entity, field, value);
								let valueField = field;
								_.forEach(checkValueProperties, function (item) {
									if (resultOperator.valid && item !== field) {
										valueField = item;
										resultOperator = validateValue(entity, item, entity[item], field, value);
									}
								});

								// has model, mean, already finish validation
								if (!resultOperator.model && !resultOperator.valid) {
									platformDataValidationService.finishValidation(resultOperator, entity, entity[valueField], valueField, service, dataService);
								}
							}
						}

						if (entity.__rt$data && entity.__rt$data.errors) {
							var error = entity.__rt$data.errors[field];
							if (error) {
								result = error;
								result.apply = true;
							}
						}
						if (result.valid) {
							if (value !== null && value !== '') {
								try {
									var detailVal = value.replace(/=/g, '').replace(',', '.');
									var evalResult = math.eval(detailVal.replace(/\*\*/g, '^'));
									if (angular.isNumber(evalResult)) {
										entity[name] = evalResult;
									}
								} catch (ex) {
									entity[name] = '';
								}
							} else {
								entity[name] = '';
							}
						}
					}

					return result;

				};

				service.validateValue1ToValue5 = function (entity, focusOpreatorModel, focusOperatorModelValue) {
					let result = {
						apply: true,
						valid: true
					};

					let field;

					_.forEach(checkValueProperties, function (checkProperty) {
						if (result.valid) {
							field = checkProperty;
							result = validateValue(entity, checkProperty, entity[checkProperty], null, null, focusOpreatorModel, focusOperatorModelValue);
						}
					});

					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, field);
					}
				};

				function validateValue(entity, model, value, focusValueModel, focusValueModelValue, focusOpreatorModel, focusOperatorModelValue) {

					let valueIndex = parseInt(model.replace('Value', '').replace('Detail', '')),
						isActive = entity.QtoFormula ? entity.QtoFormula['Value' + valueIndex + 'IsActive'] : false,
						isRequired = false,
						maxActiveIdx = dataService.maxActiveValueFieldIndex(entity),
						result = {
							apply: true,
							valid: true
						};

					if (isActive) {
						if (entity.QtoFormula && entity.QtoFormula.QtoFormulaTypeFk === qtoMainFormulaType.Predefine) {
							// if a operator before this value column has been set to '=', then this value no need to enter;
							let anyEqualSymbolBefore = false;
							if (valueIndex > 1) {
								for (let i = 1; i < valueIndex; i++) {
									let checkOperator = entity[checkOperators[i - 1]];
									if (focusOpreatorModel && checkOperators[i - 1] === focusOpreatorModel) {
										checkOperator = focusOperatorModelValue;
									}
									if (checkOperator === '=') {
										anyEqualSymbolBefore = true;
									}
								}
							}

							// if value(n) is not empty, then value1 ~ value(n-1) can't be empty.
							if (!anyEqualSymbolBefore) {
								for (let j = valueIndex; j < maxActiveIdx; j++) {
									let checkValue = entity[checkValueProperties[j]];
									if (focusValueModel && checkValueProperties[j] === focusValueModel) {
										checkValue = focusValueModelValue;
									}
									isRequired = (!!checkValue && checkValue !== '' && checkValue !== '0');

									if (isRequired) {
										break;
									}
								}
							}

							// if operator(n) is not empty, then value1 ~ value(n) can't be empty.
							if (!anyEqualSymbolBefore && !isRequired) {
								for (let k = valueIndex - 1; k < maxActiveIdx; k++) {
									let checkOper = entity[checkOperators[k]];
									if (focusOpreatorModel && checkOperators[k] === focusOpreatorModel) {
										checkOper = focusOperatorModelValue;
									}
									isRequired = (checkOper && checkOper !== '');

									if (isRequired) {
										break;
									}
								}

								// if operator(n) is not empty and also is not'=', the value1 ~ value(n+1) can't be empty
								if (!isRequired) {
									let previousOper = entity[checkOperators[valueIndex - 2]];
									if (focusOpreatorModel && checkOperators[valueIndex - 2] === focusOpreatorModel) {
										previousOper = focusOperatorModelValue;
									}

									if (previousOper && previousOper !== '' && previousOper !== '=') {
										isRequired = true;
									}
								}
							}

							if (!anyEqualSymbolBefore) {
								if (value && value !== '' && !focusOpreatorModel) {
									let op = checkOperators[valueIndex - 1];
									let opErrorTr = op ? $translate.instant('qto.main.' + op) : null;
									result = platformDataValidationService.isMandatory(entity[checkOperators[valueIndex - 1]], opErrorTr);
									platformRuntimeDataService.applyValidationResult(result, entity, checkOperators[valueIndex - 1]);
									if (!result.valid) {
										platformDataValidationService.finishValidation(result, entity, entity[op], op, service, dataService);
									}
								} else {
									removeFieldError(entity, checkOperators[valueIndex - 1]);
								}
							}
						}

						if (result.valid) {
							if (!!isRequired && platformDataValidationService.isEmptyProp(value)) {
								let modelProp = model.replace('Detail', '');
								let modelTr = modelProp ? $translate.instant('qto.main.' + modelProp) : null;
								result = platformDataValidationService.isMandatory(value, modelTr);
								result.errorType = 'nullValue';
								platformRuntimeDataService.applyValidationResult(result, entity, model);
							} else {
								if (entity.__rt$data && entity.__rt$data.errors) {
									var error = entity.__rt$data.errors[model];
									if (error){
										result.valid = false;
										result.error = error.error;
									}

									if (error && error.errorType === 'nullValue') {
										removeFieldError(entity, model);
										// as already remove the error, here should set valid as true.
										result.valid = true;
									}
								}
							}
						}
						if (result.valid) {
							if (!platformDataValidationService.isEmptyProp(value)) {
								result = $injector.get('basicsCommonStringFormatService').validateInvalidChar(value);
								if (!result.valid) {
									platformRuntimeDataService.applyValidationResult(result, entity, model);
								} else {
									result = $injector.get('basicsCommonStringFormatService').includeChineseChar(value);
									if (!result.valid) {
										platformRuntimeDataService.applyValidationResult(result, entity, model);
									}
								}
							}
						}
					}

					return result;
				}

				function removeErrorForValue1ToValue5AndOp1ToOp5(entity) {
					_.forEach(checkValueProperties, function (checkProperty) {
						removeFieldError(entity, checkProperty);
					});

					_.forEach(checkOperators, function (checkProperty) {
						removeFieldError(entity, checkProperty);
					});
				}

				function removeFieldError(entity, field) {
					platformRuntimeDataService.applyValidationResult({valid: true}, entity, field);
					platformDataValidationService.finishValidation({valid: true}, entity, '', field, service, dataService);
				}

				function getValuesParameter(entity, model, value) {
					var parameters = [];
					for (var valueIndex = 1; valueIndex <= checkValueProperties.length; valueIndex++) {
						// var valueDetail = entity[checkValueProperties[valueIndex-1]];
						var valueValue = entity[checkValues[valueIndex - 1]];
						valueValue = valueValue === null || valueValue === '' ? '' : valueValue - 0;
						parameters.push({'VariableName': 'val' + valueIndex, 'InputValue': valueValue});

						var valDetail = entity[checkValueProperties[valueIndex - 1]];
						if (model && value && model.indexOf(valueIndex) >= 0) {
							valDetail = value;
						}
						valDetail = valDetail === null || valDetail === '' ? '' : valDetail;
						valDetail = valDetail.replace(/\,/g, '.');
						parameters.push({'VariableName': 'val' + valueIndex + 'Detail', 'InputValue': valDetail});

						var operator = entity[checkOperators[valueIndex - 1]];
						operator = operator === null || operator === '' ? '' : operator;
						parameters.push({'VariableName': 'operator' + valueIndex, 'InputValue': operator});
					}
					parameters.push({'VariableName': 'reference', 'InputValue': _.isString(entity.QtoDetailReference) ? entity.QtoDetailReference : dataService.getCode(entity)});
					parameters.push({'VariableName': 'factor', 'InputValue': entity.Factor});
					parameters.push({'VariableName': 'result', 'InputValue': entity.Result});
					parameters.push({'VariableName': 'subtotal', 'InputValue': entity.SubTotal});
					parameters.push({'VariableName': 'linetext', 'InputValue': entity.LineText});
					parameters.push({'VariableName': 'remarktext', 'InputValue': entity.RemarkText});
					parameters.push({'VariableName': 'remark1text', 'InputValue': entity.Remark1Text});
					parameters.push({'VariableName': 'translator', 'InputValue': scriptTransService.getTranslator()});
					parameters.push({'VariableName': 'RHO', 'InputValue': getRho()});
					parameters.push({'VariableName': 'PI', 'InputValue': getPiValue()});
					parameters.push({'VariableName': 'isMultiLine', 'InputValue': !!(entity.QtoFormula && entity.QtoFormula.IsMultiline)});

					return parameters;
				}

				function getItemForValidation(qtoDetails) {
					var result = [];

					if (qtoDetails && qtoDetails.length > 0) {
						qtoDetails.forEach(function (detail) {
							var item = {
								reference: _.isString(detail.QtoDetailReference) ? detail.QtoDetailReference : dataService.getCode(detail),
								result: detail.Result
							};

							for (var valueIndex = 1; valueIndex <= checkValueProperties.length; valueIndex++) {
								var valueValue = detail[checkValues[valueIndex - 1]];
								item['val' + valueIndex] = valueValue === null || valueValue === '' ? '' : valueValue - 0;

								var valDetail = detail[checkValueProperties[valueIndex - 1]];
								item['val' + valueIndex + 'Detail'] = valDetail === null || valDetail === '' ? '' : valDetail;

								var operator = detail[checkOperators[valueIndex - 1]];
								item['operator' + valueIndex] = operator === null || operator === '' ? '' : operator;
							}

							result.push(item);
						});
					}

					return result;
				}

				service.setOperatorByEnterKeyOrTebKey = function (entity, model, args) {
					if (model.indexOf('Operator') < 0) {
						return;
					}

					if ($injector.get('qtoFormulaLookupService').getLookupCurrentValue()) {
						return;
					}

					var anyEqualSymbolBefore = false,
						operatorIndex = model.replace('Operator', '');
					if (operatorIndex > 1) {
						for (var i = 1; i < operatorIndex; i++) {
							if (entity[checkOperators[i - 1]] === '=') {
								anyEqualSymbolBefore = true;
							}
						}
					}
					if (anyEqualSymbolBefore) {
						return;
					}

					var previousValue = entity[checkValueProperties[operatorIndex - 1]];
					if (!previousValue || previousValue === '') {
						return;
					}

					var operators = entity.QtoFormula[model];
					if (operators.indexOf('=') > -1) {
						var originalVal = entity[model];
						entity[model] = '=';
						validateOperator(entity, model, '=');
						dataService.setValueOrOperFieldsToDisableByOperator(entity, model, '=');

						if (originalVal || args && args.grid) {
							var editor = args.grid.getCellEditor();
							if (editor) {
								editor.applyValue(entity, '=');
							}
						}

					}
					service.checkValueDetail(entity, '=', model, '');
				};

				service.validateResult = function (entity, skipUpdateQtoDetailGrouping) {
					if (!entity) {
						return;
					}

					if (entity.QtoLineTypeFk === qtoMainLineType.Standard ||
						entity.QtoLineTypeFk === qtoMainLineType.Hilfswert ||
						entity.QtoLineTypeFk === qtoMainLineType.Subtotal ||
						entity.QtoLineTypeFk === qtoMainLineType.ItemTotal) {
						if (entity.QtoFormula === null || entity.QtoFormula.QtoFormulaScriptEntities === null || entity.QtoFormula.QtoFormulaScriptEntities.length === 0) {
							return;
						}

						if (!skipUpdateQtoDetailGrouping){
							dataService.updateQtoDetailGroupInfo();
						}

						var parameterList = getValuesParameter(entity);
						var referencedDetails = getItemForValidation(dataService.getReferencedDetails(entity));
						parameterList.push({
							'VariableName': 'ReferencedItems',
							'InputValue': referencedDetails
						});
						var scriptData = {
							ParameterList: parameterList,
							ValidateScriptData: entity.QtoFormula.QtoFormulaScriptEntities[0].ValidateScriptData || ''
						};

						_.forEach(scriptData.ParameterList, function (item) {
							if (item.VariableName === 'result') {
								item.InputValue = entity.Result;
							}
							if (item.VariableName === 'subtotal') {
								item.InputValue = entity.SubTotal;
							}
							for (var i = 1; i <= checkValueProperties.length; i++) {
								if (item.VariableName.indexOf('val' + i) > 0 || item.VariableName.indexOf('operator' + i) > 0) {
									if (entity[checkValueProperties[i]] === null || entity[checkValueProperties[i]] === '') {
										item.InputValue = '';
									}
								}
							}
						});

						var response = scriptEvalService.synValidate(scriptData);
						if (!response) {
							response = [];
						}
						// for result
						applyScriptValidationErrorToField(entity, 'Result', response, 'result');

						// for subtotal
						if (entity.QtoLineTypeFk === qtoMainLineType.Subtotal || entity.QtoLineTypeFk === qtoMainLineType.ItemTotal) {
							applyScriptValidationErrorToField(entity, 'SubTotal', response, 'subtotal');
						}

						// for factor
						applyScriptValidationErrorToField(entity, 'Factor', response, 'factor');

						// for value1 - value5
						if (!entity.ignoreScriptValidation) {
							for (var k = 0; k < checkValueProperties.length; k++) {
								applyScriptValidationErrorToField(entity, checkValueProperties[k], response, 'val' + (k + 1));
							}
						}

						setValueFieldIsDisableAfterScriptValidation(entity, response);
					}
				};

				function applyScriptValidationErrorToField(entity, field, response, responseErrorfield) {
					let validateResult = {
						apply: true,
						valid: true
					};

					if (!response) {
						response = [];
					}

					var errorInfo = _.filter(response, function (info) {
						return Object.prototype.hasOwnProperty.call(info, 'HasError') && info.HasError === true && info.Name.toLowerCase() === responseErrorfield;
					});
					var error = {};

					if (errorInfo.length > 0) {

						if (entity.__rt$data && entity.__rt$data.errors) {
							error = entity.__rt$data.errors[field];
							if (error){
								validateResult.valid = false;
								validateResult.error = error.error;
							}

							if (error && error.errorType !== 'scriptError') {
								return validateResult;
							}
						}

						if (validateResult.valid) {
							var errorStr = '';
							for (var i = 0; i < errorInfo.length; i++) {
								if (i > 0) {
									errorStr += '&#10';
								}
								errorStr += errorInfo[i].Error;
							}

							if (validateValue !== null) {
								validateResult = {
									apply: true,
									valid: false,
									error: errorStr,
									errorType: 'scriptError'
								};
								platformRuntimeDataService.applyValidationResult(validateResult, entity, field);
							}
						}
					} else {
						if (entity.__rt$data && entity.__rt$data.errors) {
							error = entity.__rt$data.errors[field];
							if (error){
								validateResult.valid = false;
								validateResult.error = error.error;
							}

							if (error && error.errorType === 'scriptError') {
								removeFieldError(entity, field);
							}
						}
					}

					return validateResult;
				}

				service.validateFreeinputLineText = function (entity) {
					var field = 'LineText';

					if (!_.isNull(entity[field]) && entity[field] !== '') {
						service.asyncValidateValue1(entity, entity.LineText, field).then(function (result) {
							platformRuntimeDataService.applyValidationResult(result, entity, field);
						});
					}
				};

				function dealQtoLineValueNOperatorByQtoFormula(entity) {

					var operatorArray = ['Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5'];

					var valueActiveArray = ['Value1IsActive', 'Value2IsActive', 'Value3IsActive', 'Value4IsActive', 'Value5IsActive'];

					var newQtoFormula = entity.QtoFormula;
					var oldQtoFormula = entity.OldQtoFormula;

					service.clearCalculateFields(entity);
					service.clearOperatorFields(entity);

					if (newQtoFormula && oldQtoFormula) {
						switch (oldQtoFormula.QtoFormulaTypeFk) {
							case qtoMainFormulaType.Predefine:
								for (let j = 1; j <= operatorArray.length; j++) {
									if (!newQtoFormula['Operator' + j] || newQtoFormula['Operator' + j].indexOf(entity['Operator' + j]) < 0) {
										entity['Operator' + j] = entity['Value' + j] = entity['Value' + j + 'Detail'] = null;
									}
								}
								break;
							case qtoMainFormulaType.Script:
								for (let j = 1; j <= valueActiveArray.length; j++) {
									if (!newQtoFormula['Value' + j + 'IsActive'] || newQtoFormula['Value' + j + 'IsActive'] !== oldQtoFormula['Value' + j + 'IsActive']) {
										entity['Value' + j] = entity['Value' + j + 'Detail'] = null;
									}
								}
								break;
						}
					}
				}

				function syncMultiLineQtoDetailProperty(entity, newValue, field){
					if(!entity){
						return;
					}

					let referencedLines = dataService.getTheSameGroupQto(entity);
					if (referencedLines && referencedLines.length) {
						_.forEach(referencedLines, function (item) {
							item[field] = newValue;
							if (field === 'BilHeaderFk'){
								item.PerformedFromBil = entity.PerformedFromBil;
								item.PerformedToBil = entity.PerformedToBil;
								item.ProgressInvoiceNo = entity.ProgressInvoiceNo;

								item.OrdHeaderFk = (_.isNull(newValue) || _.isUndefined(newValue)) && !entity.WipHeaderFk? null:entity.OrdHeaderFk;
								item.BillToFk =(_.isNull(newValue) || _.isUndefined(newValue)) && !entity.OrdHeaderFk? null :entity.BillToFk;

							} else if (field === 'WipHeaderFk'){
								item.PerformedFromWip = entity.PerformedFromWip;
								item.PerformedToWip = entity.PerformedToWip;

								item.OrdHeaderFk = (_.isNull(newValue) || _.isUndefined(newValue)) && !entity.BilHeaderFk?  null:entity.OrdHeaderFk;
								item.BillToFk =(_.isNull(newValue) || _.isUndefined(newValue)) && !entity.OrdHeaderFk ? null :entity.BillToFk;

							} else if (field === 'BillToFk'){
								item.OrdHeaderFk = entity.OrdHeaderFk;

								item.WipHeaderFk = _.isNull(newValue) ||_.isUndefined(newValue) ?  null: item.WipHeaderFk ;
								item.BilHeaderFk = _.isNull(newValue)||_.isUndefined(newValue) ? null: item.BilHeaderFk ;

							} else if (field === 'OrdHeaderFk'){
								item.BillToFk = entity.BillToFk;

								item.WipHeaderFk = _.isNull(newValue) ||_.isUndefined(newValue) ?  null: item.WipHeaderFk ;
								item.BilHeaderFk = _.isNull(newValue)||_.isUndefined(newValue) ? null: item.BilHeaderFk ;

							} else if(field === 'IsReadonly'){
								item.IsReadonly = newValue;
							}
						});
						dataService.markEntitiesAsModified(referencedLines);
					}

					dataService.updateQtoDetailGroupInfo();

					let newReferencedLines = dataService.getTheSameGroupQto(entity);
					if (referencedLines.length !== newReferencedLines.length){
						service.validateNewGroup(newReferencedLines);
					}

					return {apply: true, valid: true};
				}

				function syncSplitMultiLineQtoDetailProperty(entity, newValue, field){
					syncMultiLineQtoDetailProperty(entity, newValue, field);

					if(boqType === qtoBoqType.QtoBoq && (entity.IsSplitted || (entity.QtoDetailSplitFromFk && entity.QtoDetailSplitFromFk > 0))){
						var qtoList = dataService.getList();
						let releatedEntity;

						if(entity.IsSplitted && !entity.QtoDetailSplitFromFk){
							releatedEntity = _.find(qtoList, {QtoDetailSplitFromFk: entity.Id});
						}
						else if(!entity.IsSplitted && entity.QtoDetailSplitFromFk){
							releatedEntity = _.find(qtoList, {Id: entity.QtoDetailSplitFromFk});
						}

						let isIQBQInfoEmpty = !entity.IsIQ && !entity.IsBQ && !entity.WipHeaderFk && !entity.BilHeaderFk && !releatedEntity.IsIQ && !releatedEntity.IsBQ && !releatedEntity.WipHeaderFk && !releatedEntity.BilHeaderFk;
						let isIQBQInfoReadonly = entity.SplitItemIQReadOnly || entity.SplitItemBQReadOnly || releatedEntity.SplitItemIQReadOnly || releatedEntity.SplitItemBQReadOnly;

						let entityGroup = dataService.getTheSameGroupQto(entity);
						let releatedEntityGroup = dataService.getTheSameGroupQto(releatedEntity);

						if(isIQBQInfoEmpty){
							let readonly = false;
							let allList = entityGroup.concat(releatedEntityGroup);

							_.forEach(allList, function (item) {
								item.SplitItemIQReadOnly = readonly;
								item.SplitItemBQReadOnly = readonly;

								dataService.updateReadOnly(item, ['IsBQ', 'BilHeaderFk', 'IsIQ', 'WipHeaderFk'], readonly);
							});

							dataService.gridRefresh();
						}
						else if(!isIQBQInfoReadonly) {
							let IQReadonly = entity.IsBQ || !!entity.BilHeaderFk;

							let updateReadOnlyStatus = function(item, readonly){
								item.SplitItemIQReadOnly = readonly;
								item.SplitItemBQReadOnly = !readonly;

								dataService.updateReadOnly(item, ['IsBQ', 'BilHeaderFk'], !readonly);
								dataService.updateReadOnly(item, ['IsIQ', 'WipHeaderFk'], readonly);
							};

							_.forEach(entityGroup, function (item) {
								updateReadOnlyStatus(item, IQReadonly);
							});

							_.forEach(releatedEntityGroup, function (item) {
								updateReadOnlyStatus(item, !IQReadonly);
							});

							dataService.gridRefresh();
						}
					}
				}

				service.validateIsBQ = function(entity, newValue, field){
					if(entity.IsGQ){
						let cloneEntity = _.clone(entity);
						cloneEntity.IsBQ = newValue;
						service.validateIsGQ(cloneEntity, newValue, 'IsGQ');
					}

					syncSplitMultiLineQtoDetailProperty(entity, newValue, field);
				};

				service.validateIsGQ = function(entity, newValue, field){
					let result = {apply: true, valid: true, error: ''};
					if(!entity.IsBQ && newValue){
						result.valid = false;
						result.error = $translate.instant('qto.main.GqIsDisabled');
					}else if(newValue && entity.QtoLineTypeFk !== qtoMainLineType.Standard){
						result.valid = false;
						result.error = $translate.instant('qto.main.GqLineTypeError');
					}

					result = platformRuntimeDataService.applyValidationResult(result, entity, field);
					syncSplitMultiLineQtoDetailProperty(entity, newValue, field);

					if(result.valid){
						let referencedLines = dataService.getTheSameGroupQto(entity);
						if (referencedLines && referencedLines.length) {
							_.forEach(referencedLines, function (line) {
								platformRuntimeDataService.applyValidationResult(result, line, field);
								platformDataValidationService.finishValidation(result, line, newValue, field, service, dataService);
							});
						}
					}

					dataService.gridRefresh();
					return platformDataValidationService.finishValidation(result, entity, newValue, field, service, dataService);
				}

				service.validateIsIQ = syncSplitMultiLineQtoDetailProperty;
				service.validateWipHeaderFk = syncSplitMultiLineQtoDetailProperty;
				service.validateBilHeaderFk = syncSplitMultiLineQtoDetailProperty;

				service.validatePesHeaderFk = syncMultiLineQtoDetailProperty;
				service.validateIsWQ = syncMultiLineQtoDetailProperty;
				service.validateIsAQ = syncMultiLineQtoDetailProperty;
				service.validateIsReadoOnly = syncMultiLineQtoDetailProperty;
				service.validatePrjLocationFk = syncMultiLineQtoDetailProperty;
				service.validateAssetMasterFk = syncMultiLineQtoDetailProperty;
				service.validatePrcStructureFk = syncMultiLineQtoDetailProperty;
				service.validateMdcControllingUnitFk = syncMultiLineQtoDetailProperty;
				service.validateIsBlocked = syncMultiLineQtoDetailProperty;
				service.validateOrdHeaderFk = syncMultiLineQtoDetailProperty;
				service.validateBillToFk = syncMultiLineQtoDetailProperty;
				service.validateSortCode01Fk = syncMultiLineQtoDetailProperty;
				service.validateSortCode02Fk = syncMultiLineQtoDetailProperty;
				service.validateSortCode03Fk = syncMultiLineQtoDetailProperty;
				service.validateSortCode04Fk = syncMultiLineQtoDetailProperty;
				service.validateSortCode05Fk = syncMultiLineQtoDetailProperty;
				service.validateSortCode06Fk = syncMultiLineQtoDetailProperty;
				service.validateSortCode07Fk = syncMultiLineQtoDetailProperty;
				service.validateSortCode08Fk = syncMultiLineQtoDetailProperty;
				service.validateSortCode09Fk = syncMultiLineQtoDetailProperty;
				service.validateSortCode10Fk = syncMultiLineQtoDetailProperty;
				service.validateSpecialUse = syncMultiLineQtoDetailProperty;
				service.validateV = syncMultiLineQtoDetailProperty;
				service.validateUserDefined1 = syncMultiLineQtoDetailProperty;
				service.validateUserDefined2 = syncMultiLineQtoDetailProperty;
				service.validateUserDefined3 = syncMultiLineQtoDetailProperty;
				service.validateUserDefined4 = syncMultiLineQtoDetailProperty;
				service.validateUserDefined5 = syncMultiLineQtoDetailProperty;
				service.validateIsReadonly = syncMultiLineQtoDetailProperty;

				service.validateNewGroup = function validateNewGroup(entities){
					for (let i=0; i<entities.length; i++){
						if (entities[i].__rt$data && entities[i].__rt$data.errors){
							if (entities[i].__rt$data.errors.LineText){
								service.asyncValidateValue1(entities[i], entities[i]['LineText'], 'LineText').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.LineText = null;
										dataService.gridRefresh();
									}
								});
								break;
							} else if(entities[i].__rt$data.errors.Value1Detail){
								service.asyncValidateValue1(entities[i], entities[i]['Value1Detail'], 'Value1Detail').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.Value1Detail = null;
										dataService.gridRefresh();
									}
								});
								break;
							} else if(entities[i].__rt$data.errors.Value2Detail){
								service.asyncValidateValue1(entities[i], entities[i]['Value2Detail'], 'Value2Detail').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.Value2Detail = null;
										dataService.gridRefresh();
									}
								});
								break;
							} else if(entities[i].__rt$data.errors.Value3Detail){
								service.asyncValidateValue1(entities[i], entities[i]['Value3Detail'], 'Value3Detail').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.Value3Detail = null;
										dataService.gridRefresh();
									}
								});
								break;
							} else if(entities[i].__rt$data.errors.Value4Detail){
								service.asyncValidateValue1(entities[i], entities[i]['Value4Detail'], 'Value4Detail').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.Value4Detail = null;
										dataService.gridRefresh();
									}
								});
								break;
							} else if(entities[i].__rt$data.errors.Value5Detail){
								service.asyncValidateValue1(entities[i], entities[i]['Value5Detail'], 'Value5Detail').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.Value5Detail = null;
										dataService.gridRefresh();
									}
								});
								break;
							} else if(entities[i].__rt$data.errors.Operator1){
								service.asyncValidateOperator1(entities[i], entities[i]['Operator1'], 'Operator1').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.Operator1 = null;
										dataService.gridRefresh();
									}
								});
								break;
							} else if(entities[i].__rt$data.errors.Operator2){
								service.asyncValidateOperator1(entities[i], entities[i]['Operator2'], 'Operator2').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.Operator2 = null;
										dataService.gridRefresh();
									}
								});
								break;
							} else if(entities[i].__rt$data.errors.Operator3){
								service.asyncValidateOperator1(entities[i], entities[i]['Operator3'], 'Operator3').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.Operator3 = null;
										dataService.gridRefresh();
									}
								});
								break;
							} else if(entities[i].__rt$data.errors.Operator4){
								service.asyncValidateOperator1(entities[i], entities[i]['Operator4'], 'Operator4').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.Operator4 = null;
										dataService.gridRefresh();
									}
								});
								break;
							} else if(entities[i].__rt$data.errors.Operator5){
								service.asyncValidateOperator1(entities[i], entities[i]['Operator5'], 'Operator5').then(function (result){
									if(result.valid) {
										entities[i].__rt$data.errors.Operator5 = null;
										dataService.gridRefresh();
									}
								});
								break;
							}
						}
					}
				};

				// region billto bulk edit
				let bulkEditContractCache = {};
				service.asyncValidateBillToFkForBulkConfig = function asyncValidateBillToFkForBulkConfig(entity, value, model) {
					let qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					let isBillToCanPaste = qtoHeader && (qtoHeader.QtoTargetType === 2);
					if (entity.IsReadonly || !isBillToCanPaste) {
						return $q.when({apply: true, valid: false});
					}
					entity[model] = value;
					if (!value) {
						entity.OrdHeaderFk = null;
						setReferenceDetails(entity,null,null);
						bulkEditContractCache = {};
						return $q.when({apply: true, valid: true});
					}

					return getContractId(entity,value).then(function (fk) {
						entity.OrdHeaderFk = fk;
						setReferenceDetails(entity, value, fk);
						return true;
					});
				};
				function getContractId(entity,value) {
					let selectQtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					let keys = $injector.get('platformContextService').getContext().clientId + '_' + selectQtoHeader.ProjectFk+'_'+value;
					if (Object.hasOwnProperty.call(bulkEditContractCache,keys)) {
						return $q.when(bulkEditContractCache[keys]);
					} else {
						return $injector.get('qtoMainBillToDataService').assignContractByBillTo(entity);
					}
				}
				function setReferenceDetails(entity, value, contractFk){
					if(entity.QtoFormula && entity.QtoFormula.IsMultiline) {
						let refLines = dataService.getReferencedDetails(entity);
						_.each(refLines, function (e) {
							e.BillToFk = value;
							e.OrdHeaderFk = contractFk;
							dataService.markItemAsModified(e);
						});
					}
				}
				// endregion

				return service;
			};

			return factoryService;
		}]);
})(angular);
