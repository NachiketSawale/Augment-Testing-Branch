/**
 * Created by postic on 05.08.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc service
	 * @name projectCalendarExceptionDayValidationService
	 * @description provides validation methods for project calendar exception day entities
	 */
	angular.module(moduleName).service('projectCalendarExceptionDayValidationService', ProjectCalendarExceptionDayValidationService);

	ProjectCalendarExceptionDayValidationService.$inject = ['platformValidationServiceFactory', 'projectCalendarConstantValues', 'projectCalendarExceptionDayDataService'];

	function ProjectCalendarExceptionDayValidationService(platformValidationServiceFactory, projectCalendarConstantValues, projectCalendarExceptionDayDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectCalendarConstantValues.schemes.exceptionday, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectCalendarConstantValues.schemes.exceptionday)
		},
		self,
		projectCalendarExceptionDayDataService);
	}
})(angular);