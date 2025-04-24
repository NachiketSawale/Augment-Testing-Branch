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
	angular.module(moduleName).factory('estimateWizardIpsStagingLookupDataService', [
		'$q', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function ($q, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateWizardIpsStagingLookupDataService', {
				valMember: 'Id',
				dispMember: 'FULL_BEN_LOC',
				columns: [
					{
						id: 'FULL_BEN_LOC',
						field: 'FULL_BEN_LOC',
						name: 'Asset Accounting',
						formatter: 'string',
						width: 100
					},
					{
						id: 'OPCO',
						field: 'OPCO',
						name: 'Operating Company',
						formatter: 'string',
						width: 150
					},
					{
						id: 'REGION_NM',
						field: 'REGION_NM',
						name: 'Region Name',
						formatter: 'string',
						width: 150
					},
					{
						id: 'STATE_CD',
						field: 'STATE_CD',
						name: 'State',
						formatter: 'string',
						width: 50
					},
					{
						id: 'FERC_ACCT',
						field: 'FERC_ACCT',
						name: 'FERC Account',
						formatter: 'string',
						width: 150
					}
				],
				uuid:'86805927b6e44baf9f7f126ac3f52989'
			});

			var estimateWizardIpsStagingLookupDataServiceConf = {
				httpRead: { route: globals.webApiBaseUrl + 'estimate/main/wizard/', endPointRead: 'ipsstaging'},
				filterParam: 'filters',
				prepareFilter: function(filters)
				{
					var options = {
						fercAcct: filters.fercAcct === null ? '' : filters.fercAcct,
						state: filters.state === null ? '' : filters.state,
						stationId: filters.stationId === null ? -1 : filters.stationId,
						stationName: filters.stationName === null ? '' : encodeURIComponent(filters.stationName),
					};
					var jsonWizardObject = JSON.stringify(options);
					return '?ipsObject='+ jsonWizardObject;
				}
			};
			return platformLookupDataServiceFactory.createInstance(estimateWizardIpsStagingLookupDataServiceConf).service;
		}]);
})(angular);