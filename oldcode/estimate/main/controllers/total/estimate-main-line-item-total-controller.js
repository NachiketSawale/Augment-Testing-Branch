/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemTotalController
	 * @function
	 *
	 * @description
	 * Controller for total costs.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainLineItemTotalController',
		['$scope', 'platformGridControllerService', 'estimateMainCommonUIService',
			'estimateDefaultGridConfig',
			'estimateMainService',
			'estimateLineItemTotalService',
			function ($scope,  platformGridControllerService, estimateMainCommonUIService,
				estimateDefaultGridConfig,
				estimateMainService,
				estimateLineItemTotalService
			) {

				let gridConfig = angular.extend({/* enter specific options here */}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['TotalOf',  'Description', 'Total', 'CurUoM']);

				platformGridControllerService.initListController($scope, uiService, estimateLineItemTotalService, null, gridConfig);



				function recalculate() {
					estimateLineItemTotalService.load();
				}


				function doOnLineItemChanged() {
					recalculate();
				}
				if (estimateMainService.registerSelectionChanged) {
					estimateMainService.registerSelectionChanged(doOnLineItemChanged);
				}

				// reload when the line item total container when the main line-item container is  Modified
				if (estimateMainService.registerItemModified) {
					estimateMainService.registerItemModified(recalculate);
				}

				$scope.$on('$destroy', function () {
					if (estimateMainService.unregisterSelectionChanged) {
						estimateMainService.unregisterSelectionChanged(doOnLineItemChanged);
					}
					if (estimateMainService.registerItemModified) {
						estimateMainService.registerItemModified(recalculate);
					}
				});

			}]);
})();
