/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name estimateMainRoundingConfigColumnIdsLookupService
	 * @function
	 *
	 * @description
	 * estimateMainRoundingConfigColumnIdsLookupService is the data service for Rounding Config column Ids list.
	 */
	angular.module('estimate.main').factory('estimateMainRoundingConfigColumnIdsLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateMainRoundingConfigColumnIdsLookupService', {
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

			let basicsCustomClerkRoleLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'estimate/main/roundingconfigcomplete/', endPointRead: 'getroundingcolumnids', usePostForRead: false },
				listProcessor: [{
					processList: function (items) {
						const includedScopeLevels = {};
						items.forEach(function (item) {
							includedScopeLevels[item.ScopeLevel] = true;
						});
					}
				}]
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomClerkRoleLookupDataServiceConfig).service;
		}]);
})(angular);
