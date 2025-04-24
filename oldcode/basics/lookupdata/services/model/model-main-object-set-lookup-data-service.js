/**
 * Created by Roberson Luo on 15.03.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelMainObjectSetLookupDataService
	 * @function
	 * @description
	 *
	 * data service for model main object lookup.
	 */
	angular.module('basics.lookupdata').factory('modelMainObjectSetLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('modelMainObjectSetLookupDataService', {
				valMember: 'Id',
				dispMember: 'Name',
				columns: [
					{
						id: 'Name',
						field: 'Name',
						name: 'Name',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityName'
					}
				],
				uuid: '249c03d875e94a1b9a67ba0ab3eb7deb'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'model/main/objectset/', endPointRead: 'list'},
				filterParam: 'mainItemId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
