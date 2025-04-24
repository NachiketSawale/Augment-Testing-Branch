/**
 * Created by shen on 9/16/2021
 */
(function () {
	'use strict';
	var modName = 'timekeeping.employee';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeWorkingTimeModelLayout
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of timekeeping crew assignment entity
	 */
	module.service('timekeepingEmployeeWorkingTimeModelLayoutService', TimekeepingEmployeeWorkingTimeModelLayoutService);

	TimekeepingEmployeeWorkingTimeModelLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService',
		'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeWorkingTimeModelLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getEmployeeWorkingTimeModelLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.employeeWTM,
			translator: timekeepingEmployeeTranslationService
		});
	}
})();
