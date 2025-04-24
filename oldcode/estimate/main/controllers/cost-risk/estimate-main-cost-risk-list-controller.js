/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainCostRiskListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of estimate main cost risk entities.
	 **/
	angular.module(moduleName).controller('estimateMainCostRiskListController',
		['$scope', 'estimateMainCostRiskListService', 'estimateMainCostRiskStandardConfigurationService', 'estimateRuleClipboardService','platformGridControllerService',
			function ($scope, estimateMainCostRiskListService, estimateMainCostRiskStandardConfigurationService, estimateRuleClipboardService, platformGridControllerService) {
				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'ParentId',
					childProp: 'Children',
					enableConfigSave: false
				};

				platformGridControllerService.initListController($scope, estimateMainCostRiskStandardConfigurationService, estimateMainCostRiskListService, null, myGridConfig);
			}
		]);
})();
