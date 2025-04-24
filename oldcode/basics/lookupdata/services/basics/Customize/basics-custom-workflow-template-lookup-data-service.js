/**
 * Created by leo on 17.11.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomWorkflowTemplateLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomWorkflowTemplateLookupDataService is the data service for all workflows look ups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomWorkflowTemplateLookupDataService', ['$q', '$http', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($q, $http, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomWorkflowTemplateLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				showIcon: false,
				columns: [
					{
						id: 'id',
						field: 'Id',
						name: 'Id',
						formatter: 'integer',
						name$tr$: 'cloud.common.entityId'
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'c00a2416ccc44e2d92aa2ddd6db40b1e'
			});

			var basicsCustomWorkflowTemplateLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'basics/workflow/template/', endPointRead: 'byentity'},
				filterParam: 'entityNameOrId'
			};

			var serviceContainer = platformLookupDataServiceFactory.createInstance(basicsCustomWorkflowTemplateLookupDataServiceConfig);

			serviceContainer.service.getItemByIdAsync = function getItemByIdAsync(ID) {
				var option = serviceContainer.options.httpRead;
				return $http.get(option.route + 'byId/simple?templateId='+ ID).then(function (response) {
					return response.data;
				});
			};

			serviceContainer.service.getItemById = function getItemById(ID, options) {
				return serviceContainer.data.getByFilter(function (item) {
					return item.Id === ID;
				}, options);
			};

			return serviceContainer.service;
		}]);
})(angular);
