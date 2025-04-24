/**
 * Created by leo on 09.05.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeSymbolLookupDataService
	 * @function
	 *
	 * @description
	 * timekeepingTimeSymbolLookupDataService is the data service for all time symbols
	 */
	angular.module('basics.lookupdata').factory('timekeepingTimeSymbolLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingTimeSymbolLookupDataService', {
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
					}
				],
				uuid: '8f4f18118748446abbc490b57d68e65c'
			});

			let timeSymbolLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'timekeeping/timesymbols/',
					endPointRead: 'listbycontext'
				},
				dataIsAlreadySorted: true,
				selectableCallback: function (dataItem) {
					let isSelectable = true;
					if (dataItem.Sorting === 0) {
						isSelectable = false;
					}
					return isSelectable;
				}
			};

			let serviceContainer = platformLookupDataServiceFactory.createInstance(timeSymbolLookupDataServiceConfig);

			serviceContainer.service.getItemByKey = function getItemByKey(id){
				return serviceContainer.service.getItemById(id,serviceContainer.options);
			};

			return serviceContainer.service;

		}]);
})(angular);
