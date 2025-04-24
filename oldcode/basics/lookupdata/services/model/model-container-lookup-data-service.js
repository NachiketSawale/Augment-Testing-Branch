/**
 * Created by leo on 24.11.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelLookupDataService
	 * @function
	 *
	 * @description
	 * modelLookupDataService is the data service for activity look ups
	 */
	angular.module('basics.lookupdata').factory('modelMainContainerLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {


			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('modelMainContainerLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '904ebab31f9b4432898ae9bb33db9287'
			});

			var modelMainContainerLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'model/main/container/', endPointRead: 'list' },
				filterParam: 'mainItemId'
			};

			return platformLookupDataServiceFactory.createInstance(modelMainContainerLookupDataServiceConfig).service;
		}]);
})(angular);
