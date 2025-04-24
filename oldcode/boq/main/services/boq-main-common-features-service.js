(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'boq.main';
	var estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('boqMainCommonFeaturesService', ['_', '$q', '$http', '$injector', '$translate', 'platformRuntimeDataService', 'estimateMainParamStructureConstant', 'platformDataValidationService', 'math',
		function (_, $q, $http, $injector, $translate, platformRuntimeDataService, estimateMainParamStructureConstant, platformDataValidationService, math) {
			var service = {
				getAsyncDetailValidation: getAsyncDetailValidation,
				getDetailValidation: getDetailValidation,
				clearBoqItemSavedByDetailParamsChange: clearBoqItemSavedByDetailParamsChange,
				getBoqItemSavedByDetailParamsChange: getBoqItemSavedByDetailParamsChange,
				getIsDetailsFormulaParameters: getIsDetailsFormulaParameters,
				setIsDetailsFormulaParameters: setIsDetailsFormulaParameters,
				additionalAsync: additionalAsync
			};

			var BoqItemSavedByDetailParamsChange = null;
			var isDetailsFormulaParameters = null;
			var valueTypes = $injector.get('estimateRuleParameterConstant');

			var detailFields = {
				'QuantityDetail': 'Quantity',
				'QuantityAdjDetail': 'QuantityAdj',
				'FactorDetail': 'Factor'
			};

			var union = angular.extend({}, _.invert(detailFields), detailFields);

			function getDetailValidation(dataService) {
				var result = {};
				_.each(detailFields, function (val, key) {
					result['validate' + key] = function (entity, value, model, e, options) {
						return generateDetailValidation(entity, value, model, dataService, options);
					};
				});
				return result;
			}

			function generateDetailValidation(entity, value, field, dataService) {
				var res = $injector.get('estimateMainCommonCalculationService').mapCultureValidation(entity, value, field, service, dataService);
				if (res && res.valid) {
					platformRuntimeDataService.applyValidationResult(res, entity, field);
					platformDataValidationService.finishAsyncValidation(res, entity, value, field, null, service, dataService);
				}
				return res;
			}

			function getDetailsFormulaParameters(entity, value, model, dataService) {

				var fromWicBoq = true;
				var internalOption = {currentBoqMainService: dataService};

				if (!Object.prototype.hasOwnProperty.call(internalOption, 'currentBoqMainService')) {
					internalOption.currentBoqMainService = null;
				}

				if (dataService.getCallingContextType() !== 'Wic') {
					fromWicBoq = false;
				}

				var result = {},
					platformValidationService = $injector.get('platformDataValidationService'),
					detailVal = angular.copy(value.toString()),
					asyncMarker = platformValidationService.registerAsyncCall(entity, value, model, dataService);
				detailVal = detailVal.replace(/[,]/gi, '.');
				detailVal = detailVal.replace(/\s/gi, '');

				var stringFormatService = $injector.get('basicsCommonStringFormatService');
				var invalidCharCheck = stringFormatService.validateInvalidChar(detailVal);
				if (!invalidCharCheck.valid) {
					return $q.when(platformValidationService.finishAsyncValidation(invalidCharCheck, entity, value, model, null, service, dataService));
				}

				// check whether the detail includes invalid parameter
				invalidCharCheck = stringFormatService.validateInvalidParameter(detailVal);
				if (!invalidCharCheck.valid) {
					return $q.when(platformValidationService.finishAsyncValidation(invalidCharCheck, entity, value, model, null, service, dataService));
				}

				// if the detail is formula, then check the format of formula
				// eslint-disable-next-line no-useless-escape
				if ((new RegExp('[^a-zA-Z\\d\.]', 'g')).test(detailVal)) {
					var checkFormulaPromise = $http.get(globals.webApiBaseUrl + 'estimate/main/calculator/checkformular?exp=' + encodeURIComponent(detailVal));
					asyncMarker.myPromise = checkFormulaPromise;
					return checkFormulaPromise.then(function (response) {
						if (response && response.data && !response.data.valid) {
							if (response.data.formulaError) {
								var errStr = '', i = 1;
								if (response.data.formulaError.length > 1) {
									_.forEach(response.data.formulaError, function (item) {
										errStr += '【' + i + ', ' + item + '】';
										i++;
									});
								} else {
									errStr = response.data.formulaError[0];
								}

								return $q.when(platformValidationService.finishAsyncValidation({
									valid: false,
									error: errStr
								}, entity, value, model, asyncMarker, service, dataService));
							}
						} else {
							var formulaResult = response && response.data && response.data.hasCalculateResult ? response.data.expResult : null;
							var strParams = response && response.data && response.data.strParams ? response.data.strParams : [];
							if (formulaResult) {
								entity[model] = value;
								entity[union[model]] = formulaResult;

								// Merge result into data on the client.
								return $q.when(platformValidationService.finishAsyncValidation({
									valid: true
								}, entity, value, model, asyncMarker, service, dataService));
							}

							return checkDetailFormulaParameter(strParams);
						}
					});
				} else {
					return checkDetailFormulaParameter([value.toUpperCase()]);
				}

				function checkDetailFormulaParameter(strParams) {
					// eslint-disable-next-line no-useless-escape
					var list = detailVal.match(/\b[a-zA-Z]+[\w|\s*-\+\/]*/g);
					var chars = ['sin', 'tan', 'cos', 'ln'];
					result = _.filter(list, function (li) {
						if (chars.indexOf(li.toLowerCase()) === -1) {
							var match = li.match(/^[0-9]*$/g);
							if (!match) {
								return li;
							}
						}
					});

					if (result && !result.length) {
						entity[model] = value;
						try {
							entity[union[model]] = math.eval(detailVal.replace(/\*\*/g, '^')) || 0;  // 0 is the default if the call of 'math.eval' returns 'undefined' (e.g. if detailVal==='')
						} catch (exception) {
							return $q.when(platformValidationService.finishAsyncValidation({
								valid: false
							}, entity, value, model, asyncMarker, service, dataService));
						}

						// Merge result into data on the client.
						return $q.when(platformValidationService.finishAsyncValidation({
							valid: true
						}, entity, value, model, asyncMarker, service, dataService));

					} else {

						var boqMainDetailsParamListDataService = $injector.get('boqMainDetailsParamListDataService');
						boqMainDetailsParamListDataService.setAssignedBoqItemEntity(dataService.getSelected());

						if (fromWicBoq) {

							var getBoqParamItems = $injector.get('estimateParameterFormatterService').getEstParams();

							var res = {};
							res.valid = true;
							res.error = '';

							var strParamsStr = value.toUpperCase();

							if (getBoqParamItems && getBoqParamItems.length > 0) {

								var paramInCusParam = true;
								for (var i = 0; i < strParams.length; i++) {

									var paramCode = strParams[i];
									var macthParam = _.filter(getBoqParamItems, function (item) {
										return item.Code === paramCode.toUpperCase();
									});

									if (macthParam && macthParam.length > 0 && macthParam[0].ParamvaluetypeFk === valueTypes.Decimal2) {
										strParamsStr = strParamsStr.replace(paramCode, macthParam[0].DefaultValue);
										paramInCusParam = true;

									} else {
										paramInCusParam = false;
										break;
									}
								}

								if (paramInCusParam) {
									var vaResult = math.eval(strParamsStr);
									if (vaResult === 'Infinity' || !vaResult) {
										res.valid = false;
										res.error = $translate.instant('boq.main.invalidParam');
										res = platformValidationService.finishAsyncValidation(res, entity, value, model, null, service, dataService);
									} else {
										setParameterValueToBoqItem(vaResult, value.toUpperCase(), dataService);
										platformValidationService.finishAsyncValidation(res, entity, strParamsStr, model, null, service, dataService);
									}
								} else {
									res.valid = false;
									res.error = $translate.instant('boq.main.invalidParam');
									res = platformValidationService.finishAsyncValidation(res, entity, value, model, null, service, dataService);
								}
							} else {
								res.valid = false;
								res.error = $translate.instant('boq.main.invalidParam');
								res = platformValidationService.finishAsyncValidation(res, entity, value, model, null, service, dataService);
							}
							return $q.when(res);
						} else {
							setBoqItemSavedByDetailParamsChange(entity); // the boqitem no need save by "update" button
							setIsDetailsFormulaParameters(true);

							return createOrUsePrjParameter2PrjBoqItem(strParams);
						}
					}
				}

				function createOrUsePrjParameter2PrjBoqItem(strParams) {

					var postData = {
						projectFk: fromWicBoq ? null : dataService.getSelectedProjectId(),
						codes: strParams ? strParams : []
					};
					return $http.post(globals.webApiBaseUrl + 'estimate/parameter/prjparam/GetParameterFromProjectNBasicsCustomizeByCode', postData).then(function (response) {

						var item = {};
						item.FormulaParameterEntities = [];
						item.entity = entity;
						item.field = model;
						item.ProjectId = dataService.getSelectedProjectId();
						item.BoqItem = dataService.getSelected();
						item.BoqItem[model] = value.toUpperCase();
						item.DetailFormula = value.toUpperCase();
						item.DetailFormulaField = union[union[model]];
						item.isFormula = true;
						var toSaveLeave = '';
						var boqMainDetailsParamDialogService = $injector.get('boqMainDetailsParamDialogService');

						var validParam = true;
						if (response && response.data && response.data.newPrjParams && response.data.newPrjParams.length <= 0) {

							// parameter from project
							if (response.data.estPrjParams && response.data.estPrjParams.length > 0) {

								for (var i = 0; i < response.data.estPrjParams.length; i++) {
									if (response.data.estPrjParams[i].ValueType !== valueTypes.Decimal2) {
										validParam = false;
										break;
									}
								}
								item.FormulaParameterEntities = response.data.estPrjParams;
							}

							// parameter from  Basics Customize
							if (response.data.existCusParams && response.data.existCusParams.length > 0) {

								for (var j = 0; j < response.data.existCusParams.length; j++) {
									if (response.data.existCusParams[j].ParamvaluetypeFk !== valueTypes.Decimal2) {
										validParam = false;
										break;
									}
								}

								_.forEach(response.data.existCusParams, function (param) {
									param.AssignedStructureId = estimateMainParamStructureConstant.Project;
									param.isFormulaFromBoq = true;
									param.ValueType = 1;
									param.EstParameterGroupFk = 1;
									param.Version = -1;
									param.ParameterValue = param.DefaultValue;
								});

								item.FormulaParameterEntities = item.FormulaParameterEntities.concat(response.data.existCusParams);
							}

							_.forEach(item.FormulaParameterEntities, function (param) {
								param.AssignedStructureId = estimateMainParamStructureConstant.Project;
								param.isFormulaFromBoq = true;
								param.DetailFormulaField = union[model];
							});
							toSaveLeave = estimateMainParamStructureConstant.Project;

						} else if (response && response.data && response.data.newPrjParams && response.data.newPrjParams.length) {

							item.FormulaParameterEntities = (response.data.newPrjParams);
							item.FormulaParameterEntities = item.FormulaParameterEntities.concat(response.data.estPrjParams);
							item.FormulaParameterEntities = item.FormulaParameterEntities.concat(response.data.existCusParams);

							_.forEach(item.FormulaParameterEntities, function (param) {
								param.AssignedStructureId = estimateMainParamStructureConstant.Project;
								param.isFormulaFromBoq = true;
								param.DetailFormulaField = union[model];
							});
							toSaveLeave = dataService.getDetailsParamReminder();
						}

						var res = {};
						res.valid = true;
						res.error = '';
						if (!validParam) {
							res.valid = false;
							res.error = $translate.instant('boq.main.invalidParam2');
							res = platformValidationService.finishAsyncValidation(res, entity, value, model, null, service, dataService);
							return $q.when(res);
						}

						if (item.FormulaParameterEntities && item.FormulaParameterEntities.length > 0) {

							return boqMainDetailsParamDialogService.showDialog(item, toSaveLeave, dataService).then(function () {
								// Merge result into data on the client.
								return platformValidationService.finishAsyncValidation({
									valid: true
								}, entity, value, model, asyncMarker, service, dataService);
							}, function () {
								return true;
							});
						} else {
							return true;
						}

					});
				}

				/* function createCuzParameter2WicBoqItem(strParams){
				 if(!detailParamsPromise){

				 var postData = {
				 codes :strParams ? strParams:[]
				 };
				 detailParamsPromise = $http.post(globals.webApiBaseUrl + 'estimate/parameter/prjparam/GetParameterFromBasicsCustomizeByCode',postData);
				 asyncMarker.myPromise = detailParamsPromise;
				 }
				 return detailParamsPromise.then(function(response){
				 detailParamsPromise = null;

				 var item = {};
				 item.FormulaParameterEntities= [];
				 item.entity = entity;
				 item.field = model;
				 item.ProjectId = dataService.getSelectedProjectId();
				 item.BoqItem = dataService.getSelected();
				 item.BoqItem[model]= value.toUpperCase();
				 item.DetailFormula=  value.toUpperCase();
				 item.DetailFormulaField =union[union[model]];
				 item.isFormula = true;
				 var toSaveLeave ='';
				 var boqMainDetailsParamDialogService = $injector.get('boqMainDetailsParamDialogService');

				 if(response && response.data && response.data.newCusParamParams && response.data.newCusParamParams.length<=0 && response.data.customizeParams.length>0){
				 item.FormulaParameterEntities=(response.data.customizeParams);
				 toSaveLeave =estimateMainParamStructureConstant.BasicCusizmeParam;

				 }else if(response && response.data && response.data.newCusParamParams && response.data.newCusParamParams.length ){
				 item.FormulaParameterEntities=(response.data.newCusParamParams);
				 item.FormulaParameterEntities = item.FormulaParameterEntities.concat(response.data.customizeParams);
				 }

				 _.forEach(item.FormulaParameterEntities,function(param){
				 param.AssignedStructureId = estimateMainParamStructureConstant.BoQs;
				 param.isFormulaFromBoq = true;
				 param.ValueType =1;
				 param.DetailFormulaField = union[model];
				 param.EstParameterGroupFk =1;
				 param.ParameterValue = param.DefaultValue;
				 });

				 if(item.FormulaParameterEntities && item.FormulaParameterEntities.length>0){
				 return boqMainDetailsParamDialogService.showDialog(item,toSaveLeave).then(function () {
				 //Merge result into data on the client.
				 return platformValidationService.finishAsyncValidation({
				 valid: true
				 }, entity, value, model, asyncMarker, service, dataService);
				 },function(){
				 return true;
				 });
				 }else{
				 return true;
				 }
				 });
				 } */

				function setParameterValueToBoqItem(value, Code, mainService) {
					var boqItemSelected = mainService.getSelected();
					boqItemSelected[union[model]] = value;
					boqItemSelected[model] = Code;
					mainService.markItemAsModified(boqItemSelected);
				}
			}

			function generateAsyncDetailValidation(field, dataService) {
				return function (entity, value, model, e, options) {
					return getDetailsFormulaParameters(entity, value, field, dataService, options);
				};
			}

			function getAsyncDetailValidation(dataService) {

				var result = {};
				_.each(detailFields, function (val, key) {
					result['asyncValidate' + key] = generateAsyncDetailValidation(key, dataService);
				});
				return result;
			}

			function setBoqItemSavedByDetailParamsChange(boqItem) {
				BoqItemSavedByDetailParamsChange = boqItem;
			}

			function getBoqItemSavedByDetailParamsChange() {
				return BoqItemSavedByDetailParamsChange;
			}

			function clearBoqItemSavedByDetailParamsChange() {
				BoqItemSavedByDetailParamsChange = null;
				isDetailsFormulaParameters = false;
			}

			function setIsDetailsFormulaParameters(value) {
				isDetailsFormulaParameters = value;
			}

			function getIsDetailsFormulaParameters() {
				return isDetailsFormulaParameters;
			}

			let calculateCols = [
				'QuantityAdj',
				'FactorDetail',
				'Factor',
				'Quantity',
				'Cost',
				'CostOc',
				'Correction',
				'CorrectionOc',
				'IsUrb',
				'Urb1',
				'Urb1Oc',
				'Urb2',
				'Urb2Oc',
				'Urb3',
				'Urb3Oc',
				'Urb4',
				'Urb4Oc',
				'Urb5',
				'Urb5Oc',
				'Urb6',
				'Urb6Oc',
				'DiscountPercent',
				'DiscountedUnitprice',
				'DiscountedUnitpriceOc',
				'DiscountedPrice',
				'LumpsumPrice',
				'LumpsumPriceOc',
				'DiscountedPriceOc',
				'Discount',
				'DiscountOc',
				'Finaldiscount',
				'FinaldiscountOc',
				'Pricegross',
				'PricegrossOc',
				'ItemTotal',
				'ItemTotalOc',
				'QuantityDetail',
				'QuantityAdjDetail',
				'PreEscalation',
				'PreEscalationOc'];

			function additionalAsync(validationService, boqMainService, additionalColumnsForPriceConditionCalc) {
				function getPriceConditionService(){
					return angular.isFunction(boqMainService.getCurrentPriceConditionService) ? boqMainService.getCurrentPriceConditionService() : null;
				}

				//lock the boqItem selection, let it load the price condition after calculation finished.
				function lockParentSelection(){
					if(getPriceConditionService()){
						getPriceConditionService().lockParentSelection();
					}
				}

				//release boqItem selection lock to let the next boqItem can load the price condition
				function releaseParentSelection(){
					if(getPriceConditionService()) {
						getPriceConditionService().releaseParentSelection();
					}
				}

				function recalculatePriceCondition(entity) {
					let returnPromise = $q.when(true);
					if (getPriceConditionService()) {
						let priceConditionFk = entity.PrcPriceConditionFk || entity.PrcPriceconditionFk;
						returnPromise = getPriceConditionService().recalculate(entity, priceConditionFk).then(function () {
							return true;
						});
					}
					return returnPromise;
				}

				//fixed dev-21609: enhance the columns which will trigger price condition calculation after value change
				let cols = additionalColumnsForPriceConditionCalc && additionalColumnsForPriceConditionCalc.length ? calculateCols.concat(additionalColumnsForPriceConditionCalc) : calculateCols;

				_.forEach(cols, function (col) {
					let baseAsyncValidation = validationService['asyncValidate' + col];
					let promise = $q.when(true);
					validationService['asyncValidate' + col] = function (entity, value, model, e, options) {
						entity[model] = value;
						//calculate
						if(additionalColumnsForPriceConditionCalc && additionalColumnsForPriceConditionCalc.indexOf(model) > -1){
							$injector.get('boqMainChangeService').reactOnChangeOfBoqItem(entity, model, boqMainService, $injector.get('boqMainCommonService'));
						}

						if (baseAsyncValidation) {
							promise = baseAsyncValidation(entity, value, model, e, options);
						}

						//if not in project boq, then we need to lock parent selection, and make finishSelectionChange run after async validate
						lockParentSelection();
						const def = $q.defer();
						promise.then(function () {
							recalculatePriceCondition(entity).then(function(){
								releaseParentSelection();
								def.resolve(true);
							});
						}).catch(function(){
							releaseParentSelection();
							def.resolve(true);
						});
						return def.promise;
					};
				});
			}

			return service;
		}
	]);

})(angular);
