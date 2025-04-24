(function () {
	'use strict';

	angular.module('change.main').controller('changeMainController', ['$scope', 'platformMainControllerService', 'changeMainService', 'platformNavBarService', 'changeMainTranslationService', 'changeMainWizardService',
		'documentsProjectDocumentDataService','$translate',
		function ($scope, platformMainControllerService, changeMainService, platformNavBarService, changeMainTranslationService, changeMainWizardService,
				  documentsProjectDocumentDataService,$translate) {
			$scope.path = globals.appBaseUrl;

			var options = {search: true, reports: false, auditTrail: 'b4f16c551ec74c7c87d0d9914805eef7'};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, changeMainService, configObject, changeMainTranslationService, 'change.main', options);
			changeMainWizardService.activate();

			documentsProjectDocumentDataService.register({
				moduleName: 'change.main',
				title: $translate.instant('change.main.entityChange'),
				parentService: changeMainService,
				columnConfig: [
					{documentField: 'PrjChangeFk', dataField: 'Id', readOnly: false},
					{documentField: 'ProjectInfoRequestFk', dataField: 'ProjectInfoRequestFk', readOnly: false},
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

			// un-register on destroy
			$scope.$on('$destroy', function () {
				changeMainTranslationService.unregisterUpdates();
				//changeMainWizardService.deactivate();
				//platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(changeMainService, sidebarReports, changeMainTranslationService, options);
			});
		}
	]);
})();
