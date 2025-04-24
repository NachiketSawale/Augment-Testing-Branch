/**
 * Created by zov on 7/26/2019.
 */
(function () {
	'use strict';
	/* global angular, _ */

	var moduleName = 'productionplanning.product';
	angular.module(moduleName).controller('productionplanningProductController', [
		'$scope', 'productionplanningProductMainService',
		'productionplanningProductCuttingProductDataService',
		'productionplanningProductTranslationService',
		'platformMainControllerService',
		'platformNavBarService',
		'productionplanningProductWizardService',
		'modelViewerStandardFilterService',
		'ppsDocumentReportService',

		function ($scope, productMainService,
			cuttingProductDataService,
			translationService,
			platformMainControllerService,
			platformNavBarService,
			wizardService,
			modelViewerStandardFilterService,
		  	ppsDocumentReportService
		) {
			var options = { search: true, reports: false };
			var sidebarReports = platformMainControllerService.registerCompletely($scope, productMainService,
				{}, translationService, moduleName, options);
			wizardService.activate();

			modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('ppsProductModelFilterService');

			function update(){
				productMainService.update().then(function(){
					cuttingProductDataService.update();
				});
			}

			function refresh(){
				productMainService.refresh();
				cuttingProductDataService.refresh();
			}

			platformNavBarService.getActionByKey('save').fn = update;
			platformNavBarService.getActionByKey('refresh').fn = refresh;

			$scope.$on('$destroy', function () {
				ppsDocumentReportService.unregisterReportPrepare();
				platformMainControllerService.unregisterCompletely(productMainService, sidebarReports,
					translationService, options);

			});

		}]);
})();