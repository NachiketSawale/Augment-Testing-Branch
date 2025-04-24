/**
 * Created by joshi on 21.06.2016.
 */

(function (angular) {
	'use strict';
	/* global globals, _ */
	/**
	 * @ngdoc service
	 * @name estimateRuleCommonService
	 * @function
	 * @description
	 * estimateRuleCommonService is the data service for estimate rule related related common functionality.
	 */

	let moduleName = 'estimate.rule';
	angular.module(moduleName).factory('estimateRuleCommonService', ['$http','$q', '$injector', 'math', 'basicsLookupdataTreeHelper','$translate', 'platformModalService', 'estimateRuleMasterDataFilterService',
		function ($http, $q, $injector, math, basicsLookupdataTreeHelper,$translate, platformModalService, estimateRuleMasterDataFilterService) {
			let service = {};

			service.calculateDetails = function calculateDetails(item, colName, targetColumnName, dataService, referenceParams) {
				calculateParam(item, colName, targetColumnName, dataService);
				if(targetColumnName && item.ValueType !== 2) {
					item.ActualValue = item[targetColumnName];
					item.ParameterValue = item[targetColumnName];
				}

				if(dataService &&  _.isFunction(dataService.getList)) {
					service.calculateReferenceParams(item, dataService, referenceParams);
				}
			};

			// calculate the param
			function calculateParam(item, colName, targetColumnName, dataService){
				let map2Detail =
						{
							DefaultValue: 'DefaultValue',
							ValueDetail: 'ParameterValue',
							ParameterValue: 'ValueDetail',
							Value:'Value'
						},
					union = angular.extend({}, _.invert(map2Detail), map2Detail);

				// eslint-disable-next-line no-prototype-builtins
				if (union.hasOwnProperty(colName) && item.ValueType !== 2) {
					if (item[colName]) {
						let detailVal = angular.copy(item[colName].toString());
						detailVal = detailVal.replace(/[,]/gi, '.');
						if(dataService) {
							let data = getParamData(dataService);
							if (data && data.length > 0) {
								if(!service.isBooleanType(detailVal, dataService)) {
									detailVal = service.getValyeDetial(detailVal, data);
								}
							}
						}
						// eslint-disable-next-line no-useless-escape
						detailVal = detailVal.replace(/[`~§!@#$%^&|=?;:'"<>\s{}\[\]\\]/gi, '');
						// eslint-disable-next-line no-useless-escape
						let list = detailVal.match(/\b[a-zA-Z]+[\w|\s*-+\/]*/g);
						let chars = ['sin', 'tan', 'cos', 'ln'];
						let result = _.filter(list, function (li) {
							if (chars.indexOf(li) === -1) {
								return li;
							}
						});

						let newValue;

						if(union[colName] ==='ValueDetail' || targetColumnName ==='ValueDetail'){
							detailVal = $injector.get('estimateMainCommonCalculationService').calcuateValueByCulture(detailVal.toString());
						}

						if (result && !result.length) {
							try{
								newValue = math.eval(detailVal);
							}catch (err){
								if(detailVal.indexOf(',') !== -1) {
									newValue = detailVal;
								}else{
									newValue = 0;
								}
							}
						} else {
							newValue = 0;
						}

						if (targetColumnName) {
							item[targetColumnName] = newValue;
						} else {
							item[union[colName]] = newValue;
						}
					} else {
						item[union[colName]] = 0;
					}
				}
			}

			// calculate the reference param
			service.calculateReferenceParams = function calculateReferenceParams(item, dataService, referenceParams) {

				if(item.__rt$data && item.__rt$data.errors && item.__rt$data.errors['ValueDetail']) {return;}

				let paramList = dataService.getList();
				let codeRegex = getParameterCode();
				let valueTypes = $injector.get('estimateRuleParameterConstant');
				angular.forEach(paramList, function (param) {
					if(param.ValueType === valueTypes.Decimal2 && param.Code !== item.Code) {
						let codeList = param.ValueDetail ? param.ValueDetail.toString().toUpperCase().match(codeRegex) : [];
						let index = _.indexOf(codeList, item.Code);
						if (index !== -1) {
							let anyMathKey = _.forEach(codeList, function (key){return isMathKey(key);});
							if(!anyMathKey || anyMathKey.length <=0){
								calculateParam(param, 'ValueDetail', 'DefaultValue', dataService);
								param.ActualValue = param.DefaultValue;
								param.ParameterValue = param.DefaultValue;
								if(referenceParams){
									referenceParams.params.push(param);
									referenceParams.promiseList.push($q.when(true));
								}
								else if(_.isFunction(dataService.markItemAsModified)) {
									dataService.markItemAsModified(param);
								}
								calculateReferenceParams(param, dataService);
							}else{
								let detailVal = replaceParamToValue(param.ValueDetail, paramList, param);
								let promise = $http.get(globals.webApiBaseUrl + 'basics/common/calculateexpressions/formatcheck?exp='+encodeURIComponent(detailVal)).then(function(response){
									let value = response && response.data && !response.data.valid ? 0 : response.data.expResult;
									param.ActualValue = value;
									param.ParameterValue = value;
									if(referenceParams){
										referenceParams.params.push(param);
										if($injector.get('platformGridAPI').grids.exist($injector.get('estimateParameterComplexInputgroupLookupService').gridGuid())){
											$injector.get('platformGridAPI').rows.refreshRow({gridId: $injector.get('estimateParameterComplexInputgroupLookupService').gridGuid(), item: param});
										}
									}
									else if(_.isFunction(dataService.markItemAsModified)) {
										dataService.markItemAsModified(param);
									}else if($injector.get('platformGridAPI').grids.exist($injector.get('estimateParameterComplexInputgroupLookupService').gridGuid())){
										$injector.get('platformGridAPI').rows.refreshRow({gridId: $injector.get('estimateParameterComplexInputgroupLookupService').gridGuid(), item: param});
									}
									calculateReferenceParams(param, dataService);
								});

								if(referenceParams) {
									referenceParams.promiseList.push(promise);
								}
							}
						}
					}
				});
			};

			// check the loop reference
			service.checkLoopReference = function (item, dataService, paramReference, nextParam) {
				let indexDetail = -1;
				let paramList = dataService.getList();
				let codeRegex = service.getCodeRegex();
				let currentItem = nextParam ? nextParam : item;
				let codeList;
				if(currentItem.ValueDetail) {
					codeList = (currentItem.ValueDetail + '').toUpperCase().match(codeRegex);
				}
				else {
					return false;
				}

				indexDetail = item && item.Code ? _.indexOf(codeList, item.Code.toUpperCase()) : indexDetail;
				if(!paramReference.isLoop) {
					paramReference.linkReference += currentItem.Code + '-';
					paramReference.isLoop = indexDetail !== -1;
					if(paramReference.isLoop) {
						paramReference.linkReference += item.Code;
					}
				}

				if(!paramReference.isLoop) {
					angular.forEach(paramList, function (param) {
						if (param.Code !== currentItem.Code) {
							let index = _.indexOf(codeList, param.Code);
							if (index !== -1) {
								service.checkLoopReference(item, dataService, paramReference, param);
							}
						}
					});
				}
			};

			let attachProp = function attachProp(item, list, parentProps){
				if(item[parentProps]){
					let matchedItem = _.find(list, {MainId : item[parentProps]});
					if(matchedItem){
						if(!matchedItem.CustomEstRules){
							matchedItem.CustomEstRules = [];
						}
						// matchedItem.CustomEstRules.push(item);

						item.CustomEstRuleFk = matchedItem.Id;
						item.ParentCode = matchedItem.Code;
					}
				}
			};

			// used for composite rule which combine the prjEstRule and estRule
			service.generateRuleCompositeList = function generateRuleCompositeList(items, isForBoqOrEstimate, filterByMasterData){

				// fix defect 88659, The unnamed parameter still could be saved in Estimate
				// all rule combo data is from this function, use the argument isForBoqOrEstimate to judge it is for Boq or Estimate
				// if isForBoqOrEstimate === undefined no filter for the data here;
				let isForBoq = isForBoqOrEstimate === 'isForBoq';
				let isForEstimate = isForBoqOrEstimate === 'isForEstimate';

				let result = items.EstRulesEntities;
				result = items && items.PrjEstRulesEntities && items.PrjEstRulesEntities.length ? result.concat(items.PrjEstRulesEntities) : result;

				let cnt = 0;
				angular.forEach(result, function(item){
					item.OriginalMainId = item.MainId;
					item.MainId = item.Id;
					item.Id = ++cnt;
					item.CustomEstRuleFk = null;
					item.ParentCode = null;
				});

				let prjRules = _.filter(result, function(item){
					// eslint-disable-next-line no-prototype-builtins
					if(item.hasOwnProperty('PrjEstRuleFk')){
						return item;
					}
				});

				let prjEstRules = _.filter(result, function(item){
					// eslint-disable-next-line no-prototype-builtins
					if(!item.hasOwnProperty('PrjEstRuleFk')){
						return item;
					}
				});

				angular.forEach(result, function(item){
					// eslint-disable-next-line no-prototype-builtins
					if(item.hasOwnProperty('PrjEstRuleFk')){
						attachProp(item, prjRules, 'PrjEstRuleFk');
					}
					// eslint-disable-next-line no-prototype-builtins
					if(item.hasOwnProperty('EstRuleFk')){
						attachProp(item, prjEstRules, 'EstRuleFk');
					}
				});
				result = _.sortBy(result, ['Sorting', 'Code']);
				let context = {
					treeOptions:{
						parentProp : 'CustomEstRuleFk',
						childProp : 'CustomEstRules'
					},
					IdProperty: 'Id'
				};

				if(filterByMasterData) {
					prjEstRules = _.filter(result, function(item){
						// eslint-disable-next-line no-prototype-builtins
						if(item.hasOwnProperty('EstRuleFk')){
							return item;
						}
					});
					// project unique rules
					prjRules = _.filter(result, function(item){
						// eslint-disable-next-line no-prototype-builtins
						if(item.hasOwnProperty('PrjEstRuleFk')){
							return item;
						}
					});

					let ruleTrees = basicsLookupdataTreeHelper.buildTree(prjEstRules, context);

					// filter rules by project ratebook
					ruleTrees = estimateRuleMasterDataFilterService.filterRuleByMasterData(ruleTrees, 'MainId');

					result = prjRules.concat(basicsLookupdataTreeHelper.flatten(ruleTrees, context));

					// fix alm 134610:Rules lookup is empty on surcharge 4 item in boq
					let prjRuleList = _.filter(items.EstRulesEntities,'IsPrjRule');
					result = _.uniq(prjRuleList.concat(result));
				}

				// filter it whether isForBoq or IsForEstimate
				if(isForBoq){
					result = _.filter(result, function(item){
						if(item.IsForBoq === isForBoq){
							return item;
						}
					});
				}
				else if(isForEstimate){
					result = _.filter(result, function(item){
						if(item.IsForEstimate === isForEstimate){
							return item;
						}
					});
				}

				if(filterByMasterData) {
					estimateRuleMasterDataFilterService.setRuleFilterIds(_.map(result, 'MainId'));
				}

				return basicsLookupdataTreeHelper.buildTree(result, context);
			};

			service.getCodeIsUnqiueOrNot = function getCodeIsUnqiueOrNot(value, parameterId, valueType, isLookup) {
				isLookup = !(isLookup === 0 || !isLookup);
				let defer = $q.defer();
				$http.get(globals.webApiBaseUrl + 'estimate/rule/parameter/issodecodeinall?code=' + value + '&parameterId=' + parameterId + '&valueType=' + valueType + '&isLookup=' + isLookup).then(function (response) {
					let isUnquie = response.data;
					defer.resolve(isUnquie);
				});
				return defer.promise;
			};

			service.CheckCodeConflict = function CheckCodeConflict(value,parameterId,valueType,isLookup) {
				isLookup = !(isLookup === 0 || !isLookup);
				let defer = $q.defer();
				$http.get(globals.webApiBaseUrl+'estimate/rule/parameter/CheckCodeConflict?code=' + value + '&parameterId=' +parameterId + '&valueType=' + valueType +'&isLookup=' + isLookup).then(function (response) {
					defer.resolve(response.data);
				});
				return defer.promise;
			};

			service.GetAllRuleAndRuleParamByCode = function GetAllRuleAndRuleParamByCode(code) {
				let defer = $q.defer();
				$http.get( globals.webApiBaseUrl + 'estimate/rule/parameter/getallestruleparameterbycode?code=' + code).then(function (response) {
					defer.resolve(response.data);
				});
				return defer.promise;
			};

			service.GetAllPrjRuleParametersByCode = function GetAllPrjRuleParametersByCode(code,prjId) {
				let defer = $q.defer();
				$http.get( globals.webApiBaseUrl + 'estimate/rule/projectestruleparam/getallprjruleparameterbycode?code=' + code + '&prjId=' + prjId).then(function (response) {
					defer.resolve(response.data);
				});
				return defer.promise;
			};

			service.getCodeRegex = function getCodeRegex(){
				return /([\w:.]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g;

			};

			function getParameterCode(){
				return /[_a-zA-Z]+[_a-zA-Z\d]*/g; // the old is : /(_+[a-zA-Z\d]+)|([a-zA-Z][a-zA-Z\d]*)/g;
			}

			function isMathKey(val){
				let mathKeys = ['MOD', 'DIV', 'PI', 'E', 'FLOOR', 'CEIL', 'SQRT', 'SQR', 'ABS', 'ROUNDK', 'ROUND', 'TRUNC', 'MIN', 'MAX', 'WENN', 'IF', 'SIN', 'COS', 'TAN', 'COT', 'ARCSIN', 'ARCCOS', 'ARCTAN', 'ARCTAN2', 'ARCCOT', 'SINH', 'COSH', 'TANH', 'LN', 'LOG', 'EXP', 'EEX', 'RAD', 'DEG', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'SQRT2'];
				return Math[(val+'').toLowerCase()] || mathKeys.indexOf((val+'').toUpperCase()) >= 0;
			}
			service.getParticularCharaRegex = function getParticularCharaRegex() {
				// eslint-disable-next-line no-useless-escape
				return /[\~\!\@\#\$\%\^\&\*\(\)\_\+\=\-\[\]\{\}\|\;\:\'\"\,\/\<\>\?\/\~\！\@\#\￥\\%\……\&\*\（\）\—\—\+\【\】\；\‘\“\，\。\》\《\、\？\/]/g;
			};

			service.replaceCharacter = function replaceCharacter(baseCharacterString,originalValue,replaceValue){
				let resultString ='';
				for(let i =0; i < baseCharacterString.length; i++){
					let finish = false;

					for(let j=0; j<originalValue.length; j++){
						if(baseCharacterString.charAt(i+j) !== originalValue.charAt(j)){
							break;
						}else if(baseCharacterString.charAt(i+j) === originalValue.charAt(j) && j === originalValue.length-1 ){
							i += j;
							finish = true;
							resultString = resultString.concat(replaceValue);
						}
					}
					if(!finish){
						resultString = resultString.concat(baseCharacterString.charAt(i));
					}
				}

				return resultString;
			};

			service.getValyeDetial = function getValyeDetial(detailVal, data){
				let obj = [];
				let codeRegex = service.getCodeRegex();
				let codeList = detailVal.match(codeRegex);
				let calStr = '';
				let codes = _.filter(data, function(item) {
					if (codeList &&codeList.includes(item.code)) {
						return item;
					}
				});

				if(codes && codes.length > 0) {
					let count = 0;
					let isCode = true;
					for (let i = 0; i < detailVal.length; i++) {
						// eslint-disable-next-line no-useless-escape
						if (/[\+\-\*\/\(\)]/.test(detailVal.charAt(i))) {
							isCode = true;
							obj.push({
								flag: 'cal',
								value: detailVal.charAt(i)
							});
						}
						else {
							if (isCode) {
								let strA = codeList[count];
								obj.push({
									flag: 'let',
									value: strA
								});
								count++;
							}
							isCode = false;
						}
					}

					for (let j = 0; j < obj.length; j++) {
						if (obj[j].flag === 'let') {
							let itemValue = _.find(data, {'code': obj[j].value});
							if (itemValue) {
								obj[j].value = itemValue.value;
							}
						}
					}

					for (let h = 0; h < obj.length; h++) {
						calStr += obj[h].value;
					}
				}
				else {
					calStr = detailVal;
				}

				return calStr;
			};

			function getParamData(dataService){
				let paramList = dataService.getList();
				let data = [];
				if(paramList && paramList.length > 0) {
					for(let i=0; i < paramList.length; i++) {
						let paramValue = 0;
						if(paramList[i].ParameterValue){
							paramValue = paramList[i].ParameterValue;
						}
						else {
							paramValue = paramList[i].IsLookup ? paramList[i].ActualValue : paramList[i].DefaultValue;
						}
						let item = {
							code: paramList[i].Code,
							value: paramValue
						};
						data.push(item);
					}
				}

				return data;
			}

			service.isBooleanType = function isBooleanType(detailVal, dataService) {
				let booleanCodes = [];
				let data = dataService.getList();
				let codeRegex = service.getCodeRegex();
				let codeList = false;
				if(typeof detailVal === 'string'){
					codeList = detailVal.match(codeRegex);
				}
				let booleanParams = _.filter(data, function (param) {
					return param.ValueType === 2;
				});

				if (booleanParams && codeList) {
					booleanCodes = _.filter(codeList, function (code) {
						let isBooleanParam = _.find(booleanParams, {'Code': code});
						if (isBooleanParam) {
							return code;
						}
					});
				}

				return booleanCodes && booleanCodes.length > 0;
			};

			service.validateParamVariable = function validateParamVariable(entity,newValueText,paramValueList,res,valueTextField) {

				// let tempValueText= '';
				// let tempValueDetail ='';

				// let regNumber = /^([1-9][0-9]*)(\.[0-9]+)*$/;

				let afterReplaceVtext = newValueText.replace(/[a-zA-Z\u4e00-\u9fa5]/g,'1');

				// validation the formula
				try{
					let vaResult = math.eval(afterReplaceVtext);
					if(vaResult === 'Infinity' || vaResult === 'NaN' ||  vaResult === undefined || vaResult === null){
						res.wrongFormula = true;
						return;
					}
				}catch (err){
					res.wrongFormula = true;
					return;
				}

				let codeRegex = service.getParticularCharaRegex();
				let splitValueByPlus = newValueText.split(codeRegex);
				// let isNumber = false;


				let newValueTextTemp =angular.copy(newValueText);

				_.forEach(splitValueByPlus, function (vtext) {
					if(vtext!=='' && vtext) {
						let matchParamValue = _.filter(paramValueList, function (pvalue) {
							if (pvalue.DescriptionInfo && pvalue.DescriptionInfo.Translated === vtext) {
								return pvalue;
							}
						});

						if (matchParamValue && matchParamValue.length > 0) {
							// tempValueDetail = (tempValueDetail !== '') ? tempValueDetail + '+' + matchParamValue[0].ValueText : matchParamValue[0].ValueText;
							newValueTextTemp = newValueTextTemp.replace(vtext,matchParamValue[0].ValueText);
						} else {

							/* isNumber = regNumber.test(vtext);
							if (!isNumber) {
								res.noVariableMatchValueCount++;
							} */

							let isNumber = true;
							try{
								let vaResult;
								vaResult = math.eval(vtext);
								if(vaResult === 'Infinity' || vaResult === 'NaN' ||  vaResult === undefined || vaResult === null){
									isNumber =false;
								}
							}catch (err){
								isNumber =false;
							}

							if (!isNumber) {
								res.noVariableMatchValueCount++;
							}

							res.wrongVariable = res.wrongVariable === '@' ? res.wrongVariable + vtext : res.wrongVariable + ' + ' + vtext;
							// tempValueDetail = (tempValueDetail !== '') ? tempValueDetail + '+' + vtext : vtext;
							// tempValueText = (tempValueText !== '') ? tempValueText + '+' + vtext : vtext;
						}

					}
				});

				entity.ValueDetail = newValueTextTemp;
				// entity.ValueText = entity.ParameterText  = tempValueText;
				entity[valueTextField] = newValueText;
			};

			service.validateParameterValue = function validateParameterValue(fromValidationService, entity, value,field, paramValueList) {

				let newParameterText = value;

				if (entity.ValueType === $injector.get('estimateRuleParameterConstant').TextFormula) {

					if(newParameterText !=='' && newParameterText){
						let res ={};
						res.valid = true;
						res.apply = true;
						res.wrongFormula = false;
						res.wrongVariable ='@';
						res.noVariableMatchValueCount = 0;

						service.validateParamVariable(entity,newParameterText,paramValueList,res,field);

						if(res.wrongFormula){
							res.valid = false;
							res.error =  $translate.instant('cloud.common.WrongFormulaMsg');
							res.error$tr$ =  $translate.instant('cloud.common.WrongFormulaMsg');
						}else{
							if(res.noVariableMatchValueCount > 0){
								res.error =  $translate.instant('cloud.common.VariableNotFoundErrorMessage', {object: res.wrongVariable});
								res.error$tr$ =  $translate.instant('cloud.common.VariableNotFoundErrorMessage', {object: res.wrongVariable});
								res.valid = false;
							}
						}
						if(fromValidationService.onCodeChange){
							fromValidationService.onCodeChange.fire(!res.valid);
						}
						return $injector.get('platformRuntimeDataService').applyValidationResult(res, entity, 'DefaultValue');
					}else{
						entity.ValueDetail = entity.ParameterText = newParameterText;
					}
				}
				return true;
			};

			service.asyncParameterDetailValidation = function (entity, value, model, dataService, validataService) {
				let platformValidationService = $injector.get('platformDataValidationService');
				return service.getAsyncParameterDetailValidationResult(entity, value, model, dataService).then(function (result) {
					if(validataService.onCodeChange){
						validataService.onCodeChange.fire(!result.valid);
					}
					platformValidationService.finishAsyncValidation(result, entity, value, model, null, validataService, dataService);
					return $q.when(result);
				});
			};

			function replaceParamToValue(valueDetail, paramsList, currentEntity){
				if(!valueDetail || !paramsList || paramsList.length <= 0){
					return valueDetail;
				}

				_.forEach(paramsList, function (item){
					item.level = angular.isDefined(item.level) ? item.level : 1;
					item.CodeLengthOrder = 50 - item.Code.length;
				});
				paramsList = _.orderBy(paramsList, ['level', 'CodeLengthOrder']);
				_.forEach(paramsList, function (param){
					if(!isMathKey(param.Code) && param.Id !== currentEntity.Id){
						let regTxt = '(^'+param.Code+'(?=[-+*/~><^\\s&=!;)|]+))|((?<=[-+*/~><^\\s&=!(;|]+)'+param.Code+'(?=[-+*/~><^\\s&=!;)|]+))|((?<=[-+*/~><^\\s&=!(;|]+)'+param.Code+'$)|(^'+param.Code+'$)';
						valueDetail = valueDetail.replace(new RegExp(regTxt, 'ig'), param.ParameterValue);
					}
				});

				return valueDetail;
			}

			service.getAsyncParameterDetailValidationResult = function (entity, value, model, dataService) {
				let valueTypes = $injector.get('estimateRuleParameterConstant');
				if(entity.ValueType !== valueTypes.Decimal2){
					return $q.when({
						valid: true,
						error: ''
					});
				}

				value = value || '';
				let platformValidationService = $injector.get('platformDataValidationService'),
					detailVal = angular.copy(value.toString()),
					asyncMarker = platformValidationService.registerAsyncCall(entity, value, model, dataService);
				detailVal = detailVal.replace(/[,]/gi, '.');
				detailVal = detailVal.replace(/\sdiv\s/gi, '#div#');
				detailVal = detailVal.replace(/\smod\s/gi, '#mod#');
				detailVal = detailVal.replace(/\s/gi, '');
				detailVal = detailVal.replace(/#div#/gi, ' div ');
				detailVal = detailVal.replace(/#mod#/gi, ' mod ');

				let stringFormatService = $injector.get('basicsCommonStringFormatService');
				// parameter detail can type in some particular char to support customized function
				let invalidCharCheck = stringFormatService.validateInvalidChar(detailVal,/[=|!&;[\]}{><~]/gi);
				if (!invalidCharCheck.valid) {
					return $q.when(invalidCharCheck);
				}

				// check whether the detail includes invalid parameter
				invalidCharCheck = stringFormatService.validateInvalidParameter(detailVal);
				if (!invalidCharCheck.valid) {
					return $q.when(invalidCharCheck);
				}

				// if the detail is formula, then check the format of formula
				// eslint-disable-next-line no-useless-escape
				if ((new RegExp('[^\\d\.]', 'gi')).test(detailVal)) {
					detailVal = replaceParamToValue(detailVal, dataService.getList(), entity);

					let checkFormulaPromise = $http.get(globals.webApiBaseUrl + 'basics/common/calculateexpressions/formatcheck?exp='+encodeURIComponent(detailVal));
					asyncMarker.myPromise = checkFormulaPromise;
					return checkFormulaPromise.then(function(response) {
						if(response && response.data && !response.data.valid){
							if(response.data.formulaError){
								let errStr = '', i = 1;

								if(response.data.formulaError.length > 1){
									_.forEach(response.data.formulaError, function(item){
										errStr += '【' + i +', '+  item + '】';
										i++;
									});
								}else{
									errStr = response.data.formulaError[0];
								}

								return $q.when({
									valid: false,
									error: errStr
								});
							}
						}
						else{

							entity.ParameterValue = response.data.expResult;
							if(dataService.getServiceName && dataService.getServiceName() === 'estimateProjectEstRuleParamService'){
								entity.DefaultValue = response.data.expResult;
							}

							entity.CalculateDefaultValue = true;
							entity.isCalculateByParamReference = true;
							return $q.when({
								valid: true
							});
						}
					});
				} else {
					return $q.when({
						valid: true
					});
				}
			};

			service.getParamUniqueAndValues = function getParamUniqueAndValues(lineItemContextId, ruleParamId, existCode, code, isLookup, valueType, isProject, projectFk){
				let data = {
					IsPorject: isProject,
					ProjectId: projectFk,
					MdcLineItemContextFk: lineItemContextId,
					MainItemId: ruleParamId,
					ExistCode: existCode,
					Code: code,
					IsLookup: isLookup,
					ValueType: valueType
				};

				return $http.post(globals.webApiBaseUrl + 'estimate/rule/parameter/value/getparamunqiueandvalues', data);
			};

			service.handleParameterValues = function handleParameterValues(newItems, existItems, lineItemContextId, ruleParamId, code, valueType, isUnique, isMerge, isProject, projectId) {
				let data = {
					newItems: newItems,
					existItems: existItems,
					Code: code,
					MdcLineItemContextFk: lineItemContextId,
					MainItemId: ruleParamId,
					ValueType: valueType,
					IsUnique: isUnique,
					IsMerge: isMerge,
					IsProject: isProject,
					ProjectId: projectId
				};

				return $http.post(globals.webApiBaseUrl + 'estimate/rule/parameter/value/handleparamvaluechanged', data);
			};

			// TODO: when change the parameter code, valueType and isLookup, will handle the param and param value
			service.handleParamAndParamterValue = function handleParamAndParamterValue(args, dataService, paramService, paramValueService, isProject, isCode) {
				let ruleItem = paramService.getParentItem();
				let projectId = isProject ? ruleItem.ProjectFk : null;
				let mdcLineItemContextFk = ruleItem.MdcLineItemContextFk;
				let paramId = args.item.Id;
				let code = args.item.Code;
				let existCode = paramService.getExistParamCode();
				let isLookup = args.item.IsLookup;
				let valueType = args.item.ValueType;
				let existItems, newItems, UniqueObject, SourceUinqueObject;
				service.getParamUniqueAndValues(mdcLineItemContextFk, paramId, existCode, code, isLookup, valueType, isProject, projectId).then(function (response) {
					newItems = response.data.SourceEstRuleParamValues;
					existItems = response.data.EstRuleParamValues;
					UniqueObject = response.data.UniqueObject;
					SourceUinqueObject = response.data.SourceUinqueObject;

					// ToDo: check the type, get the paramvalue default value and set it to rule param container default value column
					if(isLookup) {
						if (args.item && args.item.EstRuleParamValueFk === null) {
							angular.forEach(existItems, function (item) {
								if (item.IsDefault === true) {
									args.item.ValueDetail = item.ValueDetail;
									args.item.DefaultValue = item.Id;
									args.item.EstRuleParamValueFk = item.Id;

									args.item.ActualValue = item.Value;
									if (args.item.ValueType === $injector.get('estimateRuleParameterConstant').Text) {
										args.item.ValueText = item.ValueDetail;
									}

									paramService.fireItemModified(args.item);
									paramService.gridRefresh();
								}
							});
						}
					}

					// TODO: the code is not unique
					args.item.IsUnique = !(UniqueObject && !UniqueObject.uniqueResult);

					// TODO: change code as exist code, handle the param values.
					if (isCode && isLookup) {
						if (newItems && newItems.length > 0) {
							let isUnique = !(SourceUinqueObject && !SourceUinqueObject.uniqueResult);
							let strContent = $translate.instant('estimate.rule.MergedParamValues');
							let strTitle = $translate.instant('estimate.rule.MergedParamValuesTitle');
							platformModalService.showYesNoDialog(strContent, strTitle, 'yes').then(function (result) {
								let isMerge = !!result.yes;
								dataService.update().then(function () {
									service.handleParameterValues(newItems, existItems, mdcLineItemContextFk, paramId, code, valueType, isUnique, isMerge, isProject, projectId).then(function (response) {
										paramValueService.setList(response.data);
									});
								});
							});
						}
						else {
							paramValueService.setList(existItems);
						}
					}
					else {
						// set the estimate rule parameter values
						paramValueService.setList(existItems);
					}
					args.item.DefaultValue = args.item.DefaultValue ? args.item.DefaultValue : 0;
					paramService.fireItemModified(args.item);
					paramService.gridRefresh();
				});
			};

			service.checkParameterReference = function checkParameterReference(currentEntity,paramsList,currentValueDetail){

				let result={};
				result.invalidParam = false;
				result.error ='';
				let reg = getParameterCode();
				currentValueDetail = currentValueDetail.toUpperCase();
				let referenceCodes = currentValueDetail.match(reg);
				currentEntity.isCalculateByParamReference = false;

				let matchCode =[];
				currentEntity.CalculateDefaultValue = false;
				if(referenceCodes && referenceCodes.length) {
					let orgReferenceCodes = angular.copy(referenceCodes);
					referenceCodes = _.uniq(referenceCodes);
					if(referenceCodes.includes(currentEntity.Code.toUpperCase())){  // use self code as the valuedetail
						result.invalidParam  = true;
						result.error =$translate.instant('estimate.rule.selfReferenceErrorMessage');
					}else {
						_.forEach(paramsList, function (item) {
							if (referenceCodes && referenceCodes.includes(item.Code.toUpperCase()) && matchCode.indexOf(item.Code) < 0) {
								matchCode.push(item.Code);
							}
						});
						_.forEach(referenceCodes, function (item){
							if(isMathKey(item) &&  matchCode.indexOf(item.Code) < 0){
								matchCode.push(item);
							}
						});
						let errorText = '';
						if(matchCode.length < referenceCodes.length){ // the code is not exist
							result.invalidParam  = true;
							_.forEach(referenceCodes,function(refereCode){
								let matchParam = _.filter(paramsList,{Code:refereCode});
								if((!matchParam || !matchParam.length)&& !isMathKey(refereCode)){
									errorText = (errorText !== '' ? errorText + '-' : '') + refereCode;
								}
							});

							result.error =$translate.instant('estimate.rule.invalidParam',{object:errorText});
						}else{  // circulate reference

							let referenceDic ={};
							_.forEach(paramsList, function (item){
								item.level = angular.isDefined(item.level) ? item.level : 1;
								item.CodeLengthOrder = 50 - item.Code.length;
							});
							paramsList = _.orderBy(paramsList, ['level', 'CodeLengthOrder']);
							_.forEach(paramsList,function(item){
								if(item.Id !== currentEntity.Id  && referenceCodes.indexOf(item.Code)>-1) {

									// because ParameterValue'value come from valueDetails,so here take the ParameterValue
									let parameterValue;
									let parameterValueForCalute =  0;
									if(item.ValueType === $injector.get('estimateRuleParameterConstant').Decimal2){
										if(item.ParameterValue !== undefined && item.ParameterValue !== null) {
											parameterValueForCalute = parameterValue = item.ParameterValue;
										}else if(item.ValueDetail) {
											parameterValueForCalute = parameterValue = item.ValueDetail;
										}else {
											parameterValueForCalute = parameterValue = 0;
										}
									}else{
										// if type isnot double ,take  ParameterText
										parameterValue = item.ParameterText ? item.ParameterText  : item.ValueText;
										parameterValueForCalute = parameterValue;
									}

									if (parameterValue !== null) {
										if (currentEntity.ValueType === $injector.get('estimateRuleParameterConstant').Decimal2) {

											let isNumber = true;
											let vaResult = null;
											try {
												vaResult = eval(parameterValueForCalute);
												if (vaResult === 'Infinity' || vaResult === 'NaN' || vaResult === undefined || vaResult === null) {
													isNumber = false;
												}
											} catch (err) {
												isNumber = false;
											}

											if (!isNumber) {
												result.invalidParam = true;
												result.error = $translate.instant('estimate.rule.invalidParam2', {object: currentValueDetail});
											} else {
												_.forEach(orgReferenceCodes, function (rcode) {
													if(rcode === item.Code){
														currentValueDetail = currentValueDetail.replace(rcode, '('+parameterValueForCalute+')');
													}
												});
											}

											try {
												vaResult = eval(currentValueDetail);
												if ( vaResult === 'Infinity' || vaResult === 'NaN' || vaResult === undefined || vaResult === null) {
													currentEntity.ParameterValue = 0;
												} else {
													currentEntity.ParameterValue = vaResult;
													currentEntity.isCalculateByParamReference = true;
													currentEntity.CalculateDefaultValue = vaResult;  // for master rule paramter
												}
											} catch (err) {
												currentEntity.ParameterValue = 0;
											}

										} else {
											referenceDic[item.Code] = parameterValue;
										}
									}
								}
							});

							let cycleReferences =checkCycleReference(referenceDic,referenceCodes,currentEntity.Code.toUpperCase());
							if(cycleReferences.length > 0) {
								result.invalidParam  = true;
								_.forEach(cycleReferences, function(item){
									errorText = (errorText !== '' ? errorText + '-' : '') + item + '-';
								});
								result.error =$translate.instant('estimate.rule.cycleReferenceErrorMessage',{object:errorText});
							}
						}
					}
				}

				function checkCycleReference(referenceDic, codeToCheck, selfCode) {
					let cycleReferences = [];
					_.forEach(codeToCheck, function (item) {
						let itemTemp = item.toString();
						// eslint-disable-next-line no-prototype-builtins
						if (referenceDic.hasOwnProperty(itemTemp)) {
							if (referenceDic[itemTemp].indexOf(selfCode) !== -1) {
								cycleReferences.push(itemTemp);
							}
						}
					});

					return cycleReferences;
				}

				return result;
			};

			return service;
		}]);
})(angular);
