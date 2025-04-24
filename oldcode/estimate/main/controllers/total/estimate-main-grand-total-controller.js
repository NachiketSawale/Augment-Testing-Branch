/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainGrandTotalController
	 * @function
	 *
	 * @description
	 * Controller for total costs.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainGrandTotalController',
		['$scope',  'platformGridControllerService', 'estimateMainCommonUIService',
			'estimateGrandTotalService', 'estimateDefaultGridConfig',
			'estimateMainService', 'platformCreateUuid',
			'estimateMainCalculatorService','estimateMainSidebarWizardService',
			function ($scope, platformGridControllerService, estimateMainCommonUIService,
				estimateGrandTotalService, estimateDefaultGridConfig,
				estimateMainService, platformCreateUuid,
				estimateMainCalculatorService,estimateMainSidebarWizardService
			) {

				let gridConfig = angular.extend({/* enter specific options here */}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['TotalOf',  'Description', 'Total', 'CurUoM']);

				platformGridControllerService.initListController($scope, uiService, estimateGrandTotalService, null, gridConfig);

				$scope.getContainerUUID = function getContainerUUID() {
					return platformCreateUuid();
				};

				$scope.addTools(estimateGrandTotalService.getButtons());

				// empty the cache result, only do the calculation on clicking the button
				estimateGrandTotalService.resetGrandTotalIfEstimateHeaderChange(estimateMainService.getSelectedEstHeaderId() || null);

				function recalculate() {
					estimateGrandTotalService.loadGrandTotal();
				}
				// reload when the line item container calculation button is pressed
				// estimateMainCalculatorService.onCalculationDone.register(recalculate);
				estimateMainSidebarWizardService.onCalculationDone.register(recalculate);

				$scope.$on('$destroy', function () {
					// estimateMainCalculatorService.onCalculationDone.unregister(recalculate);
					estimateMainSidebarWizardService.onCalculationDone.unregister(recalculate);
				});

			}]);
})();
