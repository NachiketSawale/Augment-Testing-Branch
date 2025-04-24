/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectDropPointsLookupDataService
	 * @function
	 *
	 * @description
	 * projectDropPointsLookupDataService is the data service for all resource types
	 */
	angular.module('basics.lookupdata').factory('projectDropPointsLookupDataService', ['platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectDropPointsLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 300,
						name$tr$: 'cloud.common.entityCode'
					}
				],
				uuid: '83afe50043b34a1fa7205528a39dd2c8'
			});

			let readData =  { PKey1: null };
			let projectDropPointsLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'project/droppoints/droppoint/',
					usePostForRead: true,
					endPointRead: 'listbyparent'
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(projectDropPointsLookupDataServiceConfig).service;
		}]);
})(angular);
