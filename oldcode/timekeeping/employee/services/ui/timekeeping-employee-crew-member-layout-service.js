/**
 * Created by baf on 20.08.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeCrewMemberLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping employee crewMember entity.
	 **/
	angular.module(moduleName).service('timekeepingEmployeeCrewMemberLayoutService', TimekeepingEmployeeCrewMemberLayoutService);

	TimekeepingEmployeeCrewMemberLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeCrewMemberLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getCrewMemberLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.crewMember,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);