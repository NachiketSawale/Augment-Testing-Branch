/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	var moduleName = 'sales.bid';

	// TODO: improve name
	angular.module(moduleName).factory('salesBidValidationHelperService',
		['globals', '$http', 'platformDataValidationService',
			function (globals, $http, platformDataValidationService) {
				return {
					asyncValidateCode: function asyncValidateCode(companyId, code) {
						return $http.get(globals.webApiBaseUrl + 'sales/bid/isuniquecode?companyId=' + companyId + '&code=' + code).then(function (response) {
							return (response.data === true) ? true : platformDataValidationService.createErrorObject('sales.common.errorCodeMustBeUniqueInCompany');
						});
					}
				};
			}
		]);

	/**
	 * @ngdoc service
	 * @name salesBidValidationService
	 * @description provides validation methods for bid header entities
	 */
	angular.module(moduleName).factory('salesBidValidationService', ['_', 'globals', '$http', '$q', '$injector', 'platformDataValidationService', 'salesBidService', 'salesCommonValidationServiceProvider', 'salesBidBillingSchemaService',
		function (_, globals, $http, $q, $injector, platformDataValidationService, salesBidService, salesCommonValidationServiceProvider, salesBidBillingSchemaService) {
			var service = salesCommonValidationServiceProvider.getInstance(salesBidService);
			var updateExchangeRateUrl = globals.webApiBaseUrl + 'sales/bid/updateExchangeRate';
			var self = this;

			service.isCodeUnique = true;

			// TODO:
			// - mandatory fields like code, project etc. (at least all in 'create a bid' dialog)

			service.validateCodeOnMode = function(entity, value, model, updateMode){
				var itemList = salesBidService.getList();
				if(updateMode){
					service.isCodeUnique = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, service, salesBidService);
				}
				else{
					service.isCodeUnique = platformDataValidationService.validateIsUnique(entity, value, model, itemList, service, salesBidService);
				}
				return service.isCodeUnique;
			};

			service.asyncValidateCode = function (entity, modelValue, field) {
				var companyId = entity.CompanyFk || -1,
					code = modelValue,
					url = globals.webApiBaseUrl + 'sales/bid/isuniquecode?companyId=' + companyId + '&code=' + code + '&entityid=' + entity.Id;

				var finishAsyncValidationHelper = function (apply, valid) {
					return platformDataValidationService.finishAsyncValidation(
						{
							apply: apply,
							valid: valid,
							error$tr$: 'sales.common.errorCodeMustBeUniqueInCompany'
						}, entity, modelValue, field, asyncMarker, self, salesBidService);
				};

				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, code, salesBidService);
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
				var url = globals.webApiBaseUrl + 'sales/bid/status/IsStatusAvailable';

				var defer = $q.defer();
				$http.get(url).then(function (result) {
					defer.resolve(!result.data ? platformDataValidationService.createErrorObject('sales.bid.errorNoStatusForSelectedCategory') : true);
				});

				return defer.promise;
			};

			service.validateCompanyResponsibleFk = function validateCompanyResponsibleFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBidService);
			};

			service.validateClerkFk = function validateClerkFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBidService);
			};

			service.validateOrdPrbltyPercent = function validateOrdPrbltyPercent(entity, value, model) {
				// TODO: find other way to display a more user friendly message (parameter 'model' is used for finish validation process)
				// var nameForErrMsg = $injector.get('$translate').instant('sales.bid.entityOrdPrbltyPercent');
				var res = true;
				if (value !== '') {
					res = platformDataValidationService.validateIsNullOrInRange(entity, value, model, 1, 100, service, salesBidService);
				}
				else {
					platformDataValidationService.finishValidation(res, entity, value, model, service, salesBidService);
				}

				entity.OrdPrbltyLastvalDate = $injector.get('moment')(); // current date
				entity.OrdPrbltyWhoupd = $injector.get('platformUserInfoService').getCurrentUserInfo().UserId;
				if (res === true || _.get(res, 'valid') === true) {
					salesBidService.updateContractProbability(entity);
				}

				return res;
			};

			service.validateProjectFk = function validateProjectFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBidService);
			};

			service.validateBusinesspartnerFk = function validateBusinesspartnerFk(entity, value, model){
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBidService);
			};

			service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model){
				if(value === 0){
					value = null;
				}
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBidService);
			};

			service.validateContractTypeFk = function validateContractTypeFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBidService);
			};

			service.validateDocumentType = function validateDocumentType(entity, prjChangeFk, bidHeaderFk) {
				// Project Change only valid with BidHeaderFk
				if (prjChangeFk !== null) {
					if (bidHeaderFk === null) {
						return platformDataValidationService.finishValidation(
							{
								apply: true,
								valid: false,
								error: '...',
								error$tr$: bidHeaderFk !== entity.BidHeaderFk ? 'sales.bid.errorReferenceToBidNotSetIfPrjChangeSet' : 'sales.bid.errorReferenceToBidNotSet'
							},
							entity, prjChangeFk, 'PrjChangeFk', self, salesBidService);
					}
				}
				entity.PrjChangeFk = prjChangeFk;
				entity.BidHeaderFk = bidHeaderFk;
				platformDataValidationService.ensureNoRelatedError(entity, 'PrjChangeFk', ['BidHeaderFk'], service, salesBidService);
				platformDataValidationService.ensureNoRelatedError(entity, 'BidHeaderFk', ['PrjChangeFk'], service, salesBidService);
				$injector.get('SalesBidDocumentTypeProcessor').processItem(entity);
				return true;
			};

			service.validatePrjChangeFk = function validatePrjChangeFk(entity, value) {
				return service.validateDocumentType(entity, value, entity.BidHeaderFk);
			};

			service.validateBidHeaderFk = function validateBidHeaderFk(entity, value) {
				return service.validateDocumentType(entity, entity.PrjChangeFk, value);
			};

			service.validateBillingSchemaFk = function validateBillingSchemaFk(entity, value) {
				return value ? self.onValidateBillingSchemaFk(entity, value, true) : true;
			};

			service.asyncValidateCurrencyFk = function asyncValidateCurrencyFk(entity, currencyId, model) {
				return salesBidService.setAsyncExchangeRateByCurrency(entity, currencyId, model, updateExchangeRateUrl);
			};

			service.asyncValidateDateEffective = function asyncValidateDateEffective(entity,value,model) {
				let salesCommonDateEffectiveValidateService = $injector.get('salesCommonDateEffectiveValidateService');
				return salesCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model,'salesBidBoqStructureService', salesBidService, service,'sales.bid');
			};

			service.asyncValidateExchangeRate = function asyncValidateExchangeRate(entity, value, model) {
				return salesBidService.setAsyncExchangeRate(entity, value, model, updateExchangeRateUrl);
			};

			service.validateDialogConfigurationFk = function validateDialogConfigurationFk(/*   entity, value  */){
				// validate create dialog configFk
			};

			self.onValidateBillingSchemaFk = function onValidateBillingSchemaFk(entity, value, fireEvent, forceReload) {
				if (entity.BillingSchemaFk !== value || forceReload) {
					entity.BillingSchemaFk = value;
					salesBidBillingSchemaService.getBidData(entity);
					salesBidService.reloadBillingSchemas();
				}
				return true;
			};

			return service;
		}
	]);
})();
