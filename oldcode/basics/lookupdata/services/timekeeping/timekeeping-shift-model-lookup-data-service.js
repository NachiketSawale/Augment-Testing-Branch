/**
 * Created by leo on 07.05.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingShiftModelLookupDataService
	 * @function
	 *
	 * @description
	 * timekeepingShiftModelLookupDataService is the data service for all shift models
	 */
	angular.module('basics.lookupdata').factory('timekeepingShiftModelLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingShiftModelLookupDataService', {
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
				uuid: 'bd4aeb8a423c411bb3fc6f4cae2ad5ba'
			});

			let shiftModelLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/shiftmodel/',
					endPointRead: 'list'
				}
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(shiftModelLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id) {
				return serviceContainer.service.getItemById(id, serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);
