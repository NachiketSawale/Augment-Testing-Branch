/**
 * Created by baf on 21.03.2018
 */

(function (angular) {
	'use strict';
	let moduleName = 'scheduling.schedule';

	/**
	 * @ngdoc service
	 * @name schedulingScheduleClerkValidationService
	 * @description provides validation methods for scheduling schedule clerk entities
	 */
	angular.module(moduleName).service('schedulingScheduleClerkValidationService', SchedulingScheduleClerkValidationService);

	SchedulingScheduleClerkValidationService.$inject = ['platformValidationServiceFactory', 'schedulingScheduleClerkDataService'];

	function SchedulingScheduleClerkValidationService(platformValidationServiceFactory, schedulingScheduleClerkDataService) {
		let self = this;
		let schemeInfo = {typeName: 'Schedule2ClerkDto', moduleSubModule: 'Scheduling.Schedule'};

		platformValidationServiceFactory.addValidationServiceInterface(schemeInfo, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(schemeInfo)
		},
		self,
		schedulingScheduleClerkDataService);
	}

})(angular);
