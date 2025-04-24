/**
 * Created by Frank on 25.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupScheduleTypeDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupScheduleTypeDataService is the data service for schedule type look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupScheduleTypeDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingLookupScheduleTypeDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 200,
						name$tr$: 'cloud.common.descriptionInfo'
					}
				],
				uuid: 'ee9f50d284b64120b367df5d094d0eb0'
			});

			var schedulingCalendarLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/scheduletype/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					readData.customIntegerProperty = 'BAS_SCHEDULING_CONTEXT_FK';
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(schedulingCalendarLookupDataServiceConfig).service;
		}]);
})(angular);
