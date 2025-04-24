(function () {
	'use strict';
	var moduleName = 'project.inforequest';

	angular.module(moduleName).controller('projectInforequestController',
		['$scope', '$injector', 'platformMainControllerService', 'projectInfoRequestDataService',
			'projectInfoRequestTranslationService', 'cloudDesktopSidebarService',
			'projectInfoRequestWizardService', 'modelViewerStandardFilterService',
			'documentsProjectDocumentDataService','$translate',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $injector, platformMainControllerService, projectInfoRequestDataService,
			          projectInfoRequestTranslationService, cloudDesktopSidebarService, projectInfoRequestWizardService,
			          modelViewerStandardFilterService,documentsProjectDocumentDataService,$translate) {
				$scope.path = globals.appBaseUrl;
				var opt = {search: true, reports: true, wizardService: projectInfoRequestWizardService , auditTrail: 'bb5abbc10dc847f584d136517d40e72e'};
				var mc = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, projectInfoRequestDataService, mc, projectInfoRequestTranslationService, moduleName, opt);

				var exportOptions = {
					ModuleName: moduleName,
					permission: '9eab04c53d7f44939c69ad9dcc82a27a#e',
					MainContainer: {
						Id: 'rfi-requests',
						Label: 'project.inforequests.infoRequestListTitle'
					}
				};

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('project.inforequest.requestEntity'),
					parentService: projectInfoRequestDataService,
					columnConfig: [
						{documentField: 'ProjectInfoRequestFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjChangeFk', dataField: 'PrjChangeFk', readOnly: false},
						{documentField: 'QtoHeaderFk', dataField: 'QtoHeaderFk', readOnly: false},
						{documentField: 'BilHeaderFk', dataField: 'BilHeaderFk', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'PrcStructureFk', dataField: 'PrcStructureFk', readOnly: false},
						{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
						{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
						{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
					]
				});

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('projectInfoRequestModelFilterService');

				platformMainControllerService.registerExport(exportOptions);  // add export feature to the main-controller

				//sidebar | information
				var info = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'project.main/templates/sidebar-info.html'
				};

				cloudDesktopSidebarService.registerSidebarContainer(info, true);

				var moduleContext = $injector.get('procurementContextService');
				//set module context variables
				moduleContext.setLeadingService(projectInfoRequestDataService);
				moduleContext.setMainService(projectInfoRequestDataService);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(projectInfoRequestDataService, sidebarReports, projectInfoRequestTranslationService, opt);
					cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);

					moduleContext.removeModuleValue(moduleContext.leadingServiceKey);
					moduleContext.removeModuleValue(moduleContext.prcCommonMainService);
				});
			}
		]);
})();