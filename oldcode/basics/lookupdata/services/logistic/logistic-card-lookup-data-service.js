/**
 * Created by welss on 07.05.2019.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticCardLookupDataService
	 * @function
	 * @description
	 *
	 * data service for logistic card lookup.
	 */
	angular.module('basics.lookupdata').factory('logisticCardLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			// info for PKeys: Id = JobCardFk, PKey1 = JobFk, PKey2 = Dispatch_HeaderFk, PKey3 = JobCardStatusFk
			var readData = {Id: null, PKey1: null, PKey2: null, PKey3: null};
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticCardLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: '100',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '519e10079809486abd0817f9ffefb717'
			});

			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'logistic/card/card/',
					endPointRead: 'searchlist',
					usePostForRead: true
				},
				filterParam: readData,
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
