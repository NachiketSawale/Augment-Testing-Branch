/**
 * Created by postic on 05.08.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc service
	 * @name projectCalendarExceptionDayLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of project calendar exception day entity.
	 **/
	angular.module(moduleName).service('projectCalendarExceptionDayLayoutService', ProjectCalendarExceptionDayLayoutService);

	ProjectCalendarExceptionDayLayoutService.$inject = ['platformUIConfigInitService', 'projectCalendarContainerInformationService', 'projectCalendarConstantValues', 'projectCalendarTranslationService'];

	function ProjectCalendarExceptionDayLayoutService(platformUIConfigInitService, projectCalendarContainerInformationService, projectCalendarConstantValues, projectCalendarTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: projectCalendarContainerInformationService.getExceptionDayLayout(),
			dtoSchemeId: projectCalendarConstantValues.schemes.exceptionday,
			translator: projectCalendarTranslationService
		});
	}
})(angular);