(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceWorkOperationTypePlantFilterLookupDataService
	 * @function
	 *
	 * @description
	 * resourceWorkOperationTypePlantFilterLookupDataService is the data service for WorkOperationTypes filtered by plant
	 */
	angular.module('basics.lookupdata').factory('resourceWorkOperationTypePlantFilterLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceWorkOperationTypePlantFilterLookupDataService', {
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
				uuid: '3e0f28a95e21495586eb8467bfc5c1f8'
			});

			var workOperationTypePlantFilterLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/wot/workoperationtype/',
					endPointRead: 'listbyplant'
				},
				filterParam: 'plantFk'
			};

			return platformLookupDataServiceFactory.createInstance(workOperationTypePlantFilterLookupDataServiceConfig).service;
		}]);
})(angular);
