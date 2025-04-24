/**
 * Created by leo on 25.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.period';

	/**
	 * @ngdoc controller
	 * @name timekeepingPeriodValidationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping validation  entity.
	 **/
	angular.module(moduleName).service('timekeepingPeriodValidationLayoutService', TimekeepingValidationLayoutService);

	TimekeepingValidationLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingPeriodContainerInformationService', 'timekeepingPeriodTranslationService', 'timekeepingPeriodConstantValues'];

	function TimekeepingValidationLayoutService(platformUIConfigInitService, timekeepingPeriodContainerInformationService, timekeepingPeriodTranslationService, timekeepingPeriodConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingPeriodContainerInformationService.getValidationLayout(),
			dtoSchemeId: timekeepingPeriodConstantValues.schemes.validation,
			translator: timekeepingPeriodTranslationService
		});
	}
})(angular);
