/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';
	/**
     * @ngdoc directive
     * @name estimateMainAssemblyCostCodesLookup
     * @requires  estimateMainCostCodesLookupService
     * @description modal dialog window with costcodes grid to select the costcode
     */
	angular.module(moduleName).directive('estimateMainAssemblyTransferCostCodesLookup', ['$q', '$injector', 'estimateMainCostCodesLookupService',
		function ($q, $injector, estimateMainCostCodesLookupService) {

			return estimateMainCostCodesLookupService.getLookupForAssemblyDefinition('isTransferCostCode');
		}
	]);
})(angular);
