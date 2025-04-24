(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsMasterDataRubricCategoryRubricLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsMasterDataRubricCategoryRubricLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Rubric Category Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityRubricCategoryDescription'
					},
					{
						id: 'Description2',
						field: 'Rubric.Description',
						name: 'Rubric Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityRubricDescription'
					}
				],
				uuid: '240c77b6495342d78d7d8a3be3c21bdb'
			});

			var basicsMasterDataRubricCategoryLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/masterdata/rubriccategory/', endPointRead: 'listRubric'},
			};

			var container = platformLookupDataServiceFactory.createInstance(basicsMasterDataRubricCategoryLookupDataServiceConfig);

			return container.service;
		}]);
})(angular);
