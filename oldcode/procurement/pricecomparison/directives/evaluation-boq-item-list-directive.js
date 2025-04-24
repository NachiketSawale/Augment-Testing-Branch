/*
 *created by miu 07/26/2022
 *
 */
(function (angular) {
	'use strict';
	let moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).directive('evaluationBoqItemListDirective', ['globals',
		function (globals) {
			return {
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/evaluation-prc-boq-item-list-grid.html',
				restrict: 'A',
				scope: {},
				replace: true,
				controller: 'procurementPricecomparisonEvaluationBoqItemListController'
			};
		}
	]);
})(angular);