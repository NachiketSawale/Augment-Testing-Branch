(function (angular) {

	'use strict';
	var schedulingCalendarModule = angular.module('scheduling.calendar');

	/**
	 * @ngdoc service
	 * @name schedulingCalendarContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	schedulingCalendarModule.factory('schedulingCalendarContainerInformationService', ['$injector', 'basicsLookupdataLookupFilterService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector, basicsLookupdataLookupFilterService) {

			var service = {};

			/* jshint -W074 */ // There is no complexity, try harder J.S.Hint
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case 'AFECDB4A08404395855258B70652D04B': // schedulingCalendarListController
						config.layout = $injector.get('schedulingCalendarUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingCalendarUIStandardService';
						config.dataServiceName = 'schedulingCalendarMainService';
						config.validationServiceName = 'schedulingCalendarValidationService';
						config.listConfig = { initCalled: false, columns: []};
						break;
					case '506FC12756F8439E8FECB7EE4B360538': // schedulingCalendarDetailController
						config.layout = $injector.get('schedulingCalendarUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingCalendarUIStandardService';
						config.dataServiceName = 'schedulingCalendarMainService';
						config.validationServiceName = 'schedulingCalendarValidationService';
						break;
					case '3159C0A0C6D34287BF80FA1398F879EC': // schedulingCalendarExceptionDayListController
						config.layout = $injector.get('schedulingCalendarExceptionDayConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingCalendarExceptionDayConfigurationService';
						config.dataServiceName = 'schedulingCalendarExceptionDayService';
						config.validationServiceName = 'schedulingCalendarExceptionDayValidationService';
						config.listConfig = { initCalled: false, columns: []
							/* ,
							 cellChangeCallBack: function cellChangeCallBack(arg) {
							 var cols = arg.grid.getColumns();
							 var item = arg.grid.getDataItem(arg.row);
							 var valid;
							 var modalOptions = {
							 headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
							 bodyTextKey: 'scheduling.calendar.isTimeValid',
							 iconClass: 'ico-info'
							 };
							 if (cols[arg.cell].field === 'WorkStart' && item.WorkEnd !== null) {
							 valid = schedulingCalendarExceptionDayValidationService.validateStartTime(item, item.WorkStart);
							 } else if (cols[arg.cell].field === 'WorkEnd' && item.WorkStart !== null) {
							 valid = schedulingCalendarExceptionDayValidationService.validateEndTime(item, item.WorkEnd);
							 } else if (cols[arg.cell].field === 'ExceptDate') {
							 valid = schedulingCalendarExceptionDayValidationService.validateExceptDate(item);
							 modalOptions = {
							 headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
							 bodyTextKey: 'scheduling.calendar.isExceptDateUnique',
							 iconClass: 'ico-info'
							 };
							 }
							 if(!valid){
							 platformModalService.showDialog(modalOptions).then(function () {
							 arg.grid.gotoCell(arg.row, arg.cell);
							 });

							 }
							 } */
						};
						break;
					case '3978757E36BC49CBA7E8A177272F2BFC': // schedulingCalendarExceptionDayDetailController
						config.layout = $injector.get('schedulingCalendarExceptionDayConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingCalendarExceptionDayConfigurationService';
						config.dataServiceName = 'schedulingCalendarExceptionDayService';
						config.validationServiceName = 'schedulingCalendarExceptionDayValidationService';
						break;
					case '4196114C284B49EFAC5B4431BF9836B2': // schedulingCalendarWeekdayListController
						config.layout = $injector.get('schedulingCalendarWeekdayConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingCalendarWeekdayConfigurationService';
						config.dataServiceName = 'schedulingCalendarWeekdayService';
						config.validationServiceName = 'schedulingCalendarWeekdayValidationService';
						config.listConfig = { initCalled: false, columns: [], sortOptions: {initialSortColumn: {field: 'Sorting', id: 'sorting' }, isAsc: true }};
						break;
					case '4196114C284B49EFAC5B4431BF9836B4': // schedulingCalendarWeekdayDetailController
						config.layout = $injector.get('schedulingCalendarWeekdayConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingCalendarWeekdayConfigurationService';
						config.dataServiceName = 'schedulingCalendarWeekdayService';
						config.validationServiceName = 'schedulingCalendarWeekdayValidationService';
						break;
					case 'F043FAF3C3C6493181364128E3D0CD1E': // schedulingCalendarWorkdayListController
						config.layout = $injector.get('schedulingCalendarWorkdayConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingCalendarWorkdayConfigurationService';
						config.dataServiceName = 'schedulingCalendarWorkdayService';
						config.validationServiceName = 'schedulingCalendarWorkdayValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '55aa41e9e09fb8a27cd4a06d2693dc': // schedulingCalendarWorkdayDetailController
						config.layout = $injector.get('schedulingCalendarWorkdayConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingCalendarWorkdayConfigurationService';
						config.dataServiceName = 'schedulingCalendarWorkdayService';
						config.validationServiceName = 'schedulingCalendarWorkdayValidationService';
						break;
					case '7879E6D0D6BA45F3A6EF14D548EA77FC': // schedulingCalendarWorkhourListController
						config.layout = $injector.get('schedulingCalendarWorkhourConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingCalendarWorkhourConfigurationService';
						config.dataServiceName = 'schedulingCalendarWorkHourService';
						config.validationServiceName = 'schedulingCalendarWorkhourValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '0bd8d989568749cb8eb8680850526faa': // schedulingCalendarWorkhourDetailController
						config.layout = $injector.get('schedulingCalendarWorkhourConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingCalendarWorkhourConfigurationService';
						config.dataServiceName = 'schedulingCalendarWorkHourService';
						config.validationServiceName = 'schedulingCalendarWorkhourValidationService';
						break;
				}

				return config;
			};

			var filters = [
				{
					key: 'scheduling-calendar-unit-hour-filter',
					fn: function (unit, calendar) {
						return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === calendar.BasUomHourFk;
					}
				},
				{
					key: 'scheduling-calendar-unit-day-filter',
					fn: function (unit, calendar) {
						return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === calendar.BasUomDayFk;
					}
				},
				{
					key: 'scheduling-calendar-unit-work-day-filter',
					fn: function (unit, calendar) {
						return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === calendar.BasUomWorkDayFk;
					}
				},
				{
					key: 'scheduling-calendar-unit-week-filter',
					fn: function (unit, calendar) {
						return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === calendar.BasUomWeekFk;
					}
				},
				{
					key: 'scheduling-calendar-unit-month-filter',
					fn: function (unit, calendar) {
						return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === calendar.BasUomMonthFk;
					}
				},
				{
					key: 'scheduling-calendar-unit-year-filter',
					fn: function (unit, calendar) {
						return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === calendar.BasUomYearFk;
					}
				},
				{
					key: 'scheduling-calendar-unit-minute-filter',
					fn: function (unit, calendar) {
						return (unit.UomTypeFk >= 2 && unit.UomTypeFk <= 7) || unit.Id === calendar.BasUomMinuteFk;
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			return service;
		}
	]);
})(angular);
