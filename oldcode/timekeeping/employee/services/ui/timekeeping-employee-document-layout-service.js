/**
 * Created by Sudarshan on 14.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeDocumentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping employee document entity.
	 **/
	angular.module(moduleName).service('timekeepingEmployeeDocumentLayoutService', TimekeepingEmployeeDocumentLayoutService);

	TimekeepingEmployeeDocumentLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeDocumentLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getEmployeeDocumentLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.employeeDoc,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);