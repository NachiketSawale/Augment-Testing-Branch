/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.billing';

	// TODO: improve name
	angular.module(moduleName).factory('salesBillingValidationHelperService',
		['globals', '$http', 'platformDataValidationService',
			function (globals, $http, platformDataValidationService) {
				return {
					// TODO: improve name
					asyncValidateBillNo: function asyncValidateBillNo(companyId, billNo) {
						return $http.get(globals.webApiBaseUrl + 'sales/billing/isuniquebillno?companyId=' + companyId + '&billno=' + billNo).then(function (response) {
							return (response.data === true) ? true : platformDataValidationService.createErrorObject('sales.billing.errorCodeMustBeUnique');
						});
					}
				};
			}
		]);

	/**
	 * @ngdoc service
	 * @name salesBillingValidationService
	 * @description provides validation methods for billing header entities
	 */
	angular.module(moduleName).factory('salesBillingValidationService', ['_', 'globals', '$http', '$translate', '$q', '$injector', 'platformRuntimeDataService', 'platformDataValidationService', 'salesBillingService', 'salesCommonValidationServiceProvider', 'salesBillingSchemaService', 'salesCommonContextService', 'businessPartnerMainBankLookupDataService',
		function (_, globals, $http, $translate, $q, $injector, platformRuntimeDataService, platformDataValidationService, salesBillingService, salesCommonValidationServiceProvider, salesBillingSchemaService, salesCommonContextService, businessPartnerMainBankLookupDataService) {
			var service = salesCommonValidationServiceProvider.getInstance(salesBillingService);
			var updateExchangeRateUrl = globals.webApiBaseUrl + 'sales/billing/updateExchangeRate';
			var self = this;

			// TODO:
			// - mandatory fields like billno, project etc. (at least all in 'create a billing' dialog)

			service.asyncValidateBillNo = function (entity, value) {
				return service.asyncValidateCode(entity, value);
			};

			service.validateBillNo = function validateBillNo(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingService);
			};

			service.validateConsecutiveBillNo = function validateConsecutiveBillNo(entity, value, model) {
				return platformDataValidationService.validateIsUnique(entity, value, model, salesBillingService.getList(), service, salesBillingService);
			};

			service.asyncValidateCode = function (entity, modelValue, field) {
				var companyId = entity.CompanyFk || -1,
					billNo = modelValue,
					url = globals.webApiBaseUrl + 'sales/billing/isuniquebillno?companyId=' + companyId + '&billno=' + billNo + '&entityid=' + entity.Id;

				var finishAsyncValidationHelper = function (apply, valid) {
					return platformDataValidationService.finishAsyncValidation({
						apply: apply,
						valid: valid,
						error$tr$: 'sales.billing.errorCodeMustBeUnique'
					}, entity,
					modelValue, field, asyncMarker, self, salesBillingService);
				};

				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, billNo, salesBillingService);
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
				var url = globals.webApiBaseUrl + 'sales/billing/status/IsStatusAvailable';

				var defer = $q.defer();
				$http.get(url).then(function (result) {
					defer.resolve(!result.data ? platformDataValidationService.createErrorObject('sales.billing.errorNoStatusForSelectedCategory') : true);
				});

				return defer.promise;
			};

			service.validateCompanyResponsibleFk = function validateCompanyResponsibleFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingService);
			};

			service.validateClerkFk = function validateClerkFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingService);
			};

			// override: in billing customer is mandatory
			service.validateCustomerFk = function validateCustomerFk(entity, value, model) {
				// 0 is like null here
				value = value === 0 ? null : value;
				if (!value) {
					entity.CompanyIcDebtorFk = null;
				}
				return platformDataValidationService.validateMandatory(entity, value, model, self, salesBillingService);
			};

			service.asyncValidateCustomerFk = async function asyncValidateCustomerFk(entity, value, model) {
				try {
					const cache = await self.getIcPartnerDataWithCache(entity);
					const matchingItem = _.find(cache, item => item.BpdCustomerFk === value);
					entity.CompanyIcDebtorFk = matchingItem ? matchingItem.BasCompanyPartnerFk : null;

					return true;
				} catch (error) {
					console.error('Error validating customer FK:', error);
					return false;
				}
			};

			self.getIcPartnerDataWithCache = function getIcPartnerDataWithCache(entity) {
				// Cache object to store previously fetched data
				var cache = self.cache || (self.cache = {});

				// Check if the data for the current CompanyFk exists in the cache
				if (cache[entity.CompanyFk]) {
					// If cached data exists, use it directly (no need to call the API again)
					return Promise.resolve(cache[entity.CompanyFk]);
				}

				// If data is not in the cache, make an HTTP request to fetch it
				return $http.post(globals.webApiBaseUrl + 'basics/company/icpartner/listByParent', { PKey1: entity.CompanyFk })
					.then(function(response) {
						// Store the fetched data in cache for future use
						cache[entity.CompanyFk] = response.data;
						// Return the data from the HTTP response
						return response.data;
					})
					.catch(function(error) {
						// Handle error (you can log it or provide an error handling mechanism)
						console.error('Error fetching data:', error);
						throw error;
					});
			};

			service.validateProjectFk = function validateProjectFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingService);
			};

			service.validateContractTypeFk = function validateContractTypeFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingService);
			};

			service.validateBillingSchemaFk = function validateBillingSchemaFk(entity, value) {
				return value ? self.onValidateBillingSchemaFk(entity, value, true) : true;
			};

			service.asyncValidateCurrencyFk = function asyncValidateCurrencyFk(entity, value, model) {
				var checkCurrencyResult = {valid: true};
				if (entity.OrdHeaderFk) {
					checkCurrencyResult = service.checkCurrency(entity, value);
				}
				if (checkCurrencyResult.valid) {
					return salesBillingService.setAsyncExchangeRateByCurrency(entity, value, model, updateExchangeRateUrl);
				} else {
					platformRuntimeDataService.applyValidationResult(checkCurrencyResult, entity, model);
					platformDataValidationService.finishAsyncValidation(checkCurrencyResult, entity,
						value, model, null, self, salesBillingService);
					return $q.resolve(checkCurrencyResult);
				}
			};

			service.asyncValidateDateEffective = function asyncValidateDateEffective(entity,value,model) {
				let salesCommonDateEffectiveValidateService = $injector.get('salesCommonDateEffectiveValidateService');
				return salesCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model,'salesBillingBoqStructureService', salesBillingService, service,'sales.billing');
			};

			service.checkCurrency = function (entity, value) {
				if (entity.OrdHeaderFk && value !== entity.ContractCurrencyFk) {
					return {
						apply: true,
						valid: false,
						error$tr$: 'sales.billing.wrongCurrency'
					};
				}

				return {
					apply: true,
					valid: true,
					error$tr$: ''
				};
			};

			service.checkIsWipOrder = function (entity) {
				if (entity.IsWipOrder || (entity.OrdHeaderFk !== ''&&entity.OrdHeaderFk !== null)) {
					return {
						readonly: true,
					};
				} else {
					return {
						readonly: false,
					};
				}
			};
			service.asyncValidateOrdHeaderFk = function (entity, value/* , model */) {
				// eslint-disable-next-line no-empty
				if(entity.IsWipOrder===false && value===null){
					platformRuntimeDataService.readonly(entity, [{
						field: 'BasSalesTaxMethodFk',
						readonly: false
					}]);
				}else if(entity.IsWipOrder===false && value!==null){
					platformRuntimeDataService.readonly(entity, [{
						field: 'BasSalesTaxMethodFk',
						readonly: true
					}]);
				}

				var defer = $q.defer();

				if (value) {
					if (entity.CurrencyFk !== entity.ContractCurrencyFk) {
						entity.CurrencyFk = entity.ContractCurrencyFk;
						salesBillingService.setExchangeRateByCurrency(entity, entity.ContractCurrencyFk);
					}
					platformRuntimeDataService.readonly(entity, [{field: 'CurrencyFk', readonly: true}]);
					// defect 126111 start
					$http.get(globals.webApiBaseUrl + 'sales/contract/GetSalesResultByOrdHeader?OrdHeader=' + value).then(function (response) {
						if (response && response.data) {
							entity.BasSalesTaxMethodFk = response.data[0].BasSalesTaxMethodFk;
						}
						defer.resolve(true);
					});
					// defect 126111 end
					defer.resolve(true);
				} else {
					platformRuntimeDataService.readonly(entity, [{field: 'CurrencyFk', readonly: false}]);
					$http.get(globals.webApiBaseUrl + 'project/main/byid?id=' + entity.ProjectFk).then(function (response) {
						if (response && response.data && response.data.CurrencyFk) {
							entity.CurrencyFk = response.data.CurrencyFk;
						} else {
							var company = salesCommonContextService.getCompany();
							entity.CurrencyFk = company.CurrencyFk;
						}
						defer.resolve(true);
					});

				}
				return defer.promise;
			};

			service.validateTaxCodeFk = function validateTaxCodeFk(entity, value, model) {
				value = value === 0 ? null : value; // handle 0 as null
				var result = platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingService);
				// TODO: should be handled by boq now (see #104649)
				// salesBillingService.recalculateAmounts(entity, entity.ExchangeRate, value);
				return result;
			};

			service.asyncValidateExchangeRate = function asyncValidateExchangeRate(entity, value, model) {
				return salesBillingService.setAsyncExchangeRate(entity, value, model, updateExchangeRateUrl);
			};

			// TODO: should be handled by boq now (see #104649)
			// values are taken from boq, readonly field, no validation anymore
			// check to remove
			// service.validateAmountNet = function validateAmountNet(entity, value, model) {
			//  salesBillingService.recalculateAmounts(entity);
			//  return true;
			// };

			service.validateInvoiceTypeFk = function validateInvoiceTypeFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingService);
			};

			// TODO: see also #104649
			// check to remove
			// service.validateInvoiceTypeFk = function validateInvoiceTypeFk(entity, value, model) {
			//  var result = platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingService);
			//  // var isLumpsum = salesBillingService.isLumpsum({InvoiceTypeFk: value});
			//  // platformRuntimeDataService.readonly(entity, [
			//  //  {field: 'AmountNet', readonly: !isLumpsum},
			//  //  {field: 'AmountNetOc', readonly: true},
			//  //  {field: 'AmountGross', readonly: true},
			//  //  {field: 'AmountGrossOc', readonly: true}]);
			//
			//  salesBillingService.recalculateAmounts(entity);
			//
			//  platformRuntimeDataService.applyValidationResult(result, entity, model);
			//
			//  return platformDataValidationService.finishValidation(result, entity, value, model, service, salesBillingService);
			// };

			service.validateTypeFk = function validateTypeFk(entity, value, model) {
				var result = platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingService);
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				return platformDataValidationService.finishValidation(result, entity, value, model, service, salesBillingService);
			};

			self.onValidateBillingSchemaFk = function onValidateBillingSchemaFk(entity, value, fireEvent, forceReload) {
				if (entity.BillingSchemaFk !== value || forceReload) {
					entity.BillingSchemaFk = value;
					salesBillingSchemaService.getBillingData(entity);
					salesBillingService.reloadBillingSchemas();
				}
				return true;
			};

			service.validateBillDate = function validateBillDate(entity, value/* , model */) {
				salesBillingService.calcPaymentTermDates(entity, entity.PaymentTermFk, value);
				return true;
			};

			service.validateDateEffective = function validateDateEffective(entity, value/* , model */) {
				salesBillingService.calcPaymentTermDates(entity, entity.PaymentTermFk, null, value);
				return true;
			};

			service.validatePaymentTermFk = function validatePaymentTermFk(entity, value, model) {
				var result = platformDataValidationService.validateMandatory(entity, value, model, self, salesBillingService);
				salesBillingService.calcPaymentTermDates(entity, value);
				return result;
			};

			service.validateVatGroupFk = function validateVatGroupFk(entity, value, model) {
				return platformDataValidationService.validateMandatory(entity, value, model, service, salesBillingService);
			};

			service.validateReferenceStructured = function (entity, value, model) {
				var validationReferenceStructuredService = $injector.get('validationReferenceStructuredService');
				var validateResult = validationReferenceStructuredService.validationReferenceStructured(value);
				platformDataValidationService.finishValidation(validateResult, entity, value, model, service, salesBillingService);
				return validateResult;
			};

			service.asyncValidateDatePosted = function asyncValidateDatePosted(entity, value, field) {
				return service.asyncValidateDateForCompanyPeriod(entity, value, field, salesBillingService);
			};

			service.validateBankFk = function validateBankFk(entity, value) {
				if (value) {
					var banks = businessPartnerMainBankLookupDataService.getListSync();
					if (banks) {
						var bank = _.find(banks, {Id: value});
						if (bank && bank.BankTypeFk) {
							entity.BankTypeFk = bank.BankTypeFk;
						}
					}
				}
				else {
					entity.BankTypeFk = null;
				}
				return true;
			};

			return service;
		}
	]);
})();
