
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceCatalogDetailLookupDataService
	 * @function
	 *
	 * @description
	 * resourceCatalogDetailLookupDataService is the data service for all controlling catalog detail related functionality.
	 */
	angular.module('object.project').factory('resourceCatalogDetailLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			var readData =  { PKey1: -1 };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceCatalogDetailLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.code'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '7b4441bfbab84282966d379ad3e92b18'
			});



			var resourceCatalogDetailLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'resource/catalog/record/', endPointRead: 'listbyparent', usePostForRead: true},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData = {PKey1: item.CatalogFk};
					return readData;
				}

			};

			return platformLookupDataServiceFactory.createInstance(resourceCatalogDetailLookupDataServiceConfig).service;
		}]);
})(angular);
