/**
 * Created by Frank on 19.05.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupBaselineSpecificationDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupBaselineSpecificationDataService is the data service for schedule baseline look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupBaselineSpecificationDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectLookupGroupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'b24d9b7e49e8456b99dd87a9789a1e52'
			});

			var schedulingCalendarLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/baselinespec/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			var baselineSpecService = platformLookupDataServiceFactory.createInstance(schedulingCalendarLookupDataServiceConfig).service;

			baselineSpecService.getBaselineSpecs = function getBaselineSpecs() {
				return baselineSpecService.getList({ lookupType: 'basics/customize/baselinespec/', usePostForRead: true });
			};

			return baselineSpecService;
		}]);
})(angular);
