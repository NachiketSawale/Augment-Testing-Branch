/**
 * Created by Frank and Benjamin on 26.02.2015. Updated by Janas 02.03.2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsMasterDataRubricCategoryLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsMasterDataRubricCategoryLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'df56f089bab64579b57df7d9e415cdc5'
			});

			var basicsMasterDataRubricCategoryLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/masterdata/rubriccategory/', endPointRead: 'list'},
				filterParam: 'rubricId'
			};

			var container = platformLookupDataServiceFactory.createInstance(basicsMasterDataRubricCategoryLookupDataServiceConfig);

			return container.service;
		}]);
})(angular);
