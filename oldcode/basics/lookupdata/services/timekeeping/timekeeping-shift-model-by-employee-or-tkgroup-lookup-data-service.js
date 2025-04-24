/**
 * Created by leo on 07.05.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingShiftByEmployeeOrTkGroupLookupDataService
	 * @function
	 *
	 * @description
	 * timekeepingShiftModelLookupDataService is the data service for all shift models by employee or timekeeping group
	 */
	angular.module('basics.lookupdata').factory('timekeepingShiftByEmployeeOrTkGroupLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingShiftByEmployeeOrTkGroupLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Calendar',
						field: 'CalendarFk',
						name: 'Calendar',
						width: 300,
						name$tr$: 'cloud.common.entityCalCalendarFk',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'schedulingLookupCalendarDataService',
							cacheEnable: true,
							additionalColumns: false
						}).grid.formatterOptions
					}
				],
				uuid: '18db8ffbb9074978ba4496a5b0a4bfae'
			});
			let readData = {PKey1: null, PKey2: null,PKey3: null};

			let shiftModelLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/shiftmodel/',
					endPointRead: 'listbyemployeeortkgroup'
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(entity) {
					if (entity.TimekeepingGroupFk) {
						readData.PKey2 = entity.TimekeepingGroupFk;
						readData.PKey1 = null;
						readData.PKey3 = entity.ShiftFk;
					} else if (entity.EmployeeFk) {
						readData.PKey1 = entity.EmployeeFk;
						readData.PKey2 = null;
						readData.PKey3 = entity.ShiftFk;
					}
					return readData;
				}
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(shiftModelLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id) {
				return serviceContainer.service.getItemById(id, serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);
