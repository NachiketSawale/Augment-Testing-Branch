/**
 * Created by leo on 18.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarExceptiondayListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of exceptionday entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingCalendarExceptionDayListController', SchedulingCalendarExceptionDayListController);

	SchedulingCalendarExceptionDayListController.$inject = ['$scope','platformContainerControllerService', 'platformModalService', 'schedulingCalendarExceptionDayValidationService'];
	function SchedulingCalendarExceptionDayListController($scope, platformContainerControllerService, platformModalService, schedulingCalendarExceptionDayValidationService) {
		platformContainerControllerService.initController($scope, moduleName, '3159C0A0C6D34287BF80FA1398F879EC');

		$scope.validateEndTime = function(entity, newVal){
			var valid = schedulingCalendarExceptionDayValidationService.validateEndTime(entity, newVal);
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
			var valid = schedulingCalendarExceptionDayValidationService.validateStartTime(entity, newVal);
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
		$scope.validateExceptDate = function(entity, newVal){
			var valid = schedulingCalendarExceptionDayValidationService.validateExceptDate(entity, newVal);
			var modalOptionDate = {
				headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
				bodyTextKey: 'scheduling.calendar.isExceptDateUnique',
				iconClass: 'ico-info'
			};
			if(!valid){
				platformModalService.showDialog(modalOptionDate);
			}
			return valid;
		};
	}
})();