(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/* jshint -W072 */
	angular.module('procurement.invoice').factory('procurementInvoiceGeneralsValidationService',
		['platformDataValidationService', 'basicsLookupdataLookupDataService', 'procurementInvoiceHeaderDataService',
			'basicsLookupdataLookupDescriptorService', 'procurementInvoiceGeneralDataService', 'procurementInvoiceGeneralReadOnlyProcessor', 'platformRuntimeDataService', '$translate', '$q', '$http',
			function (platformDataValidationService, lookupService, parentService,
				lookupDescriptorService, dataService, readOnlyProcessor, runtimeDataService, $translate, $q, $http) {

				var service = {};

				// validators
				service.validatePrcGeneralstypeFk = function validatePrcGeneralstypeFk(entity, value, model, fromMandatoryValidation) {
					var isValid = platformDataValidationService.isUnique(dataService.getList(), 'PrcGeneralstypeFk', value, entity.Id);
					if (isValid.valid) {
						var data = _.find(lookupDescriptorService.getData('PrcGeneralsType'), {Id: value});
						var originControllingUnitFk = entity.ControllingUnitFk;
						var originTaxCodeFk = entity.TaxCodeFk;
						if (angular.isObject(data)) {
							// entity.PrcGeneralValueType = data.IsPercent ? percentMsg : amountMsg;
							// This field is null and read only (disabled) if PRC_GENERALSTYPE_FK.ISCOST = FALSE.
							entity.ValueType = data.IsPercent ? 1 : 0;

							if (!dataService.isFromContract) {
								if (data.IsCost) {
									entity.IsCost = true;
								} else {
									entity.ControllingUnitFk = null;
									entity.TaxCodeFk = null;
									entity.IsCost = false;
								}
							}
						}

						entity.PrcGeneralstypeFk = value;
						if (!fromMandatoryValidation) {
							if (entity.ControllingUnitFk && originControllingUnitFk !== entity.ControllingUnitFk) {
								dataService.fireControllingUnitOrTaxCodeChange({entity: entity, model: 'ControllingUnitFk', value: entity.ControllingUnitFk});
							}
							if (entity.TaxCodeFk && originTaxCodeFk !== entity.TaxCodeFk) {
								dataService.fireControllingUnitOrTaxCodeChange({entity: entity, model: 'TaxCodeFk', value: entity.TaxCodeFk});
							}
						}
						readOnlyProcessor.processItem(entity);
						dataService.fireGeneralCreated(entity);
						dataService.fireItemModified(entity);
					} else {
						// TODO, platformDataValidationService.isUnique have some issue
						isValid.error$tr$param$ = {object: 'generals type'};
					}
					platformDataValidationService.finishValidation(isValid, entity, value, model, service, dataService);
					return isValid;
				};

				service.asyncValidateControllingUnitFk = function (entity, value, model) {

					var defer = $q.defer();
					var result = {
						apply: true,
						valid: true
					};
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					asyncMarker.myPromise = defer.promise;

					if (null === value) {
						defer.resolve(true);
					} else {
						var ProjectFk = entity.ProjectFk;
						$http.get(globals.webApiBaseUrl + 'controlling/structure/validationControllingUnit?ControllingUnitFk=' + value + '&ProjectFk=' + ProjectFk).then(function (response) {
							if (response.data) {
								result = {
									apply: true,
									valid: false,
									error: $translate.instant('basics.common.error.controllingUnitError')
								};
								runtimeDataService.applyValidationResult(result, entity, model);
								defer.resolve(result);
							} else {
								defer.resolve(true);
							}
						});
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						dataService.fireControllingUnitOrTaxCodeChange({entity: entity, model: model, value: value});
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				};

				service.validateValue = function validateValue(entity, value) {
					entity.Value = value;
					dataService.fireGeneralCreated(entity);
					dataService.fireItemModified(entity);
				};

				service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model) {
					dataService.fireControllingUnitOrTaxCodeChange({entity: entity, model: model, value: value});
					return true;
				};

				return service;
			}
		]);
})(angular);