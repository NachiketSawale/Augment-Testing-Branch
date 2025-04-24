/**
 * Created by baf on 07.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeDefaultLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping employee default entity.
	 **/
	angular.module(moduleName).service('timekeepingEmployeeDefaultLayoutService', TimekeepingEmployeeDefaultLayoutService);

	TimekeepingEmployeeDefaultLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeDefaultLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getEmployeeDefaultLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.employeeDefault,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);