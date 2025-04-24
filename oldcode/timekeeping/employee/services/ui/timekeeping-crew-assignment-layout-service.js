/**
 * Created by leo on 07.05.2018.
 */
(function () {
	'use strict';
	var modName = 'timekeeping.employee';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name timekeepingCrewAssignmentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of timekeeping crew assignment entity
	 */
	module.service('timekeepingCrewAssignmentLayoutService', TimekeepingCrewAssignmentLayoutService);

	TimekeepingCrewAssignmentLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService',
		'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingCrewAssignmentLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getCrewAssignmentLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.crewAssignment,
			translator: timekeepingEmployeeTranslationService
		});
	}
})();
