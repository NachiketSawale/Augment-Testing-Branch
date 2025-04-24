(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceWorkOperationTypePlantTypeFilterLookupDataService
	 * @function
	 *
	 * @description
	 * resourceWorkOperationTypePlantTypeFilterLookupDataService is the data service for all WorkOperationTypes filtered by plant types
	 */
	angular.module('basics.lookupdata').factory('resourceWorkOperationTypePlantTypeFilterLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceWorkOperationTypePlantTypeFilterLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'description',
						width: 180,
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
				uuid: 'cd866ee87ec14ba2bad444511cbc69a7'
			});

			var workOperationTypePlantFilterLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/wot/workoperationtype/',
					endPointRead: 'listbyplanttypewithcurrentwot'
				},
				filterParam: 'filters',
				prepareFilter: function(filters) {
					const params = [];
					if (filters && filters.plantTypeFk) {
						params.push('plantTypeFk=' + filters.plantTypeFk);
					}
					if (filters && filters.currentWotFk) {
						params.push('currentWotFk=' + filters.currentWotFk);
					}
					if (params.length > 0) {
						return '?' + params.join('&');
					} else {
						return '';
					}
				}
			};

			return platformLookupDataServiceFactory.createInstance(workOperationTypePlantFilterLookupDataServiceConfig).service;
		}]);
})(angular);
