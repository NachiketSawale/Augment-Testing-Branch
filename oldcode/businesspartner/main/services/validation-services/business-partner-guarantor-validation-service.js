/**
 * Created by wed on 8/25/2017.
 */

(function (angular) {

	'use strict';

	var moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerGuarantorValidationService', ['platformRuntimeDataService', 'platformDataValidationService', '$translate', 'businessPartnerGuarantorDataService', function (platformRuntimeDataService, platformDataValidationService, $translate, businessPartnerGuarantorDataService) {

		var service = null;

		function getRequireErrorResult(translationId) {
			return {
				apply: true,
				valid: false,
				error: '...',
				error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
				error$tr$param$: {
					fieldName: $translate.instant(translationId)
				}
			};
		}

		function getPositiveErrorResult(translationId) {
			return {
				apply: true,
				valid: false,
				error: '...',
				error$tr$: 'businesspartner.main.entityGreaterThanZero',
				error$tr$param$: {
					fieldName: $translate.instant(translationId)
				}
			};
		}

		function createRequireValidator(translationId) {
			return function (entity, value, model) {
				var result = {apply: true, valid: true}, isInvalid = false;
				switch (model) {
					case 'BusinessPartnerFk':
						isInvalid = (value === undefined || value === null || value === -1);
						break;
					case  'CreditLine':
					case  'GuaranteeFee':
					case  'GuaranteeFeeMinimum':
					case  'GuaranteePercent':
						isInvalid = (value === undefined || value === null);
						break;
					default:
						isInvalid = (value === undefined || value === null || value === 0 || value === '');
						break;
				}
				if (isInvalid) {
					result = getRequireErrorResult(translationId);
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				return platformDataValidationService.finishValidation(result, entity, value, model, service, businessPartnerGuarantorDataService);
			};
		}

		function createRequireAndPositiveValidator(translationId) {
			var requireFun = createRequireValidator(translationId);
			return function (entity, value, model) {
				var result = requireFun(entity, value, model);
				if (result.valid) {
					if (value < 0) {
						result = getPositiveErrorResult(translationId);
					}
				}
				platformRuntimeDataService.applyValidationResult(result, entity, model);
				return platformDataValidationService.finishValidation(result, entity, value, model, service, businessPartnerGuarantorDataService);
			};
		}

		function validateAmountMaximum(entity, value) {
			if(entity.AmountMaximum !== value) {
				var amountCount = entity.AmountCalledOff;
				if(parseFloat(value) < amountCount) {
					var result = {
						apply: true,
						valid: false,
						error: '...',
						error$tr$: 'businesspartner.main.entityAmountMaxLargeAmountCount'
					};
					platformRuntimeDataService.applyValidationResult(result, entity, 'AmountMaximum');
					return platformDataValidationService.finishValidation(result, entity, value, 'AmountMaximum', service, businessPartnerGuarantorDataService);
				}
				// entity.AmountCalledOff = amountCount;
				entity.AmountRemaining = value - amountCount;
			}
			// eslint-disable-next-line no-redeclare
			var result = {
				apply: true,
				valid: true
			};
			platformRuntimeDataService.applyValidationResult(result, entity, 'AmountMaximum');
			return platformDataValidationService.finishValidation(result, entity, value, 'AmountMaximum', service, businessPartnerGuarantorDataService);
		}

		function validateGuaranteeStartDate(entity, value, model) {
			if(value !== undefined || value !== null || value !== 0 || value !== '') {
				if((model === 'GuaranteeStartDate' && value>entity.GuaranteeEndDate) || (model === 'GuaranteeEndDate' && value<entity.GuaranteeStartDate)){
					var result = {
						apply: true,
						valid: false,
						error: $translate.instant('businesspartner.main.entityGuaranteeStartDateLargeEndDate', {enddate: 'GuaranteeEndDate', startdate: 'GuaranteeStartDate'})
					};
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, businessPartnerGuarantorDataService);
				}
			}
		}

		function validateValidFrom(entity, value, model) {
			if(value !== undefined || value !== null || value !== 0 || value !== '') {
				if((model === 'Validto' && value < entity.Validfrom) || (model === 'Validfrom' && value > entity.Validto)) {
					var result = {
						apply: true,
						valid: false,
						error: $translate.instant('businesspartner.main.entityGuaranteeValidFromLargeValidTo', {validto: 'ValidTo', validfrom: 'ValidFrom'})
					};
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					return platformDataValidationService.finishValidation(result, entity, value, model, service, businessPartnerGuarantorDataService);
				}
			}
		}

		service = {
			validateBusinessPartnerFk: createRequireValidator('cloud.common.entityBusinessPartner'),
			validateGuarantorTypeFk: createRequireValidator('businesspartner.main.entityGuarantorType'),
			validateCreditLine: createRequireAndPositiveValidator('businesspartner.main.entityCreditLine'),
			validateGuaranteeFee: createRequireAndPositiveValidator('businesspartner.main.entityGuaranteeFee'),
			validateGuaranteeFeeMinimum: createRequireAndPositiveValidator('businesspartner.main.entityGuaranteeFeeMinimum'),
			validateGuaranteePercent: createRequireAndPositiveValidator('businesspartner.main.entityGuaranteePercent'),
			validateRhythmFk: createRequireValidator('businesspartner.main.entityRhythm'),
			validateAmountMaximum: validateAmountMaximum,
			validateGuaranteeStartDate: validateGuaranteeStartDate,
			validateGuaranteeEndDate: validateGuaranteeStartDate,
			validateValidfrom: validateValidFrom,
			validateValidto: validateValidFrom,
		};

		return service;

	}]);
})(angular);
