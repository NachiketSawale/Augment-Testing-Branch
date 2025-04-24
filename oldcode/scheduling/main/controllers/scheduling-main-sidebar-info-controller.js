/*
 * initialize content for sidebar-information in project-modul.
 */
(function () {
	'use strict';

	function schedulingMainInfoController($scope, schedulingMainInfoConfigItems, cloudDesktopSidebarInfoControllerService, schedulingMainService, $injector, schedulingLookupScheduleTypeDataService, schedulingSchedulePresentService) {

		var dataConfig = [
			{
				dataService: schedulingMainService,
				selectedItem: 'schedulingMainCommonItem' // model in config-items
			}
		];

		$scope.config = schedulingMainInfoConfigItems;

		$scope.getFirstHeader = function () {
			if ($scope.schedulingMainCommonItem) {
				return $scope.schedulingMainCommonItem.Code + ' - ' + $scope.schedulingMainCommonItem.Description;
			}
		};

		// Scheduling Type
		$scope.$watchGroup(['schedulingMainCommonItem', 'schedulingMainCommonItem.ScheduleFk'], function () {
			if ($scope.schedulingMainCommonItem) {
				schedulingSchedulePresentService.loadSchedule($scope.schedulingMainCommonItem.ScheduleFk).then(function () {
					var selectedschedule = schedulingSchedulePresentService.getItemById($scope.schedulingMainCommonItem.ScheduleFk);

					if (selectedschedule) {
						var lookupOptions = {
							dataServiceName: 'schedulingLookupScheduleTypeDataService',
							displayMember: 'DescriptionInfo.Translated',
							lookupModuleQualifier: 'schedulingLookupScheduleTypeDataService',
							lookupType: 'schedulingLookupScheduleTypeDataService',
							showClearButton: true,
							valueMember: 'Id'
						};

						var dataService = $injector.get('schedulingLookupScheduleTypeDataService');
						var schedulingTypeData = dataService.getItemById(selectedschedule.ScheduleTypeFk, lookupOptions);
						if ($scope.schedulingMainCommonItem && schedulingTypeData) {
							$scope.schedulingMainCommonItem.schedulingType = schedulingTypeData.DescriptionInfo.Description;
						}
					}
				});
			}
		});

		// Calendar
		$scope.$watchGroup(['schedulingMainCommonItem', 'schedulingMainCommonItem.ScheduleFk'], function () {

			if ($scope.schedulingMainCommonItem) {
				schedulingSchedulePresentService.loadSchedule($scope.schedulingMainCommonItem.ScheduleFk).then(function () {
					var selectedschedule = schedulingSchedulePresentService.getItemById($scope.schedulingMainCommonItem.ScheduleFk);
					if (selectedschedule) {
						var lookupOptions = {
							dataServiceName: 'schedulingLookupCalendarDataService',
							displayMember: 'Code',
							lookupModuleQualifier: 'schedulingLookupCalendarDataService',
							lookupType: 'schedulingLookupCalendarDataService',
							showClearButton: true,
							valueMember: 'Id'
						};

						// --> dataService: get service
						// --> 'schedulingMainCommonItem' --> lineItem
						var dataService = $injector.get('schedulingLookupCalendarDataService');
						var schedulingCalendarData = dataService.getItemById(selectedschedule.CalendarFk, lookupOptions);
						if ($scope.schedulingMainCommonItem && schedulingCalendarData) {
							$scope.schedulingMainCommonItem.schedulingCalendar = schedulingCalendarData.Code;
						}
					}

				});

			}
		});

		// call service for sidebar-information
		cloudDesktopSidebarInfoControllerService.init($scope, dataConfig);
	}

	angular.module('scheduling.main').controller('schedulingMainInfoController', ['$scope', 'schedulingMainInfoConfigItems', 'cloudDesktopSidebarInfoControllerService', 'schedulingMainService', '$injector', 'schedulingLookupScheduleTypeDataService',
		'schedulingSchedulePresentService', schedulingMainInfoController])
		.value('schedulingMainInfoConfigItems', [
			{
				panelType: 'text',
				header: 'getFirstHeader()',
				model: 'schedulingMainCommonItem',
				items: [
					{
						model: 'schedulingType',
						description: '"Schedule Type"',
						description$tr$: 'scheduling.schedule.entityPsdScheduleTypeFk'
					},
					{
						model: 'schedulingCalendar',
						description: '"Calendar(FI)"',
						description$tr$: 'cloud.common.entityCalCalendarFk'
					},
					{
						model: 'PlannedStart',
						iconClass: 'tlb-icons ico-date',
						description: '"First Start"',
						description$tr$: 'scheduling.main.plannedStart',
						domain: 'date'
					},
					{
						model: 'PlannedFinish',
						iconClass: 'tlb-icons ico-date',
						description$tr$: 'scheduling.main.plannedFinish',
						description: '"Last End"',
						domain: 'date'
					}
				]
			}
		]);
})();
