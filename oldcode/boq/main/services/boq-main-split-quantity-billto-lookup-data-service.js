(function (angular) {
	/* global globals */ 
	'use strict';
	var moduleName = 'boq.main';

	angular.module(moduleName).factory('boqMainSplitQtyBilltoLookupDataService', [
		'_', '$q', '$injector', 'basicsLookupdataConfigGenerator','platformLookupDataServiceFactory',
		function (_, $q, $injector, basicsLookupdataConfigGenerator, platformLookupDataServiceFactory) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqMainSplitQtyBilltoLookupDataService', {
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

			var readData = {PKey1: null};
			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'boq/main/billto/',
					endPointRead: 'listbyparent'
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(boqItemId) {
					readData.PKey1 = boqItemId;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
