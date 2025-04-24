/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainProjectCostCodesLookup
	 * @requires  estimateMainCostCodesLookupService
	 * @description modal dialog window with costcodes grid to select the costcode
	 */
	/* jshint -W072 */ // This function too many parameters
	angular.module(moduleName).directive('estimateMainProjectCostCodesLookup', ['$q', '$injector', 'estimateMainCostCodesLookupService',
		function ($q, $injector, estimateMainCostCodesLookupService) {

			return estimateMainCostCodesLookupService.getLookupForProjectDefinition();
		}
	]);
})(angular);

