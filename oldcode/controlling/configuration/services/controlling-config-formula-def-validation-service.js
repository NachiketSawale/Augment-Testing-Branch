/*
 * $Id: controlling-config-formula-def-validation-service.js 101747 2024-01-30 06:51:37Z long.wu $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	let moduleName = 'controlling.configuration';

	/**
     * @ngdoc service
     * @name controllingActualsValidationService
     * @function
     *
     * @description
     * This service provides validation methods of controlling-actuals
     */
	angular.module(moduleName).factory('controllingConfigFormulaDefValidationService', ['$q', '$http', 'platformDataValidationService',
		'platformRuntimeDataService', '$translate', 'controllingConfigurationFormulaDefinitionDataService', 'contrConfigFormulaTypeHelper','contrConfigFormulaImageService', 'formulaAggregateType', 'platformDialogService',
		function ($q, $http, platformDataValidationService, platformRuntimeDataService, $translate, dataService, contrConfigFormulaTypeHelper, contrConfigFormulaImageService, formulaAggregateType, platformDialogService) {
			let service = {},
				paramRegEx = new RegExp('([a-zA-Z_]+[a-zA-Z0-9_]*)', 'g');

			service.validateCode = function (entity, newCode) {
				let fieldErrorTr = {fieldName: $translate.instant('cloud.common.entityCode')};
				let result = platformDataValidationService.isMandatory(newCode, 'Code', fieldErrorTr);
				if (!result.valid) {
					return platformDataValidationService.finishValidation(result, entity, newCode, 'Code', service, dataService);
				}

				let codeRegex = new RegExp('(^[a-zA-Z_]+[a-zA-Z0-9_]*)$', 'g');
				if(!codeRegex.test(newCode)){
					return platformDataValidationService.finishValidation(platformDataValidationService.createErrorObject('controlling.configuration.codeFormat'), entity, newCode, 'Code', service, dataService);
				}

				let item = _.find(columnDefs, function (item) {
					return _.get(item, 'CodeUpper') === newCode.toUpperCase();
				});

				item = item || _.find(dataService.getList(), function (item) {
					return _.get(item, 'Code') === newCode && item.Id !== entity.Id;
				});

				let res = item ? platformDataValidationService.createErrorObject('controlling.configuration.codeRepeated') : platformDataValidationService.createSuccessObject();

				if(res.valid){
					replaceFormulaCode(entity, newCode);
				}

				return platformDataValidationService.finishValidation(res, entity, newCode, 'Code', service, dataService);
			};

			function replaceFormulaCode(entity, newCode){
				let existList = _.filter(dataService.getList(), function (item){return item.Id !== entity.Id;});
				_.forEach(existList, function (item){
					if(item.IsBaseConfigData || !item.Formula || item.Formula === ''){return;}

					let params = item.Formula.match(paramRegEx);
					if(!params || (params.indexOf(entity.Code)<0 && params.indexOf(entity.Code.toLowerCase())<0 )) { return;}

					let regex = new RegExp('\\b' + entity.Code + '\\b', 'gi');
					item.Formula = item.Formula.replace(regex,  newCode);

					dataService.markItemAsModified(item);
				});
			}

			service.validateBasContrColumnTypeFk= function (entity, newVal) {
				let result = true;
				if(!contrConfigFormulaTypeHelper.canBeNew(newVal)){
					result = false;
				}

				let res = !result ? platformDataValidationService.createErrorObject('controlling.configuration.canotUseType') : platformDataValidationService.createSuccessObject();

				if(result){
					if(contrConfigFormulaTypeHelper.isCac_m(entity.BasContrColumnTypeFk) && entity.IsDefault){
						result = false;
						res = platformDataValidationService.createErrorObject('controlling.configuration.noDefault4CurrFormula');
						res.apply = false;
					}
				}

				if(result && entity.Formula){
					let isFactorType = contrConfigFormulaTypeHelper.isFactorType(newVal);
					let isNumber = new RegExp('^(-)?\\d+(\\.\\d+)?$').test(entity.Formula);
					if(!isFactorType && isNumber){
						let r = platformDataValidationService.createErrorObject('controlling.configuration.formulaError1');
						platformRuntimeDataService.applyValidationResult(r, entity, 'Formula');
						platformDataValidationService.finishValidation(r, entity, entity.Formula, 'Formula', service, dataService);
					}else if(isFactorType){
						platformRuntimeDataService.applyValidationResult(true, entity, 'Formula');
						platformDataValidationService.finishValidation(true, entity, entity.Formula, 'Formula', service, dataService);
					}

					let existLists = _.filter(dataService.getList(), function (item){return item.Id !== entity.Id;});

					let item =  _.find(existLists, function (item) {
						return _.get(item, 'Formula') === entity.Formula && item.BasContrColumnTypeFk === newVal;
					});

					// check repeated
					if(item){
						return platformDataValidationService.finishValidation(platformDataValidationService.createErrorObject('controlling.configuration.formulaRepeated'), entity, newVal, 'BasContrColumnTypeFk', service, dataService);
					}
				}

				if(result) {
					if(contrConfigFormulaTypeHelper.isFactorType(newVal) && entity.Formula){
						if(!(new RegExp('^(-)?\\d+(\\.\\d+)?$')).test(entity.Formula)){
							entity.Formula = '0';
						}
					}

					entity.BasContrColumnTypeFk = newVal;
					generateFormulaDetail(entity, entity.Formula);
					generateFormulaDividend(entity);

					const isCustFactor = contrConfigFormulaTypeHelper.isCustFactor(entity.BasContrColumnTypeFk);
					const isCACMethod = contrConfigFormulaTypeHelper.isCac_m(entity.BasContrColumnTypeFk);

					if(isCustFactor || isCACMethod){
						entity.Aggregates = formulaAggregateType.NONE;
					}else{
						entity.Aggregates = formulaAggregateType.SUM;
					}

					platformRuntimeDataService.readonly(entity, [
						{field: 'IsDefault', readonly: !contrConfigFormulaTypeHelper.isDefaultEditable(entity.BasContrColumnTypeFk)},
						{field: 'IsVisible', readonly: isCACMethod},
						{field: 'IsEditable', readonly: (!isCustFactor && !(!entity.IsBaseConfigData &&  contrConfigFormulaTypeHelper.isSac(entity.BasContrColumnTypeFk)))},
						{field: 'Aggregates', readonly: isCustFactor || isCACMethod}
					]);
					entity.IsVisible = !isCACMethod;
					entity.IsDefault = !isCACMethod ? false : entity.IsDefault;
					entity.IsEditable = !isCustFactor ? false : entity.IsEditable;
				}

				return platformDataValidationService.finishValidation(res, entity, newVal, 'BasContrColumnTypeFk', service, dataService);
			};

			service.validateDescriptionInfo = function validateDescriptionInfo(entity, newVal) {
				let fieldErrorTr = {fieldName: $translate.instant('cloud.common.entityDescription')};
				let result = platformDataValidationService.isMandatory(newVal, 'DescriptionInfo', fieldErrorTr);
				if (!result.valid) {
					let res = platformDataValidationService.finishValidation(result, entity, newVal, 'DescriptionInfo.Translated', service, dataService);
					res.model = 'DescriptionInfo';
					return res;
				}

				let item =  _.find(dataService.getList(), function (item) {
					return _.get(item, 'DescriptionInfo.Translated') === newVal && item.Id !== entity.Id;
				});

				result = item ? platformDataValidationService.createErrorObject('controlling.configuration.descriptionRepeated') : platformDataValidationService.createSuccessObject();

				let res = platformDataValidationService.finishValidation(result, entity, newVal, 'DescriptionInfo', service, dataService);
				res.model = 'DescriptionInfo';
				return res;
			};

			service.validateAggregates = function validateAggregate(entity, newValue){
				let item = angular.copy(entity);
				item.Aggregates = newValue;
				let changed = updateFormulaAggregate(item);

				return {apply: !changed, valid: true, error: ''};
			};

			service.validateFormula = function validateFormula(entity, newVal) {
				let fieldErrorTr = {fieldName: $translate.instant('controlling.configuration.Formula')};
				let result = platformDataValidationService.isMandatory(newVal, 'Formula', fieldErrorTr);
				if (!result.valid) {
					return platformDataValidationService.finishValidation(result, entity, newVal, 'Formula', service, dataService);
				}
				let existList = _.filter(dataService.getList(), function (item){return item.Id !== entity.Id;});

				let item =  _.find(existList, function (item) {
					if(item.BasContrColumnTypeFk !== entity.BasContrColumnTypeFk){
						return false;
					}

					let itemFormula = _.get(item, 'Formula');
					if(!itemFormula || itemFormula === ''){
						return false;
					}

					return itemFormula.replace(/\s+/g,'').toLowerCase() === newVal.replace(/\s+/g,'').toLowerCase();
				});

				// check repeated
				if(item){
					return platformDataValidationService.finishValidation(platformDataValidationService.createErrorObject('controlling.configuration.formulaRepeated'), entity, newVal, 'Formula', service, dataService);
				}

				let isFactorType = contrConfigFormulaTypeHelper.isFactorType(entity.BasContrColumnTypeFk);
				let isNumber = new RegExp('^(-)?\\d+(\\.\\d+)?$').test(newVal);
				if(isFactorType && !isNumber){
					return platformDataValidationService.finishValidation(platformDataValidationService.createErrorObject('controlling.configuration.formulaError'), entity, newVal, 'Formula', service, dataService);
				}
				if(!isFactorType && isNumber){
					return platformDataValidationService.finishValidation(platformDataValidationService.createErrorObject('controlling.configuration.formulaError1'), entity, newVal, 'Formula', service, dataService);
				}

				// check whether the parameter exists;
				let codes = newVal.match(paramRegEx);
				let errorCodes = [];
				if (codes && codes.length > 0) {
					_.forEach(codes, function (code){
						if(code === 'sqrt'){
							return;
						}
						if(code && code.toUpperCase() === entity.Code){
							errorCodes.push(code);
							return;
						}

						let item = _.find(columnDefs, function (item) {
							return _.get(item, 'CodeUpper') === code.toUpperCase();
						});

						item = item || _.find(existList, function (item) {
							return _.get(item, 'Code') === code.toUpperCase();
						});

						if(!item){
							errorCodes.push(code);
						}

					});
				}

				if(errorCodes.length > 0){
					let res = {
						apply: true,
						valid: false,
						error: $translate.instant('controlling.configuration.wrongOrSelfCode') + errorCodes.join(', ')
					};
					return platformDataValidationService.finishValidation(res, entity, newVal, 'Formula', service, dataService);
				}

				// check cycle reference
				let cycledResult = {cycledPath : '', result: false};
				if (codes && codes.length > 0){
					_.forEach(codes, function (code){
						if(cycledResult.result) { return;}
						let matched = _.find(existList, function (item) {
							return _.get(item, 'Code') === code.toUpperCase();
						});

						isCycledReference(matched, cycledResult);

					});
				}
				function isCycledReference(matched, checkResult){
					if(!matched || checkResult.result){
						return;
					}

					if(contrConfigFormulaTypeHelper.isCAC(matched.BasContrColumnTypeFk)){
						let matchedSubs = _.filter(existList, function (sub) {
							return contrConfigFormulaTypeHelper.isCac_m(sub.BasContrColumnTypeFk);
						});
						_.forEach(matchedSubs, function (sub){
							isCycledReference(sub, checkResult);
						});
					}else{
						if(!matched.Formula){return;}
						let cycledCodes = matched.Formula.match(paramRegEx);
						if(!cycledCodes || cycledCodes.length <= 0) { return;}
						if(_.find(cycledCodes, function (cycledCode){ return cycledCode.toUpperCase() === entity.Code;})) {
							checkResult.cycledPath += '->' + matched.Code;
							checkResult.result = true;
							return true;
						}

						let anyCycle = false;
						_.forEach(cycledCodes, function (cycledCode){
							let matchedCycled = _.find(existList, function (item) {
								return _.get(item, 'Code') === cycledCode.toUpperCase() && item.Id !== matched.Id;
							});
							let res = isCycledReference(matchedCycled, checkResult);
							anyCycle = anyCycle || res;
						});
						if(anyCycle){
							checkResult.cycledPath = '->' + matched.Code + checkResult.cycledPath;
						}
						return anyCycle;
					}
				}

				if(cycledResult.result) {
					let res = {
						apply: true,
						valid: false,
						error: $translate.instant('controlling.configuration.cycleReference') + entity.Code + cycledResult.cycledPath + '->' + entity.Code
					};
					return platformDataValidationService.finishValidation(res, entity, newVal, 'Formula', service, dataService);
				}

				return platformDataValidationService.finishValidation(platformDataValidationService.createSuccessObject(), entity, newVal, 'Formula', service, dataService);
			};

			service.asyncValidateFormula = function (entity, newVal){
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, newVal, 'Formula', dataService);

				if ((new RegExp('[^a-zA-Z\\d.]', 'ig')).test(newVal)) {
					let newValCopy = newVal.replace(/\\sqrt/g, '');
					let checkFormulaPromise = $http.get(globals.webApiBaseUrl + 'estimate/main/calculator/checkformular?exp=' + encodeURIComponent(newValCopy));
					asyncMarker.myPromise = checkFormulaPromise;
					return checkFormulaPromise.then(function (response) {
						if (response && response.data && !response.data.valid) {
							if (response.data.formulaError) {
								let errStr = '', i = 1;
								if (response.data.formulaError.length > 1) {
									_.forEach(response.data.formulaError, function (item) {
										errStr += '【' + i + ', ' + item + '】';
										i++;
									});
								} else {
									errStr = response.data.formulaError[0];
								}

								return $q.when(platformDataValidationService.finishAsyncValidation({
									valid: false,
									error: errStr
								}, entity, newVal, 'Formula', asyncMarker, service, dataService));
							}
						}
						else{
							contrConfigFormulaImageService.changeFormulaContent({Formula: newVal, Id: entity.Id}, true);
							generateFormulaDetail(entity, newVal);
							generateFormulaDividend(entity);

							return $q.when(platformDataValidationService.finishAsyncValidation({
								valid: true
							}, entity, newVal, 'Formula', asyncMarker, service, dataService));
						}
					});
				}

				contrConfigFormulaImageService.changeFormulaContent({Formula: newVal, Id: entity.Id});
				generateFormulaDetail(entity, newVal);
				generateFormulaDividend(entity);

				return $q.when(platformDataValidationService.finishAsyncValidation({
					valid: true
				}, entity, newVal, 'Formula', asyncMarker, service, dataService));
			};
			function generateFormulaDetail(entity, newVal){
				newVal = newVal || '';
				entity.Formula = newVal;

				let codes = newVal.match(paramRegEx);
				let allList = dataService.getList();
				let existList = _.filter(allList, function (item){return item.Id !== entity.Id;});

				// generate formula detail
				let formula = newVal;
				if (codes && codes.length > 0){
					codes.sort(function(a, b) {
						return b.length - a.length;
					});

					_.forEach(codes, function (code){
						let matched = _.find(existList, function (item) {
							return _.get(item, 'Code') === code.toUpperCase();
						});

						if(matched){
							// cac type use it owner code
							if(!contrConfigFormulaTypeHelper.canReplaceInDetail(matched.BasContrColumnTypeFk)){
								return;
							}
							let fDetail = matched.FormulaDetail && matched.FormulaDetail !== '' ? matched.FormulaDetail : matched.Formula;
							let regex = new RegExp('\\b' + code + '\\b', 'g');
							formula = formula.replace(regex, '('+ fDetail +')');
						}

					});
				}
				entity.FormulaDetail = formula;

				// generate relative formula detail
				let generateItemIds = [];
				_.forEach(existList, function (item){
					if(item.IsBaseConfigData){return;}
					generateSubFormulaDetail(item);
				});

				function generateSubFormulaDetail(item){
					if(!item || generateItemIds.indexOf(item.Id) >= 0){
						return;
					}
					generateItemIds.push(item.Id);

					if(!item.Formula || item.Formula === ''){
						return;
					}

					let params = item.Formula.match(paramRegEx);
					if(!params || params.length === 0){
						return;
					}

					_.forEach(params, function (param){
						if(param.toLowerCase() !== entity.Code.toLowerCase()){
							generateSubFormulaDetail(_.find(existList, function (exist){
								return _.get(exist, 'Code') === param.toUpperCase() && exist.Id !== item.Id;
							}));
						}
					});

					params.sort(function(a, b) {
						return b.length - a.length;
					});
					item.FormulaDetail = item.Formula;
					_.forEach(params, function (param){
						let matched = _.find(allList, function (item) {
							return _.get(item, 'Code') === param.toUpperCase();
						});

						if(matched){
							// cac type use it owner code
							if(!contrConfigFormulaTypeHelper.canReplaceInDetail(matched.BasContrColumnTypeFk)){
								return;
							}
							let fDetail = matched.FormulaDetail && matched.FormulaDetail !== '' ? matched.FormulaDetail : matched.Formula;
							let regex = new RegExp('\\b' + param + '\\b', 'g');
							item.FormulaDetail = item.FormulaDetail.replace(regex, '('+ fDetail +')');
						}
					});
					generateFormulaDividend(item);
					dataService.markItemAsModified(item);
				}

				updateFormulaAggregate(entity);
			}

			function updateFormulaAggregate(entity){
				if(entity && entity.FormulaDetail && entity.Aggregates === formulaAggregateType.CAL){
					let codes = entity.FormulaDetail.match(paramRegEx);
					codes = _.isArray(codes) ? codes : [];
					let allList = dataService.getList();
					let existedFactor = _.find(allList, function (item){
						return (contrConfigFormulaTypeHelper.isWcfOrBcf(item.BasContrColumnTypeFk) || contrConfigFormulaTypeHelper.isCustFactor(item.BasContrColumnTypeFk)) && codes.indexOf(item.Code) >= 0;
					});

					if(existedFactor){
						entity.Aggregates = formulaAggregateType.SUM;
						platformDialogService.showInfoBox('controlling.configuration.errorFormulaAggregateWithFactor');

						return true;
					}
				}

				return false;
			}

			function getPrio(op) {
				let priority;
				if (op === '*' || op === '/')
					priority = 2;
				if (op === '+' || op === '-')
					priority = 1;
				if (op === '(')
					priority = 0;
				return priority;
			}

			function isOperator(char){
				return ['+','-','*','/','(',')'].indexOf(char) >= 0;
			}

			function getPostFix(formulaDetail){
				let postfix = '';
				let postFixStack =  [];
				let stack = [];

				_.forEach(formulaDetail, function(char){
					if(!isOperator(char)){
						postfix += char;
					}else {
						if(postfix !== ''){
							postFixStack.push(postfix);
							postfix = '';
						}

						if (stack.length === 0)
							stack.push(char);
						else if (char === '(')
							stack.push(char);
						else if (char === ')')
						{
							let topChar = stack[stack.length - 1];
							while (topChar !== '(')
							{
								postFixStack.push(topChar);
								stack.pop();
								topChar = stack[stack.length - 1];
							}
							stack.pop();
						}
						else
						{
							let topChar = stack[stack.length - 1];
							while (getPrio(char) <= getPrio(topChar))
							{
								postFixStack.push(topChar);
								stack.pop();
								if (stack.length === 0){
									break;
								}
								topChar = stack[stack.length - 1];
							}
							stack.push(char);
						}
					}
				});

				if(postfix !== ''){
					postFixStack.push(postfix);
				}

				while (stack.length !== 0)
				{
					let pop = stack.pop();
					postFixStack.push(pop);
				}

				return postFixStack;
			}

			function generateFormulaDividend(entity){
				if(!entity){
					return;
				}

				let formulaDividend = null;
				let resultStack = [], str, right, left, item;

				if (_.isString(entity.FormulaDetail) && entity.FormulaDetail.indexOf('/') > 0){
					let formulaDetail = entity.FormulaDetail;
					formulaDividend = '';
					let result = getPostFix(formulaDetail);

					while(result.length > 0){
						item = result.shift();

						if(item === ' '){
							continue;
						}

						if(isOperator(item)){
							right = resultStack.pop();
							left = resultStack.pop();

							if(item === '/'){
								formulaDividend = formulaDividend + ' AND ' + right + ' != 0 ';
							}

							str = '(' + left + item + right + ')';
							resultStack.push(str);
						}else{
							resultStack.push(item);
						}
					}
				}

				entity.FormulaDividendDetail = formulaDividend;
			}

			service.validateNewEntity = function (item){
				let result = service.validateCode(item, item.Code);
				platformRuntimeDataService.applyValidationResult(result, item, 'Code');
				result = service.validateDescriptionInfo(item, item && item.DescriptionInfo ? item.DescriptionInfo.Translated : null);
				platformRuntimeDataService.applyValidationResult(result, item, 'DescriptionInfo');
				result = service.validateFormula(item, item.Formula);
				platformRuntimeDataService.applyValidationResult(result, item, 'Formula');
			};

			service.validateIsDefault = function validateIsDefault(entity, newValue){
				if(!newValue || !contrConfigFormulaTypeHelper.isWcfOrBcf(entity.BasContrColumnTypeFk)){
					return platformDataValidationService.finishValidation(true, entity, newValue, 'IsDefault', service, dataService);
				}

				let existList = _.filter(dataService.getList(), function (item){return item.Id !== entity.Id;});
				let hasReferItem = false;
				_.forEach(existList, function (item){
					if(item.IsBaseConfigData || !item.Formula || item.Formula === ''){return;}

					let params = item.Formula.match(paramRegEx);
					if(params && (params.indexOf(entity.Code) >= 0 || params.indexOf(entity.Code.toLowerCase()) >= 0)) { hasReferItem = true;}
				});

				if(!hasReferItem) {
					let res = {
						apply: true,
						valid: false,
						error: $translate.instant('controlling.configuration.noRelativeFormula')
					};
					return platformDataValidationService.finishValidation(res, entity, newValue, 'IsDefault', service, dataService);
				}

				return platformDataValidationService.finishValidation(platformDataValidationService.createSuccessObject(), entity, newValue, 'IsDefault', service, dataService);
			};

			let columnDefs = [];

			service.loadColumnDef = function (){
				$http.post(globals.webApiBaseUrl + 'Controlling/Configuration/ContrColumnPropDefController/getColumnDefinitionList', {filter: ''}).then(function (response){
					if(response && response.data && response.data.dtos){
						columnDefs = response.data.dtos;
						_.forEach(columnDefs, function (col){
							col.CodeUpper = col.Code.toUpperCase();
							// col.sorting = 100 - col.Code.Length;
						});

						columnDefs = _.sortBy(columnDefs, 'sorting');
					}
				});
			};

			return service;
		}
	]);
})(angular);