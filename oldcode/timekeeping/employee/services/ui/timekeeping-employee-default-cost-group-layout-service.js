/**
 * Created by baf on 07.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeDefaultCostGroupLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping employee defaultCostGroup entity.
	 **/
	angular.module(moduleName).service('timekeepingEmployeeDefaultCostGroupLayoutService', TimekeepingEmployeeDefaultCostGroupLayoutService);

	TimekeepingEmployeeDefaultCostGroupLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeDefaultCostGroupLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getDefaultCostGroupLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.defaultCostGroup,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);