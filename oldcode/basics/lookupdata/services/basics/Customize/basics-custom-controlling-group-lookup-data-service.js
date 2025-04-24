/**
 * Created by Frank and Benjamin on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomControlingGroupLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomControlingGroupLookupDataService is the data service for all contract status
	 */
	angular.module('basics.lookupdata').factory('basicsCustomControlingGroupLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomControlingGroupLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				showIcon:true,
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						formatterOptions: {
							imageSelector: 'platformStatusIconService'
						},
						width: 50,
						name$tr$: 'cloud.common.entityIcon'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '44df4316ce384821900299242b119e1b'
			});

			var basicsCustomControlingGroupLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/mdccontrollinggroup/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomControlingGroupLookupDataServiceConfig).service;
		}]);
})(angular);
