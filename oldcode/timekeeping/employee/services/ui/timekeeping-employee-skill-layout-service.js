/**
 * Created by baf on 28.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeSkillLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping employee skill entity.
	 **/
	angular.module(moduleName).service('timekeepingEmployeeSkillLayoutService', TimekeepingEmployeeSkillLayoutService);

	TimekeepingEmployeeSkillLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeSkillLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getSkillLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.skill,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);