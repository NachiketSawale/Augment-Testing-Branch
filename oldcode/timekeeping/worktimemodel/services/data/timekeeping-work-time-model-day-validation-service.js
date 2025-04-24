/**
 * Created by shen on 6/16/2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'timekeeping.worktimemodel';

	/**
	 * @ngdoc service
	 * @name timekeepingWorkTimeModelDayValidationService
	 * @description provides validation methods for timekeeping work timeModelDay entities
	 */
	angular.module(moduleName).service('timekeepingWorkTimeModelDayValidationService', TimekeepingWorkTimeModelDayValidationService);

	TimekeepingWorkTimeModelDayValidationService.$inject = ['platformValidationServiceFactory', 'timekeepingWorkTimeModelDayDataService'];

	function TimekeepingWorkTimeModelDayValidationService(platformValidationServiceFactory, timekeepingWorkTimeModelDayDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface({ typeName: 'WorkTimeModelDayDto', moduleSubModule: 'Timekeeping.WorkTimeModel'}, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties({ typeName: 'WorkTimeModelDayDto', moduleSubModule: 'Timekeeping.WorkTimeModel'})
		},
		self,
		timekeepingWorkTimeModelDayDataService);
	}
})(angular);
