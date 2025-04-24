(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
     * @ngdoc directive
     * @name procurementPriceComparisonExportMaterialWizardGridDirective
     * @element
     * @restrict
     * @priority
     * @scope
     * @description
     * #
     * A directive for wizard 'export material' dialog grid.
     *
     */
	angular.module(moduleName).directive('procurementPriceComparisonExportMaterialWizardGridDirective', [
		function () {
			return {
				restrict: 'A',
				scope: {},
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/export-material-wizard-grid-directive.html',
				controller: 'procurementPriceComparisonExportMaterialWizardGridController'
			};
		}
	]);
})(angular);
