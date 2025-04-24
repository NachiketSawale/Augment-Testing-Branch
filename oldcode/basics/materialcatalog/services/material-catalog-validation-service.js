/*
 * Created by lja on 09.09.2014
 */

(function (angualr) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	angualr.module('basics.materialcatalog').factory('basicsMaterialCatalogValidationService',
		['validationService', 'basicsMaterialCatalogService', 'platformDataValidationService',
			'basicsLookupdataLookupDataService', 'businessPartnerLogicalValidator', '$translate',
			'platformRuntimeDataService', 'bpIsMandatoryMaterialCatalogType', '$q',
			function (validationService, dataService, platformDataValidationService, basicsLookupdataLookupDataService,
				businessPartnerLogicalValidator, $translate, platformRuntimeDataService, bpIsMandatoryMaterialCatalogType, $q) {
				var service = validationService.create('basicsMaterialCatalog', 'basics/materialcatalog/catalog/schema');
				var businessPartnerValidatorService = businessPartnerLogicalValidator.getService(
					{
						dataService: dataService,
						BusinessPartnerFk: 'BusinessPartnerFk'
					}
				);

				service.asyncValidateCode = function (entity, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);

					asyncMarker.myPromise = platformDataValidationService.isSynAndAsyncUnique(dataService.getList(),
						globals.webApiBaseUrl + 'basics/materialcatalog/catalog/isunique', entity, value, model).then(function (result) {
						if (result === true) {
							service.removeColumnError(entity, model);
						}
						platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
						return result;
					});

					return asyncMarker.myPromise;
				};

				service.validateValidFrom = function (entity, value, model) {
					var result = {
						apply: true,
						valid: true
					};
					if (value !== null && entity.ValidTo) {
						if (value > entity.ValidTo) {
							result.apply = false;
							result.valid = false;
							result.error = $translate.instant('cloud.common.Error_EndDateTooEarlier');
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
							var resultOfValidTo = {
								apply: true,
								valid: false
							};
							platformDataValidationService.finishValidation(resultOfValidTo, entity, entity.ValidTo, 'ValidTo', service, dataService);
							return result;
						}
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(true, entity, 'ValidTo');
					platformDataValidationService.finishValidation(true, entity, entity.ValidFrom, 'ValidTo', service, dataService);
					return result;
				};

				service.validateValidTo = function (entity, value, model) {
					var result = {
						apply: true,
						valid: true
					};
					if (value !== null && entity.ValidFrom) {
						if (entity.ValidFrom > value) {
							result.apply = false;
							result.valid = false;
							result.error = $translate.instant('cloud.common.Error_EndDateTooEarlier');
							platformRuntimeDataService.applyValidationResult(result, entity, model);
							platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
							var resultOfValidFrom = {
								apply: true,
								valid: false
							};
							platformDataValidationService.finishValidation(resultOfValidFrom, entity, entity.ValidFrom, 'ValidFrom', service, dataService);
							return result;
						}
					}
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					platformRuntimeDataService.applyValidationResult(true, entity, 'ValidFrom');
					platformDataValidationService.finishValidation(true, entity, entity.ValidFrom, 'ValidFrom', service, dataService);
					return result;
				};

				service.asyncValidateMaterialCatalogTypeFk = function (entity, value, model) {
					var defer = $q.defer();
					bpIsMandatoryMaterialCatalogType.getItemById(value).then(function (data) {
						if (data.Isframework && !entity.BusinessPartnerFk) {
							entity[model] = value;
							service.asyncValidateBusinessPartnerFk(entity, entity.BusinessPartnerFk, 'BusinessPartnerFk').then(function (result) {
								platformRuntimeDataService.applyValidationResult(result, entity, 'BusinessPartnerFk');
							});
						} else {
							platformDataValidationService.finishValidation(true, entity, entity.BusinessPartnerFk, 'BusinessPartnerFk', service, dataService);
							service.removeColumnError(entity, 'BusinessPartnerFk');
						}
						defer.resolve(true);
					});
					return defer.promise;
				};

				service.asyncValidateBusinessPartnerFk = function (entity, value, model) {
					var defer = $q.defer();
					bpIsMandatoryMaterialCatalogType.getItemById(entity.MaterialCatalogTypeFk).then(function (data) {
						var result = true;
						if (data.Isframework && !value) {
							entity.SubsidiaryFk = null;
							entity.SupplierFk  = null;
							result = platformDataValidationService.isMandatory(value, model, {fieldName: 'business partner'});
						} else {
							service.removeColumnError(entity, model);
							businessPartnerValidatorService.businessPartnerValidator(entity, value);
						}
						platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
						defer.resolve(result);
					});
					return defer.promise;
				};

				service.validateSupplierFk = function (entity, value) {
					businessPartnerValidatorService.supplierValidator(entity, value);
					platformRuntimeDataService.applyValidationResult(true, entity, 'BusinessPartnerFk');
				};

				service.removeColumnError = function (entity, model) {
					if (entity.__rt$data && entity.__rt$data.errors) {
						// eslint-disable-next-line no-prototype-builtins
						if (entity.__rt$data.errors.hasOwnProperty(model)) {
							delete entity.__rt$data.errors[model];
						}
					}
				};

				return service;
			}
		]);
})(angular);