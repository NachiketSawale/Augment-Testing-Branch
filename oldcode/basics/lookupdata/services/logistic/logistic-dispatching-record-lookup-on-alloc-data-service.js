/**
 * Created by leo on 2018/03/15.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordLookupOnAllocDataService
	 * @function
	 *
	 * @description
	 * logisticDispatchingRecordLookupDataService is the data service for all Address Format
	 */
	angular.module('basics.lookupdata').factory('logisticDispatchingRecordLookupOnAllocDataService', ['_', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',


		function (_, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData = {PKey1: null, PKey2: null};
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticDispatchingRecordLookupOnAllocDataService', {
				valMember: 'Id',
				dispMember: 'RecordNo',
				showIcon: true,
				columns: [
					{
						id: 'recordNo',
						field: 'RecordNo',
						name: 'RecordNo',
						formatter: 'integer',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '38488fdf505b4f1c9ff8478c80e139e7'
			});

			var logisticDispatchingRecordLookupConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'logistic/dispatching/record/',
					endPointRead: 'listbyidents',
					usePostForRead: true
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(readData) {
					let selected = $injector.get('logisticJobPlantAllocationDataService').getList();
					return _.filter(
						_.concat(
							_.map(selected, ent => {return {Id: ent.DispatchRecordInFk}}),
							_.map(selected, ent => {return {Id: ent.DispatchRecordOutFk}})
						),
						ident => {return (ident.Id !== null && ident.Id !== undefined)}
					);
				}
			};
			return platformLookupDataServiceFactory.createInstance(logisticDispatchingRecordLookupConfig).service;
		}]);
})(angular);
