/**
 * Created by baf on 07.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeAbsenceCostGroupLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping employee absenceCostGroup entity.
	 **/
	angular.module(moduleName).service('timekeepingEmployeeAbsenceCostGroupLayoutService', TimekeepingEmployeeAbsenceCostGroupLayoutService);

	TimekeepingEmployeeAbsenceCostGroupLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeAbsenceCostGroupLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getAbsenceCostGroupLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.absenceCostGroup,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);