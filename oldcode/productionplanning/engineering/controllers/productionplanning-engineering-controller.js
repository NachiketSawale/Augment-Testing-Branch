(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';

	angular.module(moduleName).controller('productionplanningEngineeringController', productionplanningEngineeringController);

	productionplanningEngineeringController.$inject = [
		'$scope', '_',
		'platformMainControllerService',
		'productionplanningEngineeringMainService',
		'productionplanningEngineeringTranslationService',
		'productionplanningEngineeringTaskWizardService',
		'platformNavBarService',
		'productionplanningEngineeringTaskStatusLookupService',
		'ppsEngDetailerPlanningBoardSupplierService',
		'ppsEngDetailerPlanningBoardDemandService',
		'ppsCommonProjectLocationSideloadFilterDataServiceFactory',
		'platformGridAPI',
		'ppsDocumentReportService'];

	function productionplanningEngineeringController(
		$scope, _,
		platformMainControllerService,
		dataServ,
		translationServ,
		wizardService,
		platformNavBarService,
		engineeringTaskStatusLookupService,
		detailerPlanningBoardSupplierService,
		detailerPlanningBoardDemandService,
		projectLocationSideloadFilterDataServiceFactory,
		platformGridAPI,
		ppsDocumentReportService) {
		var options = {search: true, reports: false};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, dataServ, {}, translationServ, moduleName, options);

		wizardService.activate();

		platformNavBarService.getActionByKey('refresh').fn = refresh;
		platformNavBarService.getActionByKey('discard').fn = clear;
		platformNavBarService.getActionByKey('save').fn = update;

		function refresh() {
			engineeringTaskStatusLookupService.load().then(function () {
				dataServ.refresh().then(function () {
					detailerPlanningBoardSupplierService.refresh();
					detailerPlanningBoardDemandService.refresh();
				});
			});
		}

		function clear() {
			dataServ.clear();
		}

		function update() {
			platformGridAPI.grids.commitAllEdits();
			dataServ.update().then(function () {
				detailerPlanningBoardSupplierService.update();
				detailerPlanningBoardDemandService.update();
				var prjLocationService = projectLocationSideloadFilterDataServiceFactory.getPrjLocationFilterService(dataServ, true);
				if (!_.isNil(prjLocationService)) {
					prjLocationService.update();
				}
			});
		}

		// un-register on destroy
		$scope.$on('$destroy', function () {
			ppsDocumentReportService.unregisterReportPrepare();
			platformMainControllerService.unregisterCompletely(dataServ, sidebarReports, translationServ, options);
		});
	}
})(angular);
