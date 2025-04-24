(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'boq.main';
	angular.module(moduleName).factory('boqMainBilltoLookupDataService', [
		'_', '$q', '$injector', 'basicsLookupdataConfigGenerator','platformLookupDataServiceFactory',
		function (_, $q, $injector, basicsLookupdataConfigGenerator, platformLookupDataServiceFactory) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqMainBilltoLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'quantityPortion',
						field: 'QuantityPortion',
						name: 'Quantity Portion (in %)',
						name$tr$: 'boq.main.quantityPortion',
						formatter: 'percent'
					}
				],
				uuid: '3c361a382f17447d978c22bc2b3c3e6d',
				width: 500,
				height: 200
			});

			var readData = {Pkey3: 0};
			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'project/main/billto/',
					endPointRead: 'getbilltosbyprojectid'
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(projectId) {
					readData.Pkey3 = projectId;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
