/**
 * Created by henkel.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name plantSupplierItemLookupDataService
	 * @function
	 *
	 * @description
	 * plantSupplierLookupDataService is the data service providing data for plantSupplier look ups
	 */
	angular.module('logistic.plantsupplier').factory('plantSupplierItemLookupDataService', ['$injector', 'globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($injector, globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('plantSupplierItemLookupDataService', {

				valMember: 'Id',
				dispMember: 'ConsumptionDate',
				columns: [

					{ id: 'consumptiondate', field: 'ConsumptionDate', name: 'ConsumptionDate', name$tr$: 'logistic.plantsupplier.entityConsumptionDate' },
					{
						id: 'MaterialFk',
						field: 'MaterialFk',
						name: 'Material',
						width: 120,
						name$tr$: 'cloud.common.entityMaterial',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code',
						}
					},
					{
						id: 'PlantFk',
						field: 'PlantFk',
						name: 'Plant',
						width: 80,
						name$tr$: 'logistic.job.plant',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'equipmentPlant',
							displayMember: 'Code',
							version: 3
						}
					}
				],
				uuid: '8bb90c679a1e45a5ac2f4789bec5289c'
			});

			let readData =  { PKey1: null };

			let locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'logistic/plantsupplier/item/', endPointRead: 'listbyparent', usePostForRead: true, },
				filterParam: readData,
				prepareFilter: function prepareFilter(plantsupplierFk) {
					readData.PKey1 = plantsupplierFk;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);