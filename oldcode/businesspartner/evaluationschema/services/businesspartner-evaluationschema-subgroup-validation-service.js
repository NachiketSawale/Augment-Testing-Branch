(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationschemaSubgroupValidationService',
		['$timeout', 'platformPropertyChangedUtil', 'platformDataValidationService', 'platformRuntimeDataService','$translate', 'businesspartnerEvaluationschemaHeaderService',
			function ($timeout, platformPropertyChangedUtil, platformDataValidationService, platformRuntimeDataService, $translate, schemaService) {

				return function (dataService) {

					let exclusion = platformPropertyChangedUtil.exclusion(['IsOptional', 'IsMultiSelect']);

					// noinspection JSUnusedGlobalSymbols
					return {
						validateModel: function () {
							return true;
						},
						validateIsDefault: function (entity, value, model) {
							platformPropertyChangedUtil.onlyOneIsTrue(dataService, entity, value, model);
							return { apply: value, valid: true };
						},
						validateWeighting: function (entity, value, model) {
							let result = platformDataValidationService.isAmong(entity, value, model, 0, 100);
							return platformDataValidationService.finishValidation(result, entity, value, model, this, dataService);

							/* if (result === true) {
								var subgroupList = dataService.getList(),
									totalWeighting = 0,
									isCreateEntity = true;
								subgroupList.forEach(function (item) {
									if (item.Id !== entity.Id) {
										totalWeighting += item.Weighting;
									}
									else {
										isCreateEntity = false;
										totalWeighting += value;
									}
								});

								if (isCreateEntity) {
									totalWeighting += value;
								}

								if (totalWeighting !== 100) {
									return platformDataValidationService.createErrorObject('cloud.common.totalValueErrorMessage', { object: model.toLowerCase(), criterion: 100 }, true);
								} else {
									subgroupList.forEach(function (item) {
										if (platformRuntimeDataService.hasError(item, model)) {
											platformRuntimeDataService.applyValidationResult(true, item, model);
											dataService.markItemAsModified(item);
										}
									});
								}
							}
							$timeout(dataService.gridRefresh, 500, true);
							return result; */
						},
						validateIsOptional: function (entity, value, model) {
							exclusion(dataService, entity, value, model);
							return true;
						},
						validateIsMultiSelect: function (entity, value, model) {
							exclusion(dataService, entity, value, model);
							let temp = entity[model];
							entity[model] = value;
							dataService.multiSelectValueChangeEvent.fire();
							entity[model] = temp;
							return true;
						},
						validatePointsPossible: function (entity, value, model) { // jshint ignore:line
							let result = {apply: true, valid: true};
							if (value < entity.PointsMinimum) {
								result.valid = false;
								result.error = $translate.instant('cloud.common.ValidationRule_CompareGreaterThanOrEqual',{ p0: model, p1: 'PointsMinimum' });
							}
							entity[model] = value;
							dataService.multiSelectValueChangeEvent.fire();

							platformRuntimeDataService.applyValidationResult(result, entity, model);
							platformDataValidationService.finishValidation(result, entity, value, model, this, dataService);
							return result;
						},
						validatePointsMinimum: function (entity, value, model) { // jshint ignore:line
							let result = {apply: true, valid: true};
							if (value > entity.PointsPossible) {
								result.valid = false;
								result.error = $translate.instant('cloud.common.ValidationRule_CompareLessThanOrEqual', { p0: model, p1: 'PointsPossible' } );
							}
							entity[model] = value;
							dataService.multiSelectValueChangeEvent.fire();

							platformRuntimeDataService.applyValidationResult(result, entity, model);
							platformDataValidationService.finishValidation(result, entity, value, model, this, dataService);
							return result;
						},
						validateFormula: function (entity, value, model) { // jshint ignore:line
							let result = {apply: true, valid: true};
							if (value) {
								let formulaStr = value.trim();
								if (!_.startsWith(formulaStr.toUpperCase(), 'SELECT')) {
									let regCheckChar = /[a-zA-Z]+/;
									if (regCheckChar.test(formulaStr)) {
										result.valid = false;
										result.error = $translate.instant('businesspartner.evaluationschema.formulaValidate',
											{ p0: entity.GroupOrder, p1: value} );
									} else {
										let regStr = /#(\d+\.?)+\d*/g;
										let strArray = formulaStr.match(regStr);
										let arrString = '';
										let groupOrder = strToSplit(entity.GroupOrder);
										_.forEach(strArray, function (arr) {
											let tempArr = strToSplit(arr);
											if (tempArr.first > groupOrder.first || (tempArr.first === groupOrder.first && tempArr.second >= groupOrder.second)) {
												arrString += arr +',';
											}
										});
										if (arrString) {
											result.valid = false;
											result.error = $translate.instant('businesspartner.evaluationschema.formulaGroupOrder',
												{ p0: arrString, p1: entity.GroupOrder, p2: value});
										}
									}
								}
							}
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							platformDataValidationService.finishValidation(result, entity, value, model, this, dataService);
							return result;
						},
						validateFormFieldFk: function (entity, value, model){
							if (!schemaService.oldFormFieldId){
								schemaService.oldFormFieldId = entity.FormFieldFk;
							}
							return {apply: true, valid: true};
						}
					};

					function strToSplit(sourceStr) {
						let sourceList = _.split(sourceStr, '.');
						if (sourceList.length > 1) {
							return {
								first: sourceList[0],
								second: parseFloat(sourceList[1])
							};
						}
						return {
							first: sourceList[0],
							second: -1
						};
					}
				};
			}
		]);
})(angular);
