/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainCostRiskDetailsController
	 * @function
	 *
	 * @description
	 * Controller for the results view of estimate main cost risk entities.
	 **/

	angular.module(moduleName).controller('estimateMainCostRiskDetailsController', ['$scope', 'estimateMainCostRiskListService', 'platformDetailControllerService', 'estimateMainCostRiskImpactConfigurationService', 'estimateMainTranslationService',
		function ($scope, estimateMainCostRiskListService, platformDetailControllerService, estimateMainCostRiskImpactConfigurationService, estimateMainTranslationService) {
			platformDetailControllerService.initDetailController($scope, estimateMainCostRiskListService, null, estimateMainCostRiskImpactConfigurationService, estimateMainTranslationService);
		}
	]);
})();
