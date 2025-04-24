/**
 * Created by leo on 14.02.2023.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentEurolistLookupDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentGroupLookupDataService is the data service for all resource types
	 */
	angular.module('basics.lookupdata').factory('resourceEquipmentEurolistLookupDataService', [
		'platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator', 'globals',

		function (
			platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator, globals
		) {
			let readData = {PKey1: null};
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceEquipmentEurolistLookupDataService', {
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
				uuid: '4c8b0c2596d44634a909bb04f5c25dba'
			});

			let resourceEquipmentEurolistLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/equipment/planteurolist/',
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

			return platformLookupDataServiceFactory.createInstance(resourceEquipmentEurolistLookupDataServiceConfig).service;
		}]);
})(angular);
