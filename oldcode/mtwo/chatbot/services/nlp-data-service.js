(function (angular) {
	/* global globals */
	'use strict';
	angular.module('mtwo.chatbot').factory('nlpDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('nlpDataService', {
				valMember: 'Id',
				dispMember: 'Name',
				desMember: 'Culture',
				columns: [
					{
						field: 'Name',
						formatter: 'description',
						id: 'Name',
						name: 'Name',
						name$tr$: 'cloud.common.entityNlpModelName',
						readonly: true
					},
					{
						field: 'Culture',
						formatter: 'description',
						id: 'Culture',
						name: 'Culture',
						name$tr$: 'cloud.common.entityNlpCultrue',
						readonly: true
					}
				],
				uuid: 'f4341c6fa21b412587468fd0c14ca8ab'
			});
			var workflowLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'mtwo/chatbot/configuration/', endPointRead: 'getnlpdata'}
			};
			let serviceContainer = platformLookupDataServiceFactory.createInstance(workflowLookupDataServiceConfig);
			var service = serviceContainer.service;
			/*
			service.getItemById = function getItemById(nlpname, options) {
				return serviceContainer.data.getByFilter(function (item) {
					return item.NlpModelName === nlpname;
				}, options);
			};
			/*
			 */
			return service;
		}]);
})(angular);
