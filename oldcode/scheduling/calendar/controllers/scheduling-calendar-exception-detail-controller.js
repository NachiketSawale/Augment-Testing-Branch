/**
 * Created by leo on 19.01.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarExceptionDayDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of exception day entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingCalendarExceptionDayDetailController', SchedulingCalendarExceptionDayDetailController);

	SchedulingCalendarExceptionDayDetailController.$inject = ['$scope', 'platformContainerControllerService', 'platformModalService', 'schedulingCalendarExceptionDayValidationService'];

	function SchedulingCalendarExceptionDayDetailController($scope, platformContainerControllerService, platformModalService , schedulingCalendarExceptionDayValidationService) {
		platformContainerControllerService.initController($scope, moduleName, '3978757E36BC49CBA7E8A177272F2BFC', 'schedulingCalendarTranslationService');

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
})(angular);