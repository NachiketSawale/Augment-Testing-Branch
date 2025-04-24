/**
 * Created by bh on 08.05.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupCalendarDataService
	 * @function
	 *
	 * @description
	 * basicsLookupMaterialCatalogDataService is the data service for material catalog look ups
	 */
	angular.module('basics.lookupdata').factory('basicsLookupMaterialCatalogDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsLookupMaterialCatalogDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						width: 100
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						width: 150
					}
				],
				uuid: '6dfe3f5cd8d34e3b9cc45f234b724751'
			});

			var basicsLookupMaterialCatalogDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/materialcatalog/catalog/', endPointRead: 'listbytype'},
				filterParam: 'materialCatalogTypeFk'
			};

			return platformLookupDataServiceFactory.createInstance(basicsLookupMaterialCatalogDataServiceConfig).service;
		}]);
})(angular);
