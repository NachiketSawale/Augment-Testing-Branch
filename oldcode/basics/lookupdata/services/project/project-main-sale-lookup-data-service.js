/**
 * Created by Frank on 28.06.2021.
 */
(function (angular) {
	/* gloval globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectSaleLookupDataService
	 * @function
	 *
	 * @description
	 * projectSaleLookupDataService is the data service for all project sale lookups
	 */
	angular.module('basics.lookupdata').factory('projectSaleLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectSaleLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
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
				uuid:'f7d2b2184b754eecae7d33d36d9994c5'
			});

			var projectSalesLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/sale/', endPointRead: 'list' },
				filterParam: 'projectId'
			};

			return platformLookupDataServiceFactory.createInstance(projectSalesLookupDataServiceConfig).service;
		}]);
})(angular);
