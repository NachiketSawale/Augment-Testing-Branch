/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name estimateAssembliesDetailsParamDialog
	 * @description
	 */
	let moduleName = 'estimate.assemblies';
	angular.module(moduleName).directive('estimateAssembliesDetailsParamDialog',['globals', function (globals) {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'estimate.assemblies/templates/details-parameters-dialog/estimate-assemblies-details-param-list.html'
		};
	}]);
})();
