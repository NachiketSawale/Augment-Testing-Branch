(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceTypePlanningBoardModuleFilterDataService
	 * @function
	 *
	 * @description
	 * resourceTypePlanningBoardModuleFilterDataService is the data service for all account look ups
	 */
	angular.module('basics.lookupdata').factory('resourceTypePlanningBoardModuleFilterLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceTypePlanningBoardModuleFilterLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				showIcon:false,
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 250,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'InternalName',
						field: 'InternalName',
						name: 'Internal Name',
						formatter: 'description',
						width: 250,
						name$tr$: 'basics.config.entityInternalName'
					}
				],
				uuid: '21bcdc4a42ac4574a1c5a989c50f8965'
			});

			var resourceTypePlanningBoardModuleFilterDataServiceConf = {
				httpRead: { route: globals.webApiBaseUrl + 'resource/type/planningboardfilter/', endPointRead: 'modules' }
			};

			return platformLookupDataServiceFactory.createInstance(resourceTypePlanningBoardModuleFilterDataServiceConf).service;
		}]);
})(angular);
