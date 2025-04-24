/**
 * Created by anl on 5/4/2017.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemController', PPSItemController);

	PPSItemController.$inject = ['$scope', 'platformMainControllerService', 'productionplanningItemDataService',
		'productionplanningItemTranslationService', 'productionplanningItemWizardService',
		'ppsCommonProjectLocationSideloadFilterDataServiceFactory', 'platformNavBarService',
		'ppsItemDetailersDataService', 'productionplanningItemStatusLookupService',
		'ppsItemDetailerPlanningBoardSupplierService', 'ppsItemDetailerPlanningBoardDemandService',
		'$rootScope', 'platformGridAPI', 'modelViewerStandardFilterService', 'ppsCommonModelFilterService',
		'productionplanningItemReassignedProductDataService', 'basicsWorkflowInstanceService', 'basicsCommonChangeStatusService',
		'ppsItemDailyPlanningBoardSupplierSiteFilterDataService', 'transportplanningTransportUtilService',
		'productionplanningItemSubItemDataService', 'ppsDocumentReportService'];

	function PPSItemController($scope, platformMainControllerService, ppsItemDataService,
							   ppsItemTranslationService, itemWizardService,
							   projectLocationSideloadFilterDataServiceFactory, platformNavBarService,
							   ppsItemDetailersDataService, productionplanningItemStatusLookupService,
							   detailerPlanningBoardSupplierService, detailerPlanningBoardDemandService,
							   $rootScope, platformGridAPI, modelViewerStandardFilterService, ppsCommonModelFilterService,
							   reassignedProductDataService, basicsWorkflowInstanceService, basicsCommonChangeStatusService,
		ppsItemDailyPlanningBoardSupplierSiteFilterDataService,transportplanningTransportUtilService,
		subItemDataService, ppsDocumentReportService) {

		var options = {search: true, reports: false, auditTrail: '2847c972f98342aeaad64dee2d93cd2e'};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, ppsItemDataService,
			{}, ppsItemTranslationService, moduleName, options);

		function update() {
			$rootScope.$emit('before-save-entity-data');
			platformGridAPI.grids.commitAllEdits();
			return ppsItemDataService.update().then(function () {
				var prjLocationService = projectLocationSideloadFilterDataServiceFactory.getPrjLocationFilterService(ppsItemDataService, true, 'byJob');
				if (!_.isNil(prjLocationService)) {
					prjLocationService.update();
				}
				return $rootScope.$emit('after-save-entity-data');
			});
		}

		ppsItemDataService.registerFilter();
		ppsItemDataService.ensureInitContext();
		itemWizardService.activate();

		if (_.isFunction(ppsItemDataService.mergeWorkflowData)) {
			basicsCommonChangeStatusService.onStatusChangedDone.register(ppsItemDataService.checkForWorkflow);
			basicsWorkflowInstanceService.registerWorkflowCallback(ppsItemDataService.mergeWorkflowData);
		}

		platformNavBarService.getActionByKey('save').fn = update;
		platformNavBarService.getActionByKey('refresh').fn = refresh;
		platformNavBarService.getActionByKey('discard').fn = clear;

		function refresh() {
			productionplanningItemStatusLookupService.load().then(function () {
				ppsItemDataService.refresh().then(function () {
					if(transportplanningTransportUtilService.hasShowContainerInFront('productionplanning.item.dailyplanningboard.site.filter.list')){
						ppsItemDailyPlanningBoardSupplierSiteFilterDataService.refresh();
					}
					detailerPlanningBoardSupplierService.refresh();
					reassignedProductDataService.read();
					// detailerPlanningBoardDemandService.refresh();

					if(transportplanningTransportUtilService.hasShowContainerInFront('productionplanning.item.listSubItem')) {
						subItemDataService.load();
					}
				});
				ppsItemDetailersDataService.refresh();
			});
		}

		function clear() {
			ppsItemDataService.clear();
			ppsItemDetailersDataService.clear();
		}

		modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('ppsItemModelFilterService');
		ppsItemDataService.registerSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			ppsDocumentReportService.unregisterReportPrepare();
			ppsItemDataService.unregisterFilter();
			itemWizardService.deactivate();
			platformMainControllerService.unregisterCompletely(ppsItemDataService, sidebarReports,
				ppsItemTranslationService, options);
			ppsItemDataService.unregisterSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);

			basicsCommonChangeStatusService.onStatusChangedDone.unregister(ppsItemDataService.checkForWorkflow);
			basicsWorkflowInstanceService.unregisterWorkflowCallback(ppsItemDataService.mergeWorkflowData);
		});
	}
})();
