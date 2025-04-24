/**
 * Created by leo on 14.03.2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.calendar';

	/**
	 * @ngdoc service
	 * @name projectCalendarValidationService
	 * @description provides validation methods for project calendar entities
	 */
	angular.module(moduleName).service('projectCalendarCalendarValidationService', ProjectCalendarValidationService);

	ProjectCalendarValidationService.$inject = ['platformValidationServiceFactory', 'projectCalendarCalendarDataService', 'projectCalendarConstantValues'];

	function ProjectCalendarValidationService(platformValidationServiceFactory, projectCalendarCalendarDataService, projectCalendarConstantValues) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectCalendarConstantValues.schemes.calendar, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectCalendarConstantValues.schemes.calendar),
			uniques: ['CalendarFk']
		},
		self,
		projectCalendarCalendarDataService);
	}
})(angular);
