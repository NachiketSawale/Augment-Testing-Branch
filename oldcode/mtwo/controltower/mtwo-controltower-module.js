/**
 * Created by lal on 2018-06-06.
 */
(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'mtwo.controltower';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	** Activity states are defined in this config block
	*/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			var options = {
				'moduleName': moduleName,
				'resolve': {
					loadDomains: ['platformSchemaService', function (platformSchemaService) {

						return platformSchemaService.getSchemas([
							{typeName: 'MtoPowerbiDto', moduleSubModule: 'Mtwo.ControlTower'},
							{typeName: 'MtoPowerbiitemDto', moduleSubModule: 'Mtwo.ControlTower'},
							{typeName: 'DashboardStructureDto', moduleSubModule: 'Basics.BiPlusDesigner'}
						]);
					}],
					loadLookup: ['$injector',
						function ($injector) {
							$injector.get('basicCustomizeSystemoptionLookupDataService').loadLookupData().then(function () {
								$injector.get('mtwoControlTowerCommonService').setPremiumStatus();
							});
						}],
					loadAllData: [
						'$injector',
						function($injector) {
							var dashboardsService = $injector.get('mtwoControlTowerDataPineDashboardsService');
							var commonService = $injector.get('mtwoControlTowerCommonService');
							var mainService = $injector.get('mtwoControlTowerMainService');
							var reportsService = $injector.get('mtwoControlTowerReportsService');
							var userListDataService = $injector.get('mtwoControlTowerUserListDataService');
							var proReportsDataService = $injector.get('mtwoControlTowerProReportsDataService');
							var proDashboardService = $injector.get('mtwoControlTowerProDashboardService');
							
							return dashboardsService.load().then(function() {
								var isPremium = commonService.getPremiumStatus();

								if (isPremium) {
									return mainService.load().then(function() {
										return reportsService.load();
									});
								} else {
									return userListDataService.refresh().then(function() {
										if (userListDataService.hasSelection()) {
											proReportsDataService.load();
											proDashboardService.load();
										}
									});
								}
							});
						}
					]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}]);
})(angular);
