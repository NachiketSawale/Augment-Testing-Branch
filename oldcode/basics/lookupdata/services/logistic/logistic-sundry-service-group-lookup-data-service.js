/**
 * Created by baf on 2016/06/13.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceGroupLookupDataService
	 * @function
	 *
	 * @description
	 * logisticSundryServiceGroupLookupDataService is the data service for all Address Format
	 */
	angular.module('basics.lookupdata').factory('logisticSundryServiceGroupLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticSundryServiceGroupLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				showIcon: true,
				imageSelectorService: 'logisticSundryServiceGroupIconService',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 300,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 250,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '7425ffe5fee34c25b411e798cafa6107'
			});

			var logisticSundryServiceGroupLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'logistic/sundrygroup/', endPointRead: 'searchlist' },
				filterParam: readData,
				prepareFilter: function prepareFilter() {
					return readData;
				},
				tree: {
					parentProp: 'SundryServiceGroupFk',
					childProp: 'SubGroups'
				}
			};

			return platformLookupDataServiceFactory.createInstance(logisticSundryServiceGroupLookupDataServiceConfig).service;
		}]);
})(angular);
