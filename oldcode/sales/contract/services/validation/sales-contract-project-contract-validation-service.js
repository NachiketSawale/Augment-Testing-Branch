/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.contract';

	/**
	 * @ngdoc service
	 * @name salesContractProjectContractValidationService
	 * @description provides validation methods for contract header entities in project module
	 */
	angular.module(moduleName).factory('salesContractProjectContractValidationService', ['globals', '$injector', '$http', '$q', 'platformDataValidationService', 'salesContractProjectContractsService', 'salesCommonValidationServiceProvider', 'salesContractBillingSchemaService','platformRuntimeDataService','salesContractService',
		function (globals, $injector, $http, $q, platformDataValidationService, salesContractProjectContractsService, salesCommonValidationServiceProvider, salesContractBillingSchemaService,platformRuntimeDataService,salesContractService) {
			var service = salesCommonValidationServiceProvider.getInstance(salesContractProjectContractsService);
			var self = this;

			// TODO:
			// - mandatory fields like code, project etc. (at least all in 'create a contract' dialog)
			service.validateSubsidiaryFk = function validateSubsidiaryFk(/* entity, value, model */) {
				return true;
			};

			service.validateBusinesspartnerFk = function validateBusinesspartnerFk(entity, businesspartnerId, model) {
				// handle 0 Id as null here
				businesspartnerId = businesspartnerId === 0 ? null : businesspartnerId;

				var result = platformDataValidationService.validateMandatory(entity, businesspartnerId, model, self, salesContractProjectContractsService);
				// set subsidiary to ready only, if no BP is set
				platformRuntimeDataService.readonly(entity, [{field: 'SubsidiaryFk', readonly: businesspartnerId === null}]);
				return result;
			};

			service.asyncValidateCode = function (entity, value) {
				var projectId = entity.ProjectFk || -1,
					code = value,
					url = globals.webApiBaseUrl + 'sales/contract/isuniquecode?projectId=' + projectId + '&code=' + code;

				var defer = $q.defer();
				$http.get(url).then(function (result) {
					defer.resolve(!result.data ? platformDataValidationService.createErrorObject('sales.contract.errorCodeMustBeUnique') : true);
				});

				return defer.promise;
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
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesContractProjectContractsService);
			};

			service.validateClerkFk = function validateClerkFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesContractProjectContractsService);
			};

			service.validateProjectFk = function validateProjectFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesContractProjectContractsService);
			};

			service.validateContractTypeFk = function validateContractTypeFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesContractProjectContractsService);
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
						entity, prjChangeFk, 'PrjChangeFk', self, salesContractProjectContractsService);
					}
				}
				entity.PrjChangeFk = prjChangeFk;
				entity.OrdHeaderFk = ordHeaderFk;
				platformDataValidationService.ensureNoRelatedError(entity, 'PrjChangeFk', ['OrdHeaderFk'], service, salesContractProjectContractsService);
				platformDataValidationService.ensureNoRelatedError(entity, 'OrdHeaderFk', ['PrjChangeFk'], service, salesContractProjectContractsService);
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

			service.validateCurrencyFk = function validateCurrencyFk(entity, value) {
				salesContractService.setExchangeRateByCurrency(entity, value);
				return true;
			};

			service.validateExchangeRate = function validateExchangeRate(entity, value) {
				salesContractService.setExchangeRate(entity, value);
				return true;
			};

			service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesContractProjectContractsService);
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

			return service;
		}
	]);
})();
