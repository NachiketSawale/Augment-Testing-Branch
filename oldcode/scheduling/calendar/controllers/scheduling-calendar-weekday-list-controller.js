/**
 * Created by leo on 16.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.calendar';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarWeekdayListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of weekday entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('schedulingCalendarWeekdayListController', SchedulingCalendarWeekdayListController);

	SchedulingCalendarWeekdayListController.$inject = ['$scope', 'platformModalService', 'platformContainerControllerService', 'schedulingCalendarWeekdayValidationService'];
	function SchedulingCalendarWeekdayListController($scope, platformModalService, platformContainerControllerService, schedulingCalendarWeekdayValidationService) {
		platformContainerControllerService.initController($scope, moduleName, '4196114C284B49EFAC5B4431BF9836B2');

		$scope.validateSorting = function(entity, newVal){
			var valid = schedulingCalendarWeekdayValidationService.validateSorting(entity, newVal);
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
})();