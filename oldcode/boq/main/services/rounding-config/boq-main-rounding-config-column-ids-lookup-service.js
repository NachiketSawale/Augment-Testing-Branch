/**
 * $Id: boq-main-rounding-config-column-ids-lookup-service.js 45949 2022-07-13 15:56:17Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name boqMainRoundingConfigColumnIdsLookupService
	 * @function
	 *
	 * @description
	 * boqMainRoundingConfigColumnIdsLookupService is the data service for Rounding Config column Ids list.
	 */
	angular.module('boq.main').factory('boqMainRoundingConfigColumnIdsLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqMainRoundingConfigColumnIdsLookupService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Column',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '8782dd79e07c45739b2e2576cc66b9c9'
			});

			let boqMainRoundingConfigColumnIdsLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'boq/main/type/', endPointRead: 'getboqroundingcolumnids', usePostForRead: false },
				listProcessor: [{
					processList: function (items) {
						const includedScopeLevels = {};
						items.forEach(function (item) {
							includedScopeLevels[item.ScopeLevel] = true;
						});
					}
				}]
			};

			return platformLookupDataServiceFactory.createInstance(boqMainRoundingConfigColumnIdsLookupDataServiceConfig).service;
		}]);
})(angular);
