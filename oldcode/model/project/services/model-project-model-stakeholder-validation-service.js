(function (angular) {
	'use strict';

	const moduleName = 'model.project';

	/**
     * @ngdoc service
     * @name modelProjectModelStakeholderValidationService
     * @description provides validation methods for stakeholder entities
     */
	angular.module(moduleName).factory('modelProjectModelStakeholderValidationService', ['$injector', 'platformDataValidationService',
		'businessPartnerLogicalValidator',

		function ($injector, platformDataValidationService, businessPartnerLogicalValidator) {

			let service = {};
			const dataService = $injector.get('modelProjectModelStakeholderDataService');
			const businessPartnerValidatorService = businessPartnerLogicalValidator.getService({dataService : dataService});

			service.validateClerkFk = function (entity, value) {
				dataService.updateItemDisabledStates(entity);
				dataService.updateReadOnly(entity, 'ClerkFk', value);
				return platformDataValidationService.validateMandatory(entity, value, 'ClerkFk', service, dataService);
			};
			service.validateSubsidiaryFk = function (entity, value) {
				return platformDataValidationService.validateMandatory(entity, value, 'SubsidiaryFk', service, dataService);
			};

			service.validateBusinessPartnerFk = function (entity, value) {
				dataService.updateItemDisabledStates(entity);
				businessPartnerValidatorService.resetArgumentsToValidate();
				businessPartnerValidatorService.businessPartnerValidator.apply(null, arguments);
				businessPartnerValidatorService.setDefaultContact(entity, value, 'ContactFk').then(function () {
					dataService.fireItemModified(entity);
				});
			};

			service.validateContactFk = function (entity, value) {
				dataService.updateReadOnly(entity, 'ContactFk', value);
				return platformDataValidationService.validateMandatory(entity, value, 'ContactFk', service, dataService);
			};

			return service;
		}

	]);

})(angular);
