/**
 * Created by leo on 18.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.calendar';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarWorkdayWorkhourListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of workday entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('schedulingCalendarWorkdayWorkhourListController',
		['$scope', '$timeout', 'schedulingCalendarWorkdayService', 'schedulingCalendarWorkdayConfigurationService', 'schedulingCalendarWorkdayValidationService', 'schedulingCalendarWorkHourService', 'schedulingCalendarWorkhourConfigurationService', 'schedulingCalendarWorkhourValidationService', 'platformGridControllerService', 'platformModalService', 'schedulingCalendarValidationService', 'schedulingCalendarMainService',
			function ($scope, $timeout, schedulingCalendarWorkdayService, schedulingCalendarWorkdayConfigurationService, schedulingCalendarWorkdayValidationService, schedulingCalendarWorkHourService, schedulingCalendarWorkhourConfigurationService, schedulingCalendarWorkhourValidationService, platformGridControllerService, platformModalService, schedulingCalendarValidationService, schedulingCalendarMainService) {

				var defineGrid = function () {
					var selectItem = schedulingCalendarMainService.getSelected();

					if (schedulingCalendarMainService.isSelection(selectItem) && selectItem.WorkHourDefinesWorkDay) {
						$scope.workHour = true;
						$scope.workDay = false;
						$scope.gridId = '7879E6D0D6BA45F3A6EF14D548EA77FC';
					} else {
						$scope.workHour = false;
						$scope.workDay = true;
						$scope.gridId = 'F043FAF3C3C6493181364128E3D0CD1E';
					}
				};

				var defineGridValue = function (value) {
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

				defineGrid();

				schedulingCalendarMainService.registerSelectionChanged(defineGrid);

				schedulingCalendarValidationService.changedWorkhourDefinesWorkday.register(defineGridValue);
				$scope.$on('$destroy', function () {
					schedulingCalendarValidationService.changedWorkhourDefinesWorkday.unregister(defineGridValue);
				});

			}
		]);
})();
