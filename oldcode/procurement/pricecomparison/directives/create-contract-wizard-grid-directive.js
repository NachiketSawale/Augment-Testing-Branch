(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc directive
	 * @name procurementPriceComparisonCreateContractWizardGrid
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 * A directive for wizard 'create contract' dialog grid.
	 *
	 */
	angular.module(moduleName).directive('procurementPriceComparisonCreateContractWizardGridDirective', [
		function () {
			return {
				restrict: 'A',
				scope: {},
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/create-contract-wizard-grid-directive.html',
				controller: 'procurementPriceComparisonCreateContractWizardGridController'
			};
		}
	]);
})(angular);
