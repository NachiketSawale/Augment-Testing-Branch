/**
 * Created by Frank on 2017/07/17.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectTemplateLookupDataService
	 * @function
	 *
	 * @description
	 * projectTemplateLookupDataService is the data service for all template projects available in a company
	 */
	angular.module('basics.lookupdata').factory('projectTemplateLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectTemplateLookupDataService', {
				valMember: 'Id',
				dispMember: 'ProjectNo',
				columns: [
					{
						id: 'ProjectNo',
						field: 'ProjectNo',
						name: 'ProjectNo',
						formatter: 'code',
						width: 100,
						name$tr$: 'project.main.projectNo'
					},
					{
						id: 'ProjectName',
						field: 'ProjectName',
						name: 'ProjectName',
						formatter: 'description',
						width: 250,
						name$tr$: 'cloud.common.entityName'
					},
					{
						id: 'ProjectName2',
						field: 'ProjectName2',
						name: 'ProjectName2',
						formatter: 'description',
						width: 250,
						name$tr$: 'project.main.name2'
					}
				],
				uuid: '2b99a1ce74484b0c99c660115c0811dd'
			});

			var projectTemplateLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/', endPointRead: 'templates' }
			};

			return platformLookupDataServiceFactory.createInstance(projectTemplateLookupDataServiceConfig).service;
		}]);
})(angular);
