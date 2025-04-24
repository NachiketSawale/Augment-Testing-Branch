/**
 * Created by chd on 24.03.2025
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeLicenseCheckLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping employee License Check entity.
	 **/
	angular.module(moduleName).service('timekeepingEmployeeLicenseCheckLayoutService', TimekeepingEmployeeLicenseCheckLayoutService);

	TimekeepingEmployeeLicenseCheckLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeLicenseCheckLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getEmployeeLicenseCheckLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.licenseCheck,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);