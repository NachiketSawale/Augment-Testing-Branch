(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomTaxCodeMatrixLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomControllingUnitStatusLookupDataService for tax code matrix (customize)
	 */
	angular.module('basics.lookupdata').factory('basicsCustomTaxCodeMatrixLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData = {PKey1: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomTaxCodeMatrixLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				showIcon: false,
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
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '74ad6c8f70714f799725fb2c26549d79'
			});

			var basicsCustomTaxCodeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/taxcode/taxcodematrix/',
					endPointRead: 'list',
					usePostForRead: true
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomTaxCodeLookupDataServiceConfig).service;
		}]);
})(angular);