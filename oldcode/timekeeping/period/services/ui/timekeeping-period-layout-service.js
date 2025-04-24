/**
 * Created by baf on 05.06.2019
 */

(function (angular) {
	'use strict';
	const moduleName = 'timekeeping.period';

	/**
	 * @ngdoc controller
	 * @name timekeepingPeriodLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping period period entity.
	 **/
	angular.module(moduleName).service('timekeepingPeriodLayoutService', TimekeepingPeriodLayoutService);

	TimekeepingPeriodLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingPeriodContainerInformationService',
		'timekeepingPeriodConstantValues', 'timekeepingPeriodTranslationService'];

	function TimekeepingPeriodLayoutService(platformUIConfigInitService, timekeepingPeriodContainerInformationService, timekeepingPeriodConstantValues, timekeepingPeriodTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingPeriodContainerInformationService.getPeriodLayout(),
			dtoSchemeId: timekeepingPeriodConstantValues.schemes.period,
			translator: timekeepingPeriodTranslationService
		});
	}
})(angular);