/**
 * Created by henkel on 20.09.2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsRubricCategoryLookupDataService
	 * @function
	 *
	 * @description
	 * basicsRubricCategoryLookupDataService is the data service providing data for RubricCategory look ups
	 */
	angular.module('basics.company').factory('basicsRubricCategoryLookupDataService', ['$injector', 'globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($injector, globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsRubricCategoryLookupDataService', {

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
				uuid: '518bef5fe3c44ca3b3424b527559d8c3'
			});

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/rubriccategoryindex/', endPointRead: 'listById' },
				filterParam: 'mainItemId'
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
