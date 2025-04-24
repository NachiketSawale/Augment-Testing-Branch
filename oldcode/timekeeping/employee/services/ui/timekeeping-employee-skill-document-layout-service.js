/**
 * Created by henkel
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeSkillDocumentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping employee skill document entity.
	 **/
	angular.module(moduleName).service('timekeepingEmployeeSkillDocumentLayoutService', TimekeepingEmployeeSkillDocumentLayoutService);

	TimekeepingEmployeeSkillDocumentLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingEmployeeContainerInformationService', 'timekeepingEmployeeConstantValues', 'timekeepingEmployeeTranslationService'];

	function TimekeepingEmployeeSkillDocumentLayoutService(platformUIConfigInitService, timekeepingEmployeeContainerInformationService, timekeepingEmployeeConstantValues, timekeepingEmployeeTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingEmployeeContainerInformationService.getSkillDocumentLayout(),
			dtoSchemeId: timekeepingEmployeeConstantValues.schemes.skillDocument,
			translator: timekeepingEmployeeTranslationService
		});
	}
})(angular);