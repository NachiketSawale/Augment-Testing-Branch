(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name timekeepingRoundingConfigColumnIdsLookupService
	 * @function
	 *
	 * @description
	 * timekeepingRoundingConfigColumnIdsLookupService is the data service for Rounding Config column Ids list.
	 */
	angular.module('timekeeping.recording').factory('timekeepingRoundingConfigColumnIdsLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('timekeepingRoundingConfigColumnIdsLookupService', {
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
				uuid: 'f2639ab1c250412187a1f8f19eb712ec'
			});

			let timekeepingRoundingConfigColumnIdsLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'timekeeping/recording/roundingconfig/', endPointRead: 'gettksqroundingcolumnids', usePostForRead: false },
				listProcessor: [{
					processList: function (items) {
						const includedScopeLevels = {};
						items.forEach(function (item) {
							includedScopeLevels[item.ScopeLevel] = true;
						});
					}
				}]
			};

			return platformLookupDataServiceFactory.createInstance(timekeepingRoundingConfigColumnIdsLookupDataServiceConfig).service;
		}]);
})(angular);
