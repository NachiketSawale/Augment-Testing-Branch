(function (angular) {
	/* global globals */
	'use strict';
	angular.module('mtwo.chatbot').factory('workflowLookupDataService', ['_', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (_, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('workflowLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true
					}
				],
				uuid: 'f4341c6fa21b412587468fd0c14ca8ab'
			});

			var workflowLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'mtwo/chatbot/wf2intent/', endPointRead: 'bycontext'}
			};

			return platformLookupDataServiceFactory.createInstance(workflowLookupDataServiceConfig).service;
		}]);
})(angular);
