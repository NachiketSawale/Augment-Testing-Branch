/**
 * Created by leo on 08.05.2018.
 */
(function () {
	'use strict';
	var modName = 'timekeeping.employee';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeePictureLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of timekeeping employee picture entity
	 */
	module.service('timekeepingEmployeePictureLayoutService', EmployeePictureLayoutService);

	EmployeePictureLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService',
		'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function EmployeePictureLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getEmployeePictureLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.employeePicture,
			translator: timekeepingEmployeeTranslationService
		});
	}
})();