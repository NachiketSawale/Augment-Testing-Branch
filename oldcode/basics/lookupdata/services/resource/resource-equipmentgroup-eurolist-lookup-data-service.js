/**
 * Created by leo on 14.02.2023.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupEurolistLookupDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentGroupLookupDataService is the data service for all resource types
	 */
	angular.module('basics.lookupdata').factory('resourceEquipmentGroupEurolistLookupDataService', [
		'platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator', 'globals',

		function (
			platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator, globals
		) {
			let readData = {PKey1: null};
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceEquipmentGroupEurolistLookupDataService', {
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
					}
				],
				uuid: '86319aad82644c3abbfd1d4d51bf6743'
			});

			let resourceEquipmentGroupEurolistLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/eurolist/',
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

			return platformLookupDataServiceFactory.createInstance(resourceEquipmentGroupEurolistLookupDataServiceConfig).service;
		}]);
})(angular);
