/**
 * Created by leo on 02.05.2018.
 */
(function (angular) {
	'use strict';
	const mainModule = angular.module('timekeeping.shiftmodel');
	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	mainModule.service('timekeepingShiftmodelContainerInformationService', TimekeepingShiftModelContainerInformationService);

	TimekeepingShiftModelContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'timekeepingShiftModelConstantValues', 'timekeepingShiftModelDataService', 'platformContextService'];

	function TimekeepingShiftModelContainerInformationService(platformLayoutHelperService, basicsLookupdataConfigGenerator,
		timekeepingShiftModelConstantValues, timekeepingShiftModelDataService, platformContextService) {
		let self = this;
		let guids = timekeepingShiftModelConstantValues.uuid.container;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case guids.shiftList: // timekeepingShiftModelListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTimekeepingShiftModelServiceInfos(), self.getTimekeepingShiftModelLayout);
					break;
				case guids.shiftDetails: // timekeepingShiftModelDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTimekeepingShiftModelServiceInfos(), self.getTimekeepingShiftModelLayout);
					break;
				case guids.workingTimeList: // timekeepingShiftModelWorkingTimeListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getWorkingTimeServiceInfos(), self.getWorkingTimeLayout);
					break;
				case guids.workingTimeDetails: // timekeepingShiftModelWorkingTimeDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getWorkingTimeServiceInfos(), self.getWorkingTimeLayout);
					break;
				case guids.exceptionDayList: // timekeepingShiftModelExceptionDayListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getExceptionDayServiceInfos(), self.getExceptionDayLayout);
					break;
				case guids.exceptionDayDetails: // timekeepingShiftModelExceptionDayDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getExceptionDayServiceInfos(), self.getExceptionDayLayout);
					break;
				case guids.shift2GroupList: // timekeepingShiftModel2GroupListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getShift2GroupServiceInfos(), self.getShift2GroupLayout);
					break;
				case guids.shift2GroupDetails: // timekeepingShiftModel2GroupDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getShift2GroupServiceInfos(), self.getShift2GroupLayout);
					break;
				case guids.shiftBreakList: // timekeepingShiftModel2GroupListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getShiftBreakServiceInfos(), self.getShiftBreakLayout);
					break;
				case guids.shiftBreakDetails: // timekeepingShiftModel2GroupDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getShiftBreakServiceInfos(), self.getShiftBreakLayout);
					break;

			}
			return config;
		};

		this.getTimekeepingShiftModelServiceInfos = function getTimekeepingShiftModelServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingShiftModelLayoutService',
				dataServiceName: 'timekeepingShiftModelDataService',
				validationServiceName: 'timekeepingShiftModelValidationService'
			};
		};

		this.getTimekeepingShiftModelLayout = function getTimekeepingShiftModelLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.shiftmodel',
				['descriptioninfo', 'calendarfk', 'isdefault', 'sorting', 'defaultworkdayfk', 'shiftgroupfk']);

			res.overloads = platformLayoutHelperService.getOverloads(['calendarfk', 'defaultworkdayfk', 'shiftgroupfk'], self);

			return res;
		};

		this.getWorkingTimeServiceInfos = function getWorkingTimeServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingShiftModelWorkingTimeLayoutService',
				dataServiceName: 'timekeepingShiftModelWorkingTimeDataService',
				validationServiceName: 'timekeepingShiftModelWorkingTimeValidationService'
			};
		};

		this.getWorkingTimeLayout = function getWorkingTimeLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.shiftmodel.workingtime',
				['acronym', 'descriptioninfo', 'timesymbolfk', 'fromtime', 'totime', 'duration', 'weekdayfk', 'exceptiondayfk', 'commenttext', 'breakfrom', 'breakto']);

			res.overloads = platformLayoutHelperService.getOverloads(['timesymbolfk', 'weekdayfk', 'exceptiondayfk', 'breakfrom', 'breakto'], self);

			return res;
		};
		this.getExceptionDayServiceInfos = function getExceptionDayServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingShiftModelExceptionDayLayoutService',
				dataServiceName: 'timekeepingShiftModelExceptionDayDataService',
				validationServiceName: 'timekeepingShiftModelExceptionDayValidationService'
			};
		};

		this.getExceptionDayLayout = function getExceptionDayLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.shiftmodel.exceptionday',
				['descriptioninfo', 'commenttext', 'exceptdate', 'timesymbolfk', 'duration', 'isworkday', 'timesymworkonholidayfk']);

			res.overloads = platformLayoutHelperService.getOverloads(['timesymbolfk', 'timesymworkonholidayfk'], self);

			return res;
		};

		this.getShift2GroupServiceInfos = function getShift2GroupServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingShiftModel2GroupLayoutService',
				dataServiceName: 'timekeepingShiftModel2GroupDataService',
				validationServiceName: 'timekeepingShiftModel2GroupValidationService'
			};
		};

		this.getShift2GroupLayout = function getShift2GroupLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.shiftmodel.shift2group',
				['timekeepinggroupfk', 'commenttext']);

			res.overloads = platformLayoutHelperService.getOverloads(['timekeepinggroupfk'], self);

			return res;
		};


		this.getShiftBreakServiceInfos = function getShiftBreakServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingShiftModelBreakLayoutService',
				dataServiceName: 'timekeepingShiftModelBreakDataService',
				validationServiceName: 'timekeepingShiftModelBreakValidationService'
			};
		};

		this.getShiftBreakLayout = function getShiftBreakLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'timekeeping.shiftmodel.break',
				['breakstart', 'breakend','duration','isstartaftermidnight','isendaftermidnight']);

			res.overloads = platformLayoutHelperService.getOverloads([], self);

			return res;
		};



		this.getOverload = function getOverload(overload) {
			let ovl = null;

			if (overload === 'timesymbolfk' || overload === 'timesymworkonholidayfk') {
				ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'timekeepingTimeSymbolLookupDataService'
				});
			}
			if (overload === 'calendarfk') {
				ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'schedulingLookupCalendarDataService',
					enableCache: true
				});
			}
			if (overload === 'weekdayfk') {
				ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'schedulingLookupCalendarWeekdayDataService',
					filter: function (item) {
						let calendar;
						if (item) {
							calendar = timekeepingShiftModelDataService.getSelected().CalendarFk;
						}
						return calendar;
					}// ,
					// readonly: true
				});
			}

			if (overload === 'defaultworkdayfk') {
				ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'schedulingLookupCalendarWeekdayDataService',
					filter: function (item) {
						let calendar;
						if (item) {
							calendar = item.CalendarFk;
						}
						return calendar;
					}
				});
			}
			if (overload === 'shiftgroupfk') {
				ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.timekeepingshiftgroup');
			}

			if (overload === 'exceptiondayfk') {
				ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'schedulingLookupCalendarExceptionDayDataService',
					filter: function (item) {
						let calendar;
						if (item) {
							calendar = timekeepingShiftModelDataService.getSelected().CalendarFk;
						}
						return calendar;
					}// ,
					// readonly: true
				});
			}

			if (overload === 'timekeepinggroupfk') {
				ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsTimekeepingGroupLookupDataService',
					filter: function () {
						return platformContextService.clientId;
					}
				});
			}
			return ovl;
		};
	}
})(angular);
