/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonValidationService
	 * @description provides validation services for common modules
	 */
	angular.module(salesCommonModule).factory('salesCommonValidationServiceProvider', ['globals', '$q', '_', '$http', '$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'salesCommonBusinesspartnerSubsidiaryCustomerService',
		function (globals, $q, _, $http, $translate, platformDataValidationService, platformRuntimeDataService, salesCommonBusinesspartnerSubsidiaryCustomerService) {

			var ValidationServiceProvider = function (mainService) {
				var self = this;

				this.validateCode = function validateCode(entity, value, model) {
					var itemList = mainService.getList();
					return platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, itemList, self, mainService);
				};

				this.validatePlannedStart = function validatePlannedStart(entity, value, model) {
					return platformDataValidationService.validatePeriod(value, entity.PlannedEnd, entity, model, self, mainService, 'PlannedEnd');
				};

				this.validatePlannedEnd = function validatePlannedEnd(entity, value, model) {
					return platformDataValidationService.validatePeriod(entity.PlannedStart, value, entity, model, self, mainService, 'PlannedStart');
				};

				this.validateLanguageFk = function validateLanguageFk(entity, languageId, model) {
					// handle 0 Id as null here
					languageId = languageId === 0 ? null : languageId;
					return platformDataValidationService.validateMandatory(entity, languageId, model, self, mainService);
				};

				this.validateBusinesspartnerFk = function validateBusinesspartnerFk(entity, businesspartnerId, model) {
					// handle 0 Id as null here
					businesspartnerId = businesspartnerId === 0 ? null : businesspartnerId;

					var result = platformDataValidationService.validateMandatory(entity, businesspartnerId, model, self, mainService);
					// set subsidiary to ready only, if no BP is set
					platformRuntimeDataService.readonly(entity, [{field: 'SubsidiaryFk', readonly: businesspartnerId === null}]);
					return result;
				};

				this.validateSubsidiaryFk = function validateSubsidiaryFk(entity, value, model) {
					return platformDataValidationService.validateMandatory(entity, value, model, self, mainService);
				};

				this.validateCustomerFk = function validateCustomerFk(entity, value, model) {
					// 0 is like null here
					value = value === 0 ? null : value;

					var res = platformDataValidationService.createSuccessObject();
					return platformDataValidationService.finishValidation(res, entity, value, model, self, mainService);
				};

				this.asyncValidateBusinesspartnerFk = function asyncValidateBusinesspartnerFk(entity, value, model) {
					var originVatGroupFk = entity.VatGroupFk;
					var moduleName = mainService.getModule().name;
					if (value !== null) {
						entity.BusinesspartnerFk = value;
					}
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, mainService);
					asyncMarker.myPromise = entity.Version === 0 && entity.OrdHeaderFk !== null ? $q.when(true) :
						salesCommonBusinesspartnerSubsidiaryCustomerService.populateRelatedValues(mainService, entity, model, value).then(function () {
							// handle customer
							var resultCustomerFk = self.validateCustomerFk(entity, entity.CustomerFk, 'CustomerFk');
							var isValidCustomer = _.get(resultCustomerFk, 'valid') || (_.isBoolean(resultCustomerFk) && resultCustomerFk === true);
							if (isValidCustomer) {
								platformDataValidationService.ensureNoRelatedError(entity, model, ['CustomerFk'], self, mainService);
							}
							platformRuntimeDataService.applyValidationResult(resultCustomerFk, entity, 'CustomerFk');

							// handle subsidiary
							var resultSubsidiaryFk = self.validateSubsidiaryFk(entity, entity.SubsidiaryFk, 'SubsidiaryFk');
							if (_.get(resultSubsidiaryFk, 'valid') || (_.isBoolean(resultSubsidiaryFk) && resultSubsidiaryFk === true)) {
								platformDataValidationService.ensureNoRelatedError(entity, model, ['SubsidiaryFk'], self, mainService);
							}
							platformRuntimeDataService.applyValidationResult(resultSubsidiaryFk, entity, 'SubsidiaryFk');
							if (moduleName === 'sales.contract' && entity.VatGroupFk && entity.VatGroupFk !== originVatGroupFk && entity.Version > 0) {
								mainService.isRecalculationBoQ(entity);
							}

							var customerValidationPromise = isValidCustomer && entity.CustomerFk
								? self.asyncValidateCustomerFk(entity, entity.CustomerFk, 'CustomerFk')
								: $q.when(true);

							// checking version for 0 to skip the recalculation (warning popup) on creation process
							return customerValidationPromise.then(function () {
								return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, mainService);
							});
						});
					return asyncMarker.myPromise;
				};

				this.asyncValidateCustomerFk = function asyncValidateCustomerFk(entity, value, model) {
					var originVatGroupFk = entity.VatGroupFk;
					var moduleName = mainService.getModule().name;
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, mainService);
					asyncMarker.myPromise = entity.Version === 0 && entity.OrdHeaderFk !== null ? $q.when(true) : salesCommonBusinesspartnerSubsidiaryCustomerService.populateRelatedValues(mainService, entity, model, value).then(function () {
						// handle business partner
						var resultBusinessPartnerFk = self.validateBusinesspartnerFk(entity, entity.BusinesspartnerFk, 'BusinesspartnerFk');
						if (_.get(resultBusinessPartnerFk, 'valid') || (_.isBoolean(resultBusinessPartnerFk) && resultBusinessPartnerFk === true)) {
							platformDataValidationService.ensureNoRelatedError(entity, model, ['BusinesspartnerFk'], self, mainService);
						}
						platformRuntimeDataService.applyValidationResult(resultBusinessPartnerFk, entity, 'BusinesspartnerFk');
						// handle subsidiary
						var resultSubsidiaryFk = self.validateSubsidiaryFk(entity, entity.SubsidiaryFk, 'SubsidiaryFk');
						if (_.get(resultSubsidiaryFk, 'valid') || (_.isBoolean(resultSubsidiaryFk) && resultSubsidiaryFk === true)) {
							platformDataValidationService.ensureNoRelatedError(entity, model, ['SubsidiaryFk'], self, mainService);
						}
						platformRuntimeDataService.applyValidationResult(resultSubsidiaryFk, entity, 'SubsidiaryFk');

						if (moduleName === 'sales.contract' && entity.VatGroupFk && entity.VatGroupFk !== originVatGroupFk) {
							mainService.isRecalculationBoQ(entity);
						}

						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, mainService);
					});
					return asyncMarker.myPromise;
				};

				this.asyncValidateBusinesspartnerBilltoFk = function asyncValidateBusinesspartnerBillToFk(entity, value, model) {
					if(value !== null){
						entity.BusinesspartnerBilltoFk = value;
					}
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, mainService);
					asyncMarker.myPromise = salesCommonBusinesspartnerSubsidiaryCustomerService.populateRelatedValues(mainService, entity, model, value).then(function () {
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, mainService);
					});
					return asyncMarker.myPromise;
				};

				this.asyncValidateCustomerBilltoFk = function asyncValidateCustomerBilltoFk(entity, value, model) {
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, mainService);
					asyncMarker.myPromise = salesCommonBusinesspartnerSubsidiaryCustomerService.populateRelatedValues(mainService, entity, model, value).then(function () {
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, mainService);
					});
					return asyncMarker.myPromise;
				};

				// TODO: needs probably to moved to another service (this one is used as a provider, context dependent validation)
				this.asyncValidateDateForCompanyPeriod = function asyncValidateDateForCompanyPeriod(entity, value, field, dataService) {
					var url = globals.webApiBaseUrl + 'sales/common/validateDateForCompanyPeriod';
					var data = {
						newValue: value
					};

					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, dataService);

					asyncMarker.myPromise = $http.post(url, data).then(function (response) {
						var validationNumber = _.get(response, 'data.validationNumber');
						var period = _.get(response, 'data.period');
						var errorMessage = '';

						if (validationNumber === 1) {
							errorMessage = $translate.instant('sales.billing.errorNoPostingPeriod', {period: period});
						} else if (validationNumber === 2) {
							errorMessage = $translate.instant('sales.billing.errorNotInPeriod', {period: period});
						} else if (validationNumber === 3) {
							errorMessage = $translate.instant('sales.billing.errorPeriodNotOpen', {period: period});
						} else {
							return platformDataValidationService.finishAsyncValidation(platformDataValidationService.createSuccessObject(),
								entity, value, field, asyncMarker, self, dataService);
						}
						return platformDataValidationService.finishAsyncValidation({
							apply: true,
							valid: false,
							error: errorMessage
						}, entity, value, field, asyncMarker, self, dataService);
					});
					return asyncMarker.myPromise;
				};
			};

			// service api
			return {
				getInstance: function getInstance(mainService) {
					return new ValidationServiceProvider(mainService);
				}
			};
		}

	]);

})();
