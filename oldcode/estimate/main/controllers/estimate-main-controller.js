/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';

	/**
     * @ngdoc controller
     * @name estimateMainController
     * @function
     *
     * @description
     * Main controller for the estimate.main module
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainController',
		['$scope', '$rootScope', '$translate', '$injector', 'platformMainControllerService', 'estimateMainService', 'estimateMainTranslationService', 'cloudDesktopSidebarService', 'cloudDesktopInfoService','estimateMainWizardContext',
			'modelViewerStandardFilterService', 'estimateMainLineItem2MdlObjectService', 'estimateProjectRateBookConfigDataService','estimateMainSidebarWizardService', 'documentsProjectDocumentFileUploadDataService',
			function ($scope, $rootScope,  $translate, $injector, platformMainControllerService, estimateMainService, estimateMainTranslationService, cloudDesktopSidebarService, cloudDesktopInfoService,estimateMainWizardContext,
				modelViewerStandardFilterService, estimateMainLineItem2MdlObjectService, estimateProjectRateBookConfigDataService, estimateMainSidebarWizardService, fileUploadDataService) {

				// TODO:
				// - use platformMainControllerService.showModuleHeaderInformation(...) instead?
				cloudDesktopInfoService.updateModuleInfo($translate.instant('cloud.desktop.moduleDisplayNameEstimate'));

				let opt = {search: true, auditTrail: 'baa6806d57ac450282947f5c46939539'};
				let reports = platformMainControllerService.registerCompletely($scope, estimateMainService, {}, estimateMainTranslationService, moduleName, opt);

				// sidebar-information
				let sidebarInfo = {
					name: cloudDesktopSidebarService.getSidebarIds().info,
					title: 'info',
					type: 'template',
					templateUrl: globals.appBaseUrl + 'estimate.main/templates/sidebar/sidebar-info.html'
				};

				const unregisterReportPrepare = $rootScope.$on('reporting:postPreparePrint', function(dummy, reportValue) {
					reportValue.processed = true;
					reportValue.projectFk = estimateMainService.getSelectedProjectInfo().ProjectId;
					reportValue.moduleName = moduleName;
					fileUploadDataService.storeReportAsProjectDocument(reportValue);
				});

				cloudDesktopSidebarService.registerSidebarContainer(sidebarInfo, true);

				estimateMainSidebarWizardService.activate();

				modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('estimateMainModelFilterService');

				estimateMainWizardContext.setConfig(moduleName);

				estimateMainLineItem2MdlObjectService.activateViewerControlling();

				let allRateBook = estimateProjectRateBookConfigDataService.getData();
				if(allRateBook && allRateBook.length === 0) {
					estimateProjectRateBookConfigDataService.initData();
				}
				function toggleSideBarWizard(){
					estimateMainSidebarWizardService.toggleSideBarWizard();
				}
				cloudDesktopSidebarService.onOpenSidebar.register(toggleSideBarWizard);
				// un-register on destroy
				$scope.$on('$destroy', function () {
					unregisterReportPrepare();
					estimateMainSidebarWizardService.deactivate();
					estimateMainLineItem2MdlObjectService.deActivateViewerControlling();
					platformMainControllerService.unregisterCompletely(estimateMainService, reports, estimateMainTranslationService, opt);
					estimateProjectRateBookConfigDataService.clearData();
					cloudDesktopSidebarService.onOpenSidebar.unregister(toggleSideBarWizard);
					$injector.get('estimateMainAssembliesCategoryService').resetEstHeaderId();
					$injector.get('estimateMainCombineColumnService').reSetVieConfig();
					$injector.get('estimateMainCombinedLineItemClientService').reSetViewConfig();
				});
			}]);

})();
