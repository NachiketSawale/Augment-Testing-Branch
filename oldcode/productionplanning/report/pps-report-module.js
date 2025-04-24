/**
 * Created by anl on 1/22/2018.
 */

(function (angular) {
	/*global angular*/
	/*global globals*/
	'use strict';

	var moduleName = 'productionplanning.report';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);


	angular.module(moduleName).config(['mainViewServiceProvider',
		function (platformLayoutService) {

			var wizardData = [
				{
					serviceName: 'productionplanningReportWizardService',
					wizardGuid: 'bc1fdf73fcb2460ebd38a06afe1dc7b1',
					methodName: 'changeReportStatus',
					canActivate: true
				},
				{
					serviceName: 'basicsUserFormFormDataWizardService',
					wizardGuid: '756badc830b74fdcbf6b6ddc3f92f7bd',
					methodName: 'changeFormDataStatus',
					canActivate: true
				}];

			var options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', 'basicsConfigWizardSidebarService', '$http', 'basicsLookupdataLookupDescriptorService', 'productionplanningCommonProductStatusLookupService',
						function (platformSchemaService, wizardService, $http, lookupDescriptorService, productStatusLookupService) {

							wizardService.registerWizard(wizardData);
							productStatusLookupService.load();

							$http.post(globals.webApiBaseUrl + 'basics/customize/mountingreportstatus/list').then(function (response) {
								lookupDescriptorService.updateData('MntReportStatus', response.data);
							});

							return platformSchemaService.getSchemas([
								{typeName: 'ReportDto', moduleSubModule: 'ProductionPlanning.Report'},
								{typeName: 'Report2ProductDto', moduleSubModule: 'ProductionPlanning.Report'},
								{typeName: 'Report2CostCodeDto', moduleSubModule: 'ProductionPlanning.Report'},
								{typeName: 'TimeSheetDto', moduleSubModule: 'ProductionPlanning.Report'},
								{typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'PpsDocumentDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'PpsDocumentRevisionDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'ProductDto', moduleSubModule: 'ProductionPlanning.Common'},
								{typeName: 'BundleDto', moduleSubModule: 'TransportPlanning.Bundle'},
								{
									typeName: 'ActivityDto',
									moduleSubModule: 'ProductionPlanning.Activity'
								},
								{typeName: 'FormDataDto', moduleSubModule: 'Basics.UserForm'},
								{
									typeName: 'ContactDto',
									moduleSubModule: 'BusinessPartner.Contact'
								},
								{typeName: 'RequisitionDto', moduleSubModule: 'TransportPlanning.Requisition'}
							]);
						}]
				}
			};
			platformLayoutService.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService',
		function ($injector, platformModuleNavigationService) {
			platformModuleNavigationService.registerNavigationEndpoint({
				moduleName: moduleName,
				navFunc: function (item) {
					var reportService = $injector.get('productionplanningReportReportDataService');

					if (angular.isDefined(item.ActStatusFk)) {
						reportService.navigateToActivity(item);
					}
					else if (angular.isDefined(item.RepStatusFk)) {
						reportService.navigatedByCode(item);
					}
				}
			});
		}]);
})(angular);