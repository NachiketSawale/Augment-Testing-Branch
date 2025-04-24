/**
 * Created by leo on 02.05.2018.
 */
(function () {
	'use strict';
	var modName = 'timekeeping.employee';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of timekeeping employee entity
	 */
	module.service('timekeepingEmployeeLayoutService', TimekeepingEmployeeLayoutService);

	TimekeepingEmployeeLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService',
		'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getTimekeepingEmployeeLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.employee,
			translator: timekeepingEmployeeTranslationService
		});
	}
})();