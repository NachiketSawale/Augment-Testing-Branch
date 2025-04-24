/**
 * Created by leo on 09.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingPlannedAbsenceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping planned absence entity.
	 **/
	angular.module(moduleName).service('timekeepingPlannedAbsenceLayoutService', TimekeepingPlannedAbsenceLayoutService);

	TimekeepingPlannedAbsenceLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService',
		'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingPlannedAbsenceLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getPlannedAbsenceLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.plannedAbsence,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);