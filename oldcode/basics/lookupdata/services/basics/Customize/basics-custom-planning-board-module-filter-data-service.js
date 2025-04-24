(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomPlanningBoardModuleFilterDataService
	 * @function
	 *
	 * @description
	 * basicsCustomPlanningBoardModuleFilterDataService is the data service for all account look ups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomPlanningBoardModuleFilterDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomPlanningBoardModuleFilterDataService', {
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
				uuid: '75a59861ea654bc892ee5aa366ea1977'
			});

			var basicsCustomPlanningBoardModuleFilterDataServiceConf = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/planningboardfilter/', endPointRead: 'modules' }
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomPlanningBoardModuleFilterDataServiceConf).service;
		}]);
})(angular);
