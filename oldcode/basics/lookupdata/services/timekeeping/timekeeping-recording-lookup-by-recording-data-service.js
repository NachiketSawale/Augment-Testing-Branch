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
	angular.module('basics.lookupdata').factory('timekeepingRecordingLookupByRecordingDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$injector',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, $injector) {

			let readData = {PKey1: null};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingRecordingLookupByRecordingDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code1',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description1',
						field: 'Description',
						name: 'Description',
						width: 150,
						name$tr$: 'timekeeping.common.Description',
						formatter: 'description'
					},
				],
				uuid: '5bde1d26ecdf4d23be13cf97ddfbf0d7'
			});

			let lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'timekeeping/recording/', endPointRead: 'listbycompany'},
				filterParam: readData,
				disableDataCaching: true
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
