/**
 * Created by ada on 2018/10/10.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
     * @ngdoc directive
     * @name printColumnSettingDirective
     * @element
     * @restrict
     * @priority
     * @scope
     * @description
     * #
     * A directive for 'create print column Setting'.
     *
     */
	angular.module(moduleName).directive('printColumnSettingDirective', [
		function () {
			return {
				restrict: 'A',
				scope: {},
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/print-column-setting-template.html',
				controller: 'procurementPriceComparisonPrintColumnSettingController'
			};
		}
	]);

	angular.module(moduleName).directive('columnLayoutSettingDirective', [
		function () {
			return {
				restrict: 'A',
				scope: {
					model: '@'
				},
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/print-column-setting-template.html',
				controller: 'priceComparisonGridLayoutController'
			};
		}
	]);
})(angular);
