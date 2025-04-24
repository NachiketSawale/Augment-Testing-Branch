/**
 * Created by shen on 4/13/2023
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementPesItemLookupDataService
	 * @function
	 *
	 * @description
	 * data service for pes item lookups
	 */
	angular.module('basics.lookupdata').factory('procurementPesItemLookupDataService',
		['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
			function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('procurementPesItemLookupDataService', {
					valMember: 'Id',
					dispMember: 'Description1',
					columns: [
						{
							id: 'Description1',
							field: 'Description1',
							name: 'Description1',
							formatter: 'Description1',
							name$tr$: 'procurement.common.prcItemDescription1'
						},
						{
							id: 'ConHeaderFk',
							field: 'ConHeaderFk',
							name: 'Contract',
							name$tr$: 'procurement.pes.entityConHeaderFk',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ConHeaderView',
								displayMember: 'Code'
							},
							width: 150
						},
						{ id: 'ItemNo', field: 'ItemNo', name: 'Item no', name$tr$: 'procurement.common.prcItemItemNo' },
						{ id: 'MdcMaterialFk',
							field: 'MdcMaterialFk',
							name: 'Material',
							name$tr$: 'cloud.common.prcItemMaterialNo',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'MaterialCommodity',
								displayMember: 'Code'
							},
							width:120,
						}
					],
					uuid: 'd621a536d860479ab023d9e8614816f8'
				});

				let lookupDataServiceConfig = {
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/pes/item/',
						endPointRead: 'filteredpesitems'
					},
					filterParam: 'plantIds',
					prepareFilter: function (plantIds) {
						return plantIds;
					}

				};

				return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
			}]);
})(angular);
