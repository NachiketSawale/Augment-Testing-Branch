/**
 * Created by cakiral on 06.11.2020.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectActivityLookupDataService
	 * @function
	 *
	 * @description
	 * ProjectActivityLookupDataService
	 */
	angular.module('project.main').factory('projectActivityLookupDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectActivityLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				uuid: '3d95524908434ee2b19874fd2272f150',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 180,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
			});

			var projectActivityLookupDataService = {
				httpRead: {
					route: globals.webApiBaseUrl + 'scheduling/main/activity/',
					endPointRead: 'project'
				},
				filterParam: 'projectId'
			};

			return platformLookupDataServiceFactory.createInstance(projectActivityLookupDataService).service;
		}]);
})(angular);
