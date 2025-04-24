/**
 * Created by Frank on 26.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectLookupDataService
	 * @function
	 *
	 * @description
	 * projectLookupDataService is the data service for project look ups
	 */
	angular.module('basics.lookupdata').factory('projectLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectLookupDataService', {
				valMember: 'Id',
				dispMember: 'ProjectNo',
				columns: [
					{
						id: 'ProjectNo',
						field: 'ProjectNo',
						name: 'Project No',
						formatter: 'code',
						name$tr$: 'cloud.common.entityNumber'
					},
					{
						id: 'ProjectName',
						field: 'ProjectName',
						name: 'Project name',
						formatter: 'description',
						name$tr$: 'cloud.common.entityName'
					}
				],
				uuid: 'ce5fd229944e408a8e24a80b319ebcfe'
			});

			var projectLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/main/', endPointRead: 'list' },
				navigator: { moduleName: 'project.main', registerService:'projectMainService' }
			};

			return platformLookupDataServiceFactory.createInstance(projectLookupDataServiceConfig).service;
		}]);
})(angular);
