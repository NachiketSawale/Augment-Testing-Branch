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
	angular.module('basics.lookupdata').factory('modelProjectModelLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {


			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('modelProjectModelLookupDataService', {
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
				uuid: '7dc75d8975f94b92b1ad3f9c69036310'
			});

			var modelProjectModelLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'model/project/model/', endPointRead: 'listAllFilteredHeaders' },
				filterParam: 'mainItemId',
				prepareFilter: function prepareFilter(Id) {
					if (Id === null || Id === undefined)
					{
						Id = 1;
					}
					return '?mainItemId=' + Id +'&includeComposite=true';
				}
			};

			return platformLookupDataServiceFactory.createInstance(modelProjectModelLookupDataServiceConfig).service;
		}]);
})(angular);
