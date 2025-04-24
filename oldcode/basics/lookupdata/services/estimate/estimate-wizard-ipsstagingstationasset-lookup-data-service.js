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
	angular.module(moduleName).factory('estimateWizardIpsStagingStationAssetLookupDataService', [
		'$q', '$injector', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function ($q, $injector, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateWizardIpsStagingStationAssetLookupDataService', {
				valMember: 'Id',
				dispMember: 'STATION_ID',
				columns: [
					{
						id: 'STATION_ID',
						field: 'STATION_ID',
						name: 'Station ID',
						formatter: 'code',
						width: 100
					},
					{
						id: 'STATION_NM',
						field: 'STATION_NM',
						name: 'Station Name',
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
					},

				],
				uuid:'86805927b6e44baf9f7f126ac3f52989'
			});

			var estimateWizardIpsStagingLookupDataServiceConf = {
				httpRead: { route: globals.webApiBaseUrl + 'estimate/main/wizard/', endPointRead: 'ipsstagingasset'},
				filterParam: 'filters',
				prepareFilter: function(filters)
				{
					var options = {
						fercAcct: filters.fercAcct === null ? '' : filters.fercAcct,
						estimateId: filters.estimateId === null ? '' : filters.estimateId
					};
					var jsonWizardObject = JSON.stringify(options);
					return '?ipsAssetObject='+ jsonWizardObject;
				}
			};
			return platformLookupDataServiceFactory.createInstance(estimateWizardIpsStagingLookupDataServiceConf).service;
		}]);
})(angular);