/**
 * Created by leo on 19.01.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarWorkhourDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Workhour entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingCalendarWorkhourDetailController', SchedulingCalendarWorkhourDetailController);

	SchedulingCalendarWorkhourDetailController.$inject = ['$scope', 'platformContainerControllerService', 'platformModalService', 'schedulingCalendarWorkhourValidationService'];

	function SchedulingCalendarWorkhourDetailController($scope, platformContainerControllerService, platformModalService, schedulingCalendarWorkhourValidationService) {
		platformContainerControllerService.initController($scope, moduleName, '0bd8d989568749cb8eb8680850526faa', 'schedulingCalendarTranslationService');

		$scope.validateEndTime = function(entity, newVal){
			var valid = schedulingCalendarWorkhourValidationService.validateEndTime(entity, newVal);
			if(!valid){
				var modalOptions = {
					headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
					bodyTextKey: 'scheduling.calendar.isTimeValid',
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
			return valid;
		};
		$scope.validateStartTime = function(entity, newVal){
			var valid = schedulingCalendarWorkhourValidationService.validateStartTime(entity, newVal);
			if(!valid){
				var modalOptions = {
					headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
					bodyTextKey: 'scheduling.calendar.isTimeValid',
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
			return valid;
		};
	}
})(angular);