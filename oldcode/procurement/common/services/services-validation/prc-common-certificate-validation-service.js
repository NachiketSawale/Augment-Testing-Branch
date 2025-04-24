(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonCertificatesValidationService
	 * @description provides validation methods for Certificates
	 */
	angular.module('procurement.common').factory('procurementCommonCertificatesValidationService',
		['platformDataValidationService', 'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService',
			function (platformDataValidationService, basicsLookupdataLookupDescriptorService, platformRuntimeDataService) {
				return function (dataService) {
					var service = {};

					// validators
					service.validateBpdCertificateTypeFk = function validateBpdCertificateTypeFk(entity, value, model) {
						var isValid = platformDataValidationService.isUnique(dataService.getList(), 'BpdCertificateTypeFk', value, entity.Id);
						if (isValid) {
							var data = basicsLookupdataLookupDescriptorService.getLookupItem('CertificateType', value);
							if (!data) {
								return true;
							}
							isValid.valid = isValid.valid || data.HasAmount;
							entity.IsValued = data.IsValued;
							if(dataService.isCalculateAmount) {
								dataService.calculateAmount(entity, value);
							}
						}
						if (angular.isFunction(dataService.updateReadOnly)) {
							dataService.updateReadOnly(entity, 'RequiredAmount' );
						}
						if (!isValid.valid){// TODO, platformDataValidationService.isUnique have some issue
							isValid.error$tr$param$ = { object: 'certificate type'};
						}
						platformRuntimeDataService.applyValidationResult(isValid, entity, model);
						platformDataValidationService.finishValidation(isValid, entity, value, model, service, dataService);
						return isValid;
					};

					service.validateEntity = function (entity) {
						service.validateBpdCertificateTypeFk(entity, entity.BpdCertificateTypeFk, 'BpdCertificateTypeFk');
					};

					service.validateValidFrom = function validateValidFrom(entity, value, model) {
						return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, service, dataService, 'ValidTo');
					};

					service.validateValidTo = function validateValidTo(entity, value, model) {
						return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, service, dataService, 'ValidFrom');
					};

					service.validateGuaranteeCostPercent = function validateGuaranteeCostPercent(entity, value) {
						dataService.recalculateAmountExp(entity, value);
					};

					// noinspection JSUnusedLocalSymbols
					function onEntityCreated(e, item) {
						service.validateEntity(item);
					}

					dataService.registerEntityCreated(onEntityCreated);

					return service;
				};
			}
		]);
})(angular);

