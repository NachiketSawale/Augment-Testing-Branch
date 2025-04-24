(function (angular) {

	'use strict';

	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarWeekdayDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Weekday entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingCalendarWeekdayDetailController', SchedulingCalendarWeekdayDetailController);

	SchedulingCalendarWeekdayDetailController.$inject = ['$scope','platformModalService', 'platformContainerControllerService', 'schedulingCalendarWeekdayValidationService'];

	function SchedulingCalendarWeekdayDetailController($scope, platformModalService, platformContainerControllerService, schedulingCalendarWeekdayValidationService) {
		platformContainerControllerService.initController($scope, moduleName, '4196114C284B49EFAC5B4431BF9836B4', 'schedulingCalendarTranslationService');

		$scope.validateSorting = function(entity, newVal, model){
			var valid = schedulingCalendarWeekdayValidationService.validateSorting(entity, newVal, model);
			if(!valid){
				var modalOptions = {
					headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
					bodyTextKey: 'scheduling.calendar.sortingValue',
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
			return valid;
		};
		$scope.validateAcronym = function(entity, newVal, model){
			var valid = schedulingCalendarWeekdayValidationService.validateAcronym(entity, newVal, model);
			if(!valid){
				var modalOptions = {
					headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
					bodyTextKey: 'scheduling.calendar.weekdayValue',
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
			return valid;
		};
	}
})(angular);