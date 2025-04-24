(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.layout';

	/**
	 * @ngdoc service
	 * @name timekeepingLayoutUserInterfaceLayoutValidationService
	 * @description provides validation methods for timekeeping layout UserInterfaceLayout entities
	 */
	angular.module(moduleName).service('timekeepingLayoutUserInterfaceLayoutValidationService', TimekeepingLayoutUserInterfaceLayoutValidationService);

	TimekeepingLayoutUserInterfaceLayoutValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingLayoutConstantValues', 'timekeepingLayoutUserInterfaceLayoutDataService', 'platformDataValidationService'];

	function TimekeepingLayoutUserInterfaceLayoutValidationService(platformValidationServiceFactory, timekeepingLayoutConstantValues, timekeepingLayoutUserInterfaceLayoutDataService, platformDataValidationService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingLayoutConstantValues.schemes.userInterfaceLayout, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingLayoutConstantValues.schemes.userInterfaceLayout)
		},
		self,
		timekeepingLayoutUserInterfaceLayoutDataService);

		self.validateDescriptionInfo = function (entity, value, model) {
			if(value !== null && value.Description === null)
			{
				value = null;
			}
			return platformDataValidationService.validateMandatory(entity, value, model, self, timekeepingLayoutUserInterfaceLayoutDataService);
		};
	}
})(angular);
