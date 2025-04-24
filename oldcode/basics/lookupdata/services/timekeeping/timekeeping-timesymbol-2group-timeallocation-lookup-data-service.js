/**
 * Created by mohit on 21.06.2022.
 */
(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbol2GroupTimeAllocationLookupDataService
	 * @function
	 *
	 * @description
	 * timekeepingTimeSymbol2GroupLookupDataService is the data service for all time symbols
	 */

	angular.module('basics.lookupdata').factory('timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
		['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

			function (
				platformLookupDataServiceFactory,
				basicsLookupdataConfigGenerator
			) {
				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(
					'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					{
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
							},
							{
								id: 'TimeSymbolGroup',
								field: 'TimeSymbolGroup.DescriptionInfo',
								name: 'TimeSymbolGroup',
								formatter: 'translation',
								name$tr$: 'cloud.common.entityTimeSymbolGroupFk'

							},
							{
								id: 'UoMFk',
								field: 'UoMFk',
								name: 'UoM',
								width: 100,
								name$tr$: 'basics.unit.entityUomFk',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'uom',
									displayMember: 'Unit'

								}
							},
							{
								id: 'CompanyCode',
								field: 'CompanyFk',
								name: 'Company Code',
								width: 100,
								name$tr$: 'cloud.common.entityCompanyCode',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Company',
									displayMember: 'Code'
								},
								sortable: true
							}
						],
						uuid: 'e529982324434e69852d1ba22683f54a'
					});

				let readData = {PKey1: null, PKey2: null, Pkey3: null};
				let locationLookupDataServiceConfig = {
					httpRead: {
						route: globals.webApiBaseUrl +	'timekeeping/timesymbols/',
						endPointRead: 'listbysymbol'
					},
					filterParam: readData,
					prepareFilter: function prepareFilter(entity) {
						readData = {PKey1: null, PKey2: null, Pkey3: null , ByTimeAllocation : true};
						if (entity) {
							if (entity.EmployeeFk) {
								readData.PKey1 = entity.EmployeeFk;
							} else if (entity.SheetFk) {
								readData.Pkey3 = entity.SheetFk;
							} else if (entity.TimeSymbolFk) {
								readData.PKey2 = entity.TimeSymbolFk;
							}
						}
						return readData;
					},
					showFilteredData: true,
					filterOnLoadFn: function (entity) {
						return entity.IsLive && entity.IsTimeAllocation
					}
				};

				return platformLookupDataServiceFactory.createInstance(
					locationLookupDataServiceConfig
				).service;
			}
		]);

})();
