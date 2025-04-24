/**
 * Created by shen on 7/6/2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeWorkingTimeAccountLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping employee working time account entity.
	 **/
	angular.module(moduleName).service('timekeepingEmployeeWorkingTimeAccountLayoutService', TimekeepingEmployeeWorkingTimeAccountLayoutService);

	TimekeepingEmployeeWorkingTimeAccountLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService', 'timekeepingEmployeeTranslationService', 'timekeepingEmployeeConstantValues'];

	function TimekeepingEmployeeWorkingTimeAccountLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeTranslationService, timekeepingEmployeeConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getWorkingTimeAccountVLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.workingTimeAccountV,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);
