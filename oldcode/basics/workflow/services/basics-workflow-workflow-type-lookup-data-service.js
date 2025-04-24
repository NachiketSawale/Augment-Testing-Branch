(function (angular) {
	'use strict';

	angular.module('basics.workflow').factory('basicsWorkflowWorkflowTypeLookupDataService', ['_', 'globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (_, globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsWorkflowWorkflowTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
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
				uuid: 'f3d3564f76984723b5bafbd8a81dfdd4'
			});

			var basicsWorkflowWorkflowTypeLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/workflow/type/', endPointRead: 'list'},
			};

			return platformLookupDataServiceFactory.createInstance(basicsWorkflowWorkflowTypeLookupDataServiceConfig).service;
		}]);
})(angular);
