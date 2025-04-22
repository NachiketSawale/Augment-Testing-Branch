/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.contract';

	// TODO: improve name
	angular.module(moduleName).factory('salesContractValidationHelperService',
		['globals', '$http', 'platformDataValidationService',
			function (globals, $http, platformDataValidationService) {
				return {
					asyncValidateCode: function asyncValidateCode(companyId, code) {
						return $http.get(globals.webApiBaseUrl + 'sales/contract/isuniquecode?companyId=' + companyId + '&code=' + code).then(function (response) {
							return (response.data === true) ? true : platformDataValidationService.createErrorObject('sales.common.errorCodeMustBeUniqueInCompany');
						});
					}
				};
			}
		]);

	/**
	 * @ngdoc service
	 * @name salesContractValidationService
	 * @description provides validation methods for contract header entities
	 */
	angular.module(moduleName).factory('salesContractValidationService', ['_','$translate','globals', '$injector', '$http', '$q', 'platformDataValidationService', 'salesContractService', 'salesCommonValidationServiceProvider', 'salesContractBillingSchemaService',
		function (_,$translate,globals, $injector, $http, $q, platformDataValidationService, salesContractService, salesCommonValidationServiceProvider, salesContractBillingSchemaService) {
			var service = salesCommonValidationServiceProvider.getInstance(salesContractService);
			var updateExchangeRateUrl = globals.webApiBaseUrl + 'sales/contract/updateExchangeRate';
			var self = this;
			// added this  method because custom message is not available in platform at the moment
			this.validatePeriod = function (startDate, endDate, entity, model, validationService, dataService, relModel) {
				if (startDate && endDate) {
					if (Date.parse(endDate) < Date.parse(startDate)) {
						// TODO: refactor  a similar  method in sales-common later to add custom message
						var res = platformDataValidationService.createErrorObject('sales.contract.generatePaymentScheduleFromSchedule.error_HasError', {}, true);
						return platformDataValidationService.finishWithError(res, entity, endDate, model, validationService, dataService);
					} else {
						platformDataValidationService.ensureNoRelatedError(entity, model, [relModel], validationService, dataService);
					}
				} else {
					platformDataValidationService.ensureNoRelatedError(entity, model, [relModel], validationService, dataService);
				}
				return true;
			};

			// TODO:
			// - mandatory fields like code, project etc. (at least all in 'create a contract' dialog)

			service.asyncValidateCode = function (entity, modelValue, field) {
				var companyId = entity.CompanyFk || -1,
					code = modelValue,
					url = globals.webApiBaseUrl + 'sales/contract/isuniquecode?companyId=' + companyId + '&code=' + code + '&entityid=' + entity.Id;

				var finishAsyncValidationHelper = function (apply, valid) {
					return platformDataValidationService.finishAsyncValidation({
						apply: apply,
						valid: valid,
						error$tr$: 'sales.common.errorCodeMustBeUniqueInCompany'
					}, entity,
					modelValue, field, asyncMarker, self, salesContractService);
				};

				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, code, salesContractService);
				asyncMarker.myPromise = $http.get(url).then(function (result) {
					return finishAsyncValidationHelper(true, result.data);
				},
				function () {
					return finishAsyncValidationHelper(false, false);
				});

				return asyncMarker.myPromise;
			};

			service.asyncValidateRubricCategoryFk = function asyncValidateRubricCategoryFk(/* entity, value */) {
				// check if status is available
				var url = globals.webApiBaseUrl + 'sales/contract/status/IsStatusAvailable';

				var defer = $q.defer();
				$http.get(url).then(function (result) {
					defer.resolve(!result.data ? platformDataValidationService.createErrorObject('sales.contract.errorNoStatusForSelectedCategory') : true);
				});

				return defer.promise;
			};

			service.validateCompanyResponsibleFk = function validateCompanyResponsibleFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesContractService);
			};

			service.validateClerkFk = function validateClerkFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesContractService);
			};

			service.validateProjectFk = function validateProjectFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesContractService);
			};

			service.validateContractTypeFk = function validateContractTypeFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesContractService);
			};


			service.validateDocumentType = function validateDocumetType(entity, prjChangeFk, ordHeaderFk) {
				// Project Change only valid with OrdHeaderFk
				if (prjChangeFk !== null) {
					if (ordHeaderFk === null) {
						return platformDataValidationService.finishValidation({
							apply: true,
							valid: false,
							error: '...',
							error$tr$: ordHeaderFk !== entity.OrdHeaderFk ? 'sales.contract.errorReferenceToContractNotSetIfPrjChangeSet' : 'sales.contract.errorReferenceToContractNotSet'
						},
						entity, prjChangeFk, 'PrjChangeFk', self, salesContractService);
					}
				}
				entity.PrjChangeFk = prjChangeFk;
				entity.OrdHeaderFk = ordHeaderFk;
				platformDataValidationService.ensureNoRelatedError(entity, 'PrjChangeFk', ['OrdHeaderFk'], service, salesContractService);
				platformDataValidationService.ensureNoRelatedError(entity, 'OrdHeaderFk', ['PrjChangeFk'], service, salesContractService);
				$injector.get('SalesContractDocumentTypeProcessor').processItem(entity);
				return true;
			};

			service.validatePrjChangeFk = function validatePrjChangeFk(entity, value) {
				return service.validateDocumentType(entity, value, entity.OrdHeaderFk);
			};

			service.validateOrdHeaderFk = function validateOrdHeaderFk(entity, value) {
				return service.validateDocumentType(entity, entity.PrjChangeFk, value);
			};

			service.validateBillingSchemaFk = function validateBillingSchemaFk(entity, value) {
				return value ? self.onValidateBillingSchemaFk(entity, value, true) : true;
			};

			service.asyncValidateCurrencyFk = function asyncValidateCurrencyFk(entity, currencyId, model) {
				return salesContractService.setAsyncExchangeRateByCurrency(entity, currencyId, model, updateExchangeRateUrl);
			};

			service.asyncValidateDateEffective = function asyncValidateDateEffective(entity,value,model) {
				let salesCommonDateEffectiveValidateService = $injector.get('salesCommonDateEffectiveValidateService');
				return salesCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model,'salesContractBoqStructureService', salesContractService, service,'sales.contract');
			};

			service.asyncValidateExchangeRate = function asyncValidateExchangeRate(entity, value, model) {
				return salesContractService.setAsyncExchangeRate(entity, value, model, updateExchangeRateUrl);
			};

			service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model) {
				value = value === 0 ? null : value; // handle 0 as null
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesContractService);
			};

			service.validateBusinesspartnerFk = function validateBusinesspartnerFk(entity, businesspartnerId, model) {
				// handle 0 Id as null here
				businesspartnerId = businesspartnerId === 0 ? null : businesspartnerId;

				var result = platformDataValidationService.validateMandatory(entity, businesspartnerId, model, self, salesContractService);

				// set subsidiary to ready only, if no BP is set
				var isChangeOrder = (entity.OrdHeaderFk !== null && entity.PrjChangeFk !== null);
				$injector.get('platformRuntimeDataService').readonly(entity, [{
					field: 'SubsidiaryFk',
					readonly: isChangeOrder ? true : (businesspartnerId === null)
				}]);
				return result;
			};

			service.validateAddressEntity = function validateAddressEntity(entity, value) {
				if (entity.AddressEntity !== value) {
					entity.AddressEntity = value;
					if (value !== null) {
						entity.AddressFk = value.Id;
					} else {
						entity.AddressFk = value;
					}
					salesContractService.markCurrentItemAsModified();
				}
				return true;
			};

			self.onValidateBillingSchemaFk = function onValidateBillingSchemaFk(entity, value, fireEvent, forceReload) {
				if (entity.BillingSchemaFk !== value || forceReload) {
					entity.BillingSchemaFk = value;
					salesContractBillingSchemaService.getContractData(entity);
					salesContractService.reloadBillingSchemas();
				}
				return true;
			};

			service.validateOrderDate = function (entity, value) {
				entity.DateEffective = value || entity.DateEffective;
				entity.DateEffective = value || entity.DateEffective;
			};
			service.validateBoqWicCatFk = function (entity, value) {
				if (value === null) {
					$injector.get('platformRuntimeDataService').readonly(entity, [{ field: 'BoqWicCatBoqFk', readonly: true }]);
					entity.BoqWicCatBoqFk = null;
				} else {
					$injector.get('platformRuntimeDataService').readonly(entity, [{ field: 'BoqWicCatBoqFk', readonly: false }]);
					entity.BoqWicCatBoqFk = null;
				}
			};
			service.validateValidFrom = function validateValidFrom(entity, value, model) {
				if (!_.isNil(entity.RelatedCallOffContract) && !_.isUndefined(entity.RelatedCallOffContract)) {
					if (!_.isNil(entity.RelatedCallOffContract.OrdHeaderFk)) {
						if (entity.RelatedCallOffContract.OrdHeaderFk === entity.SelectedFrameworkContract.Id) {
							if (Date.parse(value) > Date.parse(entity.ValidTo)) {
								return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, salesContractService, 'ValidFrom');
							}
							return self.validatePeriod(value, entity.RelatedDateEffective, entity, model, service, salesContractService, 'RelatedDateEffective');
						}
					}
				}
				return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, salesContractService, 'ValidTo');
			};
			service.validateValidTo = function validateValidTo(entity, value, model) {
				if (!_.isNil(entity.RelatedCallOffContract) && !_.isUndefined(entity.RelatedCallOffContract)) {
					if (!_.isNil(entity.RelatedCallOffContract.OrdHeaderFk)) {
						if (entity.RelatedCallOffContract.OrdHeaderFk === entity.SelectedFrameworkContract.Id) {
							if (Date.parse(value) < Date.parse(entity.ValidFrom)) {
								return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, salesContractService, 'ValidFrom');
							}
							return self.validatePeriod(entity.RelatedDateEffective, value, entity, model, service, salesContractService, 'RelatedDateEffective');
						}
					}
				}
				return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, salesContractService, 'ValidFrom');
			};
			return service;
		}
	]);
})();
