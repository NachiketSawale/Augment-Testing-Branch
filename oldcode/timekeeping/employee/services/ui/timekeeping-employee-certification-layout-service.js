/**
 * Created by Sudarshan on 30.03.2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeCertificationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping employee certification entity.
	 **/
	angular.module(moduleName).service('timekeepingEmployeeCertificationLayoutService', TimekeepingEmployeeCertificationLayoutService);

	TimekeepingEmployeeCertificationLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeCertificationLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getCertificationLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.certification,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);