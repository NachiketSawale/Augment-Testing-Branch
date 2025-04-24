/**
 * Created by zwz on 9/27/2018.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name trsPkglogisticDispatchingRecordLookupDataService
	 * @function
	 *
	 */
	var moduleName = 'transportplanning.package';
	angular.module(moduleName).factory('trsPkglogisticDispatchingRecordLookupDataService', ['$injector', 'globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($injector, globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData = {PKey1: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('trsPkglogisticDispatchingRecordLookupDataService', {
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
				uuid: 'e9430722c9e6426ea4545c51abddbd5e'
			});

			var logisticDispatchingRecordLookupConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'logistic/dispatching/record/', endPointRead: 'listbyparent'},
				filterParam: readData,

				prepareFilter: function prepareFilter(item) {
					readData = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(logisticDispatchingRecordLookupConfig).service;
		}]);
})(angular);

