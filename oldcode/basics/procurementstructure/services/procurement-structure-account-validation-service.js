(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementStructureAccountValidationService',
		['$q', 'validationService', 'basicsProcurementStructureAccountService', 'platformDataValidationService', '$translate',
			'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService',
			function ($q, validationService, dataService, platformDataValidationService, $translate, platformRuntimeDataService, basicsLookupdataLookupDescriptorService) {
				var service = validationService.create('basicsProcurementStructureAccount', 'basics/procurementstructure/account/schema');
				var error = $translate.instant('basics.procurementstructure.threeFiledUniqueValueErrorMessage',
					{field1: 'account type', field2: 'tax code', field3: 'controlling cat'});
				var result;
				// ADD field 'Account' Check   2017-7-20
				service.asyncValidateAccount = function (entity, value, model, apply) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					var defer = $q.defer();
					var result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
					if (apply) {
						result.apply = true;
					}

					if (value) {
						var basAccounts = basicsLookupdataLookupDescriptorService.getData('BasAccount');
						var selectedAccounts = _.filter(basAccounts, function (ac) {
							return ac.Code === value;
						});
						if (selectedAccounts.length === 0) {
							getBasAccount(value).then(res => {
								selectedAccounts = res;
								setAccountInfoForEntity(selectedAccounts, entity, defer, 'BasAccountFk', 'BasAccountDescription');
							})
						} else {
							setAccountInfoForEntity(selectedAccounts, entity, defer, 'BasAccountFk', 'BasAccountDescription');
						}
					} else {
						entity.BasAccountFk = null;
						defer.resolve(result);
					}
					asyncMarker.myPromise = defer.promise.then(function (validateResult) {
						platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
						return validateResult;
					});
					return asyncMarker.myPromise;
				};

				// ADD field 'OffsetAccount' Check   2017-7-20
				service.asyncValidateOffsetAccount = function (entity, value, model, apply) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					var defer = $q.defer();
					result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);
					if (apply) {
						result.apply = true;
					}

					if (value) {
						var basAccounts = basicsLookupdataLookupDescriptorService.getData('BasAccount');
						var selectedAccounts = _.filter(basAccounts, function (ac) {
							return ac.Code === value;
						});
						if (selectedAccounts.length === 0) {
							getBasAccount(value).then(res => {
								selectedAccounts = res;
								setAccountInfoForEntity(selectedAccounts, entity, defer, 'BasAccountOffsetFk', 'BasAccountOffsetDescription');
							})
						} else {
							setAccountInfoForEntity(selectedAccounts, entity, defer, 'BasAccountOffsetFk', 'BasAccountOffsetDescription');
						}
					} else {
						entity.BasAccountOffsetFk = null;
						defer.resolve(result);
					}
					asyncMarker.myPromise = defer.promise.then(function (validateResult) {
						platformDataValidationService.finishAsyncValidation(validateResult, entity, value, model, asyncMarker, service, dataService);
						return validateResult;
					});
					return asyncMarker.myPromise;
				};

				service.validatePrcAccountTypeFk = function (entity, value, model) {
					result = platformDataValidationService.isGroupUnique(dataService.getList(),
						{
							PrcAccountTypeFk: value,
							TaxCodeFk: entity.TaxCodeFk,
							BasControllingCatFk: entity.BasControllingCatFk
						}, entity.Id, error);
					if (result.valid) {
						service.removeError(entity, ['PrcAccountTypeFk', 'TaxCodeFk', 'BasControllingCatFk']);
						// remove TaxCodeFk error list in finishValidation
						platformDataValidationService.finishValidation(result, entity, entity.TaxCodeFk, 'TaxCodeFk', service, dataService);
						platformDataValidationService.finishValidation(result, entity, entity.BasControllingCatFk, 'BasControllingCatFk', service, dataService);
					} else if (result !== true) {
						result.error = error;
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				service.validateTaxCodeFk = function (entity, value) {
					result = platformDataValidationService.isGroupUnique(dataService.getList(),
						{
							PrcAccountTypeFk: entity.PrcAccountTypeFk,
							TaxCodeFk: value,
							BasControllingCatFk: entity.BasControllingCatFk
						}, entity.Id, error);

					if (result.valid) {
						service.removeError(entity, ['PrcAccountTypeFk', 'TaxCodeFk', 'BasControllingCatFk']);
						// remove PrcAccountType error list in finishValidation
						platformDataValidationService.finishValidation(result, entity, entity.PrcAccountTypeFk, 'PrcAccountTypeFk', service, dataService);
						platformDataValidationService.finishValidation(result, entity, entity.BasControllingCatFk, 'BasControllingCatFk', service, dataService);
					} else if (result !== true) {
						result.error = error;
					}

					platformDataValidationService.finishValidation(result, entity, value, 'TaxCodeFk', service, dataService);
					return result;
				};

				service.validateBasControllingCatFk = function (entity, value) {
					result = platformDataValidationService.isGroupUnique(dataService.getList(),
						{
							PrcAccountTypeFk: entity.PrcAccountTypeFk,
							TaxCodeFk: entity.TaxCodeFk,
							BasControllingCatFk: value
						}, entity.Id, error);

					if (result.valid) {
						service.removeError(entity, ['PrcAccountTypeFk', 'TaxCodeFk', 'BasControllingCatFk']);
						platformDataValidationService.finishValidation(result, entity, entity.PrcAccountTypeFk, 'PrcAccountTypeFk', service, dataService);
					} else if (result !== true) {
						result.error = error;
					}

					platformDataValidationService.finishValidation(result, entity, value, 'BasControllingCatFk', service, dataService);
					return result;
				};

				service.removeError = function (entity, fieldsArry) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						if (!fieldsArry || !fieldsArry.length) {
							entity.__rt$data.errors = null;
						} else {
							fieldsArry.forEach(function (field) {
								entity.__rt$data.errors[field] = null;
							});
						}
					}
				};

				function onEntityCreated(e, item) {
					var result = service.validateTaxCodeFk(item, item.TaxCodeFk);
					platformRuntimeDataService.applyValidationResult(result, item, 'TaxCodeFk');
				}

				function getBasAccount(value) {
					return basicsLookupdataLookupDescriptorService.loadData('BasAccount').then(function () {
						let basAccounts = basicsLookupdataLookupDescriptorService.getData('BasAccount');
						return _.filter(basAccounts, function (ac) {
							return ac.Code === value;
						});
					});
				}

				function setAccountInfoForEntity(selectedAccounts, entity, defer, fieldFkName, fieldDesName) {
					const selAccount = _.find(selectedAccounts, {Id: entity[fieldFkName]}) || selectedAccounts[0];

					if (selAccount && selAccount.Id) {
						entity[fieldFkName] = selAccount.Id;
						entity[fieldDesName] = selAccount.DescriptionInfo.Translated;
					} else {
						entity[fieldFkName] = null;
						entity[fieldDesName] = '';
					}

					dataService.fireItemModified(entity);
					defer.resolve(true);
				}

				dataService.registerEntityCreated(onEntityCreated);

				/*service.validateEntity = function (entity) {
				 this.validatePrcAccountType(entity, entity.PrcAccounttypeFk);
				 this.validateTaxCode(entity, entity.MdcTaxCodeFk);
				 this.validateIsNullOrEmpty(entity, entity.Account);
				 this.validateIsNullOrEmpty(entity, entity.Offsetaccount);
				 };

				 function onEntityCreated(e, item) {
				 service.validateEntity(item);
				 }

				 dataService.registerEntityCreated(onEntityCreated);*/

				return service;
			}]);
})(angular);