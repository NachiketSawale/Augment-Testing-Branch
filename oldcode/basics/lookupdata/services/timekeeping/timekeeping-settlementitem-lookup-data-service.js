/**
 * Created by Sudarshan on 07.09.2022.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingSettlementItemLookupDataService
	 * @function
	 *
	 * @description
	 * timekeepingSettlementItemLookupDataService is the data service for all settlement items
	 */

	angular.module('basics.lookupdata').factory('timekeepingSettlementItemLookupDataService', [
		'platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingSettlementItemLookupDataService', {
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
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '2a6ce68774414203a75edff0b6c07b3d'
			});

			let readData = { PKey1: null };

			let locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/settlement/item',
					endPointRead: 'listbysettlement'
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(entity) {
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}
	]);
})();
