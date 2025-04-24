(function (angular) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	/**
     * @ngdoc service
     * @name estimateWizardMainHeaderLookupDataService
     * @function
     * @description
     * #
     * lookup data service for estimate main header used in wizard.
     */
	angular.module(moduleName).factory('estimateWizardMainHeaderLookupDataService', [
		'$q', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function ($q, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateWizardMainHeaderLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						width: 100
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						width: 150
					}
				],
				uuid:'f3fbbdfdbd19434e883b7b77d0d965e6'
			});

			var estimateWizardMainHeaderLookupDataServiceConf = {
				httpRead: { route: globals.webApiBaseUrl + 'estimate/main/header/', endPointRead: 'lookup'},
				filterParam: 'filters',
				prepareFilter: function(filters)
				{
					return '?projectId=' + filters.projectId + '&isActive=' + filters.isActive;
				}
			};
			return platformLookupDataServiceFactory.createInstance(estimateWizardMainHeaderLookupDataServiceConf).service;
		}]);
})(angular);