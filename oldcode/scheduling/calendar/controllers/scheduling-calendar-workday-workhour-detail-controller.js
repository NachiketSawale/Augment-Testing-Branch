/**
 * Created by leo on 19.01.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarWORkdayDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of weekday entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingCalendarWorkdayWorkhourDetailController', ['$scope', 'schedulingCalendarWorkdayService', 'platformDetailControllerService', 'schedulingCalendarWorkdayValidationService', 'schedulingCalendarWorkdayConfigurationService', 'schedulingCalendarTranslationService', 'schedulingCalendarWorkHourService', 'schedulingCalendarWorkhourConfigurationService', 'schedulingCalendarWorkhourValidationService', 'schedulingCalendarMainService', 'schedulingCalendarValidationService',
		function ($scope, schedulingCalendarWorkdayService, platformDetailControllerService, schedulingCalendarWorkdayValidationService, schedulingCalendarWorkdayConfigurationService, schedulingCalendarTranslationService, schedulingCalendarWorkHourService, schedulingCalendarWorkhourConfigurationService, schedulingCalendarWorkhourValidationService, schedulingCalendarMainService, schedulingCalendarValidationService) {

			var defineGrid = function() {
				var selectItem = schedulingCalendarMainService.getSelected();
				if (schedulingCalendarMainService.isSelection(selectItem) && schedulingCalendarMainService.getSelected().WorkHourDefinesWorkDay) {
					$scope.workHour = true;
					$scope.workDay = false;
				} else {
					$scope.workHour = false;
					$scope.workDay = true;
				}
			};

			defineGrid();
			var defineGridValue = function(value) {
				if (value) {
					$scope.workHour = true;
					$scope.workDay = false;
					$scope.gridId = '7879E6D0D6BA45F3A6EF14D548EA77FC';
				} else {
					$scope.workHour = false;
					$scope.workDay = true;
					$scope.gridId = 'F043FAF3C3C6493181364128E3D0CD1E';
				}
			};
			schedulingCalendarMainService.registerSelectionChanged(defineGridValue);

			schedulingCalendarValidationService.changedWorkhourDefinesWorkday.register(defineGridValue);
			$scope.$on('$destroy', function () {
				schedulingCalendarValidationService.changedWorkhourDefinesWorkday.unregister(defineGridValue);
			});
		}
	]);
})(angular);