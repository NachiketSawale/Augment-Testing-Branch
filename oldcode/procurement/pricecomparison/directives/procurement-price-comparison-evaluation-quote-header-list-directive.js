/*
 *created by miu 07/26/2022
 *
 */
(function (angular) {
	'use strict';
	let moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).directive('procurementPriceComparisonEvaluationQuoteHeaderListDirective', ['globals',
		function (globals) {
			return {
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/procurement-price-comparison-evaluation-quote-header-list-grid.html',
				restrict: 'A',
				scope: {},
				replace: true,
				controller: 'procurementPricecomparisonEvaluationQuoteHeaderListController'
			};
		}
	]);
})(angular);