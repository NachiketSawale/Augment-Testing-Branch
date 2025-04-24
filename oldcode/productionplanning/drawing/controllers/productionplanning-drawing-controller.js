/**
 * Created by zov on 02/04/2019.
 */
(function (){
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).controller('productionplanningDrawingController', [
		'$scope', 'productionplanningDrawingMainService',
		'productionplanningDrawingTranslationService',
		'platformMainControllerService',
		'productionplanningDrawingWizardService',
		'platformModuleNavigationService',
		'drawingComponentTypes',
		'basicsCommonChangeStatusService',
		'basicsWorkflowInstanceService',
		'ppsDocumentReportService',
		function($scope, drawingMainService,
				 drawingTranslationService,
				 platformMainControllerService,
				 wizardService,
				 naviservice,
				 drawingComponentTypes,
				 basicsCommonChangeStatusService,
				 basicsWorkflowInstanceService,
				 ppsDocumentReportService
		) {
			var options = {search: true, reports: false};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, drawingMainService,
				{}, drawingTranslationService, moduleName, options);
			wizardService.activate();

			if (_.isFunction(drawingMainService.mergeWorkflowData)) {
				basicsCommonChangeStatusService.onStatusChangedDone.register(drawingMainService.checkForWorkflow);
				basicsWorkflowInstanceService.registerWorkflowCallback(drawingMainService.mergeWorkflowData);
			}

			$scope.$on('$destroy', function () {
				ppsDocumentReportService.unregisterReportPrepare();
				platformMainControllerService.unregisterCompletely(drawingMainService, sidebarReports,
					drawingTranslationService, options);
				basicsCommonChangeStatusService.onStatusChangedDone.unregister(drawingMainService.checkForWorkflow);
				basicsWorkflowInstanceService.unregisterWorkflowCallback(drawingMainService.mergeWorkflowData);
			});

			// for column MdcMaterialCostCodeFk, it's a dynamic column depends on EngDrwCompTypeFk
			// but the go-to vavigator is only active for Material component type
			//
			// set "hide" function for navigator on "basics.material"
			var materialNav = naviservice.getNavigator('basics.material');
			if(!materialNav.isAlreadyHideForCostCodeComp){
				var orgHide = materialNav.hide;
				materialNav.hide = function (entity) {
					var hide = false;
					if(entity.entityType === 'engDrawingComponent'){
						hide = entity.EngDrwCompTypeFk !== drawingComponentTypes.Material;
					}
					return hide || (orgHide ? orgHide(entity) : false);
				};
				materialNav.isAlreadyHideForCostCodeComp = true;
			}
		}]);
})();