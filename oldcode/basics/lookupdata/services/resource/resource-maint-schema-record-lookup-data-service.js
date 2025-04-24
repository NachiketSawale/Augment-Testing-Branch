(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceMaintSchemaRecordLookupDataService
	 * @function
	 *
	 * @description
	 * resourceMaintSchemaRecordLookupDataService is the data service for all resource types
	 */
	angular.module('basics.lookupdata').factory('resourceMaintSchemaRecordLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator', 'globals',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator, globals) {

			let readData = {PKey1: null};
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceMaintSchemaRecordLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '3af0e3ceeb374d9ab3060d8fc1fdbf82'
			});

			let resourceTypeLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/maintenance/record/',
					endPointRead: 'listbyparent',
					usePostForRead: true
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(filter) {
					if (filter) {
						readData = filter;
					}
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(resourceTypeLookupDataServiceConfig).service;
		}]);
})(angular);
