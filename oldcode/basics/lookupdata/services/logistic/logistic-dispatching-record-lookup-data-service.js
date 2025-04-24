/**
 * Created by leo on 2018/03/15.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordLookupDataService
	 * @function
	 *
	 * @description
	 * logisticDispatchingRecordLookupDataService is the data service for all Address Format
	 */
	angular.module('basics.lookupdata').factory('logisticDispatchingRecordLookupDataService', ['$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',


		function ($injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData = {PKey1: null, PKey2: null};
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticDispatchingRecordLookupDataService', {
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
					endPointRead: 'listbyparent',
					usePostForRead: true
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(readData) {
					var selected = $injector.get('logisticDispatchingHeaderDataService').getSelected();
					if (selected) {
						readData = {PKey1: selected.Id, PKey2: selected.CompanyFk};
					}
					return readData;
				},
			};
			return platformLookupDataServiceFactory.createInstance(logisticDispatchingRecordLookupConfig).service;
		}]);
})(angular);
