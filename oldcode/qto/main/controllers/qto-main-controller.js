(function (angular) {
	'use strict';

	var moduleName = 'qto.main';

	/* jshint -W072 */
	angular.module(moduleName).controller('qtoMainController',
		['$rootScope','$scope', 'platformMainControllerService', 'cloudDesktopSidebarService', 'qtoMainHeaderDataService',
			'qtoMainTranslationService', 'qtoMainSidebarWizardService','documentsProjectDocumentDataService','$translate','$injector',
			function ($rootScope, $scope, platformMainControllerService, cloudDesktopSidebarService, mainDataService, translateService, qtoMainSidebarWizardService,
				documentsProjectDocumentDataService,$translate,$injector) {

				let opt = {search: true, reports: false};

				let result = platformMainControllerService.registerCompletely($scope, mainDataService, {},
					translateService, moduleName, opt);

				qtoMainSidebarWizardService.activate();

				documentsProjectDocumentDataService.register({
					moduleName: moduleName,
					title: $translate.instant('qto.main.moduleName'),
					parentService: mainDataService,
					columnConfig: [
						{documentField: 'QtoHeaderFk', dataField: 'Id', readOnly: false},
						{documentField: 'PrjChangeFk', dataField: 'PrjChangeFk', readOnly: false},
						{documentField: 'ProjectInfoRequestFk', dataField: 'ProjectInfoRequestFk', readOnly: false},
						{documentField: 'BilHeaderFk', dataField: 'BilHeaderFk', readOnly: false},
						{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
						{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
						{documentField: 'PrcStructureFk', dataField: 'PrcStructureFk', readOnly: false},
						{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
						{documentField: 'ConHeaderFk', dataField: 'ConHeaderFk', readOnly: false},
						{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false},
						{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
						{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
					],
					setReadOnlyByMainEntity: function (mainEntity) {
						if (mainEntity) {
							$injector.get('qtoMainCommonService').setContainerReadOnly(mainEntity.IsBackup, '4eaa47c530984b87853c6f2e4e4fc67e');
						}
					}
				});

				let reportParameterListener = $rootScope.$on('reporting:resolveCustomParameter', function(dummy, reportValue) {
					if (reportValue.reportInfo.fileName === 'IMP_QTO_QTOReport.frx'||reportValue.reportInfo.fileName === 'Mengenermittlung_mit_Vortrag.frx') {
						$injector.get('qtoMainSiaService').showDialog(reportValue);
					}
				});

				cloudDesktopSidebarService.onOpenSidebar.register(toggleSideBarWizard);
				function toggleSideBarWizard(){
					qtoMainSidebarWizardService.toggleSideBarWizard();
				}

				$scope.$on('$destroy', function () {
					qtoMainSidebarWizardService.deactivate();
					platformMainControllerService.unregisterCompletely(mainDataService, result, translateService, opt);
					reportParameterListener();
					$injector.get('qtoMainCommonService').setContainerReadOnly(false, '4eaa47c530984b87853c6f2e4e4fc67e');
				});

			}]);
})(angular);

