/**
 * Created by leo on 07.11.2017.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingSheetLookupByRecordingDataService
	 * @function
	 * @description
	 *
	 * data service for timekeeping sheet lookup filtered by recording.
	 */
	angular.module('basics.lookupdata').factory('timekeepingResultLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			let readData = {PKey1: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingResultLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Sheet',
						field: 'SheetFk',
						name: 'Sheet',
						formatter: 'lookup',
						width: 150,
						name$tr$: 'timekeeping.common.sheetSymbol',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.timekeepingsheetsymbol',
							displayMember: 'Description',
							valueMember: 'Id',
							imageSelector: 'platformStatusIconService'
						}
					},
					{
						id: 'Hours',
						field: 'Hours',
						name: 'Hours',
						width: 150,
						name$tr$: 'timekeeping.common.Hours',
						formatter: 'description'
					},
				],
				uuid: 'f82309f30b004de1893f2c6d3e19ac22'
			});

			let lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'timekeeping/recording/result/', endPointRead: 'listbyparent'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				},



				disableDataCaching: true
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
