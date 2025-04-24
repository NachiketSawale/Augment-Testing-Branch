(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/**
	 * @ngdoc service
	 * @name businesspartner.main.businesspartnerMainCustomerValidationService
	 * @function
	 * @requireds $q, $translate, basicsLookupdataLookupDataService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService
	 *
	 * @description validate the data service
	 */
	angular.module('businesspartner.main').factory('businesspartnerMainCustomerValidationService', ['platformDataValidationService', '$q', '$translate',
		'basicsLookupdataLookupDataService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', '$http', 'globals', 'customerNumberGenerationSettingsService',
		/* jshint -W072 */
		function (platformDataValidationService, $q, $translate, basicsLookupdataLookupDataService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService,
			$http, globals, customerNumberGenerationSettingsService) {
			let serviceCache = {};
			return function (dataService) {
				let serviceName = null;
				if (dataService?.getServiceName) {
					serviceName = dataService.getServiceName();
					if (serviceName && Object.hasOwn(serviceCache,serviceName)) {
						return serviceCache[serviceName];
					}
				}

				let service = {};

				function requiredValidator(value, model) {
					let result = {apply: true, valid: true};
					if (angular.isUndefined(value) || value === null || value <= 0 || value === '') {
						result.valid = false;
						result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
					}
					return result;
				}

				function asyncValidateSubledgerContextAndCode(entity, value, model) {
					let code = value;
					let defer = $q.defer();
					let result = requiredValidator(value, model);
					if (!result.valid || value === $translate.instant('cloud.common.isGenerated')) {
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						defer.resolve(result);
						return defer.promise;
					}

					let rootUrl = globals.webApiBaseUrl;
					$http.get(rootUrl + 'businesspartner/main/customer/checkcustomercodelength?customerLedgerGroupFk=' + entity.CustomerLedgerGroupFk).then(function (response) {
						if (response.data) {

							let data = response.data;
							let errorMsg = '';
							let codeLength = code.length;
							if (data.isCurrentContext) {
								if (data.checkLength) {
									let maxLength = data.maxLength > 42 ? 42 : data.maxLength;
									if (codeLength < data.minLength || codeLength > maxLength) {
										errorMsg = $translate.instant('businesspartner.main.errorMessage.fieldLengthRestrict', {
											p0: model,
											p1: data.minLength,
											p2: maxLength
										});
										result.valid = false;
										result.error = errorMsg;
									}
								} else if (codeLength > 16) {
									errorMsg = $translate.instant('businesspartner.main.errorMessage.fieldLengthLessThenSpecificNumber', {p0: model, p1: 16});
									result.valid = false;
									result.error = errorMsg;
								}
								platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
								if (!result.valid) {
									defer.resolve(result);
								}
							}
						}
						if (result.valid) {
							basicsLookupdataLookupDataService.getSearchList('CustomerLedgerGroup', 'SubledgerContextFk=' + entity.SubledgerContextFk).then(function (response) {
								if (response) {
									let ledgerGrps = angular.isArray(response.items) ? response.items : [];
									let ledgerGrpIds = _.map(ledgerGrps, 'Id');
									dataService.getCustomerByCustomerLedgerGrps(ledgerGrpIds).then(function (response) {

										if (response.data) {
											let errorMsg = $translate.instant('businesspartner.main.errorMessage.codeUniqueInASublegerContext');
											let duplicateItem = _.find(response.data, function (item) {
												return item.Code === code && item.Id !== entity.Id;
											});

											if (duplicateItem) {
												result.valid = false;
												result.error = errorMsg;
											} else {
												let itemList = dataService.getList();
												duplicateItem = _.find(itemList, function (item) {
													return item.Code === code && item.Id !== entity.Id && item.SubledgerContextFk === entity.SubledgerContextFk;
												});
												if (duplicateItem) {
													result.valid = false;
													result.error = errorMsg;
												}
											}
										}
										platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
										defer.resolve(result);
									});
								}
							});
						}
					});

					return defer.promise;
				}

				service.validateCode = function (entity) {
					if (entity.Version === 0 && customerNumberGenerationSettingsService.hasToGenerateForRubricCategory(entity.RubricCategoryFk)) {
						entity.Code = $translate.instant('cloud.common.isGenerated');
						return true;
					}
					return {valid: true, apply: true};
				};

				service.asyncValidateCode = function asyncValidateCode(entity, value, model) {

					return asyncValidateSubledgerContextAndCode(entity, value, model);
				};

				service.validateBusinessUnitFk = function validateBusinessUnitFk(entity, value, model) {
					return requiredValidator(value, model);
				};

				service.validateBusinessPostingGroupFk = function validateBusinessPostingGroupFk(entity, value, model) {
					let result = requiredValidator(value, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};

				service.asyncValidateCustomerLedgerGroupFk = function validateSupplierLedgerGroupFk(entity, value, model) {
					let defer = $q.defer();
					let result = requiredValidator(value, model);

					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					defer.resolve(result);

					if (result.valid) { // entity.Code
						entity.CustomerLedgerGroupFk = value;
						let codeModel = 'Code';
						service.asyncValidateCode(entity, entity[codeModel], codeModel).then(function (res) {
							platformRuntimeDataService.applyValidationResult(res, entity, codeModel);
						});
					}

					return defer.promise;
				};

				service.validateFieldsOnCreate = function validateFieldsOnCreate(newEntity) {
					// validate code.
					service.asyncValidateCode(newEntity, newEntity.Code, 'Code').then(function (res) {
						platformRuntimeDataService.applyValidationResult(res, newEntity, 'Code');
					});
					// validate SupplierLedgerGroupFk.
					let customerLGFkField = 'CustomerLedgerGroupFk';
					let result = requiredValidator(newEntity[customerLGFkField], customerLGFkField);
					platformDataValidationService.finishValidation(result, newEntity, newEntity[customerLGFkField], customerLGFkField, service, dataService);
					platformRuntimeDataService.applyValidationResult(result, newEntity, customerLGFkField);
					// validate field 'BpdDunninggroupFk'.
					service.validateBpdDunninggroupFk(newEntity, newEntity.BpdDunninggroupFk, 'BpdDunninggroupFk');
				};

				service.validateBpdDunninggroupFk = function (entity, value, model) {
					let result = requiredValidator(value, model);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
				};
				service.validateRubricCategoryFk = function validateRubricCategoryFk(entity, value) {
					let validResultCode = {apply: true, valid: true};
					let validResultRubricCategoryFk= {apply: true, valid: true};
					let errorMsg = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'Code'});
					if (entity.Version === 0) {
						let codeReadOnly=false;
						if (!value) {
							entity.Code = null;
							validResultCode = {apply: true, valid: false,error: errorMsg};
						} else {
							let isGenerate=customerNumberGenerationSettingsService.hasToGenerateForRubricCategory(value);
							if (!isGenerate){
								entity.Code = null;
								validResultCode = {apply: true, valid: false,error: errorMsg};
							} else {
								entity.Code = $translate.instant('cloud.common.isGenerated');
								codeReadOnly = true;
							}
						}
						platformDataValidationService.finishValidation(validResultCode, entity, entity.Code, 'Code', service, dataService);
						platformRuntimeDataService.applyValidationResult(validResultCode, entity, 'Code');
						setCodeReadOnly(entity,codeReadOnly);
					}
					return validResultRubricCategoryFk;
				};
				function  setCodeReadOnly(entity,codeReadOnly) {
					let fields=[];
					let readOnlyField={field: 'Code', readonly: codeReadOnly};
					fields.push(readOnlyField);
					platformRuntimeDataService.readonly(entity, fields);
					dataService.gridRefresh();
				}
				return service;
			};
		}
	]);
})(angular);
