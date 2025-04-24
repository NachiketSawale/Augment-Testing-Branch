(function (angular) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	/**
     * @ngdoc service
     * @name estimateWizardStagingLookupDataService
     * @function
     * @description
     * #
     * lookup data service for estimate main header used in wizard.
     */
	angular.module(moduleName).factory('estimateWizardEcosysStagingLookupDataService', [
		'$q', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function ($q, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateWizardEcosysStagingLookupDataService', {
				valMember: 'Id', //'Project_BPID',
				dispMember: 'Project_BPID',
				columns: [
					{
						id: 'Project_BPID',
						field: 'Project_BPID',
						name: 'BPID',
						formatter: 'string',
						width: 100
					},
					{
						id: 'Project_Description',
						field: 'Project_Description',
						name: 'Description',
						formatter: 'description',
						width: 150
					},
					{
						id: 'MasterProject_Name',
						field: 'MasterProject_Name',
						name: 'MPID',
						formatter: 'string',
						width: 150
					},
					{
						id: 'SuperProject_Name',
						field: 'SuperProject_Name',
						name: 'Super Project',
						formatter: 'string',
						width: 150
					},
					{
						id: 'Project_CINumber',
						field: 'Project_CINumber',
						name: 'CI Number',
						formatter: 'string',
						width: 150
					},
					{
						id: 'Project_CPP',
						field: 'Project_CPP',
						name: 'CPP Number',
						formatter: 'string',
						width: 150
					},
				],
				uuid:'f3fbbdfdbd19434e883b7b77d0d965e6'
			});

			var estimateWizardEcosysStagingLookupDataServiceConf = {
				httpRead: { route: globals.webApiBaseUrl + 'estimate/main/wizard/', endPointRead: 'ecosysstaging'},
			};
			return platformLookupDataServiceFactory.createInstance(estimateWizardEcosysStagingLookupDataServiceConf).service;
		}]);
})(angular);