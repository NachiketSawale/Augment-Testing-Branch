/**
 * Created by lav on 9/24/2019.
 */
/**
 * Created by baf on 2016/06/13.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	/**
	 * @ngdoc service
	 * @name ppsConfigurationClerkRoleSlotLookupDataService
	 * @function
	 *
	 * @description
	 * ppsConfigurationClerkRoleSlotLookupDataService is the data service for all Address Format
	 */
	angular.module(moduleName).factory('ppsConfigurationClerkRoleSlotLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsConfigurationClerkRoleSlotLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				showIcon: true,
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'fghjfdd6e0764900be28b1c8f1908fa1'
			});

			var serviceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/configuration/clerkroleslot/',
					endPointRead: 'isEngineering'
				}
			};

			return platformLookupDataServiceFactory.createInstance(serviceConfig).service;
		}]);
})(angular);
