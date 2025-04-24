/**
 * Created by shen on 4/13/2023
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceWorkOperationTypeFilterByIsHireLookupDataService
	 * @function
	 *
	 * @description
	 * resourceWorkOperationTypePlantTypeFilterLookupDataService is the data service for all WorkOperationTypes filtered by plant types
	 */
	angular.module('basics.lookupdata').factory('resourceWorkOperationTypeFilterByIsHireLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceWorkOperationTypeFilterByIsHireLookupDataService', {
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
				uuid: 'a77aa9a30753468c869b1efc2d709595'
			});

			var workOperationTypeFilterByIsHireLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'resource/wot/workoperationtype/',
					endPointRead: 'listbyishired'
				}
			};

			return platformLookupDataServiceFactory.createInstance(workOperationTypeFilterByIsHireLookupDataServiceConfig).service;
		}]);
})(angular);
