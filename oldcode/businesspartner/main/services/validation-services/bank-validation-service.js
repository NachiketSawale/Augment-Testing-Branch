/**
 * Created by zos on 9/11/2014.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name businesspartnerMainBankValidationService
	 * @description provides validation methods for a rfqHeader.
	 */
	angular.module('businesspartner.main').factory('businesspartnerMainBankValidationService',
		['$translate', 'basicsLookupdataLookupDescriptorService', '_', 'platformDataValidationService', 'platformRuntimeDataService','IBAN','$q','basicsLookupdataLookupDataService',
			function ($translate, basicsLookupdataLookupDescriptorService, _, platformDataValidationService, platformRuntimeDataService,IBAN,$q,basicsLookupdataLookupDataService) {
				let serviceCache = {};

				return function (dataService) {

					let serviceName = null;
					if (dataService && dataService.getServiceName) {
						serviceName = dataService.getServiceName();
						if (serviceName && Object.prototype.hasOwnProperty.call(serviceCache, serviceName)) {
							return serviceCache[serviceName];
						}
					}

					var service = {};

					function requiredValidator(value, model) {
						var result = {apply: true, valid: true};
						if (angular.isUndefined(value) || value === null || value === -1) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: model});
						}
						return result;
					}

					// function setBankIbanWithNameValue(entity){
					//
					// }

					function updateData(entity, value) {
						var banks = basicsLookupdataLookupDescriptorService.getData('Bank');
						var bankItem = banks ? banks[value] : null;

						if (bankItem) {
							entity.BankName = bankItem.BankName;
						} else {
							entity.BankName = null;
						}
						// setBankIbanWithNameValue(entity);
						if (bankItem && bankItem.BasCountryFk !== entity.CountryFk) {
							entity.CountryFk = bankItem.BasCountryFk;
						}
					}

					function updateIsDefault(entity, value, model) {
						dataService.getList().forEach(function (item) {
							if (item !== entity && value && item[model]) {
								item[model] = false;
								dataService.markItemAsModified(item);
								dataService.gridRefresh();
							}
						});
					}

					service.validateBankTypeFk = function validateBankTypeFk(entity, value, model) {
						var result = requiredValidator(value, model);
						return platformDataValidationService.finishValidation(result, entity, value, model, this, dataService);
					};

					service.validateBankFk = function validateBankFk(entity, value) {
						updateData(entity, value);
						return true;
					};
					service.asyncValidateIban = function asyncValidateIban(entity, value) {
						let defer = $q.defer();
						if (!value || value === '') {
							defer.resolve(true);
							return defer.promise;
						}
						let countryCode = value.slice(0, 2);
						if (!IBAN.countries[countryCode] || !IBAN.countries[countryCode].structure) {
							defer.resolve(true);
							return defer.promise;
						}
						let bankRegexStructure = IBAN.countries[countryCode]._regex();
						let bbanCode = value.slice(4);
						let bankCode = bbanCode.match(bankRegexStructure);
						if (!bankCode || !bankCode[1]) {
							defer.resolve(true);
							return defer.promise;
						}
						basicsLookupdataLookupDataService.getSearchList('Bank', 'Sortcode="' + bankCode[1] + '"').then(result => {
							if (!result || !result[0]) {
								defer.resolve(true);
								return;
							}
							entity.BankFk = result[0].Id;
							entity.BankName = result[0].BankName;
							entity.CountryFk = result[0].BasCountryFk;
							dataService.gridRefresh();
							defer.resolve(true);
						});
						return defer.promise;
					}

					service.validateIban = function validateIban(entity, value, model) {
						var result = {apply: true, valid: true};
						var errorMessage = platformRuntimeDataService.getErrorText(entity, model);
						var p0 = $translate.instant('cloud.common.entityBankIBan');
						var p1 = $translate.instant('cloud.common.entityBankAccountNo');

						// the error message would be because of the wrong format of Iban.
						if (!!errorMessage && errorMessage.length > 0) {

							result.valid = false;
							result.error = errorMessage;
						}

						// Defect: #98386 Bank anlegen ohne IBAN möglich / Create bank without IBAN possible
						// entry should exist in IBAN or AccountNo.
						if (result.valid && !value && !entity.AccountNo) {
							result.valid = false;
							// do not easily remove this error message, it is used in AccountNo sa well and
							// there is a reference to it at validationAccountNo.
							result.error = $translate.instant('cloud.common.entryShouldExistFields', {p0: p0, p1: p1});
						}

						// setBankIbanWithNameValue(entity);

						// if(!!value)
						// {
						var accountNoError = platformRuntimeDataService.getErrorText(entity, 'AccountNo');
						var accountNoResult = {valid: true, apply: true};
						if (accountNoError && accountNoError.length > 0 && !!value) {
							// when AccountNo show error and now would be valid.
							platformRuntimeDataService.applyValidationResult(accountNoResult, entity, 'AccountNo');
							platformDataValidationService.finishValidation(accountNoResult, entity, entity.AccountNo, 'AccountNo', service, dataService);
						} else if ((!accountNoError || !accountNoError.length) && !value && !entity.AccountNo) {
							// when AccountNo does not show error and now it would be invalid.
							accountNoResult.valid = false;
							accountNoResult.error = $translate.instant('cloud.common.entryShouldExistFields', {p0: p1, p1: p0});
							platformRuntimeDataService.applyValidationResult(accountNoResult, entity, 'AccountNo');
							platformDataValidationService.finishValidation(accountNoResult, entity, entity.AccountNo, 'AccountNo', service, dataService);
						}
						// }

						return platformDataValidationService.finishValidation(result, entity, value, model, this, dataService);

					};

					service.validateCountryFk = function validateCountryFk(entity, value, model) {
						var result = requiredValidator(value, model);
						return platformDataValidationService.finishValidation(result, entity, entity.AccountNo, model, this, dataService);
					};

					service.validateIsDefault = function validateIsDefault(entity, value, model) {
						updateIsDefault(entity, value, model);
						return {apply: true, valid: true};
					};

					service.validateIsDefaultCustomer = function validateIsDefaultCustomer(entity, value, model) {
						updateIsDefault(entity, value, model);
						return {apply: true, valid: true};
					};

					service.validateAccountNo = function validateAccountNo(entity, value, model) {

						// Defect: #98386 Bank anlegen ohne IBAN möglich / Create bank without IBAN possible
						// entry should exist in IBAN or AccountNo.
						var result = {valid: true, apply: true};
						var p0 = $translate.instant('cloud.common.entityBankAccountNo');
						var p1 = $translate.instant('cloud.common.entityBankIBan');

						if (!value && !entity.Iban) {
							result.valid = false;
							result.error = $translate.instant('cloud.common.entryShouldExistFields', {p0: p0, p1: p1});
						}

						// if(result.valid)
						// {
						var ibanError = platformRuntimeDataService.getErrorText(entity, 'Iban');
						var ibanResult = {valid: true, apply: true};
						// IBAN or Account No.
						// it is a reference to Iban at validationIban.
						var ibanErrorStr = $translate.instant('cloud.common.entryShouldExistFields', {p0: p1, p1: p0});
						if (ibanError === ibanErrorStr && !!value) {
							// when iban shows error and now is would be valid.
							platformRuntimeDataService.applyValidationResult(ibanResult, entity, 'Iban');
							platformDataValidationService.finishValidation(ibanResult, entity, entity.Iban, 'Iban', service, dataService);
						} else if ((!ibanError || !ibanError.length) && !value && !entity.Iban) {
							// when iban does not show error and now it would be invalid.
							ibanResult.valid = false;
							ibanResult.error = ibanErrorStr;
							platformRuntimeDataService.applyValidationResult(ibanResult, entity, 'Iban');
							platformDataValidationService.finishValidation(ibanResult, entity, entity.Iban, 'Iban', service, dataService);
						}
						// }

						return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);

					};

					return service;
				};
			}
		]);

})(angular);
