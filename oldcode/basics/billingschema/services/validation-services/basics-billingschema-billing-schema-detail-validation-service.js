/**
 * Created by chm on 6/4/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.billingschema';
	/**
	 * @ngdoc service
	 * @name basicsBillingSchemaValidationService
	 * @description provides validation methods for billing schema instances
	 */
	angular.module(moduleName)
		.factory('basicsBillingSchemaBillingSchemaDetailValidationService', [
			'$http', 'platformDataValidationService', 'platformRuntimeDataService', '$translate', 'basicsBillingSchemaBillingLineType', 'basicsBillingSchemaRubricCategoryService',
			function ($http, platformDataValidationService, platformRuntimeDataService, $translate, basicsBillingSchemaBillingLineType, basicsBillingSchemaRubricCategoryService) {
				//todo-chm: not completed!!!
				return function (dataService) {
					var service = {};

					const advances = basicsBillingSchemaBillingLineType.advances;

					angular.extend(service, {
						validateBillingSchemaDetailFk: validateBillingSchemaDetailFk,
						validateBillingLineTypeFk: validateBillingLineTypeFk,
						validateFactor: validateFactor
					});
					service.validateSorting = function (entity, value, model) {
						var modelTranslation = $translate.instant('cloud.common.entitySorting');
						if (angular.isUndefined(value) || value === null || value <= 0 || value === '') {
							var result = {apply: true, valid: true};
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: modelTranslation});
							return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						} else if (value !== 0) {
							var dataList = dataService.getList();
							return platformDataValidationService.validateMandatoryUniqErrorEntity(entity, value, model, dataList, service, dataService, modelTranslation);
						} else {
							return platformDataValidationService.finishValidation(true, entity, value, model, service, dataService);
						}
					};

					function validateBillingSchemaDetailFk(entity, value, model) { // jshint ignore:line
						var billingLineTypeList = [8, 11, 13, 14, 23, 28]; //8-Discount / Uplift (Percent)  or 11-VAT (calculated) or 12-Early Payment Discount
						var billingSchemaDetailFkResult = platformDataValidationService.createSuccessObject();

						if (billingLineTypeList.indexOf(entity.BillingLineTypeFk) > -1 && platformDataValidationService.isEmptyProp(value)) {
							entity[model] = value;
							var fieldName = $translate.instant('basics.billingschema.entityBillingSchemaDetailFk');
							billingSchemaDetailFkResult = platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: fieldName});
						}
						platformRuntimeDataService.applyValidationResult(billingSchemaDetailFkResult, entity, model);
						platformDataValidationService.finishValidation(billingSchemaDetailFkResult, entity, value, model, service, dataService);
						return billingSchemaDetailFkResult;
					}

					// determine the reference column if it is editable according to related lineType or not
					function changeRefColEditableState(entity, value, field) {
						var editableLineTypes = [8, 10, 11, 12, 13, 14, 19, 23, 28]; // lineType that need reference
						if (editableLineTypes.indexOf(value) > -1) {
							platformRuntimeDataService.readonly(entity, [{field: field, readonly: false}]);
						}

						var readonlyLineTypes = [1, 2, 3, 4, 5, 6, 17, 7, 9, 15, 18, 24, 25, 26, 27, 29]; // no need for reference
						if (readonlyLineTypes.indexOf(value) > -1) {
							entity[field] = null;
							platformRuntimeDataService.readonly(entity, [{field: field, readonly: true}]);
						}

						dataService.gridRefresh();
					}

					function changeFormulaColEditableState(entity, value) {
						if (value === basicsBillingSchemaBillingLineType.formula) {
							platformRuntimeDataService.readonly(entity, [{field: 'Formula', readonly: false}]);

							if (entity.Value === 0) {
								entity.Value = 1;
							}
						} else {
							platformRuntimeDataService.readonly(entity, [{field: 'Formula', readonly: true}]);
						}
					}

					function changeSqlStatementColEditableState(entity, value) {
						if (value === basicsBillingSchemaBillingLineType.configurableLine) {
							platformRuntimeDataService.readonly(entity, [{field: 'SqlStatement', readonly: false}]);

							if (entity.Value === 0) {
								entity.Value = 1;
							}
						} else {
							platformRuntimeDataService.readonly(entity, [{field: 'SqlStatement', readonly: true}]);
						}
					}

					function changeResetFIColEditableState(entity, value) {
						var isResetFIList = [14];
						if (isResetFIList.indexOf(value) > -1) {
							platformRuntimeDataService.readonly(entity, [{field: 'IsResetFI', readonly: false}]);
						} else {

							if (entity.IsResetFI) {
								entity.IsResetFI = false;
							}
							platformRuntimeDataService.readonly(entity, [{field: 'IsResetFI', readonly: true}]);
						}
					}

					function changeNetAdjustedColEditableState(entity) {

						var selectedRubricCategoryItem = basicsBillingSchemaRubricCategoryService.getSelected();
						var value = selectedRubricCategoryItem.RubricId;

						var isNetAdjust = [4, 5, 7, 17];
						if (isNetAdjust.indexOf(value) > -1) {
							platformRuntimeDataService.readonly(entity, [{field: 'IsNetAdjusted', readonly: false}]);
						} else {

							if (entity.IsNetAdjusted) {
								entity.IsNetAdjusted = false;
							}
							platformRuntimeDataService.readonly(entity, [{field: 'IsNetAdjusted', readonly: true}]);
						}
					}

					function validateFactor(entity, value, model) {
						var result = {apply: true, valid: true};
						if (entity.BillingLineTypeFk === advances) {
							if (value !== 1 && value !== -1) {
								result.valid = false;
								result.error = $translate.instant('basics.billingschema.factorError', {fieldName: 'Factor'});
							} else {
								const minFactorEntity = dataService.getLine28EntityByMinId();
								if (minFactorEntity.Id === entity.Id){
									_.forEach(dataService.getList(), function (item) {
										if (item.Id !== entity.Id && item.BillingLineTypeFk === entity.BillingLineTypeFk && item.Factor !== value) {
											item.Factor = value;
											dataService.markItemAsModified(item);
										}
									});
									dataService.gridRefresh();
								}
							}
						}
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					}

					function validateBillingLineTypeFk(entity, value, model, isProcessor) { // jshint ignore:line
						var billingLineTypeList = [1, 2, 3, 4, 5, 6, 17];
						var previousPeriodsOrCumulative = [13, 14];
						platformRuntimeDataService.readonly(entity, [{field: 'Factor', readonly: true}]);

						if (billingLineTypeList.indexOf(value) > -1) {
							entity.Value = 0;
							platformRuntimeDataService.readonly(entity, [{field: 'Value', readonly: true}]);

							dataService.gridRefresh();
						} else if (entity.__rt$data && Array.isArray(entity.__rt$data.readonly)) {
							// var hasValue = entity.__rt$data.readonly.some(function (item) {
							// return item.field === 'Value';
							// });

							var readonlyIndex = -1;
							entity.__rt$data.readonly.forEach(function (item, index) {
								if (item.field === 'Value') {
									readonlyIndex = index;
								}
							});
							if (readonlyIndex > -1) {
								entity.__rt$data.readonly.splice(readonlyIndex, 1);

								dataService.gridRefresh();
							}
						}

						if (value === advances) {
							const minFactorEntity = dataService.getLine28EntityByMinId();
							if (minFactorEntity) {
								if (minFactorEntity.Id >= entity.Id) {
									platformRuntimeDataService.readonly(entity, [{field: 'Factor', readonly: false}]);
								} else {
									entity.Factor = minFactorEntity.Factor;
								}
							} else {
								platformRuntimeDataService.readonly(entity, [{field: 'Factor', readonly: false}]);
							}
						} else {
							entity.Factor = 1;
						}

						if (previousPeriodsOrCumulative.indexOf(value) > -1 && isProcessor !== true) {//set default 1
							entity.Value = 1;
							dataService.gridRefresh();
						}

						// #93748 - "Awaiting Credit Note", set default value to 1
						if ((value === basicsBillingSchemaBillingLineType.rejectionsNet ||
								value === basicsBillingSchemaBillingLineType.rejectionsGross) &&
							isProcessor !== true) {
							entity.Value = 1;
						}

						changeFormulaColEditableState(entity, value);
						changeSqlStatementColEditableState(entity, value);
						changeResetFIColEditableState(entity, value);
						//changeNetAdjustedColEditableState(entity, value);
						changeRefColEditableState(entity, value, 'BillingSchemaDetailFk');


						entity.BillingLineTypeFk = value;

						//validate BillingSchemaDetailFk
						validateBillingSchemaDetailFk(entity, entity.BillingSchemaDetailFk, 'BillingSchemaDetailFk');
						validateFactor(entity, entity.Factor, 'Factor');

						return platformDataValidationService.createSuccessObject();
					}

					service.validateFormula = function (entity, value) {
						if (value && value.length) {
							var pattern = /L\d+/g;
							var matches = value.match(pattern);

							if (matches && matches.length) {
								var result = {valid: true};

								result.valid = !matches.some(function (match) {
									var sorting = match.substring(1);
									return sorting >= entity.Sorting;
								});

								if (!result.valid) {
									result.error = $translate.instant('basics.billingschema.formulaRefError');
								}

								return result;
							}
						}
					};

					return service;
				};
			}]);
})(angular);