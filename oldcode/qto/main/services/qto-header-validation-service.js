(function (angular) {
	'use strict';

	angular.module('qto.main').factory('qtoMainHeaderValidationService',
		['_','$q','$http', 'validationService', '$injector', 'platformRuntimeDataService', 'platformRuntimeDataService', '$translate', 'platformDataValidationService', 'qtoMainHeaderDataService','basicsLookupdataLookupDescriptorService',
			function (_,$q,$http, validationService, $injector, runtimeDataService, platformRuntimeDataService, $translate, platformDataValidationService, dataService,basicsLookupdataLookupDescriptorService) {
				let service = validationService.create('qtoMainHeader', 'qto/main/header/schema');
				service.handleError = function (entity, result) {
					if (!result.valid) {
						platformRuntimeDataService.applyValidationResult(result, entity, 'PerformedFrom');
						platformRuntimeDataService.applyValidationResult(result, entity, 'PerformedTo');
					} else {
						service.removeError(entity);
					}
				};
				service.validateDate = function (entity, fromDate, toDate) {
					let result = true;
					if (fromDate !== null && toDate !== null) {
						if (fromDate > toDate) {
							result = {
								apply: false, valid: false,
								error: $translate.instant('qto.main.dateError')
							};
						}
					}
					service.handleError(entity, result);
					return result;
				};

				service.validatePerformedFrom = function (entity, newValue) {
					return service.validateDate(entity, newValue, entity.PerformedTo);
				};

				service.validatePerformedTo = function (entity, newValue) {
					return service.validateDate(entity, entity.PerformedFrom, newValue);
				};

				service.validateBasRubricCategoryFk = function (entity, newValue) {
					dataService.getCode(newValue,entity).then(function (code) {
						service.validateCode(entity, code, 'Code');
						entity.Code = code;
						dataService.onQtoHeaderRubricCatagoryChanged.fire(entity);
						dataService.gridRefresh();
						return {
							apply: true, valid: true
						};
					});
				};

				service.validateProjectFk = function (entity, value, model) {
					entity.ProjectFk = value;
					dataService.updateReadOnly(entity, 'PackageFk', value);

					entity.PackageFk = null;
					entity.Package2HeaderFK = null;
					entity.PrcBoqFk = null;
					dataService.updateReadOnly(entity, 'Package2HeaderFK', value);
					dataService.updateReadOnly(entity, 'PrcBoqFk', value);

					dataService.updateReadOnly(entity, 'OrdHeaderFk', value);
					dataService.updateReadOnly(entity, 'ConHeaderFk', value);
					return platformDataValidationService.isMandatory(value, model);
				};

				service.validatePackageFk = function (entity, value, model) {
					entity.PackageFk = value;
					entity.Package2HeaderFK = null;
					entity.PrcBoqFk = null;
					if(entity.ConHeaderFk){
						dataService.updateReadOnly(entity, 'PackageFk', value);
					}
					dataService.updateReadOnly(entity, 'Package2HeaderFK', value);
					dataService.updateReadOnly(entity, 'PrcBoqFk', value);

					// TODO:reValidate the other property(use another way to do it)
					let result = platformDataValidationService.isMandatory(value, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return result;
				};

				// sub package
				service.validatePackage2HeaderFK = function (entity, value,model) {
					entity.Package2HeaderFK = value;
					entity.PrcBoqFk = null;

					// TODO:reValidate the other property(use another way to do it)
					if(!entity.ConHeaderFk) {
						dataService.getBoqHeaderId(value).then(function (response) {
							if (response.length > 0) {
								entity.BoqHeaderFk = response[0].BoqHeaderFk;
								dataService.updateReadOnly(entity, 'PrcBoqFk', value);
								if(entity.BoqHeaderFk && entity.BoqHeaderFk > 0) {
									// If there is only one BOQ, automatically assigned
									dataService.getBoqReferenceNo().then(function (data) {
										if (data && data.length === 1) {
											entity.PrcBoqFk = data[0].Id;
											var result = service.validatePrcBoqFk(entity, entity.PrcBoqFk, 'PrcBoqFk');
											platformDataValidationService.finishValidation(result, entity, entity.PrcBoqFk, 'PrcBoqFk', service, dataService);
											platformRuntimeDataService.applyValidationResult(result, entity, 'PrcBoqFk');
										}
									});
								}

							} else {
								runtimeDataService.readonly(entity, [
									{field: 'PrcBoqFk', readonly: true}
								]);
							}
						});
					}
					let res = platformDataValidationService.isMandatory(value, model);
					runtimeDataService.applyValidationResult(res, entity, model);
				};


				// procurement contract
				service.validateConHeaderFk = function (entity, value) {
					entity.Package2HeaderFK = null;
					entity.PrcBoqFk = null;

					let procumentContracts =basicsLookupdataLookupDescriptorService.getData('ConHeaderView');
					let prcContract = _.filter(procumentContracts, function (item) {
						if(item.Id ===value){
							return item;
						}
					});

					if(prcContract && prcContract.length> 0) {
						entity.PackageFk = prcContract[0].PackageFk;
						dataService.updateReadOnly(entity, 'PackageFk', value);
						dataService.updateReadOnly(entity, 'Package2HeaderFK', '');
					}
					return true;
				};
				service.validatePrcBoqFk = function (entity, value, model) {
					return platformDataValidationService.isMandatory(value, model);
				};

				service.validatePrjBoqFk = function (entity, value, model) {
					let result = platformDataValidationService.isMandatory(value, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return result;
				};

				service.validateOrdHeaderFk = function (entity, value, model) {
					let result = platformDataValidationService.isMandatory(value, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return result;
				};

				service.validateClerkFk = function (entity, value, model) {
					let result = platformDataValidationService.isMandatory(value, model);
					runtimeDataService.applyValidationResult(result, entity, model);
				};

				service.validateCode = function (entity, value, model) {
					let result = platformDataValidationService.isMandatory(value, model);
					if (result.valid) {
						result = platformDataValidationService.isUnique(dataService.getList(), model, value, entity.Id, false);
					}

					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					return result;
				};

				return service;
			}
		]);
})(angular);